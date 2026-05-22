import Link from "next/link";
import { ShoppingCart, Search, Menu } from "lucide-react";
import { CartDrawer } from "@/components/store/cart-drawer";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Shop All" },
];

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-(--border)">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between gap-4">
            <div className="flex items-center gap-8">
              <Link href="/" className="text-xl font-bold tracking-tight">
                MyStore
              </Link>
              <nav className="hidden md:flex items-center gap-6">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-sm text-(--muted-foreground) hover:text-(--foreground) transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/search"
                className="p-2 text-(--muted-foreground) hover:text-(--foreground) transition-colors"
              >
                <Search className="size-5" />
              </Link>
              <CartDrawer />
              <button className="md:hidden p-2 text-(--muted-foreground) hover:text-(--foreground)">
                <Menu className="size-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="bg-(--muted) border-t border-(--border)">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-semibold mb-3">MyStore</h3>
              <p className="text-sm text-(--muted-foreground)">
                Quality products at great prices. Fast shipping worldwide.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-sm mb-3">Shop</h4>
              <ul className="space-y-2 text-sm text-(--muted-foreground)">
                <li><Link href="/products" className="hover:text-(--foreground)">All Products</Link></li>
                <li><Link href="/search" className="hover:text-(--foreground)">Search</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-sm mb-3">Support</h4>
              <ul className="space-y-2 text-sm text-(--muted-foreground)">
                <li><Link href="/shipping" className="hover:text-(--foreground)">Shipping Policy</Link></li>
                <li><Link href="/returns" className="hover:text-(--foreground)">Returns</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-sm mb-3">Legal</h4>
              <ul className="space-y-2 text-sm text-(--muted-foreground)">
                <li><Link href="/privacy" className="hover:text-(--foreground)">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-(--foreground)">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-(--border) text-center text-sm text-(--muted-foreground)">
            &copy; {new Date().getFullYear()} MyStore. All rights reserved.
          </div>
        </div>
      </footer>
    </>
  );
}
