import { prisma } from "@/lib/prisma";
import { ProductGrid } from "@/components/store/product-grid";
import { SortSelect } from "@/components/store/sort-select";
import { PRODUCTS_PER_PAGE } from "@/lib/constants";
import { generateSiteMetadata } from "@/lib/seo";
import type { Metadata } from "next";

export const revalidate = 300;

export const metadata: Metadata = generateSiteMetadata({
  title: "All Products",
  description: "Browse our complete collection of products.",
});

async function getProducts(page: number, category?: string, sort?: string) {
  const where: Record<string, unknown> = { isActive: true };
  if (category) {
    where.category = { slug: category };
  }

  let orderBy: Record<string, string> = { createdAt: "desc" };
  if (sort === "price-asc") orderBy = { price: "asc" };
  else if (sort === "price-desc") orderBy = { price: "desc" };

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: { images: { orderBy: { sortOrder: "asc" } } },
      orderBy,
      skip: (page - 1) * PRODUCTS_PER_PAGE,
      take: PRODUCTS_PER_PAGE,
    }),
    prisma.product.count({ where }),
  ]);

  return { products, total, pages: Math.ceil(total / PRODUCTS_PER_PAGE) };
}

async function getCategories() {
  return prisma.category.findMany({
    orderBy: { sortOrder: "asc" },
    include: { _count: { select: { products: { where: { isActive: true } } } } },
  });
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; category?: string; sort?: string }>;
}) {
  const params = await searchParams;
  const page = Math.max(1, parseInt(params.page || "1"));
  const { products, total, pages } = await getProducts(
    page,
    params.category,
    params.sort
  );
  const categories = await getCategories();

  const currentSort = params.sort || "newest";
  const currentCategory = params.category || "";

  const buildUrl = (updates: Record<string, string | null>) => {
    const p = new URLSearchParams();
    p.set("page", updates.page || "1");
    const cat = updates.category !== undefined ? updates.category : currentCategory;
    if (cat) p.set("category", cat);
    const s = updates.sort !== undefined ? updates.sort : currentSort;
    if (s && s !== "newest") p.set("sort", s);
    return `/products?${p.toString()}`;
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar filters */}
        <aside className="w-full md:w-56 flex-shrink-0">
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-sm mb-3">Categories</h3>
              <ul className="space-y-1">
                <li>
                  <a
                    href={buildUrl({ category: null })}
                    className={`text-sm block py-1 px-2 rounded-lg transition-colors ${
                      !currentCategory
                        ? "bg-(--accent) text-(--accent-foreground) font-medium"
                        : "text-(--muted-foreground) hover:text-(--foreground)"
                    }`}
                  >
                    All Products
                  </a>
                </li>
                {categories.map((cat) => (
                  <li key={cat.id}>
                    <a
                      href={buildUrl({ category: cat.slug })}
                      className={`text-sm block py-1 px-2 rounded-lg transition-colors ${
                        currentCategory === cat.slug
                          ? "bg-(--accent) text-(--accent-foreground) font-medium"
                          : "text-(--muted-foreground) hover:text-(--foreground)"
                      }`}
                    >
                      {cat.name} ({cat._count.products})
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </aside>

        {/* Product grid */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-(--muted-foreground)">
              {total} product{total !== 1 ? "s" : ""}
              {currentCategory && ` in this category`}
            </p>
            <SortSelect currentSort={currentSort} currentCategory={currentCategory} />
          </div>

          <ProductGrid products={products} />

          {/* Pagination */}
          {pages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
                <a
                  key={p}
                  href={buildUrl({ page: String(p) })}
                  className={`size-9 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                    p === page
                      ? "bg-(--primary) text-(--primary-foreground)"
                      : "text-(--muted-foreground) hover:bg-(--muted)"
                  }`}
                >
                  {p}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
