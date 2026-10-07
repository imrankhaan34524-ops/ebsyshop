import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"

// Verify coupon
export async function POST(request) {
  try {
    const { userId, has } = await auth()

    if (!userId) {
      return NextResponse.json({ error: "Please sign in to use a coupon" }, { status: 401 })
    }

    const { code } = await request.json()

    if (!code || typeof code !== "string") {
      return NextResponse.json({ error: "Coupon code is required" }, { status: 400 })
    }

    const coupon = await prisma.coupon.findFirst({
      where: {
        code: code.trim().toUpperCase(),
        expiresAt: { gt: new Date() },
      },
    })

    if (!coupon) {
      return NextResponse.json({ error: "Coupon not found or expired" }, { status: 404 })
    }

    if (coupon.forNewUser) {
      const orderCount = await prisma.order.count({ where: { userId } })

      if (orderCount > 0) {
        return NextResponse.json({ error: "Coupon valid for new users only" }, { status: 400 })
      }
    }

    if (coupon.forMember && !has({ plan: "members" })) {
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

    return NextResponse.json({ coupon })
  } catch (error) {
    console.error("Coupon verify error:", error)
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}