import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { ImageGallery } from "@/components/store/image-gallery";
import { AddToCart } from "@/components/store/add-to-cart";
import { Breadcrumbs } from "@/components/store/breadcrumbs";
import { formatPrice } from "@/lib/utils";
import { generateSiteMetadata, productJsonLd, breadcrumbJsonLd } from "@/lib/seo";

export const revalidate = 300;

async function getProduct(slug: string) {
  return prisma.product.findUnique({
    where: { slug, isActive: true },
    include: {
      images: { orderBy: { sortOrder: "asc" } },
      category: { select: { id: true, name: true, slug: true } },
    },
  });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return generateSiteMetadata({ title: "Not Found", noIndex: true });

  return generateSiteMetadata({
    title: product.metaTitle || product.name,
    description: product.metaDescription || product.shortDescription || product.description.slice(0, 160),
    image: product.images[0]?.url,
  });
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const product = await getProduct(slug);
  const t = await getTranslations("product");
  const tc = await getTranslations("common");

  if (!product) notFound();

  const inStock = product.inventory === -1 || product.inventory > 0;
  const hasSale = product.compareAtPrice && product.compareAtPrice > product.price;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productJsonLd({
            name: product.name,
            description: product.shortDescription || product.description.slice(0, 200),
            images: product.images,
            sku: product.sku,
            price: product.price,
            slug: product.slug,
          })),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: tc("breadcrumbs.home"), url: "/" },
              ...(product.category
                ? [{ name: product.category.name, url: `/categories/${product.category.slug}` }]
                : []),
              { name: product.name, url: `/products/${product.slug}` },
            ])
          ),
        }}
      />

      <Breadcrumbs
        items={[
          { label: tc("breadcrumbs.home"), href: "/" },
          ...(product.category
            ? [
                {
                  label: product.category.name,
                  href: `/categories/${product.category.slug}`,
                },
              ]
            : [{ label: tc("breadcrumbs.products"), href: "/products" }]),
          { label: product.name },
        ]}
      />

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16">
        <ImageGallery images={product.images} />

        <div>
          {product.category && (
            <Link
              href={`/categories/${product.category.slug}`}
              className="text-sm font-medium text-(--primary) hover:text-(--primary-hover) transition-colors"
            >
              {product.category.name}
            </Link>
          )}
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mt-2 mb-3 text-stone-900">
            {product.name}
          </h1>
          {product.shortDescription && (
            <p className="text-(--muted-foreground) mb-6 leading-relaxed">
              {product.shortDescription}
            </p>
          )}

          <div className="flex items-baseline gap-4 mb-6">
            <span className="text-3xl font-bold text-stone-900">
              {formatPrice(product.price, locale)}
            </span>
            {hasSale && (
              <span className="text-xl text-(--muted-foreground) line-through">
                {formatPrice(product.compareAtPrice!, locale)}
              </span>
            )}
            {hasSale && (
              <span className="text-sm font-semibold text-red-500 bg-red-50 px-2.5 py-1 rounded-full">
                {t("detail.save", { percent: Math.round(((product.compareAtPrice! - product.price) / product.compareAtPrice!) * 100) })}
              </span>
            )}
          </div>

          <div className="flex items-center gap-6 mb-8 text-sm">
            {inStock ? (
              <span className="flex items-center gap-1.5 text-emerald-700 font-medium">
                <span className="size-2 rounded-full bg-emerald-500 inline-block" />
                {product.inventory > 0
                  ? `${t("detail.inStock")}${t("detail.available", { count: product.inventory })}`
                  : t("detail.inStock")}
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-red-600 font-medium">
                <span className="size-2 rounded-full bg-red-500 inline-block" />
                {t("detail.outOfStock")}
              </span>
            )}
            <span className="text-(--muted-foreground)">{t("detail.sku")}: {product.sku}</span>
          </div>

          {inStock && <AddToCart product={product} />}

          <div className="mt-6">
            <Link
              href={`/contact?product=${encodeURIComponent(product.name)}&productId=${product.id}`}
              className="inline-flex items-center gap-2 text-sm text-(--primary) hover:text-(--primary-hover) font-medium transition-colors"
            >
              <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
              {t("detail.askAbout")}
            </Link>
          </div>

          <div className="mt-10 border-t border-(--border) pt-10">
            <h2 className="font-semibold text-lg mb-4 text-stone-900">{t("detail.description")}</h2>
            <div className="prose prose-stone prose-sm max-w-none text-(--muted-foreground) whitespace-pre-wrap leading-relaxed">
              {product.description}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
