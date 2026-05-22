"use client"
import { useEffect, useState } from "react";
import Link from "next/link";
import { ShoppingCart, X, Minus, Plus, Trash2 } from "lucide-react";
import { useCartStore } from "@/store/cart-store";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function CartDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const { items, removeItem, updateQuantity, itemCount, subtotal } = useCartStore();
  const count = itemCount();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="relative p-2 text-(--muted-foreground) hover:text-(--foreground) transition-colors"
      >
        <ShoppingCart className="size-5" />
        {count > 0 && (
          <span className="absolute -top-0.5 -right-0.5 flex size-5 items-center justify-center rounded-full bg-(--primary) text-[10px] font-bold text-(--primary-foreground)">
            {count > 99 ? "99+" : count}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-(--border)">
              <h2 className="text-lg font-semibold">
                Cart ({count} {count === 1 ? "item" : "items"})
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-(--muted) rounded-lg"
              >
                <X className="size-5" />
              </button>
            </div>

            {items.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center gap-3 p-6">
                <ShoppingCart className="size-12 text-(--muted-foreground)" />
                <p className="text-(--muted-foreground)">Your cart is empty</p>
                <Link href="/products" onClick={() => setIsOpen(false)}>
                  <Button variant="primary" size="sm">
                    Start Shopping
                  </Button>
                </Link>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {items.map((item) => (
                    <div
                      key={item.productId}
                      className="flex gap-3 p-3 rounded-lg border border-(--border)"
                    >
                      <div className="size-16 rounded-lg bg-(--muted) flex-shrink-0 overflow-hidden">
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
                          onClick={() => setIsOpen(false)}
                          className="text-sm font-medium hover:text-(--primary) line-clamp-1"
                        >
                          {item.name}
                        </Link>
                        <p className="text-sm font-semibold mt-0.5">
                          {formatPrice(item.price)}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <button
                            onClick={() =>
                              updateQuantity(item.productId, item.quantity - 1)
                            }
                            className="p-0.5 rounded hover:bg-(--muted)"
                          >
                            <Minus className="size-3.5" />
                          </button>
                          <span className="text-sm w-8 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.productId, item.quantity + 1)
                            }
                            className="p-0.5 rounded hover:bg-(--muted)"
                          >
                            <Plus className="size-3.5" />
                          </button>
                          <button
                            onClick={() => removeItem(item.productId)}
                            className="ml-auto p-0.5 rounded text-red-500 hover:bg-red-50"
                          >
                            <Trash2 className="size-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-(--border) p-4 space-y-3">
                  <div className="flex items-center justify-between font-semibold">
                    <span>Subtotal</span>
                    <span>{formatPrice(subtotal())}</span>
                  </div>
                  <Link
                    href="/cart"
                    onClick={() => setIsOpen(false)}
                    className="block"
                  >
                    <Button variant="outline" className="w-full">
                      View Cart
                    </Button>
                  </Link>
                  <Link
                    href="/checkout"
                    onClick={() => setIsOpen(false)}
                    className="block"
                  >
                    <Button variant="primary" className="w-full">
                      Checkout
                    </Button>
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
