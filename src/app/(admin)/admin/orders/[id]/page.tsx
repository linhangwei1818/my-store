import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils";
import { OrderActions } from "@/components/admin/order-actions";

export const dynamic = "force-dynamic";

const statusLabels: Record<string, string> = {
  PENDING: "待处理",
  CONFIRMED: "已确认",
  PROCESSING: "处理中",
  SHIPPED: "已发货",
  DELIVERED: "已送达",
  CANCELLED: "已取消",
};

const paymentLabels: Record<string, string> = {
  PAID: "已付款",
  UNPAID: "未付款",
  REFUNDED: "已退款",
};

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
          <h1 className="text-2xl font-bold">订单 {order.orderNumber}</h1>
          <p className="text-sm text-(--muted-foreground) mt-1">
            创建于 {new Date(order.createdAt).toLocaleString()}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={variant(order.status)}>{statusLabels[order.status] || order.status}</Badge>
          <Badge
            variant={
              order.paymentStatus === "PAID" ? "success" : "warning"
            }
          >
            {paymentLabels[order.paymentStatus] || order.paymentStatus}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-(--border) overflow-hidden">
            <div className="p-4 border-b border-(--border)">
              <h2 className="font-semibold">订单商品</h2>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-(--border) text-left text-(--muted-foreground)">
                  <th className="p-3 font-medium">商品</th>
                  <th className="p-3 font-medium text-center">数量</th>
                  <th className="p-3 font-medium text-right">单价</th>
                  <th className="p-3 font-medium text-right">小计</th>
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

          <div className="bg-white rounded-xl border border-(--border) p-6">
            <h2 className="font-semibold mb-3">客户信息</h2>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-(--muted-foreground)">姓名:</span>{" "}
                {order.customerName}
              </div>
              <div>
                <span className="text-(--muted-foreground)">邮箱:</span>{" "}
                {order.customerEmail}
              </div>
              {order.customerPhone && (
                <div>
                  <span className="text-(--muted-foreground)">电话:</span>{" "}
                  {order.customerPhone}
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-(--border) p-6">
            <h2 className="font-semibold mb-3">收货地址</h2>
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
                  物流单号:
                </span>{" "}
                <span className="font-mono font-medium">
                  {order.trackingNumber}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-(--border) p-6 sticky top-24 space-y-6">
            <div>
              <h3 className="font-semibold text-sm mb-3">订单汇总</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-(--muted-foreground)">小计</span>
                  <span>{formatPrice(order.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-(--muted-foreground)">运费</span>
                  <span>{formatPrice(order.shippingCost)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-(--muted-foreground)">税费</span>
                  <span>{formatPrice(order.taxAmount)}</span>
                </div>
                <div className="border-t border-(--border) pt-2 flex justify-between font-semibold">
                  <span>合计</span>
                  <span>{formatPrice(order.totalAmount)}</span>
                </div>
              </div>
            </div>

            <OrderActions orderId={order.id} currentStatus={order.status} />
          </div>
        </div>
      </div>
    </div>
  );
}
