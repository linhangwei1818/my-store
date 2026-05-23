import { getTranslations } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import { ProductGrid } from "@/components/store/product-grid";
import { generateSiteMetadata } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = generateSiteMetadata({ title: "Search" });

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const t = await getTranslations("common");
  const { q } = await searchParams;
  const query = q || "";

  let products: {
    slug: string;
    name: string;
    price: number;
    compareAtPrice: number | null;
    images: { url: string; alt: string | null }[];
  }[] = [];

  if (query) {
    products = await prisma.product.findMany({
      where: {
        isActive: true,
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { description: { contains: query, mode: "insensitive" } },
        ],
      },
      include: { images: { orderBy: { sortOrder: "asc" } } },
      take: 50,
    });
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold mb-6">{t("footer.search")}</h1>

      <form className="mb-8">
        <div className="flex gap-3 max-w-lg">
          <input
            name="q"
            defaultValue={query}
            placeholder={t("footer.search") + "..."}
            className="flex-1 h-10 rounded-lg border border-(--border) px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-(--primary)"
          />
          <button
            type="submit"
            className="h-10 px-6 bg-(--primary) text-(--primary-foreground) rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
          >
            {t("footer.search")}
          </button>
        </div>
      </form>

      {query && (
        <p className="text-sm text-(--muted-foreground) mb-6">
          {t("search.results", { count: products.length, query })}
        </p>
      )}

      <ProductGrid products={products} />
    </div>
  );
}
