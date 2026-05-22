import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils";
import { ORDER_STATUSES } from "@/lib/constants";

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

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; search?: string }>;
}) {
  const params = await searchParams;
  const status = params.status;
  const search = params.search;

  const where: Record<string, unknown> = {};
  if (status && ORDER_STATUSES.includes(status as never)) {
    where.status = status;
  }
  if (search) {
    where.OR = [
      { orderNumber: { contains: search, mode: "insensitive" } },
      { customerEmail: { contains: search, mode: "insensitive" } },
      { customerName: { contains: search, mode: "insensitive" } },
    ];
  }

  const orders = await prisma.order.findMany({
    where,
    include: { items: true },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  const variant = (s: string) =>
    s === "DELIVERED" ? "success" : s === "CANCELLED" ? "destructive" : "warning";

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">订单管理</h1>
        <form className="flex gap-2">
          <input
            name="search"
            defaultValue={search}
            placeholder="搜索订单..."
            className="h-10 rounded-lg border border-(--border) px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-(--primary)"
          />
          <select
            name="status"
            defaultValue={status || ""}
            className="h-10 rounded-lg border border-(--border) px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-(--primary)"
          >
            <option value="">全部状态</option>
            {ORDER_STATUSES.map((s) => (
              <option key={s} value={s}>
                {statusLabels[s] || s}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="h-10 px-4 bg-(--primary) text-(--primary-foreground) rounded-lg text-sm font-medium hover:opacity-90"
          >
            筛选
          </button>
        </form>
      </div>

      <div className="bg-white rounded-xl border border-(--border) overflow-hidden">
        {orders.length === 0 ? (
          <p className="p-6 text-sm text-(--muted-foreground)">暂无订单。</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-(--border) text-left text-(--muted-foreground)">
                <th className="p-3 font-medium">订单号</th>
                <th className="p-3 font-medium">客户</th>
                <th className="p-3 font-medium">商品数</th>
                <th className="p-3 font-medium text-right">金额</th>
                <th className="p-3 font-medium">状态</th>
                <th className="p-3 font-medium">付款</th>
                <th className="p-3 font-medium">日期</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr
                  key={order.id}
                  className="border-b border-(--border) hover:bg-(--muted)"
                >
                  <td className="p-3">
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="font-medium text-(--primary) hover:underline"
                    >
                      {order.orderNumber}
                    </Link>
                  </td>
                  <td className="p-3">
                    <div>
                      <p>{order.customerName}</p>
                      <p className="text-(--muted-foreground) text-xs">
                        {order.customerEmail}
                      </p>
                    </div>
                  </td>
                  <td className="p-3 text-(--muted-foreground)">
                    {order.items.length} 件
                  </td>
                  <td className="p-3 text-right font-medium">
                    {formatPrice(order.totalAmount)}
                  </td>
                  <td className="p-3">
                    <Badge variant={variant(order.status)}>{statusLabels[order.status] || order.status}</Badge>
                  </td>
                  <td className="p-3">
                    <Badge
                      variant={
                        order.paymentStatus === "PAID" ? "success" : "warning"
                      }
                    >
                      {paymentLabels[order.paymentStatus] || order.paymentStatus}
                    </Badge>
                  </td>
                  <td className="p-3 text-(--muted-foreground)">
                    {new Date(order.createdAt).toLocaleDateString()}
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
