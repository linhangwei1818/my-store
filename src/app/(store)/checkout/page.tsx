"use client"
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cart-store";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { FREE_SHIPPING_THRESHOLD, SHIPPING_FLAT_RATE } from "@/lib/constants";
import toast from "react-hot-toast";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, clearCart } = useCartStore();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    email: "",
    name: "",
    phone: "",
    line1: "",
    line2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "US",
  });

  if (items.length === 0) {
    router.push("/cart");
    return null;
  }

  const sub = subtotal();
  const shipping = sub >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FLAT_RATE;
  const total = sub + shipping;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({
            productId: i.productId,
            quantity: i.quantity,
          })),
          customer: {
            email: form.email,
            name: form.name,
            phone: form.phone || undefined,
          },
          shippingAddress: {
            line1: form.line1,
            line2: form.line2 || undefined,
            city: form.city,
            state: form.state,
            postal_code: form.postalCode,
            country: form.country,
          },
        }),
      });

      const data = await res.json();

      if (data.url) {
        clearCart();
        window.location.href = data.url;
      } else {
        toast.error(data.error || "Something went wrong");
      }
    } catch {
      toast.error("Failed to process checkout");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold mb-8">Checkout</h1>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Contact */}
            <div className="rounded-xl border border-(--border) p-6">
              <h2 className="font-semibold mb-4">Contact Information</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5">
                    Email *
                  </label>
                  <Input
                    name="email"
                    type="email"
                    required
                    value={form.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">
                    Full Name *
                  </label>
                  <Input
                    name="name"
                    required
                    value={form.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                  />
                </div>
              </div>
            </div>

            {/* Shipping */}
            <div className="rounded-xl border border-(--border) p-6">
              <h2 className="font-semibold mb-4">Shipping Address</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5">
                    Address Line 1 *
                  </label>
                  <Input
                    name="line1"
                    required
                    value={form.line1}
                    onChange={handleChange}
                    placeholder="123 Main St"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">
                    Address Line 2
                  </label>
                  <Input
                    name="line2"
                    value={form.line2}
                    onChange={handleChange}
                    placeholder="Apt 4B"
                  />
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1.5">
                      City *
                    </label>
                    <Input
                      name="city"
                      required
                      value={form.city}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">
                      State *
                    </label>
                    <Input
                      name="state"
                      required
                      value={form.state}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">
                      Postal Code *
                    </label>
                    <Input
                      name="postalCode"
                      required
                      value={form.postalCode}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">
                    Country *
                  </label>
                  <Select
                    name="country"
                    required
                    value={form.country}
                    onChange={handleChange}
                  >
                    <option value="US">United States</option>
                    <option value="CA">Canada</option>
                    <option value="GB">United Kingdom</option>
                    <option value="AU">Australia</option>
                    <option value="DE">Germany</option>
                    <option value="FR">France</option>
                  </Select>
                </div>
              </div>
            </div>
          </div>

          {/* Order summary */}
          <div className="lg:col-span-1">
            <div className="rounded-xl border border-(--border) p-6 space-y-4 sticky top-24">
              <h2 className="font-semibold text-lg">Order Summary</h2>
              <div className="space-y-2">
                {items.map((item) => (
                  <div key={item.productId} className="flex justify-between text-sm">
                    <span className="text-(--muted-foreground)">
                      {item.name} x {item.quantity}
                    </span>
                    <span>{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-(--border) pt-3 space-y-2 text-sm">
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
              </div>
              <div className="border-t border-(--border) pt-3 flex justify-between font-semibold">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
              <Button
                variant="primary"
                className="w-full"
                size="lg"
                type="submit"
                disabled={loading}
              >
                {loading ? "Processing..." : "Pay with Stripe"}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
