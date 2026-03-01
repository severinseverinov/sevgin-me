import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth/authOptions";
import PortalTopNav from "@/components/portal/PortalTopNav";

export default async function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  const role = (session?.user as { role?: string })?.role;

  // SUPER_ADMIN should use /admin, not the portal
  // But only if they are NOT trying to log out or visit a specific page
  if (session && role === "SUPER_ADMIN") {
    redirect("/admin");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {session && (
        <PortalTopNav
          user={session.user as { name?: string | null; email?: string | null }}
        />
      )}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
