"use client"

import { useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/store/cart-store";
import toast from "react-hot-toast";
import { ShoppingBag } from "lucide-react";

const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000;

export interface ProductCardProduct {
  slug: string;
  name: string;
  price: number;
  compareAtPrice: number | null;
  images: { url: string; alt: string | null }[];
  createdAt?: string | Date;
}

export function ProductCard({ product }: { product: ProductCardProduct }) {
  const t = useTranslations("product");
  const locale = useLocale();
  const addItem = useCartStore((s) => s.addItem);
  const image = product.images[0];
  const secondImage = product.images[1];
  const [now] = useState(() => Date.now());
  const hasSale = product.compareAtPrice && product.compareAtPrice > product.price;
  const isNew = useMemo(
    () =>
      product.createdAt &&
      new Date(product.createdAt).getTime() > now - THIRTY_DAYS,
    [product.createdAt, now],
  );

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      productId: product.slug,
      name: product.name,
      price: product.price,
      image: image?.url || "",
      slug: product.slug,
      maxQuantity: 99,
    });
    toast.success(t("detail.addedToCart", { name: product.name }));
  };

  return (
    <Link href={`/products/${product.slug}`} className="block">
      <Card className="group h-full overflow-hidden border-(--border) hover:border-(--primary)/30 hover:shadow-lg transition-all duration-300 rounded-2xl">
        <div className="aspect-square bg-stone-100 overflow-hidden relative">
          {image ? (
            <>
              {/* Primary image */}
              <img
                src={image.url}
                alt={image.alt || product.name}
                className="size-full object-cover transition-all duration-500 group-hover:scale-110"
              />
              {/* Secondary image on hover */}
              {secondImage && (
                <img
                  src={secondImage.url}
                  alt={secondImage.alt || product.name}
                  className="absolute inset-0 size-full object-cover transition-all duration-500 opacity-0 group-hover:opacity-100 group-hover:scale-110"
                />
              )}
            </>
          ) : (
            <div className="size-full flex items-center justify-center text-stone-400">
              <span className="text-sm">{t("card.noImage")}</span>
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
            {hasSale && (
              <span className="px-2.5 py-1 text-xs font-semibold bg-red-500 text-white rounded-full shadow-sm">
                {t("badge.sale")}
              </span>
            )}
            {isNew && (
              <span className="px-2.5 py-1 text-xs font-semibold bg-emerald-600 text-white rounded-full shadow-sm">
                {t("badge.new")}
              </span>
            )}
          </div>

          {/* Quick Add overlay — desktop: hover only, mobile: always visible */}
          <div className="absolute inset-x-0 bottom-0 p-3 translate-y-full group-hover:translate-y-0 max-sm:translate-y-0 transition-transform duration-300 z-10">
            <button
              onClick={handleQuickAdd}
              className="w-full py-2.5 bg-white/95 backdrop-blur text-(--foreground) rounded-xl text-sm font-medium shadow-lg hover:bg-(--primary) hover:text-white active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2"
            >
              <ShoppingBag className="size-4" />
              {t("card.quickAdd")}
            </button>
          </div>

          {/* Dark overlay on hover */}
          <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
        </div>

        <CardContent className="p-4">
          <h3 className="font-medium text-sm line-clamp-2 mb-2 group-hover:text-(--primary) transition-colors">
            {product.name}
          </h3>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm text-stone-900">
              {formatPrice(product.price, locale)}
            </span>
            {hasSale && (
              <span className="text-xs text-(--muted-foreground) line-through">
                {formatPrice(product.compareAtPrice!, locale)}
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
