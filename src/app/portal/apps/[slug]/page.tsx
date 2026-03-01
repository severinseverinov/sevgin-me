import { getServerSession } from "next-auth/next";
import { redirect, notFound } from "next/navigation";
import { authOptions } from "@/lib/auth/authOptions";
import { prisma } from "@/lib/prisma";

export default async function InternalAppPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const session = await getServerSession(authOptions);
  if (!session) redirect("/portal/login");
  const userId = (session?.user as { id?: string })?.id;
  if (!userId) redirect("/portal/login");

  // Verify user has access to this app
  const app = await prisma.app.findUnique({
    where: { slug, type: "internal", isPublished: true },
  });
  if (!app) notFound();

  const access = await prisma.userApp.findUnique({
    where: { userId_appId: { userId, appId: app.id } },
  });
  if (!access) redirect("/portal/dashboard");

  return (
    <div className="py-4">
      {/* App header */}
      <div className="flex items-center gap-4 mb-8">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
          style={{ background: `${app.color ?? "#0D9488"}20` }}
        >
          {app.icon ?? "🚀"}
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white font-heading">
            {app.name}
          </h1>
          {app.description && (
            <p className="text-sm text-slate-400 mt-0.5">{app.description}</p>
          )}
        </div>
      </div>

      {/* App content area — extend this per app */}
      <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-8 min-h-64 flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-400 text-sm">App content goes here.</p>
          <p className="text-slate-600 text-xs mt-1">
            Build your app&apos;s page content in this area.
          </p>
        </div>
      </div>
    </div>
  );
}
