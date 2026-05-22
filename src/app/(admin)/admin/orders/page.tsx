import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils";
import { ORDER_STATUSES } from "@/lib/constants";

export const dynamic = "force-dynamic";

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
        <h1 className="text-2xl font-bold">Orders</h1>
        <form className="flex gap-2">
          <input
            name="search"
            defaultValue={search}
            placeholder="Search orders..."
            className="h-10 rounded-lg border border-(--border) px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-(--primary)"
          />
          <select
            name="status"
            defaultValue={status || ""}
            className="h-10 rounded-lg border border-(--border) px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-(--primary)"
          >
            <option value="">All Statuses</option>
            {ORDER_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="h-10 px-4 bg-(--primary) text-(--primary-foreground) rounded-lg text-sm font-medium hover:opacity-90"
          >
            Filter
          </button>
        </form>
      </div>

      <div className="bg-white rounded-xl border border-(--border) overflow-hidden">
        {orders.length === 0 ? (
          <p className="p-6 text-sm text-(--muted-foreground)">No orders found.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-(--border) text-left text-(--muted-foreground)">
                <th className="p-3 font-medium">Order #</th>
                <th className="p-3 font-medium">Customer</th>
                <th className="p-3 font-medium">Items</th>
                <th className="p-3 font-medium text-right">Total</th>
                <th className="p-3 font-medium">Status</th>
                <th className="p-3 font-medium">Payment</th>
                <th className="p-3 font-medium">Date</th>
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
                    {order.items.length} item{order.items.length !== 1 ? "s" : ""}
                  </td>
                  <td className="p-3 text-right font-medium">
                    {formatPrice(order.totalAmount)}
                  </td>
                  <td className="p-3">
                    <Badge variant={variant(order.status)}>{order.status}</Badge>
                  </td>
                  <td className="p-3">
                    <Badge
                      variant={
                        order.paymentStatus === "PAID" ? "success" : "warning"
                      }
                    >
                      {order.paymentStatus}
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
