"use client"

import { useRouter } from "@/i18n/navigation"
import { useSearchParams } from "next/navigation"
import { useTranslations } from "next-intl"

interface Props {
  currentSort: string
  currentCategory: string
}

export function SortSelect({ currentSort, currentCategory }: Props) {
  const t = useTranslations("product")
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
      <option value="newest">{t("sort.newest")}</option>
      <option value="price-asc">{t("sort.priceAsc")}</option>
      <option value="price-desc">{t("sort.priceDesc")}</option>
    </select>
  )
}
