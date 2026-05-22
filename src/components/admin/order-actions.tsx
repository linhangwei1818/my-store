"use client"
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { ORDER_STATUSES } from "@/lib/constants";
import toast from "react-hot-toast";

const statusLabels: Record<string, string> = {
  PENDING: "待处理",
  CONFIRMED: "已确认",
  PROCESSING: "处理中",
  SHIPPED: "已发货",
  DELIVERED: "已送达",
  CANCELLED: "已取消",
};

export function OrderActions({
  orderId,
  currentStatus,
}: {
  orderId: string;
  currentStatus: string;
}) {
  const router = useRouter();
  const [status, setStatus] = useState(currentStatus);
  const [trackingNumber, setTrackingNumber] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status,
          trackingNumber: trackingNumber || undefined,
        }),
      });

      if (res.ok) {
        toast.success("订单已更新");
        router.refresh();
      } else {
        toast.error("更新失败");
      }
    } catch {
      toast.error("更新失败");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      <h3 className="font-semibold text-sm">更新订单</h3>
      <div>
        <label className="block text-xs text-(--muted-foreground) mb-1">
          状态
        </label>
        <Select value={status} onChange={(e) => setStatus(e.target.value)}>
          {ORDER_STATUSES.map((s) => (
            <option key={s} value={s}>
              {statusLabels[s] || s}
            </option>
          ))}
        </Select>
      </div>
      <div>
        <label className="block text-xs text-(--muted-foreground) mb-1">
          物流单号
        </label>
        <Input
          value={trackingNumber}
          onChange={(e) => setTrackingNumber(e.target.value)}
          placeholder="输入物流单号"
        />
      </div>
      <Button
        variant="primary"
        className="w-full"
        onClick={handleUpdate}
        disabled={loading}
      >
        {loading ? "更新中..." : "更新订单"}
      </Button>
    </div>
  );
}
