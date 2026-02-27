import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import Link from "next/link";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale });

  const [projects, settings] = await Promise.all([
    prisma.portfolioItem.findMany({
      where: { isPublished: true },
      orderBy: { order: "asc" },
    }),
    prisma.siteSettings.findUnique({ where: { id: "singleton" } }),
  ]);

  return (
    <>
      {/* Hero Section */}
      <section className="py-20 sm:py-28 lg:py-36">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col items-center text-center animate-fade-in-up">
            {/* Profile Photo */}
            <div className="relative mb-8">
              <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] p-1">
                <div className="w-full h-full rounded-full bg-[var(--color-surface)] dark:bg-[var(--color-surface-dark)] flex items-center justify-center overflow-hidden">
                  {settings?.profileImageUrl ? (
                    <img
                      src={settings.profileImageUrl}
                      alt="Sevgin Serbest"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <svg
                      className="w-16 h-16 sm:w-20 sm:h-20 text-[var(--color-text-muted)] dark:text-[var(--color-text-muted-dark)]"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                    </svg>
                  )}
                </div>
              </div>
              <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-[var(--color-success)] rounded-full border-4 border-[var(--color-bg)] dark:border-[var(--color-bg-dark)]" />
            </div>

            {/* Badge */}
            <span className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase bg-[var(--color-primary)]/10 text-[var(--color-primary)] mb-4 animate-fade-in-up delay-100">
              {t("hero.badge")}
            </span>

            {/* Name */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold font-heading tracking-tight mb-4 animate-fade-in-up delay-200">
              {t("hero.name")}
            </h1>

            {/* Bio */}
            <p className="text-lg sm:text-xl text-[var(--color-text-muted)] dark:text-[var(--color-text-muted-dark)] max-w-2xl leading-relaxed mb-8 animate-fade-in-up delay-300">
              {t("hero.bio")}
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4 justify-center animate-fade-in-up delay-400">
              <a
                href="#projects"
                className="inline-flex items-center px-6 py-3 rounded-lg bg-[var(--color-primary)] text-white font-semibold text-sm hover:bg-[var(--color-primary-dark)] transition-colors shadow-sm hover:shadow-md"
              >
                {t("hero.cta_work")}
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
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </a>
              <a
                href="mailto:contact@sevginserbest.com"
                className="inline-flex items-center px-6 py-3 rounded-lg border-2 border-[var(--color-border)] dark:border-[var(--color-border-dark)] font-semibold text-sm hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-colors"
              >
                {t("hero.cta_contact")}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section
        id="projects"
        className="py-20 bg-[var(--color-surface)] dark:bg-[var(--color-surface-dark)]"
      >
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold font-heading mb-3">
              {t("projects.title")}
            </h2>
            <p className="text-[var(--color-text-muted)] dark:text-[var(--color-text-muted-dark)] text-lg">
              {t("projects.subtitle")}
            </p>
          </div>

          {projects.length === 0 ? (
            <p className="text-lg text-[var(--color-text-muted)] dark:text-[var(--color-text-muted-dark)] italic">
              {t("projects.empty")}
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {projects.map(
                (project: {
                  id: string;
                  title: string;
                  description: string;
                  link: string | null;
                  tags: string;
                  imageUrl: string | null;
                }) => (
                  <div
                    key={project.id}
                    className="group bg-[var(--color-bg)] dark:bg-[var(--color-bg-dark)] border border-[var(--color-border)] dark:border-[var(--color-border-dark)] rounded-xl overflow-hidden hover:-translate-y-1 hover:shadow-lg transition-all duration-300"
                  >
                    {/* Thumbnail */}
                    {project.imageUrl && (
                      <div className="aspect-video bg-[var(--color-surface-hover)] dark:bg-[var(--color-surface-hover-dark)] overflow-hidden">
                        <img
                          src={project.imageUrl}
                          alt={project.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    )}

                    {!project.imageUrl && (
                      <div className="aspect-video bg-gradient-to-br from-[var(--color-primary)]/5 to-[var(--color-secondary)]/5 flex items-center justify-center">
                        <svg
                          className="w-12 h-12 text-[var(--color-text-muted)]/30"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={1}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                    )}

                    <div className="p-6">
                      {/* Tags */}
                      {project.tags && (
                        <div className="flex flex-wrap gap-1.5 mb-3">
                          {project.tags.split(",").map((tag: string) => (
                            <span
                              key={tag.trim()}
                              className="text-xs font-medium px-2 py-0.5 rounded-md bg-[var(--color-primary)]/10 text-[var(--color-primary)]"
                            >
                              {tag.trim()}
                            </span>
                          ))}
                        </div>
                      )}

                      <h3 className="text-xl font-bold font-heading mb-2 group-hover:text-[var(--color-primary)] transition-colors">
                        {project.title}
                      </h3>
                      <p className="text-sm text-[var(--color-text-muted)] dark:text-[var(--color-text-muted-dark)] leading-relaxed mb-4">
                        {project.description}
                      </p>

                      {project.link && (
                        <a
                          href={project.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-sm font-semibold text-[var(--color-primary)] hover:text-[var(--color-primary-dark)] transition-colors"
                        >
                          {t("projects.visit")}
                          <svg
                            className="w-4 h-4 ml-1.5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                            />
                          </svg>
                        </a>
                      )}
                    </div>
                  </div>
                ),
              )}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold font-heading mb-4">
            {t("about.contact_title")}
          </h2>
          <p className="text-lg text-[var(--color-text-muted)] dark:text-[var(--color-text-muted-dark)] mb-8 max-w-xl mx-auto">
            {t("about.contact_text")}
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a
              href="mailto:contact@sevginserbest.com"
              className="inline-flex items-center px-6 py-3 rounded-lg bg-[var(--color-primary)] text-white font-semibold text-sm hover:bg-[var(--color-primary-dark)] transition-colors shadow-sm"
            >
              {t("about.contact_cta")}
            </a>
            <Link
              href={`/${locale}/about`}
              className="inline-flex items-center px-6 py-3 rounded-lg border-2 border-[var(--color-border)] dark:border-[var(--color-border-dark)] font-semibold text-sm hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-colors"
            >
              {t("nav.about")}
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
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
