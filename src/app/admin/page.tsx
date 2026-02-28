import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function AdminDashboard() {
  const [portfolioCount, pageCount, skillCount, experienceCount] =
    await Promise.all([
      prisma.portfolioItem.count(),
      prisma.page.count(),
      prisma.skill.count(),
      prisma.experience.count(),
    ]);

  const stats = [
    {
      label: "Portfolio Items",
      value: portfolioCount,
      href: "/admin/portfolio",
      color: "text-[var(--color-primary)]",
    },
    {
      label: "Pages",
      value: pageCount,
      href: "/admin/pages",
      color: "text-[var(--color-secondary)]",
    },
    {
      label: "Skills",
      value: skillCount,
      href: "/admin/skills",
      color: "text-teal-500",
    },
    {
      label: "Experience",
      value: experienceCount,
      href: "/admin/experience",
      color: "text-amber-500",
    },
  ];

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-5xl mb-16 md:mb-0">
      <h1 className="text-2xl font-bold font-heading mb-2">Dashboard</h1>
      <p className="text-sm text-[var(--color-text-muted)] dark:text-[var(--color-text-muted-dark)] mb-8">
        Manage your website content from here.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-[var(--color-surface)] dark:bg-[var(--color-surface-dark)] border border-[var(--color-border)] dark:border-[var(--color-border-dark)] rounded-xl p-5 sm:p-6 flex flex-col"
          >
            <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] dark:text-[var(--color-text-muted-dark)]">
              {stat.label}
            </span>
            <span
              className={`text-4xl font-bold font-heading mt-2 mb-4 ${stat.color}`}
            >
              {stat.value}
            </span>
            <Link
              href={stat.href}
              className="text-sm font-semibold text-[var(--color-primary)] hover:text-[var(--color-primary-dark)] transition-colors mt-auto"
            >
              Manage →
            </Link>
          </div>
        ))}
      </div>

      {/* Quick Links */}
      <div className="mt-6 sm:mt-8 bg-[var(--color-surface)] dark:bg-[var(--color-surface-dark)] border border-[var(--color-border)] dark:border-[var(--color-border-dark)] rounded-xl p-5 sm:p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--color-text-muted)] dark:text-[var(--color-text-muted-dark)] mb-4">
          Quick Actions
        </h2>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/admin/portfolio/new"
            className="inline-flex items-center px-4 py-2 rounded-lg bg-[var(--color-primary)]/10 text-[var(--color-primary)] text-sm font-medium hover:bg-[var(--color-primary)]/20 transition-colors"
          >
            + New Project
          </Link>
          <Link
            href="/admin/settings"
            className="inline-flex items-center px-4 py-2 rounded-lg bg-[var(--color-primary)]/10 text-[var(--color-primary)] text-sm font-medium hover:bg-[var(--color-primary)]/20 transition-colors"
          >
            ⚙ Site Settings
          </Link>
          <Link
            href="/en"
            className="inline-flex items-center px-4 py-2 rounded-lg border border-[var(--color-border)] dark:border-[var(--color-border-dark)] text-sm font-medium hover:bg-[var(--color-surface-hover)] dark:hover:bg-[var(--color-surface-hover-dark)] transition-colors"
          >
            View Site →
          </Link>
        </div>
      </div>
    </div>
  );
}
