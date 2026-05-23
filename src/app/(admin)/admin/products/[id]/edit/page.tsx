import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ProductForm } from "@/components/admin/product-form";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [product, categories] = await Promise.all([
    prisma.product.findUnique({
      where: { id },
      include: { images: { orderBy: { sortOrder: "asc" } } },
    }),
    prisma.category.findMany({ orderBy: { sortOrder: "asc" } }),
  ]);

  if (!product) notFound();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">编辑商品</h1>
      <ProductForm
        initialData={{
          ...product,
          shortDescription: product.shortDescription,
          compareAtPrice: product.compareAtPrice,
          weight: product.weight ? String(product.weight) : null,
          categoryId: product.categoryId,
          metaTitle: product.metaTitle,
          metaDescription: product.metaDescription,
        }}
        categories={categories}
        existingImages={product.images.map((img) => ({
          id: img.id,
          url: img.url,
          alt: img.alt,
        }))}
      />
    </div>
  );
}
