import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function AdminPagesPage() {
  const pages = await prisma.page.findMany({ orderBy: { slug: "asc" } });

  return (
    <div className="p-8 max-w-5xl">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold font-heading">Pages</h1>
        <Link
          href="/admin/pages/new"
          className="inline-flex items-center px-4 py-2 rounded-lg bg-[var(--color-primary)] text-white text-sm font-semibold hover:bg-[var(--color-primary-dark)] transition-colors"
        >
          + New Page
        </Link>
      </div>

      <div className="bg-[var(--color-surface)] dark:bg-[var(--color-surface-dark)] border border-[var(--color-border)] dark:border-[var(--color-border-dark)] rounded-xl overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-[var(--color-border)] dark:border-[var(--color-border-dark)]">
              <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] dark:text-[var(--color-text-muted-dark)]">
                Title
              </th>
              <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] dark:text-[var(--color-text-muted-dark)]">
                Slug
              </th>
              <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] dark:text-[var(--color-text-muted-dark)]">
                Published
              </th>
              <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] dark:text-[var(--color-text-muted-dark)]">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-border)] dark:divide-[var(--color-border-dark)]">
            {pages.length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  className="px-5 py-8 text-center text-sm text-[var(--color-text-muted)] dark:text-[var(--color-text-muted-dark)]"
                >
                  No pages yet.
                </td>
              </tr>
            )}
            {pages.map((page) => (
              <tr
                key={page.id}
                className="hover:bg-[var(--color-surface-hover)] dark:hover:bg-[var(--color-surface-hover-dark)] transition-colors"
              >
                <td className="px-5 py-3.5 text-sm font-medium">
                  {page.title}
                </td>
                <td className="px-5 py-3.5 text-sm">
                  <code className="text-xs px-2 py-1 rounded bg-[var(--color-surface-hover)] dark:bg-[var(--color-surface-hover-dark)] font-mono">
                    {page.slug}
                  </code>
                </td>
                <td className="px-5 py-3.5 text-sm">
                  {page.isPublished ? (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                      Published
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                      Draft
                    </span>
                  )}
                </td>
                <td className="px-5 py-3.5">
                  <Link
                    href={`/admin/pages/${page.slug}/edit`}
                    className="text-sm font-semibold text-[var(--color-primary)] hover:text-[var(--color-primary-dark)] transition-colors"
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
