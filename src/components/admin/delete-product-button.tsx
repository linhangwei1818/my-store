"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import toast from "react-hot-toast"

interface Props {
  productId: string
  productName: string
}

export function DeleteProductButton({ productId, productName }: Props) {
  const router = useRouter()
  const [deleting, setDeleting] = useState(false)

  const handleDelete = async () => {
    if (!confirm(`确定要删除「${productName}」吗？此操作不可撤销。`)) return
    setDeleting(true)
    try {
      const res = await fetch(`/api/products/${productId}`, { method: "DELETE" })
      if (res.ok) {
        toast.success("商品已删除")
        router.refresh()
      } else {
        toast.error("删除失败")
      }
    } catch {
      toast.error("删除失败")
    } finally {
      setDeleting(false)
    }
  }

  return (
    <Button variant="ghost" size="sm" onClick={handleDelete} disabled={deleting}>
      <Trash2 className="size-3.5 text-red-500" />
    </Button>
  )
}
