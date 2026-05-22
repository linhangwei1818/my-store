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
  };
}

export function ProductCard({ product }: ProductCardProps) {
  const image = product.images[0];
  const hasSale = product.compareAtPrice && product.compareAtPrice > product.price;

  return (
    <Link href={`/products/${product.slug}`}>
      <Card className="group h-full overflow-hidden transition-shadow hover:shadow-md">
        <div className="aspect-square bg-(--muted) overflow-hidden">
          {image ? (
            <img
              src={image.url}
              alt={image.alt || product.name}
              className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="size-full flex items-center justify-center text-(--muted-foreground)">
              No Image
            </div>
          )}
        </div>
        <CardContent className="p-4">
          <h3 className="font-medium text-sm line-clamp-2 mb-1 group-hover:text-(--primary) transition-colors">
            {product.name}
          </h3>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm">
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
