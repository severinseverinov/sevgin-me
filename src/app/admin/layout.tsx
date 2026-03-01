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

  // Not logged in → login page
  if (!session) {
    redirect("/login");
  }

  // Only SUPER_ADMIN may enter the admin panel
  const role = (session.user as { role?: string })?.role;
  if (role !== "SUPER_ADMIN") {
    redirect("/access-denied");
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[var(--color-bg)] dark:bg-[var(--color-bg-dark)]">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto overflow-x-hidden w-full relative z-0 pb-safe">
        {children}
      </main>
    </div>
  );
}
