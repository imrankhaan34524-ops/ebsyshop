import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import Stripe from "stripe"
import { prisma } from "@/lib/prisma"

export async function POST(request) {
  try {
    const { userId, has } = await auth()

    if (!userId) {
      return NextResponse.json({ error: "Not authorized" }, { status: 401 })
    }

    const { addressId, items, couponCode, paymentMethod } = await request.json()

    // Check if all required fields are present
    if (!addressId || !paymentMethod || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Missing order details" }, { status: 400 })
    }

    if (!["COD", "STRIPE"].includes(paymentMethod)) {
      return NextResponse.json({ error: "Invalid payment method" }, { status: 400 })
    }

    // Address must belong to the logged in user
    const address = await prisma.address.findFirst({
      where: { id: addressId, userId },
    })

    if (!address) {
      return NextResponse.json({ error: "Address not found" }, { status: 400 })
    }

    const isPlusMember = has({ plan: "members" })

    let coupon = null

    if (couponCode) {
      coupon = await prisma.coupon.findFirst({
        where: {
          code: String(couponCode).trim().toUpperCase(),
          expiresAt: { gt: new Date() },
        },
      })

      if (!coupon) {
        return NextResponse.json({ error: "Coupon not found or expired" }, { status: 400 })
      }

      // Check if coupon is applicable for new users
      if (coupon.forNewUser) {
        const orderCount = await prisma.order.count({ where: { userId } })

        if (orderCount > 0) {
          return NextResponse.json({ error: "Coupon valid for new users only" }, { status: 400 })
        }
      }

      // Check if coupon is applicable for members
      if (coupon.forMember && !isPlusMember) {
        return NextResponse.json({ error: "Coupon valid for members only" }, { status: 400 })
      }

      // One use per user for each coupon
      const alreadyUsed = await prisma.order.count({
        where: {
          userId,
          isCouponUsed: true,
          coupon: { path: ["code"], equals: coupon.code },
        },
      })

      if (alreadyUsed > 0) {
        return NextResponse.json({ error: "You have already used this coupon" }, { status: 400 })
      }
    }

    // Merge duplicate items and validate quantities
    const quantities = new Map()

    for (const item of items) {
      const productId = item?.id || item?.productId
      const qty = Number(item?.quantity)

      if (!productId || !Number.isInteger(qty) || qty < 1) {
        return NextResponse.json({ error: "Invalid cart item" }, { status: 400 })
      }

      quantities.set(productId, (quantities.get(productId) || 0) + qty)
    }

    // Real prices come from the database
    const products = await prisma.product.findMany({
      where: { id: { in: [...quantities.keys()] } },
    })

    if (products.length !== quantities.size) {
      return NextResponse.json({ error: "Some products no longer exist" }, { status: 400 })
    }

    if (products.some((p) => !p.inStock)) {
      return NextResponse.json({ error: "Some products are out of stock" }, { status: 400 })
    }

    const ordersByStore = new Map()

    for (const product of products) {
      if (!ordersByStore.has(product.storeId)) {
        ordersByStore.set(product.storeId, [])
      }

      ordersByStore.get(product.storeId).push({
        id: product.id,
        quantity: quantities.get(product.id),
        price: product.price,
      })
    }

    let fullAmount = 0
    let isShippingFeeAdded = false
    const createOperations = []
    const couponData = coupon ? JSON.parse(JSON.stringify(coupon)) : {}

    // Create orders for each seller
    for (const [storeId, sellerItems] of ordersByStore.entries()) {
      let total = sellerItems.reduce((acc, item) => acc + item.price * item.quantity, 0)

      if (coupon) {
        total -= (total * coupon.discount) / 100
      }

      if (!isPlusMember && !isShippingFeeAdded) {
        total += 199
        isShippingFeeAdded = true
      }

      total = parseFloat(total.toFixed(2))
      fullAmount += total

      createOperations.push(
        prisma.order.create({
          data: {
            userId,
            storeId,
            addressId,
            total,
            paymentMethod,
            isCouponUsed: coupon ? true : false,
            coupon: couponData,
            orderItems: {
              create: sellerItems.map((item) => ({
                productId: item.id,
                quantity: item.quantity,
                price: item.price,
              })),
            },
          },
        })
      )
    }

    // Create all orders together, or none at all
    const createdOrders = await prisma.$transaction(createOperations)
    const orderIds = createdOrders.map((order) => order.id)

    if (paymentMethod === "STRIPE") {
      try {
        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
        const origin = request.headers.get("origin")

        const session = await stripe.checkout.sessions.create({
          line_items: [
            {
              price_data: {
                currency: "pkr",
                product_data: {
                  name: "Order",
                },
                unit_amount: Math.round(fullAmount * 100),
              },
              quantity: 1,
            },
          ],
          expires_at: Math.floor(Date.now() / 1000) + 31 * 60, // current time + 31 minutes
          mode: "payment",
          success_url: `${origin}/loading?nextUrl=orders`,
          cancel_url: `${origin}/cart`,
          metadata: {
            orderIds: orderIds.join(","),
            userId,
            appId: "gocart",
          },
        })

        // Clear the cart only after the Stripe session exists
        await prisma.user.update({
          where: { id: userId },
          data: { cart: {} },
        })

        return NextResponse.json({ session })
      } catch (stripeError) {
        // Stripe failed, remove the unpaid orders so nothing is left behind
        await prisma.$transaction([
          prisma.orderItem.deleteMany({ where: { orderId: { in: orderIds } } }),
          prisma.order.deleteMany({ where: { id: { in: orderIds } } }),
        ])

        throw stripeError
      }
    }

    // Cash on delivery: clear the cart
    await prisma.user.update({
      where: { id: userId },
      data: { cart: {} },
    })

    return NextResponse.json({ message: "Orders Placed Successfully", orderIds, fullAmount })
  } catch (error) {
    console.error("Order error:", error)
    return NextResponse.json({ error: error.message || "Something went wrong" }, { status: 500 })
  }
}

// Get all orders of the logged in user
export async function GET() {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: "Not authorized" }, { status: 401 })
    }

    const orders = await prisma.order.findMany({
      where: { userId },
      include: {
        orderItems: { include: { product: true } },
        address: true,
      },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json({ orders })
  } catch (error) {
    console.error("Orders fetch error:", error)
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}