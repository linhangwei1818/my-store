import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils";
import { ORDER_STATUSES } from "@/lib/constants";
import { OrderActions } from "@/components/admin/order-actions";

export const dynamic = "force-dynamic";

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: true },
  });

  if (!order) notFound();

  const address = order.shippingAddress as Record<string, string>;

  const variant = (s: string) =>
    s === "DELIVERED" ? "success" : s === "CANCELLED" ? "destructive" : "warning";

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Order {order.orderNumber}</h1>
          <p className="text-sm text-(--muted-foreground) mt-1">
            Created on {new Date(order.createdAt).toLocaleString()}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={variant(order.status)}>{order.status}</Badge>
          <Badge
            variant={
              order.paymentStatus === "PAID" ? "success" : "warning"
            }
          >
            {order.paymentStatus}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Items */}
          <div className="bg-white rounded-xl border border-(--border) overflow-hidden">
            <div className="p-4 border-b border-(--border)">
              <h2 className="font-semibold">Order Items</h2>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-(--border) text-left text-(--muted-foreground)">
                  <th className="p-3 font-medium">Product</th>
                  <th className="p-3 font-medium text-center">Qty</th>
                  <th className="p-3 font-medium text-right">Price</th>
                  <th className="p-3 font-medium text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b border-(--border)"
                  >
                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        {item.imageUrl && (
                          <img
                            src={item.imageUrl}
                            alt={item.productName}
                            className="size-10 rounded-lg object-cover"
                          />
                        )}
                        <div>
                          <p className="font-medium">{item.productName}</p>
                          <p className="text-xs text-(--muted-foreground)">
                            SKU: {item.productSku}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-3 text-center">{item.quantity}</td>
                    <td className="p-3 text-right">
                      {formatPrice(item.unitPrice)}
                    </td>
                    <td className="p-3 text-right font-medium">
                      {formatPrice(item.totalPrice)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Customer */}
          <div className="bg-white rounded-xl border border-(--border) p-6">
            <h2 className="font-semibold mb-3">Customer</h2>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-(--muted-foreground)">Name:</span>{" "}
                {order.customerName}
              </div>
              <div>
                <span className="text-(--muted-foreground)">Email:</span>{" "}
                {order.customerEmail}
              </div>
              {order.customerPhone && (
                <div>
                  <span className="text-(--muted-foreground)">Phone:</span>{" "}
                  {order.customerPhone}
                </div>
              )}
            </div>
          </div>

          {/* Shipping */}
          <div className="bg-white rounded-xl border border-(--border) p-6">
            <h2 className="font-semibold mb-3">Shipping Address</h2>
            <div className="text-sm">
              <p>{address.line1}</p>
              {address.line2 && <p>{address.line2}</p>}
              <p>
                {address.city}, {address.state} {address.postal_code}
              </p>
              <p>{address.country}</p>
            </div>
            {order.trackingNumber && (
              <div className="mt-3 text-sm">
                <span className="text-(--muted-foreground)">
                  Tracking Number:
                </span>{" "}
                <span className="font-mono font-medium">
                  {order.trackingNumber}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-(--border) p-6 sticky top-24 space-y-6">
            {/* Summary */}
            <div>
              <h3 className="font-semibold text-sm mb-3">Order Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-(--muted-foreground)">Subtotal</span>
                  <span>{formatPrice(order.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-(--muted-foreground)">Shipping</span>
                  <span>{formatPrice(order.shippingCost)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-(--muted-foreground)">Tax</span>
                  <span>{formatPrice(order.taxAmount)}</span>
                </div>
                <div className="border-t border-(--border) pt-2 flex justify-between font-semibold">
                  <span>Total</span>
                  <span>{formatPrice(order.totalAmount)}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <OrderActions orderId={order.id} currentStatus={order.status} />
          </div>
        </div>
      </div>
    </div>
  );
}
