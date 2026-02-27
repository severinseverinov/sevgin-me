"use client";

import { usePathname } from "next/navigation";
import { routing } from "@/i18n/routing";

const labels: Record<string, string> = {
  en: "EN",
  tr: "TR",
  de: "DE",
};

const flags: Record<string, string> = {
  en: "🇬🇧",
  tr: "🇹🇷",
  de: "🇩🇪",
};

export default function LanguageSwitcher({ locale }: { locale: string }) {
  const pathname = usePathname();

  const switchLocale = (newLocale: string) => {
    const segments = pathname.split("/");
    // Replace the locale segment (first segment after /)
    if (routing.locales.includes(segments[1] as "en" | "tr" | "de")) {
      segments[1] = newLocale;
    } else {
      segments.splice(1, 0, newLocale);
    }
    window.location.href = segments.join("/") || "/";
  };

  return (
    <div className="relative group">
      <button
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-sm font-medium hover:bg-[var(--color-surface-hover)] dark:hover:bg-[var(--color-surface-hover-dark)] transition-colors cursor-pointer"
        aria-label="Change language"
      >
        <span>{flags[locale]}</span>
        <span className="hidden sm:inline">{labels[locale]}</span>
        <svg
          className="w-3.5 h-3.5 opacity-50"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      <div className="absolute right-0 top-full mt-1 bg-[var(--color-surface)] dark:bg-[var(--color-surface-dark)] border border-[var(--color-border)] dark:border-[var(--color-border-dark)] rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 min-w-[120px] z-50">
        {routing.locales.map((loc) => (
          <button
            key={loc}
            onClick={() => switchLocale(loc)}
            className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 text-sm transition-colors cursor-pointer first:rounded-t-lg last:rounded-b-lg ${
              loc === locale
                ? "bg-[var(--color-primary)] text-white font-semibold"
                : "hover:bg-[var(--color-surface-hover)] dark:hover:bg-[var(--color-surface-hover-dark)]"
            }`}
          >
            <span>{flags[loc]}</span>
            <span>{labels[loc]}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
