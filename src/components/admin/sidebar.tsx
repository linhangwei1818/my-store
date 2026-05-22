'use client'

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Package, ShoppingBag, Tags, LogOut } from "lucide-react"
import { signOut } from "next-auth/react"

const navItems = [
  { href: "/admin", label: "仪表盘", icon: LayoutDashboard },
  { href: "/admin/products", label: "商品管理", icon: Package },
  { href: "/admin/orders", label: "订单管理", icon: ShoppingBag },
  { href: "/admin/categories", label: "分类管理", icon: Tags },
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-60 bg-white border-r border-(--border) flex flex-col flex-shrink-0">
      <div className="p-4 border-b border-(--border)">
        <Link href="/admin" className="text-lg font-bold">
          MyStore 后台
        </Link>
      </div>
      <nav className="flex-1 p-3 space-y-1">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/admin" && pathname.startsWith(item.href))
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-(--accent) text-(--accent-foreground)"
                  : "text-(--muted-foreground) hover:bg-(--muted) hover:text-(--foreground)"
              }`}
            >
              <item.icon className="size-4" />
              {item.label}
            </Link>
          )
        })}
      </nav>
      <div className="p-3 border-t border-(--border)">
        <button
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-(--muted-foreground) hover:bg-red-50 hover:text-red-600 w-full transition-colors"
        >
          <LogOut className="size-4" />
          退出登录
        </button>
      </div>
    </aside>
  )
}
