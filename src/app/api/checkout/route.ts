import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { SITE_URL, FREE_SHIPPING_THRESHOLD, SHIPPING_FLAT_RATE } from "@/lib/constants";
import { checkoutSchema } from "@/lib/validations";
import { ZodError } from "zod";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { items, customer, shippingAddress } = checkoutSchema.parse(body);

    // Validate products and prices
    const productIds = items.map((i) => i.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds }, isActive: true },
      include: { images: { orderBy: { sortOrder: "asc" } } },
    });

    if (products.length !== items.length) {
      return NextResponse.json(
        { error: "Some products are no longer available" },
        { status: 400 }
      );
    }

    // Check inventory
    for (const item of items) {
      const product = products.find((p) => p.id === item.productId);
      if (!product) {
        return NextResponse.json(
          { error: `Product not found: ${item.productId}` },
          { status: 400 }
        );
      }
      if (product.inventory !== -1 && product.inventory < item.quantity) {
        return NextResponse.json(
          { error: `Insufficient stock for: ${product.name}` },
          { status: 400 }
        );
      }
    }

    // Calculate subtotal from DB prices (not client prices - security)
    const subtotal = items.reduce((sum, item) => {
      const product = products.find((p) => p.id === item.productId)!;
      return sum + product.price * item.quantity;
    }, 0);

    const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FLAT_RATE;

    // Create Stripe line items
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const line_items: any[] = items.map((item) => {
      const product = products.find((p) => p.id === item.productId)!;
      return {
        price_data: {
          currency: "usd",
          product_data: {
            name: product.name,
            images: product.images[0] ? [product.images[0].url] : undefined,
            metadata: { productId: product.id },
          },
          unit_amount: product.price,
        },
        quantity: item.quantity,
      };
    });

    // Add shipping as line item if applicable
    if (shipping > 0) {
      line_items.push({
        price_data: {
          currency: "usd",
          product_data: {
            name: "Shipping",
            metadata: {},
          },
          unit_amount: shipping,
        },
        quantity: 1,
      });
    }

    // Create product ID map for webhook
    const productMap: Record<string, string> = {};
    items.forEach((item, index) => {
      productMap[String(index)] = item.productId;
    });

    const session = await stripe.checkout.sessions.create({
      customer_email: customer.email,
      shipping_address_collection: {
        allowed_countries: ["US", "CA", "GB", "AU", "DE", "FR"],
      },
      line_items,
      mode: "payment",
      success_url: `${SITE_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${SITE_URL}/cart`,
      metadata: {
        customerName: customer.name,
        customerPhone: customer.phone || "",
        productMap: JSON.stringify(productMap),
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Invalid request data", details: error.issues },
        { status: 400 }
      );
    }
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
