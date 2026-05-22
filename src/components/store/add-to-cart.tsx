"use client"
import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cart-store";
import toast from "react-hot-toast";

interface AddToCartProps {
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    inventory: number;
    images: { url: string; alt: string | null }[];
  };
}

export function AddToCart({ product }: AddToCartProps) {
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore((s) => s.addItem);
  const maxQty = product.inventory === -1 ? 99 : product.inventory;

  const handleAdd = () => {
    addItem({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      image: product.images[0]?.url || "",
      maxQuantity: maxQty,
      quantity,
    });
    toast.success(`${product.name} added to cart`);
    setQuantity(1);
  };

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center rounded-lg border border-(--border)">
        <button
          onClick={() => setQuantity(Math.max(1, quantity - 1))}
          className="p-2.5 hover:bg-(--muted) rounded-l-lg transition-colors"
          disabled={quantity <= 1}
        >
          <Minus className="size-4" />
        </button>
        <span className="w-12 text-center text-sm font-medium">
          {quantity}
        </span>
        <button
          onClick={() => setQuantity(Math.min(maxQty, quantity + 1))}
          className="p-2.5 hover:bg-(--muted) rounded-r-lg transition-colors"
          disabled={quantity >= maxQty}
        >
          <Plus className="size-4" />
        </button>
      </div>
      <Button variant="primary" size="lg" onClick={handleAdd}>
        Add to Cart
      </Button>
    </div>
  );
}
