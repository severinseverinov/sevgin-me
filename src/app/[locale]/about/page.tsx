import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about" });
  return {
    title: `${t("title")} | Sevgin Serbest`,
    description: t("bio"),
  };
}

const categoryColors: Record<string, string> = {
  language: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
  frontend: "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300",
  backend:
    "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
  database: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300",
  devops:
    "bg-slate-100 text-slate-700 dark:bg-slate-800/50 dark:text-slate-300",
};

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale });

  const [skills, experience, settings] = await Promise.all([
    prisma.skill.findMany({ orderBy: { order: "asc" } }),
    prisma.experience.findMany({ orderBy: { order: "asc" } }),
    prisma.siteSettings.findUnique({ where: { id: "singleton" } }),
  ]);

  return (
    <>
      {/* Header */}
      <section className="py-20 sm:py-28">
        <div className="max-w-4xl mx-auto px-6">
          <div className="animate-fade-in-up">
            <h1 className="text-4xl sm:text-5xl font-extrabold font-heading tracking-tight mb-4">
              {t("about.title")}
            </h1>
            <p className="text-xl text-[var(--color-text-muted)] dark:text-[var(--color-text-muted-dark)]">
              {t("about.subtitle")}
            </p>
          </div>
        </div>
      </section>

      {/* Bio Section */}
      <section className="pb-20">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex flex-col md:flex-row gap-10 items-start">
            {/* Photo */}
            <div className="shrink-0">
              <div className="w-48 h-48 sm:w-56 sm:h-56 rounded-2xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] p-1">
                <div className="w-full h-full rounded-2xl bg-[var(--color-surface)] dark:bg-[var(--color-surface-dark)] flex items-center justify-center overflow-hidden">
                  {settings?.profileImageUrl ? (
                    <img
                      src={settings.profileImageUrl}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <svg
                      className="w-24 h-24 text-[var(--color-text-muted)]/30"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                    </svg>
                  )}
                </div>
              </div>
            </div>

            {/* Bio Text */}
            <div>
              <h2 className="text-2xl font-bold font-heading mb-4">
                {t("about.bio_title")}
              </h2>
              <p className="text-lg text-[var(--color-text-muted)] dark:text-[var(--color-text-muted-dark)] leading-relaxed">
                {t("about.bio")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Experience Timeline */}
      {experience.length > 0 && (
        <section className="py-20 bg-[var(--color-surface)] dark:bg-[var(--color-surface-dark)]">
          <div className="max-w-4xl mx-auto px-6">
            <h2 className="text-3xl font-bold font-heading mb-12">
              {t("about.experience_title")}
            </h2>

            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-[var(--color-border)] dark:bg-[var(--color-border-dark)]" />

              <div className="space-y-10">
                {experience.map((exp) => (
                  <div key={exp.id} className="relative pl-12">
                    {/* Dot */}
                    <div className="absolute left-2.5 top-1.5 w-3.5 h-3.5 rounded-full border-2 border-[var(--color-primary)] bg-[var(--color-bg)] dark:bg-[var(--color-bg-dark)]" />

                    <div className="bg-[var(--color-bg)] dark:bg-[var(--color-bg-dark)] border border-[var(--color-border)] dark:border-[var(--color-border-dark)] rounded-xl p-6 hover:shadow-md transition-shadow">
                      <span className="text-xs font-semibold text-[var(--color-primary)] uppercase tracking-wider">
                        {exp.year}
                      </span>
                      <h3 className="text-lg font-bold font-heading mt-1 mb-2">
                        {exp.title}
                      </h3>
                      <p className="text-sm text-[var(--color-text-muted)] dark:text-[var(--color-text-muted-dark)] leading-relaxed">
                        {exp.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <section className="py-20">
          <div className="max-w-4xl mx-auto px-6">
            <h2 className="text-3xl font-bold font-heading mb-8">
              {t("about.skills_title")}
            </h2>

            <div className="flex flex-wrap gap-2.5">
              {skills.map((skill) => (
                <span
                  key={skill.id}
                  className={`px-4 py-2 rounded-lg text-sm font-medium ${categoryColors[skill.category] ?? "bg-slate-100 text-slate-700 dark:bg-slate-800/50 dark:text-slate-300"}`}
                >
                  {skill.name}
                </span>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Contact CTA */}
      <section className="py-20 bg-[var(--color-surface)] dark:bg-[var(--color-surface-dark)]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold font-heading mb-4">
            {t("about.contact_title")}
          </h2>
          <p className="text-lg text-[var(--color-text-muted)] dark:text-[var(--color-text-muted-dark)] mb-8 max-w-xl mx-auto">
            {t("about.contact_text")}
          </p>
          <a
            href={`mailto:${settings?.emailAddress ?? "contact@sevginserbest.com"}`}
            className="inline-flex items-center px-8 py-3.5 rounded-lg bg-[var(--color-primary)] text-white font-semibold hover:bg-[var(--color-primary-dark)] transition-colors shadow-sm hover:shadow-md"
          >
            {t("about.contact_cta")}
            <svg
              className="w-4 h-4 ml-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </a>
        </div>
      </section>
    </>
  );
}
