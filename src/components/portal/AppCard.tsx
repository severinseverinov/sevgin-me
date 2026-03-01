"use client";

import Link from "next/link";

interface App {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  icon?: string | null;
  type: string;
  url?: string | null;
  color?: string | null;
}

const DEFAULT_COLORS = [
  "#0D9488",
  "#3B82F6",
  "#8B5CF6",
  "#EC4899",
  "#F59E0B",
  "#10B981",
  "#EF4444",
  "#06B6D4",
];

let colorIndex = 0;
function getDefaultColor() {
  return DEFAULT_COLORS[colorIndex++ % DEFAULT_COLORS.length];
}

export default function AppCard({ app }: { app: App }) {
  const accent = app.color || getDefaultColor();
  const isExternal = app.type === "external";
  const href = isExternal ? (app.url ?? "#") : `/portal/apps/${app.slug}`;

  return (
    <div
      className="group relative rounded-2xl overflow-hidden border border-white/[0.08] hover:border-white/[0.14] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-2xl"
      style={{
        background: `linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.02) 100%)`,
      }}
    >
      {/* Accent glow */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at top left, ${accent}15 0%, transparent 60%)`,
        }}
      />

      {/* Top border accent */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background: `linear-gradient(90deg, transparent, ${accent}60, transparent)`,
        }}
      />

      <div className="relative p-6">
        {/* Icon + type badge */}
        <div className="flex items-start justify-between mb-4">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-lg"
            style={{
              background: `${accent}20`,
              boxShadow: `0 0 20px ${accent}25`,
            }}
          >
            {app.icon ?? "🚀"}
          </div>
          <span
            className={`text-[10px] font-semibold uppercase tracking-widest px-2 py-1 rounded-full border`}
            style={{
              color: accent,
              borderColor: `${accent}40`,
              background: `${accent}10`,
            }}
          >
            {isExternal ? "External" : "App"}
          </span>
        </div>

        {/* Name + description */}
        <h3 className="text-base font-semibold text-white mb-1.5 font-heading">
          {app.name}
        </h3>
        {app.description && (
          <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
            {app.description}
          </p>
        )}

        {/* Launch button */}
        <div className="mt-5">
          <Link
            href={href}
            target={isExternal ? "_blank" : undefined}
            rel={isExternal ? "noopener noreferrer" : undefined}
            className="inline-flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-lg transition-all group/btn"
            style={{
              color: accent,
              background: `${accent}15`,
              border: `1px solid ${accent}30`,
            }}
          >
            {isExternal ? "Open ↗" : "Launch"}
            <svg
              className="w-3 h-3 transition-transform group-hover/btn:translate-x-0.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d={
                  isExternal
                    ? "M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                    : "M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                }
              />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
