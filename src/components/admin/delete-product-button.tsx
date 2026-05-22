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
    if (!confirm(`Delete "${productName}"? This will deactivate the product.`)) return
    setDeleting(true)
    try {
      const res = await fetch(`/api/products/${productId}`, { method: "DELETE" })
      if (res.ok) {
        toast.success("Product deleted")
        router.refresh()
      } else {
        toast.error("Failed to delete product")
      }
    } catch {
      toast.error("Failed to delete product")
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
