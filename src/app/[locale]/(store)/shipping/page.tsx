import { getTranslations } from "next-intl/server";
import { generateSiteMetadata } from "@/lib/seo";
import { FREE_SHIPPING_THRESHOLD, SHIPPING_FLAT_RATE } from "@/lib/constants";
import { formatPrice } from "@/lib/utils";
import type { Metadata } from "next";

export const metadata: Metadata = generateSiteMetadata({
  title: "Shipping Policy",
});

export default async function ShippingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const tc = await getTranslations("common");
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12 prose prose-sm">
      <h1>{tc("footer.shippingPolicy")}</h1>

      <h2>Shipping Rates</h2>
      <p>
        Standard shipping is a flat rate of {formatPrice(SHIPPING_FLAT_RATE, locale)}.
        Orders over {formatPrice(FREE_SHIPPING_THRESHOLD, locale)} qualify for free
        standard shipping.
      </p>

      <h2>Processing Time</h2>
      <p>
        Orders are typically processed within 1-2 business days. You will
        receive a confirmation email with tracking information once your order
        has shipped.
      </p>

      <h2>Delivery Times</h2>
      <ul>
        <li>United States: 3-7 business days</li>
        <li>Canada: 5-10 business days</li>
        <li>United Kingdom: 5-12 business days</li>
        <li>Australia: 7-14 business days</li>
        <li>Europe: 5-12 business days</li>
      </ul>

      <h2>International Shipping</h2>
      <p>
        International orders may be subject to customs duties and import taxes.
        These charges are the responsibility of the customer and are not
        included in the shipping cost.
      </p>
    </div>
  );
}
