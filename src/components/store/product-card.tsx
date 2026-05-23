import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { formatPrice } from "@/lib/utils";

interface ProductCardProps {
  product: {
    slug: string;
    name: string;
    price: number;
    compareAtPrice: number | null;
    images: { url: string; alt: string | null }[];
    createdAt?: string | Date;
  };
}

export function ProductCard({ product }: ProductCardProps) {
  const image = product.images[0];
  const hasSale = product.compareAtPrice && product.compareAtPrice > product.price;
  const isNew =
    product.createdAt &&
    new Date(product.createdAt).getTime() > Date.now() - 30 * 24 * 60 * 60 * 1000;

  return (
    <Link href={`/products/${product.slug}`}>
      <Card className="group h-full overflow-hidden border-(--border) hover:border-(--primary)/30 hover:shadow-lg transition-all duration-300 rounded-2xl">
        <div className="aspect-square bg-stone-100 overflow-hidden relative">
          {image ? (
            <img
              src={image.url}
              alt={image.alt || product.name}
              className="size-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          ) : (
            <div className="size-full flex items-center justify-center text-stone-400">
              <span className="text-sm">No Image</span>
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {hasSale && (
              <span className="px-2.5 py-1 text-xs font-semibold bg-red-500 text-white rounded-full">
                Sale
              </span>
            )}
            {isNew && (
              <span className="px-2.5 py-1 text-xs font-semibold bg-emerald-600 text-white rounded-full">
                New
              </span>
            )}
          </div>

          {/* Quick view overlay */}
          <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
        <CardContent className="p-4">
          <h3 className="font-medium text-sm line-clamp-2 mb-2 group-hover:text-(--primary) transition-colors">
            {product.name}
          </h3>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm text-stone-900">
              {formatPrice(product.price)}
            </span>
            {hasSale && (
              <span className="text-xs text-(--muted-foreground) line-through">
                {formatPrice(product.compareAtPrice!)}
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
