import { prisma } from "@/lib/prisma";
import Link from "next/link";
export default async function AdminDashboard() {
  const [portfolioCount, pageCount] = await Promise.all([
    prisma.portfolioItem.count(),
    prisma.page.count(),
  ]);

  return (
    <div className="admin-page">
      <h1 className="admin-title">Dashboard</h1>
      <div className="admin-stats-grid">
        <div className="admin-stat-card">
          <span className="admin-stat-label">Portfolio Items</span>
          <span className="admin-stat-value">{portfolioCount}</span>
          <Link href="/admin/portfolio" className="admin-stat-link">
            Manage →
          </Link>
        </div>
        <div className="admin-stat-card">
          <span className="admin-stat-label">Pages</span>
          <span className="admin-stat-value">{pageCount}</span>
          <Link href="/admin/pages" className="admin-stat-link">
            Manage →
          </Link>
        </div>
      </div>
    </div>
  );
}
