import { Link } from "@/i18n/navigation";
import { ShoppingCart, Search, Menu, Sparkles } from "lucide-react";
import { CartDrawer } from "@/components/store/cart-drawer";
import { WhatsAppButton } from "@/components/store/whatsapp-button";
import { LanguageSwitcher } from "@/components/store/language-switcher";
import { getTranslations } from "next-intl/server";

export default async function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const t = await getTranslations("common");

  const navLinks = [
    { href: "/", label: t("header.home") },
    { href: "/products", label: t("header.shop") },
    { href: "/products?sort=newest", label: t("header.newArrivals") },
    { href: "/contact", label: t("header.contact") },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-lg border-b border-(--border)">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between gap-4">
            <div className="flex items-center gap-8">
              <Link
                href="/"
                className="flex items-center gap-2 text-xl font-bold tracking-tight"
              >
                <Sparkles className="size-5 text-(--primary)" />
                <span className="hidden sm:inline">{t("brand")}</span>
                <span className="sm:hidden">{t("brandShort")}</span>
              </Link>
              <nav className="hidden md:flex items-center gap-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="px-3 py-1.5 text-sm text-(--muted-foreground) hover:text-(--foreground) hover:bg-(--muted) rounded-lg transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>

            <div className="flex items-center gap-1">
              <LanguageSwitcher />
              <Link
                href="/search"
                className="p-2 text-(--muted-foreground) hover:text-(--foreground) transition-colors rounded-lg hover:bg-(--muted)"
              >
                <Search className="size-5" />
              </Link>
              <CartDrawer />
              <button className="md:hidden p-2 text-(--muted-foreground) hover:text-(--foreground) rounded-lg hover:bg-(--muted)">
                <Menu className="size-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <WhatsAppButton />

      <footer className="bg-stone-900 text-stone-300">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            <div>
              <Link href="/" className="text-white text-lg font-bold tracking-tight">
                {t("brand")}
              </Link>
              <p className="mt-3 text-sm text-stone-400 leading-relaxed">
                {t("footer.tagline")}
              </p>
            </div>
            <div>
              <h4 className="text-white font-medium text-sm mb-4">{t("footer.shop")}</h4>
              <ul className="space-y-2.5 text-sm text-stone-400">
                <li><Link href="/products" className="hover:text-white transition-colors">{t("footer.allProducts")}</Link></li>
                <li><Link href="/products?sort=newest" className="hover:text-white transition-colors">{t("footer.newArrivals")}</Link></li>
                <li><Link href="/search" className="hover:text-white transition-colors">{t("footer.search")}</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-medium text-sm mb-4">{t("footer.support")}</h4>
              <ul className="space-y-2.5 text-sm text-stone-400">
                <li><Link href="/contact" className="hover:text-white transition-colors">{t("footer.contactUs")}</Link></li>
                <li><Link href="/shipping" className="hover:text-white transition-colors">{t("footer.shippingPolicy")}</Link></li>
                <li><Link href="/returns" className="hover:text-white transition-colors">{t("footer.returns")}</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-medium text-sm mb-4">{t("footer.company")}</h4>
              <ul className="space-y-2.5 text-sm text-stone-400">
                <li><Link href="/privacy" className="hover:text-white transition-colors">{t("footer.privacyPolicy")}</Link></li>
                <li><Link href="/terms" className="hover:text-white transition-colors">{t("footer.termsOfService")}</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-stone-800 text-center text-sm text-stone-500">
            {t("footer.copyright", { year: new Date().getFullYear() })}
          </div>
        </div>
      </footer>
    </>
  );
}
