"use client"
import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ProductCard } from "@/components/store/product-card";

interface ScrollRowProduct {
  slug: string;
  name: string;
  price: number;
  compareAtPrice: number | null;
  images: { url: string; alt: string | null }[];
  createdAt?: string | Date;
}

interface ScrollRowProps {
  products: ScrollRowProduct[];
  overline: string;
  title: string;
}

export function ScrollRow({ products, overline, title }: ScrollRowProps) {
  const ref = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    if (!ref.current) return;
    const amount = ref.current.clientWidth * 0.75;
    ref.current.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" });
  };

  if (products.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
      <div className="flex items-end justify-between mb-8">
        <div>
          <p className="text-sm font-medium tracking-widest uppercase text-(--primary) mb-3">
            {overline}
          </p>
          <h2 className="text-2xl md:text-3xl font-bold text-stone-900">{title}</h2>
        </div>
        <div className="hidden md:flex items-center gap-1">
          <button
            onClick={() => scroll("left")}
            className="p-2 rounded-full border border-(--border) text-(--muted-foreground) hover:text-(--foreground) hover:border-(--primary) transition-colors"
          >
            <ChevronLeft className="size-4" />
          </button>
          <button
            onClick={() => scroll("right")}
            className="p-2 rounded-full border border-(--border) text-(--muted-foreground) hover:text-(--foreground) hover:border-(--primary) transition-colors"
          >
            <ChevronRight className="size-4" />
          </button>
        </div>
      </div>

      <div
        ref={ref}
        className="flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-2 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 scrollbar-hide"
        style={{ scrollbarWidth: "none" }}
      >
        {products.map((product) => (
          <div
            key={product.slug}
            className="flex-shrink-0 w-[65vw] sm:w-[40vw] md:w-[28vw] lg:w-[22vw] xl:w-[18vw] snap-start"
          >
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </section>
  );
}
