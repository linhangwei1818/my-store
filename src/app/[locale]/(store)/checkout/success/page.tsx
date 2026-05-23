import { Link, redirect } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";
import { getStripe } from "@/lib/stripe";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

export default async function CheckoutSuccessPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { locale } = await params;
  const { session_id } = await searchParams;

  if (!session_id) {
    redirect({ href: "/", locale });
  }

  const t = await getTranslations("checkout");
  let customerEmail = "";
  try {
    const session = await getStripe().checkout.sessions.retrieve(session_id!);
    customerEmail = session.customer_details?.email || "";
  } catch {
    // Session might not be available yet (webhook delayed)
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 text-center">
      <div className="mx-auto max-w-md">
        <CheckCircle className="size-16 text-green-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-2">{t("success.title")}</h1>
        <p className="text-(--muted-foreground) mb-6">
          {t("success.message", { email: customerEmail || "" })}
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link href="/products">
            <Button variant="primary">{t("success.continueShopping")}</Button>
          </Link>
          <Link href="/">
            <Button variant="outline">{t("success.goHome")}</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
