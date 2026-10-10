// app/api/chat/route.js
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { site } from "@/lib/siteConfig"
import { FREE_SHIPPING_THRESHOLD, SHIPPING_FEE } from "@/lib/shipping"

const MODEL = "claude-haiku-4-5-20251001" // fast and low cost, good for support chat
const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || "Rs."

// Very simple limit per visitor: 25 messages per 10 minutes (best effort on serverless hosting)
const hits = new Map()
function isLimited(ip) {
  const now = Date.now()
  const recent = (hits.get(ip) || []).filter((t) => now - t < 10 * 60 * 1000)
  recent.push(now)
  hits.set(ip, recent)
  if (hits.size > 5000) hits.clear()
  return recent.length > 25
}

const STOP = new Set([
  "the","and","for","you","your","are","have","with","this","that","what","which","how","can","does","has",
  "any","from","about","need","want","please","tell","show","get","buy","price","cost","much","sell","there",
  "payment","methods","method","shipping","delivery","order","track","free","accept","store","ebsystore",
])

// Finds a few real products that match the customer's last message
async function findProducts(text) {
  const tokens = [...new Set((text.toLowerCase().match(/[a-z0-9]{3,}/g) || []).filter((t) => !STOP.has(t)))].slice(0, 6)

  const where = tokens.length
    ? {
        inStock: true,
        OR: tokens.flatMap((t) => [
          { name: { contains: t, mode: "insensitive" } },
          { category: { contains: t, mode: "insensitive" } },
        ]),
      }
    : { inStock: true }

  return prisma.product.findMany({
    where,
    take: 5,
    orderBy: { createdAt: "desc" },
    select: { id: true, name: true, category: true, price: true, mrp: true },
  })
}

function buildSystemPrompt(products) {
  const productLines = products.length
    ? products
        .map((p) => `- ${p.name} | ${p.category} | ${currency}${p.price}${p.mrp > p.price ? ` (was ${currency}${p.mrp})` : ""} | /product/${p.id}`)
        .join("\n")
    : "(no matching products found)"

  return `You are the friendly support assistant for EbsyStore, an online store in Pakistan that sells gadgets (phones, headphones, smartwatches, accessories) from multiple sellers.

STORE FACTS (only use these, never invent others):
- Delivery: usually 3 to 7 working days, depending on city and seller.
- Shipping: free on orders of ${currency}${FREE_SHIPPING_THRESHOLD.toLocaleString("en-PK")} or more, and always free for Plus members. Otherwise a flat ${currency}${SHIPPING_FEE} fee.
- Payments: Cash on Delivery, JazzCash, Easypaisa, Bank Transfer, and credit or debit card. For JazzCash, Easypaisa and Bank Transfer the customer sends the amount to the account shown at checkout, then enters the Transaction ID (TID); the order is confirmed after the payment is verified.
- Order tracking: the customer opens My Orders (/orders) to see a progress tracker (placed, processing, shipped, delivered) and the courier tracking ID once shipped.
- Returns: items can be returned within 7 days if the customer changes their mind. See the Returns and Refunds policy page.
- Plus membership (/pricing): free shipping on every order and member only coupons.
- Selling: anyone can open a store at /create-store. After the store is approved they get a seller dashboard to add products and manage orders.
- Support: phone ${site.phone}, email ${site.email}, WhatsApp on the same number.

PRODUCTS THAT MATCH THE CUSTOMER'S MESSAGE (real, live data):
${productLines}

RULES:
- Be short, warm and clear (2 to 5 sentences). Plain text only, no markdown, no bullet symbols, no bold.
- Reply in the customer's language (English, Urdu, or Roman Urdu).
- When you recommend a product, mention its name and price and put its link on its own, exactly as /product/<id>. Only recommend products from the list above. Never invent products, prices, stock or discounts.
- You cannot see a customer's personal orders. For order status, tell them to open My Orders (/orders). For anything you cannot answer, suggest WhatsApp or email support.
- Never ask for passwords, card numbers or OTP codes. Only discuss EbsyStore; politely decline unrelated requests.`
}

export async function POST(request) {
  try {
    const apiKey = process.env.ANTHROPIC_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: "The assistant is not set up yet." }, { status: 503 })
    }

    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown"
    if (isLimited(ip)) {
      return NextResponse.json({ error: "You are sending messages very fast. Please wait a few minutes." }, { status: 429 })
    }

    const body = await request.json()

    // Clean the conversation: valid roles, short text, alternating turns, starts with the customer
    const messages = []
    for (const m of (Array.isArray(body.messages) ? body.messages : []).slice(-10)) {
      if (!m || (m.role !== "user" && m.role !== "assistant")) continue
      const content = String(m.content || "").trim().slice(0, 600)
      if (!content) continue
      const last = messages[messages.length - 1]
      if (last && last.role === m.role) last.content += "\n" + content
      else messages.push({ role: m.role, content })
    }
    while (messages.length && messages[0].role !== "user") messages.shift()

    if (!messages.length || messages[messages.length - 1].role !== "user") {
      return NextResponse.json({ error: "Please type a message." }, { status: 400 })
    }

    const products = await findProducts(messages[messages.length - 1].content)

    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 25000)

    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 400,
        system: buildSystemPrompt(products),
        messages,
      }),
      signal: controller.signal,
    }).finally(() => clearTimeout(timeout))

    if (!res.ok) {
      console.error("Chat API error:", res.status, await res.text())
      return NextResponse.json({ error: "The assistant is busy right now. Please try again." }, { status: 502 })
    }

    const data = await res.json()
    const reply = (data.content || [])
      .filter((b) => b.type === "text")
      .map((b) => b.text)
      .join("\n")
      .trim()

    return NextResponse.json({ reply: reply || "Sorry, I could not answer that. Please try WhatsApp." })
  } catch (error) {
    console.error("Chat error:", error)
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 })
  }
}