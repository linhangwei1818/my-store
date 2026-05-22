import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils";
import { Package, ShoppingBag, DollarSign, Clock } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const [
    totalProducts,
    totalOrders,
    recentOrders,
    revenueResult,
    pendingOrders,
  ] = await Promise.all([
    prisma.product.count({ where: { isActive: true } }),
    prisma.order.count(),
    prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { items: true },
    }),
    prisma.order.aggregate({
      _sum: { totalAmount: true },
      where: {
        createdAt: { gte: thirtyDaysAgo },
        paymentStatus: "PAID",
      },
    }),
    prisma.order.count({ where: { status: "PENDING" } }),
  ]);

  const revenue = revenueResult._sum.totalAmount || 0;

  const stats = [
    { label: "Active Products", value: totalProducts, icon: Package },
    { label: "Total Orders", value: totalOrders, icon: ShoppingBag },
    { label: "Revenue (30d)", value: formatPrice(revenue), icon: DollarSign },
    { label: "Pending Orders", value: pendingOrders, icon: Clock },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-(--accent) rounded-lg">
                  <stat.icon className="size-5 text-(--accent-foreground)" />
                </div>
                <div>
                  <p className="text-sm text-(--muted-foreground)">
                    {stat.label}
                  </p>
                  <p className="text-xl font-bold">{stat.value}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <h2 className="font-semibold">Recent Orders</h2>
        </CardHeader>
        <CardContent className="p-0">
          {recentOrders.length === 0 ? (
            <p className="p-6 text-sm text-(--muted-foreground)">
              No orders yet.
            </p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-(--border) text-left text-(--muted-foreground)">
                  <th className="p-3 font-medium">Order</th>
                  <th className="p-3 font-medium">Customer</th>
                  <th className="p-3 font-medium">Status</th>
                  <th className="p-3 font-medium text-right">Total</th>
                  <th className="p-3 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-b border-(--border) hover:bg-(--muted)"
                  >
                    <td className="p-3 font-medium">
                      <a
                        href={`/admin/orders/${order.id}`}
                        className="text-(--primary) hover:underline"
                      >
                        {order.orderNumber}
                      </a>
                    </td>
                    <td className="p-3">{order.customerName}</td>
                    <td className="p-3">
                      <Badge
                        variant={
                          order.status === "DELIVERED"
                            ? "success"
                            : order.status === "CANCELLED"
                            ? "destructive"
                            : "warning"
                        }
                      >
                        {order.status}
                      </Badge>
                    </td>
                    <td className="p-3 text-right font-medium">
                      {formatPrice(order.totalAmount)}
                    </td>
                    <td className="p-3 text-(--muted-foreground)">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
