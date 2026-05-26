import { notFound } from "next/navigation";
import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { ProductGrid } from "@/components/store/product-grid";
import { generateSiteMetadata } from "@/lib/seo";

export const revalidate = 300;

export async function generateStaticParams() {
  const categories = await prisma.category.findMany({
    select: { slug: true },
  });
  return categories.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = await prisma.category.findUnique({ where: { slug } });
  if (!category) return generateSiteMetadata({ title: "Not Found", noIndex: true });
  return generateSiteMetadata({
    title: category.name,
    description: category.description || `Browse ${category.name} products.`,
  });
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = await prisma.category.findUnique({
    where: { slug },
    include: {
      products: {
        where: { isActive: true },
        include: { images: { orderBy: { sortOrder: "asc" } } },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!category) notFound();

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">{category.name}</h1>
        {category.description && (
          <p className="text-(--muted-foreground) mt-1">{category.description}</p>
        )}
      </div>
      <ProductGrid products={category.products} />
    </div>
  );
}
