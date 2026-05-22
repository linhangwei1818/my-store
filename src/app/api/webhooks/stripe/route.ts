import { NextRequest, NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"
import { prisma } from "@/lib/prisma"
import { generateOrderNumber } from "@/lib/utils"
import Stripe from "stripe"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnySession = any

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get("stripe-signature")!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    console.error("Webhook signature verification failed:", err)
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session

    try {
      const fullSession: AnySession = await stripe.checkout.sessions.retrieve(
        session.id,
        { expand: ["line_items"] }
      )

      const orderNumber = generateOrderNumber()
      const productMap: Record<string, string> = JSON.parse(
        fullSession.metadata?.productMap || "{}"
      )

      await prisma.$transaction(async (tx) => {
        const lineItems = fullSession.line_items?.data || []

        await tx.order.create({
          data: {
            orderNumber,
            customerEmail: fullSession.customer_details?.email || "",
            customerName:
              fullSession.customer_details?.name ||
              fullSession.metadata?.customerName ||
              "",
            customerPhone: fullSession.metadata?.customerPhone || null,
            shippingAddress: (fullSession.shipping_details?.address || {}) as AnySession,
            subtotal: fullSession.amount_subtotal || 0,
            shippingCost: fullSession.total_details?.amount_shipping || 0,
            taxAmount: fullSession.total_details?.amount_tax || 0,
            totalAmount: fullSession.amount_total || 0,
            currency: fullSession.currency || "usd",
            status: "CONFIRMED",
            paymentStatus: "PAID",
            stripePaymentIntentId: fullSession.payment_intent as string,
            stripeSessionId: fullSession.id,
            items: {
              create: lineItems.map((item: AnySession, index: number) => ({
                productId: productMap[String(index)] || null,
                productName: item.description || "Product",
                productSku: item.price?.metadata?.sku || "",
                quantity: item.quantity || 1,
                unitPrice: item.price?.unit_amount || 0,
                totalPrice: item.amount_total || 0,
                imageUrl: item.price?.product_data?.images?.[0] || null,
              })),
            },
          },
        })

        for (const [index, productId] of Object.entries(productMap)) {
          const li = lineItems[parseInt(index)]
          if (li && productId) {
            await tx.product.updateMany({
              where: {
                id: productId,
                inventory: { gte: li.quantity || 1 },
              },
              data: {
                inventory: { decrement: li.quantity || 1 },
              },
            })
          }
        }
      })

      console.log(`Order ${orderNumber} created successfully`)
    } catch (err) {
      console.error("Failed to create order from webhook:", err)
      return NextResponse.json(
        { error: "Failed to process order" },
        { status: 500 }
      )
    }
  }

  return NextResponse.json({ received: true })
}
