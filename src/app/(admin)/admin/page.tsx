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
    { label: "在售商品", value: totalProducts, icon: Package },
    { label: "总订单", value: totalOrders, icon: ShoppingBag },
    { label: "近30天营收", value: formatPrice(revenue), icon: DollarSign },
    { label: "待处理", value: pendingOrders, icon: Clock },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">仪表盘</h1>

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
          <h2 className="font-semibold">近期订单</h2>
        </CardHeader>
        <CardContent className="p-0">
          {recentOrders.length === 0 ? (
            <p className="p-6 text-sm text-(--muted-foreground)">
              暂无订单
            </p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-(--border) text-left text-(--muted-foreground)">
                  <th className="p-3 font-medium">订单号</th>
                  <th className="p-3 font-medium">客户</th>
                  <th className="p-3 font-medium">状态</th>
                  <th className="p-3 font-medium text-right">金额</th>
                  <th className="p-3 font-medium">日期</th>
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
                        {order.status === "DELIVERED" ? "已发货" : order.status === "CANCELLED" ? "已取消" : order.status === "CONFIRMED" ? "已确认" : "待处理"}
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
