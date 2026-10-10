// app/api/me/dashboard/route.js
// Tells the navbar which dashboard buttons to show for the logged in user.
import { NextResponse } from "next/server"
import { getAuth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"
import authAdmin from "@/middlewears/authAdmin"

export const dynamic = "force-dynamic"

export async function GET(request) {
  try {
    const { userId } = getAuth(request)

    if (!userId) {
      return NextResponse.json({ signedIn: false })
    }

    const [store, isAdmin] = await Promise.all([
      prisma.store.findUnique({
        where: { userId },
        select: { name: true, username: true, logo: true, status: true, isActive: true },
      }),
      authAdmin(userId),
    ])

    return NextResponse.json({
      signedIn: true,
      hasStore: Boolean(store),
      status: store?.status ?? null, // "pending", "approved" or "rejected"
      isActive: store?.isActive ?? false,
      store: store ? { name: store.name, username: store.username, logo: store.logo } : null,
      isAdmin: Boolean(isAdmin),
    })
  } catch (error) {
    console.error("Dashboard info error:", error)
    return NextResponse.json({ signedIn: false, hasStore: false, isAdmin: false }, { status: 500 })
  }
}