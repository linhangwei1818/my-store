import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils";
import { Plus, Pencil } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    include: {
      images: { orderBy: { sortOrder: "asc" } },
      category: { select: { name: true } },
    },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Products</h1>
        <Link href="/admin/products/new">
          <Button variant="primary">
            <Plus className="size-4 mr-1" />
            Add Product
          </Button>
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-(--border) overflow-hidden">
        {products.length === 0 ? (
          <p className="p-6 text-sm text-(--muted-foreground)">
            No products yet.{" "}
            <Link href="/admin/products/new" className="text-(--primary) hover:underline">
              Create your first product
            </Link>
            .
          </p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-(--border) text-left text-(--muted-foreground)">
                <th className="p-3 font-medium">Product</th>
                <th className="p-3 font-medium">SKU</th>
                <th className="p-3 font-medium">Category</th>
                <th className="p-3 font-medium text-right">Price</th>
                <th className="p-3 font-medium">Status</th>
                <th className="p-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr
                  key={product.id}
                  className="border-b border-(--border) hover:bg-(--muted)"
                >
                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      <div className="size-10 rounded-lg bg-(--muted) overflow-hidden flex-shrink-0">
                        {product.images[0] && (
                          <img
                            src={product.images[0].url}
                            alt={product.name}
                            className="size-full object-cover"
                          />
                        )}
                      </div>
                      <span className="font-medium">{product.name}</span>
                    </div>
                  </td>
                  <td className="p-3 text-(--muted-foreground)">
                    {product.sku}
                  </td>
                  <td className="p-3 text-(--muted-foreground)">
                    {product.category?.name || "—"}
                  </td>
                  <td className="p-3 text-right font-medium">
                    {formatPrice(product.price)}
                  </td>
                  <td className="p-3">
                    <Badge
                      variant={product.isActive ? "success" : "destructive"}
                    >
                      {product.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </td>
                  <td className="p-3 text-right">
                    <Link href={`/admin/products/${product.id}/edit`}>
                      <Button variant="ghost" size="sm">
                        <Pencil className="size-3.5" />
                      </Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
