import Link from "next/link";
import { redirect } from "next/navigation";
import { stripe } from "@/lib/stripe";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id } = await searchParams;

  if (!session_id) {
    redirect("/");
  }

  let customerEmail = "";
  try {
    const session = await stripe.checkout.sessions.retrieve(session_id);
    customerEmail = session.customer_details?.email || "";
  } catch {
    // Session might not be available yet (webhook delayed)
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 text-center">
      <div className="mx-auto max-w-md">
        <CheckCircle className="size-16 text-green-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-2">Order Confirmed!</h1>
        <p className="text-(--muted-foreground) mb-6">
          Thank you for your purchase. Your order has been received and is being
          processed. A confirmation email will be sent to{" "}
          {customerEmail && (
            <span className="font-medium text-(--foreground)">
              {customerEmail}
            </span>
          )}
          .
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link href="/products">
            <Button variant="primary">Continue Shopping</Button>
          </Link>
          <Link href="/">
            <Button variant="outline">Go Home</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
