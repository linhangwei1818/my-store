import { Metadata } from "next";
import { generateSiteMetadata } from "@/lib/seo";
import { ContactForm } from "@/components/store/contact-form";

export const metadata: Metadata = generateSiteMetadata({
  title: "Contact Us",
  description: "Have questions about our products? Get in touch with us.",
});

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ product?: string; productId?: string }>;
}) {
  const params = await searchParams;

  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-10">
        <p className="text-sm font-medium tracking-widest uppercase text-(--primary) mb-3">
          Get In Touch
        </p>
        <h1 className="text-3xl md:text-4xl font-bold text-stone-900 mb-3">
          Contact Us
        </h1>
        <p className="text-(--muted-foreground) leading-relaxed max-w-md mx-auto">
          Have questions about our products? Want to customize a piece? We&apos;d love to hear from you.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-(--border) p-6 md:p-8">
        <ContactForm
          productName={params.product}
          productId={params.productId}
        />
      </div>
    </div>
  );
}
