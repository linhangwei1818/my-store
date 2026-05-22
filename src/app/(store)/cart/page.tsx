"use client"
import Link from "next/link";
import { Minus, Plus, Trash2, ArrowLeft } from "lucide-react";
import { useCartStore } from "@/store/cart-store";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { FREE_SHIPPING_THRESHOLD, SHIPPING_FLAT_RATE } from "@/lib/constants";

export default function CartPage() {
  const { items, removeItem, updateQuantity, itemCount, subtotal } = useCartStore();
  const count = itemCount();
  const sub = subtotal();
  const shipping = sub >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FLAT_RATE;
  const total = sub + shipping;

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Your Cart is Empty</h1>
        <p className="text-(--muted-foreground) mb-6">
          Looks like you haven&apos;t added anything to your cart yet.
        </p>
        <Link href="/products">
          <Button variant="primary">Browse Products</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold mb-8">
        Shopping Cart ({count} {count === 1 ? "item" : "items"})
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-3">
          {items.map((item) => (
            <div
              key={item.productId}
              className="flex gap-4 p-4 rounded-xl border border-(--border)"
            >
              <div className="size-24 rounded-lg bg-(--muted) flex-shrink-0 overflow-hidden">
                {item.image && (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="size-full object-cover"
                  />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <Link
                  href={`/products/${item.slug}`}
                  className="font-medium hover:text-(--primary)"
                >
                  {item.name}
                </Link>
                <p className="text-sm font-semibold mt-1">
                  {formatPrice(item.price)}
                </p>
                <div className="flex items-center gap-3 mt-3">
                  <div className="flex items-center rounded-lg border border-(--border)">
                    <button
                      onClick={() =>
                        updateQuantity(item.productId, item.quantity - 1)
                      }
                      className="p-1.5 hover:bg-(--muted) rounded-l-lg"
                    >
                      <Minus className="size-3.5" />
                    </button>
                    <span className="w-10 text-center text-sm">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        updateQuantity(item.productId, item.quantity + 1)
                      }
                      className="p-1.5 hover:bg-(--muted) rounded-r-lg"
                    >
                      <Plus className="size-3.5" />
                    </button>
                  </div>
                  <button
                    onClick={() => removeItem(item.productId)}
                    className="text-sm text-red-500 hover:text-red-700 flex items-center gap-1"
                  >
                    <Trash2 className="size-3.5" />
                    Remove
                  </button>
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="font-semibold">
                  {formatPrice(item.price * item.quantity)}
                </p>
              </div>
            </div>
          ))}
          <Link
            href="/products"
            className="inline-flex items-center gap-1 text-sm text-(--muted-foreground) hover:text-(--foreground) mt-4"
          >
            <ArrowLeft className="size-3.5" />
            Continue Shopping
          </Link>
        </div>

        <div className="lg:col-span-1">
          <div className="rounded-xl border border-(--border) p-6 space-y-4 sticky top-24">
            <h2 className="font-semibold text-lg">Order Summary</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-(--muted-foreground)">Subtotal</span>
                <span>{formatPrice(sub)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-(--muted-foreground)">Shipping</span>
                <span>
                  {shipping === 0 ? (
                    <span className="text-green-600">Free</span>
                  ) : (
                    formatPrice(shipping)
                  )}
                </span>
              </div>
              {shipping > 0 && (
                <p className="text-xs text-(--muted-foreground)">
                  Free shipping on orders over {formatPrice(FREE_SHIPPING_THRESHOLD)}
                </p>
              )}
            </div>
            <div className="border-t border-(--border) pt-3 flex justify-between font-semibold">
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>
            <Link href="/checkout" className="block">
              <Button variant="primary" className="w-full" size="lg">
                Proceed to Checkout
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
