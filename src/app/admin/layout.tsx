import type { Metadata } from "next";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth/authOptions";

import Link from "next/link";

export const metadata: Metadata = {
  title: "Admin \u2013 sevginserbest.com",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/api/auth/signin"); // default next-auth page, or '/login' if custom
  }
  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-logo">⚡ Admin</div>
        <nav className="admin-nav">
          <Link href="/admin" className="admin-nav-link">
            Dashboard
          </Link>
          <Link href="/admin/portfolio" className="admin-nav-link">
            Portfolio
          </Link>
          <Link href="/admin/pages" className="admin-nav-link">
            Pages
          </Link>
          <Link
            href="/api/auth/signout"
            className="admin-nav-link admin-nav-signout"
          >
            Sign Out
          </Link>
        </nav>
      </aside>
      <main className="admin-main">{children}</main>
    </div>
  );
}
