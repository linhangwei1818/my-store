"use client"
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { ORDER_STATUSES } from "@/lib/constants";
import toast from "react-hot-toast";

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
        toast.success("Order updated");
        router.refresh();
      } else {
        toast.error("Failed to update order");
      }
    } catch {
      toast.error("Failed to update order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      <h3 className="font-semibold text-sm">Update Order</h3>
      <div>
        <label className="block text-xs text-(--muted-foreground) mb-1">
          Status
        </label>
        <Select value={status} onChange={(e) => setStatus(e.target.value)}>
          {ORDER_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </Select>
      </div>
      <div>
        <label className="block text-xs text-(--muted-foreground) mb-1">
          Tracking Number
        </label>
        <Input
          value={trackingNumber}
          onChange={(e) => setTrackingNumber(e.target.value)}
          placeholder="Enter tracking number"
        />
      </div>
      <Button
        variant="primary"
        className="w-full"
        onClick={handleUpdate}
        disabled={loading}
      >
        {loading ? "Updating..." : "Update Order"}
      </Button>
    </div>
  );
}
