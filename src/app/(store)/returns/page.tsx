import { generateSiteMetadata } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = generateSiteMetadata({
  title: "Returns & Refunds",
});

export default function ReturnsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12 prose prose-sm">
      <h1>Returns & Refunds Policy</h1>

      <h2>30-Day Return Policy</h2>
      <p>
        We offer a 30-day return policy for most products. If you are not
        completely satisfied with your purchase, you may return it within 30
        days of delivery for a full refund.
      </p>

      <h2>Return Conditions</h2>
      <ul>
        <li>Items must be in original, unused condition</li>
        <li>All original packaging, tags, and accessories must be included</li>
        <li>Proof of purchase is required</li>
      </ul>

      <h2>Non-Returnable Items</h2>
      <p>
        For hygiene reasons, certain items cannot be returned once opened:
        earphones, personal care items, and intimate apparel.
      </p>

      <h2>Refund Process</h2>
      <p>
        Once your return is received and inspected, we will process your refund
        to the original payment method within 5-10 business days. Shipping costs
        are non-refundable unless the return is due to our error.
      </p>

      <h2>How to Return</h2>
      <p>
        To initiate a return, please contact our customer support team at
        support@mystore.com with your order number and the reason for return.
      </p>
    </div>
  );
}
