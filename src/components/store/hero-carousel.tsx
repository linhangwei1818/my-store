"use client"
import { useState, useEffect, useCallback } from "react";
import { ArrowRight } from "lucide-react";

interface HeroImage {
  url: string;
  alt: string;
}

interface HeroCarouselProps {
  images: HeroImage[];
  overline: string;
  title1: string;
  title2: string;
  subtitle: string;
  cta1Label: string;
  cta1Href: string;
  cta2Label: string;
  cta2Href: string;
}

export function HeroCarousel({
  images,
  overline,
  title1,
  title2,
  subtitle,
  cta1Label,
  cta1Href,
  cta2Label,
  cta2Href,
}: HeroCarouselProps) {
  const [current, setCurrent] = useState(0);

  const goTo = useCallback(
    (index: number) => {
      if (index === current) return;
      setCurrent(index);
    },
    [current],
  );

  useEffect(() => {
    if (images.length <= 1) return;
    const timer = setInterval(() => {
      goTo((current + 1) % images.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [current, images.length, goTo]);

  if (images.length === 0) {
    return (
      <section className="relative overflow-hidden bg-gradient-to-b from-stone-50 to-(--accent)">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 md:py-36 text-center">
          <p className="text-sm font-medium tracking-widest uppercase text-(--primary) mb-4">
            {overline}
          </p>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-stone-900 mb-6 leading-tight">
            {title1}
            <br />
            <span className="text-(--primary)">{title2}</span>
          </h1>
          <p className="text-base md:text-lg text-(--muted-foreground) max-w-lg mx-auto mb-10 leading-relaxed">
            {subtitle}
          </p>
        </div>
      </section>
    );
  }

  const activeImage = images[current % images.length];

  return (
    <section className="relative overflow-hidden bg-stone-900">
      {/* Image panel */}
      <div className="relative w-full h-[50vh] md:h-[75vh] min-h-[400px] max-h-[700px]">
        {/* Current image */}
        <div className="absolute inset-0 transition-opacity duration-300">
          <img
            src={activeImage.url}
            alt={activeImage.alt}
            className="size-full object-cover"
          />
        </div>

        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/10 md:from-black/60 md:via-black/40 md:to-transparent" />

        {/* Text content overlaid */}
        <div className="absolute inset-0 flex items-center">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
            <div className="max-w-xl md:max-w-lg">
              <p className="text-sm font-medium tracking-widest uppercase text-orange-300 mb-4">
                {overline}
              </p>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white mb-6 leading-tight">
                {title1}
                <br />
                <span className="text-orange-400">{title2}</span>
              </h1>
              <p className="text-base md:text-lg text-stone-300 max-w-md mb-10 leading-relaxed">
                {subtitle}
              </p>
              <div className="flex items-center gap-3 flex-wrap">
                <a
                  href={cta1Href}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-orange-600 text-white rounded-xl font-medium hover:bg-orange-700 transition-colors shadow-lg shadow-orange-900/30"
                >
                  {cta1Label}
                  <ArrowRight className="size-4" />
                </a>
                <a
                  href={cta2Href}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur text-white border border-white/20 rounded-xl font-medium hover:bg-white/20 transition-colors"
                >
                  {cta2Label}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dots indicator */}
      {images.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`size-2 rounded-full transition-all duration-300 ${
                i === current
                  ? "bg-white w-6"
                  : "bg-white/40 hover:bg-white/70"
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
