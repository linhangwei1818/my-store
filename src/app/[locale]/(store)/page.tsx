import { Link } from "@/i18n/navigation";
import { prisma } from "@/lib/prisma";
import { ProductGrid } from "@/components/store/product-grid";
import { ScrollRow } from "@/components/store/scroll-row";
import { HeroCarousel } from "@/components/store/hero-carousel";
import { Button } from "@/components/ui/button";
import { ArrowRight, Truck, Shield, RotateCcw, Gem } from "lucide-react";
import { getTranslations } from "next-intl/server";

export const revalidate = 3600;

async function getFeaturedProducts() {
  return prisma.product.findMany({
    where: { isActive: true, isFeatured: true },
    include: { images: { orderBy: { sortOrder: "asc" } } },
    take: 8,
    orderBy: { createdAt: "desc" },
  });
}

async function getTrendingProducts() {
  return prisma.product.findMany({
    where: { isActive: true },
    include: { images: { orderBy: { sortOrder: "asc" } } },
    take: 8,
    orderBy: { createdAt: "desc" },
  });
}

async function getCategories() {
  return prisma.category.findMany({
    include: {
      _count: { select: { products: { where: { isActive: true } } } },
      products: {
        where: { isActive: true },
        include: { images: { orderBy: { sortOrder: "asc" }, take: 1 } },
        take: 1,
        orderBy: { createdAt: "desc" },
      },
    },
    orderBy: { sortOrder: "asc" },
  });
}

export default async function HomePage() {
  const t = await getTranslations("home");
  const [featuredProducts, categories, trendingProducts] = await Promise.all([
    getFeaturedProducts(),
    getCategories(),
    getTrendingProducts(),
  ]);

  const heroImages = featuredProducts
    .filter((p) => p.images.length > 0)
    .slice(0, 4)
    .map((p) => ({
      url: p.images[0].url,
      alt: p.images[0].alt || p.name,
    }));

  return (
    <div>
      {/* Hero — product image carousel */}
      <HeroCarousel
        images={heroImages}
        overline={t("hero.overline")}
        title1={t("hero.title1")}
        title2={t("hero.title2")}
        subtitle={t("hero.subtitle")}
        cta1Label={t("hero.cta1")}
        cta1Href="/products"
        cta2Label={t("hero.cta2")}
        cta2Href="/products?sort=newest"
      />

      {/* Categories — with real product images */}
      {categories.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-12">
            <p className="text-sm font-medium tracking-widest uppercase text-(--primary) mb-3">
              {t("categories.overline")}
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-stone-900">
              {t("categories.title")}
            </h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            {categories.map((cat) => {
              const catImage = cat.products[0]?.images[0];
              return (
                <Link
                  key={cat.id}
                  href={`/categories/${cat.slug}`}
                  className="group relative bg-white rounded-2xl border border-(--border) overflow-hidden hover:border-(--primary)/30 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                >
                  {/* Category image */}
                  <div className="aspect-[4/3] bg-(--muted) overflow-hidden">
                    {catImage ? (
                      <img
                        src={catImage.url}
                        alt={catImage.alt || cat.name}
                        className="size-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    ) : (
                      <div className="size-full flex items-center justify-center text-(--muted-foreground)">
                        <Gem className="size-8 opacity-30" />
                      </div>
                    )}
                  </div>
                  {/* Label */}
                  <div className="p-4 text-center">
                    <h3 className="font-semibold group-hover:text-(--primary) transition-colors">
                      {cat.name}
                    </h3>
                    <p className="text-sm text-(--muted-foreground) mt-1">
                      {t("categories.count", { count: cat._count.products })}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* Trending — horizontal scroll row */}
      {trendingProducts.length > 0 && (
        <ScrollRow
          products={trendingProducts}
          overline={t("trending.overline")}
          title={t("trending.title")}
        />
      )}

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="text-sm font-medium tracking-widest uppercase text-(--primary) mb-3">
                {t("featured.overline")}
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-stone-900">
                {t("featured.title")}
              </h2>
            </div>
            <Link href="/products" className="hidden sm:block">
              <Button variant="ghost" size="sm" className="group">
                {t("featured.viewAll")}{" "}
                <ArrowRight className="ml-1.5 size-4 group-hover:translate-x-0.5 transition-transform" />
              </Button>
            </Link>
          </div>
          <ProductGrid products={featuredProducts} />
          <div className="mt-8 text-center sm:hidden">
            <Link href="/products">
              <Button variant="outline" size="lg">
                {t("featured.viewAllMobile")}
                <ArrowRight className="ml-2 size-4" />
              </Button>
            </Link>
          </div>
        </section>
      )}

      {/* Inspiration gallery — 2x2 lifestyle grid */}
      {trendingProducts.length >= 4 && (
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-10">
            <p className="text-sm font-medium tracking-widest uppercase text-(--primary) mb-3">
              {t("inspiration.overline")}
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-stone-900">
              {t("inspiration.title")}
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {trendingProducts.slice(0, 4).map((product, i) => {
              const img = product.images[0];
              const isTall = i === 0 || i === 3;
              return (
                <Link
                  key={product.slug}
                  href={`/products/${product.slug}`}
                  className={`group relative overflow-hidden rounded-2xl bg-(--muted) ${
                    isTall ? "md:row-span-2 md:col-span-1" : ""
                  }`}
                >
                  <div className={isTall ? "aspect-[3/4]" : "aspect-square"}>
                    {img && (
                      <img
                        src={img.url}
                        alt={img.alt || product.name}
                        className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <p className="text-white text-sm font-medium line-clamp-1">
                        {product.name}
                      </p>
                    </div>
                  </div>
                </Link>
              );
            })}
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
                title: t("promise.shipping.title"),
                desc: t("promise.shipping.desc"),
              },
              {
                icon: <Shield className="size-6" />,
                title: t("promise.quality.title"),
                desc: t("promise.quality.desc"),
              },
              {
                icon: <RotateCcw className="size-6" />,
                title: t("promise.returns.title"),
                desc: t("promise.returns.desc"),
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
              {t("cta.title")}
            </h2>
            <p className="text-stone-400 max-w-lg mx-auto mb-8 leading-relaxed">
              {t("cta.subtitle")}
            </p>
            <Link href="/products">
              <Button variant="primary" size="lg" className="shadow-lg">
                {t("cta.button")}
                <ArrowRight className="ml-2 size-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
