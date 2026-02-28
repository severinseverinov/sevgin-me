import type { Metadata } from "next";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth/authOptions";
import AdminSidebar from "./AdminSidebar";

export const metadata: Metadata = {
  title: "Admin – sevginserbest.com",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[var(--color-bg)] dark:bg-[var(--color-bg-dark)]">
      {/* Client Component handling responsive Sidebar & Mobile Header */}
      <AdminSidebar />

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto overflow-x-hidden w-full relative z-0 pb-safe">
        {children}
      </main>
    </div>
  );
}
