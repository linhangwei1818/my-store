import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ProductGrid } from "@/components/store/product-grid";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export const revalidate = 3600;

async function getFeaturedProducts() {
  return prisma.product.findMany({
    where: { isActive: true, isFeatured: true },
    include: { images: { orderBy: { sortOrder: "asc" } } },
    take: 8,
    orderBy: { createdAt: "desc" },
  });
}

async function getCategories() {
  return prisma.category.findMany({
    include: { _count: { select: { products: { where: { isActive: true } } } } },
    orderBy: { sortOrder: "asc" },
  });
}

export default async function HomePage() {
  const [featuredProducts, categories] = await Promise.all([
    getFeaturedProducts(),
    getCategories(),
  ]);

  return (
    <div>
      {/* Hero */}
      <section className="bg-(--accent)">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 md:py-32 text-center">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">
            Quality Products, <br />
            <span className="text-(--primary)">Great Prices</span>
          </h1>
          <p className="text-lg text-(--muted-foreground) max-w-xl mx-auto mb-8">
            Discover our curated collection of premium products. Free shipping on orders over $50.
          </p>
          <div className="flex items-center justify-center gap-3">
            <Link href="/products">
              <Button variant="primary" size="lg">
                Shop Now
                <ArrowRight className="ml-2 size-4" />
              </Button>
            </Link>
            <Link href="/products">
              <Button variant="outline" size="lg">
                View All Products
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      {categories.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-2xl font-bold mb-8 text-center">Shop by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/categories/${cat.slug}`}
                className="group rounded-xl border border-(--border) p-6 text-center hover:border-(--primary) hover:shadow-sm transition-all"
              >
                <h3 className="font-medium group-hover:text-(--primary) transition-colors">
                  {cat.name}
                </h3>
                <p className="text-sm text-(--muted-foreground) mt-1">
                  {cat._count.products} products
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold">Featured Products</h2>
            <Link href="/products">
              <Button variant="ghost" size="sm">
                View All <ArrowRight className="ml-1 size-4" />
              </Button>
            </Link>
          </div>
          <ProductGrid products={featuredProducts} />
        </section>
      )}

      {/* Trust badges */}
      <section className="bg-(--muted) border-y border-(--border)">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { title: "Free Shipping", desc: "On orders over $50" },
              { title: "Secure Payment", desc: "256-bit SSL encryption" },
              { title: "Easy Returns", desc: "30-day return policy" },
              { title: "24/7 Support", desc: "Dedicated customer service" },
            ].map((item) => (
              <div key={item.title}>
                <h4 className="font-semibold text-sm">{item.title}</h4>
                <p className="text-xs text-(--muted-foreground) mt-1">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
