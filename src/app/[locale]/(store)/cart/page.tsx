"use client"
import { Link } from "@/i18n/navigation";
import { useTranslations, useLocale } from "next-intl";
import { Minus, Plus, Trash2, ArrowLeft } from "lucide-react";
import { useCartStore } from "@/store/cart-store";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { FREE_SHIPPING_THRESHOLD, SHIPPING_FLAT_RATE } from "@/lib/constants";

export default function CartPage() {
  const t = useTranslations("cart");
  const locale = useLocale();
  const { items, removeItem, updateQuantity, itemCount, subtotal } = useCartStore();
  const count = itemCount();
  const sub = subtotal();
  const shipping = sub >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FLAT_RATE;
  const total = sub + shipping;

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">{t("page.empty")}</h1>
        <p className="text-(--muted-foreground) mb-6">
          {t("page.emptyMessage")}
        </p>
        <Link href="/products">
          <Button variant="primary">{t("page.browseProducts")}</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold mb-8">
        {t("page.title", { count })}
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-3">
          {items.map((item) => (
            <div
              key={item.productId}
              className="flex gap-4 p-4 rounded-xl border border-(--border)"
            >
              <div className="size-24 rounded-lg bg-(--muted) flex-shrink-0 overflow-hidden">
                {item.image && (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="size-full object-cover"
                  />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <Link
                  href={`/products/${item.slug}`}
                  className="font-medium hover:text-(--primary)"
                >
                  {item.name}
                </Link>
                <p className="text-sm font-semibold mt-1">
                  {formatPrice(item.price, locale)}
                </p>
                <div className="flex items-center gap-3 mt-3">
                  <div className="flex items-center rounded-lg border border-(--border)">
                    <button
                      onClick={() =>
                        updateQuantity(item.productId, item.quantity - 1)
                      }
                      className="p-1.5 hover:bg-(--muted) rounded-l-lg"
                    >
                      <Minus className="size-3.5" />
                    </button>
                    <span className="w-10 text-center text-sm">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        updateQuantity(item.productId, item.quantity + 1)
                      }
                      className="p-1.5 hover:bg-(--muted) rounded-r-lg"
                    >
                      <Plus className="size-3.5" />
                    </button>
                  </div>
                  <button
                    onClick={() => removeItem(item.productId)}
                    className="text-sm text-red-500 hover:text-red-700 flex items-center gap-1"
                  >
                    <Trash2 className="size-3.5" />
                    {t("page.remove")}
                  </button>
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="font-semibold">
                  {formatPrice(item.price * item.quantity, locale)}
                </p>
              </div>
            </div>
          ))}
          <Link
            href="/products"
            className="inline-flex items-center gap-1 text-sm text-(--muted-foreground) hover:text-(--foreground) mt-4"
          >
            <ArrowLeft className="size-3.5" />
            {t("page.continueShopping")}
          </Link>
        </div>

        <div className="lg:col-span-1">
          <div className="rounded-xl border border-(--border) p-6 space-y-4 sticky top-24">
            <h2 className="font-semibold text-lg">{t("page.orderSummary")}</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-(--muted-foreground)">{t("page.subtotal")}</span>
                <span>{formatPrice(sub, locale)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-(--muted-foreground)">{t("page.shipping")}</span>
                <span>
                  {shipping === 0 ? (
                    <span className="text-green-600">{t("page.free")}</span>
                  ) : (
                    formatPrice(shipping, locale)
                  )}
                </span>
              </div>
              {shipping > 0 && (
                <p className="text-xs text-(--muted-foreground)">
                  {t("page.freeShippingNotice", { threshold: formatPrice(FREE_SHIPPING_THRESHOLD, locale) })}
                </p>
              )}
            </div>
            <div className="border-t border-(--border) pt-3 flex justify-between font-semibold">
              <span>{t("page.total")}</span>
              <span>{formatPrice(total, locale)}</span>
            </div>
            <Link href="/checkout" className="block">
              <Button variant="primary" className="w-full" size="lg">
                {t("page.proceedToCheckout")}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
