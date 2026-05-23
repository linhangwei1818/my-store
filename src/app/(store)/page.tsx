import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ProductGrid } from "@/components/store/product-grid";
import { Button } from "@/components/ui/button";
import { ArrowRight, Truck, Shield, RotateCcw, Flower2, Home, Palette, Gem } from "lucide-react";

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

const categoryIcons: Record<string, React.ReactNode> = {
  "Home & Garden": <Home className="size-6" />,
  "Clothing": <Gem className="size-6" />,
  "Electronics": <Palette className="size-6" />,
  "Sports": <Flower2 className="size-6" />,
};

export default async function HomePage() {
  const [featuredProducts, categories] = await Promise.all([
    getFeaturedProducts(),
    getCategories(),
  ]);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-stone-50 to-(--accent)">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 md:py-36 text-center">
          <p className="text-sm font-medium tracking-widest uppercase text-(--primary) mb-4">
            Elevate Your Space
          </p>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-stone-900 mb-6 leading-tight">
            Beautiful Decor
            <br />
            <span className="text-(--primary)">For Your Home</span>
          </h1>
          <p className="text-base md:text-lg text-(--muted-foreground) max-w-lg mx-auto mb-10 leading-relaxed">
            Discover our curated collection of artisanal decorations. Each piece tells a story and brings warmth to your living space.
          </p>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <Link href="/products">
              <Button variant="primary" size="lg" className="shadow-lg shadow-orange-200">
                Shop Collection
                <ArrowRight className="ml-2 size-4" />
              </Button>
            </Link>
            <Link href="/products?sort=newest">
              <Button variant="outline" size="lg">
                New Arrivals
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      {categories.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-12">
            <p className="text-sm font-medium tracking-widest uppercase text-(--primary) mb-3">
              Curated Collections
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-stone-900">
              Shop by Category
            </h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/categories/${cat.slug}`}
                className="group relative bg-white rounded-2xl border border-(--border) p-8 text-center hover:border-(--primary) hover:shadow-lg hover:shadow-orange-50 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="mx-auto size-14 flex items-center justify-center rounded-xl bg-(--accent) text-(--primary) mb-4 group-hover:scale-110 transition-transform duration-300">
                  {categoryIcons[cat.name] || <Gem className="size-6" />}
                </div>
                <h3 className="font-semibold group-hover:text-(--primary) transition-colors">
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
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="text-sm font-medium tracking-widest uppercase text-(--primary) mb-3">
                Handpicked For You
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-stone-900">
                Featured Products
              </h2>
            </div>
            <Link href="/products" className="hidden sm:block">
              <Button variant="ghost" size="sm" className="group">
                View All{" "}
                <ArrowRight className="ml-1.5 size-4 group-hover:translate-x-0.5 transition-transform" />
              </Button>
            </Link>
          </div>
          <ProductGrid products={featuredProducts} />
          <div className="mt-8 text-center sm:hidden">
            <Link href="/products">
              <Button variant="outline" size="lg">
                View All Products
                <ArrowRight className="ml-2 size-4" />
              </Button>
            </Link>
          </div>
        </section>
      )}

      {/* Brand Promise */}
      <section className="border-y border-(--border) bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Truck className="size-6" />,
                title: "Free Shipping",
                desc: "Complimentary shipping on all orders over $50. Carefully packaged to arrive in perfect condition.",
              },
              {
                icon: <Shield className="size-6" />,
                title: "Quality Guarantee",
                desc: "Every piece is inspected before shipping. Not satisfied? Return within 30 days, no questions asked.",
              },
              {
                icon: <RotateCcw className="size-6" />,
                title: "Easy Returns",
                desc: "Hassle-free returns within 30 days. Your satisfaction is our priority — always.",
              },
            ].map((item) => (
              <div key={item.title} className="flex gap-4 p-6 rounded-2xl hover:bg-(--accent) transition-colors duration-300">
                <div className="flex-shrink-0 size-12 flex items-center justify-center rounded-xl bg-(--accent) text-(--primary)">
                  {item.icon}
                </div>
                <div>
                  <h3 className="font-semibold mb-1.5">{item.title}</h3>
                  <p className="text-sm text-(--muted-foreground) leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-stone-900 rounded-3xl p-10 md:p-16 text-center relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Bring Your Home to Life
            </h2>
            <p className="text-stone-400 max-w-lg mx-auto mb-8 leading-relaxed">
              Explore our latest collection of wall art, decorative accents, and home essentials designed to inspire.
            </p>
            <Link href="/products">
              <Button variant="primary" size="lg" className="shadow-lg">
                Explore Collection
                <ArrowRight className="ml-2 size-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
