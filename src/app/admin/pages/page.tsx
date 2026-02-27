import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function AdminPagesPage() {
  const pages = await prisma.page.findMany({ orderBy: { slug: "asc" } });

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1 className="admin-title">Pages</h1>
        <Link href="/admin/pages/new" className="admin-btn admin-btn-primary">
          + New Page
        </Link>
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Slug</th>
              <th>Published</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {pages.length === 0 && (
              <tr>
                <td colSpan={4} className="admin-table-empty">
                  No pages yet.
                </td>
              </tr>
            )}
            {pages.map((page) => (
              <tr key={page.id}>
                <td>{page.title}</td>
                <td>
                  <code>{page.slug}</code>
                </td>
                <td>{page.isPublished ? "✅" : "❌"}</td>
                <td>
                  <Link
                    href={`/admin/pages/${page.slug}/edit`}
                    className="admin-btn admin-btn-sm"
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
