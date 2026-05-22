import { prisma } from "@/lib/prisma";
import { ProductForm } from "@/components/admin/product-form";

export default async function NewProductPage() {
  const categories = await prisma.category.findMany({
    orderBy: { sortOrder: "asc" },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">New Product</h1>
      <ProductForm categories={categories} />
    </div>
  );
}
