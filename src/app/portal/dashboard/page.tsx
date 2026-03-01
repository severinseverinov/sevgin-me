import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth/authOptions";
import { getPortalUserApps } from "@/app/actions/apps";
import AppCard from "@/components/portal/AppCard";

export default async function PortalDashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/portal/login");
  const userId = (session?.user as { id?: string })?.id;

  const apps = userId ? await getPortalUserApps(userId) : [];

  return (
    <div className="py-4">
      {/* Header */}
      <div className="mb-10">
        <p className="text-xs font-semibold text-teal-400 uppercase tracking-widest mb-2">
          Welcome back
        </p>
        <h1 className="text-3xl font-bold text-white font-heading">
          {(session?.user as { name?: string | null })?.name ?? "Your Apps"}
        </h1>
        <p className="text-slate-400 mt-1.5 text-sm">
          {apps.length === 0
            ? "No applications assigned yet. Contact your admin."
            : `You have access to ${apps.length} application${apps.length !== 1 ? "s" : ""}.`}
        </p>
      </div>

      {/* App grid */}
      {apps.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center mb-4">
            <svg
              className="w-8 h-8 text-slate-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z"
              />
            </svg>
          </div>
          <p className="text-slate-500 text-sm">No applications available</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {apps.map((app) => (
            <AppCard key={app.id} app={app} />
          ))}
        </div>
      )}
    </div>
  );
}
