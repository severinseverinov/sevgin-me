import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { authOptions } from "@/lib/auth/authOptions";
import PortalTopNav from "@/components/portal/PortalTopNav";

export default async function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Allow the login page through without session check (prevents redirect loop)
  const headersList = await headers();
  const pathname = headersList.get("x-invoke-path") ?? "";
  const isLoginPage =
    pathname === "/portal/login" || pathname.startsWith("/portal/login");

  if (isLoginPage) {
    return <>{children}</>;
  }

  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/portal/login");
  }

  const role = (session.user as { role?: string })?.role;

  // SUPER_ADMIN should use /admin, not the portal
  if (role === "SUPER_ADMIN") {
    redirect("/admin");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <PortalTopNav
        user={session.user as { name?: string | null; email?: string | null }}
      />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
