import { getTranslations } from "next-intl/server";
import { generateSiteMetadata } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = generateSiteMetadata({
  title: "Terms of Service",
});

export default async function TermsPage() {
  const tc = await getTranslations("common");
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12 prose prose-sm">
      <h1>{tc("footer.termsOfService")}</h1>
      <p>Last updated: {new Date().toLocaleDateString()}</p>

      <h2>Acceptance of Terms</h2>
      <p>
        By accessing and using this website, you agree to be bound by these
        Terms of Service. If you do not agree, please do not use our services.
      </p>

      <h2>Products and Pricing</h2>
      <p>
        All prices are listed in US dollars (USD). We reserve the right to
        modify prices and discontinue products without prior notice. Product
        images are for illustration purposes only; actual products may vary
        slightly.
      </p>

      <h2>Orders and Payment</h2>
      <p>
        By placing an order, you agree to provide accurate and complete
        information. We reserve the right to refuse or cancel any order. Payment
        is processed securely through Stripe.
      </p>

      <h2>Intellectual Property</h2>
      <p>
        All content on this website, including text, images, logos, and
        graphics, is the property of MyStore and is protected by copyright laws.
      </p>

      <h2>Limitation of Liability</h2>
      <p>
        MyStore shall not be liable for any indirect, incidental, or
        consequential damages arising from the use of our products or services.
      </p>

      <h2>Contact</h2>
      <p>
        For any questions regarding these terms, contact us at
        support@mystore.com.
      </p>
    </div>
  );
}
