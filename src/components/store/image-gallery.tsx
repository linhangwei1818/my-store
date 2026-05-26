"use client"
import { useState } from "react";
import { useTranslations } from "next-intl";

interface ImageGalleryProps {
  images: { url: string; alt: string | null }[];
}

export function ImageGallery({ images }: ImageGalleryProps) {
  const t = useTranslations("product");
  const [activeIndex, setActiveIndex] = useState(0);

  if (images.length === 0) {
    return (
      <div className="aspect-square bg-(--muted) rounded-xl flex items-center justify-center text-(--muted-foreground)">
        {t("gallery.noImage")}
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row md:gap-4">
      {/* Vertical thumbnails — desktop */}
      {images.length > 1 && (
        <div className="hidden md:flex flex-col gap-2 w-20 flex-shrink-0 overflow-y-auto max-h-[600px]">
          {images.map((image, index) => (
            <button
              key={image.url}
              onClick={() => setActiveIndex(index)}
              className={`size-20 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-colors ${
                index === activeIndex
                  ? "border-(--primary)"
                  : "border-transparent hover:border-(--border)"
              }`}
            >
              <img
                src={image.url}
                alt={image.alt || t("gallery.productImage")}
                className="size-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Main image with hover zoom */}
      <div className="flex-1">
        <div className="aspect-square bg-(--muted) rounded-xl overflow-hidden group">
          <img
            src={images[activeIndex].url}
            alt={images[activeIndex].alt || t("gallery.productImage")}
            className="size-full object-cover transition-transform duration-500 group-hover:scale-150 cursor-zoom-in"
          />
        </div>
      </div>

      {/* Horizontal thumbnails — mobile */}
      {images.length > 1 && (
        <div className="flex md:hidden gap-2 overflow-x-auto pb-1 mt-3">
          {images.map((image, index) => (
            <button
              key={image.url}
              onClick={() => setActiveIndex(index)}
              className={`size-20 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-colors ${
                index === activeIndex
                  ? "border-(--primary)"
                  : "border-transparent hover:border-(--border)"
              }`}
            >
              <img
                src={image.url}
                alt={image.alt || t("gallery.productImage")}
                className="size-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
