"use client"

import { useTranslations } from "next-intl";
import { ProductCard } from "./product-card";

interface ProductGridProps {
  products: {
    slug: string;
    name: string;
    price: number;
    compareAtPrice: number | null;
    images: { url: string; alt: string | null }[];
    createdAt?: string | Date;
  }[];
}

export function ProductGrid({ products }: ProductGridProps) {
  const t = useTranslations("product");

  if (products.length === 0) {
    return (
      <div className="text-center py-12 text-(--muted-foreground)">
        {t("grid.noProducts")}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
      {products.map((product) => (
        <ProductCard key={product.slug} product={product} />
      ))}
    </div>
  );
}
