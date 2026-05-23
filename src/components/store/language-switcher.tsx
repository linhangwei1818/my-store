"use client"
import { useState } from "react";
import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { Globe } from "lucide-react";

const LOCALE_LABELS: Record<string, string> = {
  en: "English",
  es: "Español",
  ja: "日本語",
  ko: "한국어",
};

const LOCALE_FLAGS: Record<string, string> = {
  en: "🇬🇧",
  es: "🇪🇸",
  ja: "🇯🇵",
  ko: "🇰🇷",
};

export function LanguageSwitcher() {
  const pathname = usePathname();
  const router = useRouter();
  const locale = useLocale();
  const [open, setOpen] = useState(false);

  const switchTo = (newLocale: string) => {
    router.replace(pathname, { locale: newLocale });
    setOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-2 py-1.5 text-sm text-(--muted-foreground) hover:text-(--foreground) rounded-lg hover:bg-(--muted) transition-colors"
      >
        <Globe className="size-4" />
        <span className="hidden sm:inline text-xs">{LOCALE_FLAGS[locale]} {LOCALE_LABELS[locale]}</span>
        <span className="sm:hidden text-xs">{LOCALE_FLAGS[locale]}</span>
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-1 z-50 bg-white rounded-xl shadow-lg border border-(--border) py-1 min-w-[150px]">
            {["en", "es", "ja", "ko"].map((l) => (
              <button
                key={l}
                onClick={() => switchTo(l)}
                className={`w-full text-left px-3 py-2 text-sm hover:bg-(--muted) transition-colors flex items-center gap-2 ${
                  l === locale ? "font-semibold bg-(--accent)/50" : ""
                }`}
              >
                <span>{LOCALE_FLAGS[l]}</span>
                <span>{LOCALE_LABELS[l]}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
