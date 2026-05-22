"use client"

import { useRouter, useSearchParams } from "next/navigation"

interface Props {
  currentSort: string
  currentCategory: string
}

export function SortSelect({ currentSort, currentCategory }: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleChange = (value: string) => {
    const p = new URLSearchParams(searchParams.toString())
    p.set("page", "1")
    if (currentCategory) p.set("category", currentCategory)
    if (value && value !== "newest") p.set("sort", value)
    else p.delete("sort")
    router.push(`/products?${p.toString()}`)
  }

  return (
    <select
      className="text-sm rounded-lg border border-(--border) px-3 py-2 focus:outline-none focus:ring-2 focus:ring-(--primary)"
      defaultValue={currentSort}
      onChange={(e) => handleChange(e.target.value)}
    >
      <option value="newest">Newest</option>
      <option value="price-asc">Price: Low to High</option>
      <option value="price-desc">Price: High to Low</option>
    </select>
  )
}
