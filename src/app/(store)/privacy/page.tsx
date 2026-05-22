import { generateSiteMetadata } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = generateSiteMetadata({
  title: "Privacy Policy",
  description: "Learn how we collect, use, and protect your personal information.",
});

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12 prose prose-sm">
      <h1>Privacy Policy</h1>
      <p>Last updated: {new Date().toLocaleDateString()}</p>

      <h2>Information We Collect</h2>
      <p>
        When you make a purchase from our store, we collect the personal
        information you provide, such as your name, email address, shipping
        address, and payment details. We also automatically receive your
        computer&apos;s internet protocol (IP) address.
      </p>

      <h2>How We Use Your Information</h2>
      <p>
        We use the information we collect to process your orders, communicate
        with you about your purchases, and improve our store. We do not sell,
        trade, or otherwise transfer your personally identifiable information to
        outside parties.
      </p>

      <h2>Payment Processing</h2>
      <p>
        All payments are processed securely through Stripe. We do not store your
        credit card details on our servers. Stripe&apos;s use of your personal
        information is governed by their privacy policy.
      </p>

      <h2>Cookies</h2>
      <p>
        We use cookies to maintain your shopping cart session and improve your
        browsing experience. You can disable cookies in your browser settings,
        but this may affect the functionality of our store.
      </p>

      <h2>Contact</h2>
      <p>
        If you have any questions about this privacy policy, please contact us
        at support@mystore.com.
      </p>
    </div>
  );
}
