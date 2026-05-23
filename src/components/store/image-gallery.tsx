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
    <div className="space-y-3">
      <div className="aspect-square bg-(--muted) rounded-xl overflow-hidden">
        <img
          src={images[activeIndex].url}
          alt={images[activeIndex].alt || t("gallery.productImage")}
          className="size-full object-cover"
        />
      </div>
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
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
