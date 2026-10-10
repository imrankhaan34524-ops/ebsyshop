// app/api/store/featured/route.js
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// Refresh the list at most once a minute
export const revalidate = 60

export async function GET() {
  try {
    const stores = await prisma.store.findMany({
      where: { status: "approved", isActive: true },
      orderBy: { createdAt: "desc" },
      take: 20,
      select: {
        id: true,
        name: true,
        username: true,
        logo: true,
        description: true,
        createdAt: true,
        // the 3 newest products that are in stock
        Product: {
          where: { inStock: true },
          orderBy: { createdAt: "desc" },
          take: 3,
          select: { id: true, name: true, price: true, images: true, createdAt: true },
        },
        _count: { select: { Product: { where: { inStock: true } } } },
      },
    })

    const result = stores
      .map((store) => ({
        id: store.id,
        name: store.name,
        username: store.username,
        logo: store.logo,
        description: store.description,
        createdAt: store.createdAt,
        productCount: store._count.Product,
        products: store.Product.map((p) => ({
          id: p.id,
          name: p.name,
          price: p.price,
          image: p.images?.[0] || "",
        })),
        // used for sorting only
        _latest: new Date(store.Product[0]?.createdAt || store.createdAt).getTime(),
      }))
      // stores that already have products first, then the most recently active
      .sort((a, b) => (b.products.length > 0) - (a.products.length > 0) || b._latest - a._latest)
      .slice(0, 12)
      .map(({ _latest, ...store }) => store)

    return NextResponse.json({ stores: result })
  } catch (error) {
    console.error("Featured stores error:", error)
    return NextResponse.json({ stores: [], error: error.message }, { status: 500 })
  }
}