import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
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
  const t = await getTranslations("contact");
  const params = await searchParams;

  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-10">
        <p className="text-sm font-medium tracking-widest uppercase text-(--primary) mb-3">
          {t("overline")}
        </p>
        <h1 className="text-3xl md:text-4xl font-bold text-stone-900 mb-3">
          {t("title")}
        </h1>
        <p className="text-(--muted-foreground) leading-relaxed max-w-md mx-auto">
          {t("subtitle")}
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
