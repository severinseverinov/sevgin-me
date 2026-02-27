import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function AdminPortfolioPage() {
  const items = await prisma.portfolioItem.findMany({
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
  });

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1 className="admin-title">Portfolio</h1>
        <Link
          href="/admin/portfolio/new"
          className="admin-btn admin-btn-primary"
        >
          + New Item
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
            {items.length === 0 && (
              <tr>
                <td colSpan={4} className="admin-table-empty">
                  No items yet. Create your first portfolio item!
                </td>
              </tr>
            )}
            {items.map((item) => (
              <tr key={item.id}>
                <td>{item.title}</td>
                <td>
                  <code>{item.slug}</code>
                </td>
                <td>{item.isPublished ? "✅" : "❌"}</td>
                <td>
                  <Link
                    href={`/admin/portfolio/${item.id}/edit`}
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
