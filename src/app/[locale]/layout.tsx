import { NextIntlClientProvider } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import ThemeToggle from "@/components/ThemeToggle";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { prisma } from "@/lib/prisma";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as "en" | "tr" | "de")) {
    notFound();
  }

  setRequestLocale(locale);

  const messages = (await import(`../../../messages/${locale}.json`)).default;

  const settings = await prisma.siteSettings.findUnique({
    where: { id: "singleton" },
  });

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-[var(--color-border)] dark:border-[var(--color-border-dark)] bg-[var(--color-bg)]/80 dark:bg-[var(--color-bg-dark)]/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href={`/${locale}`} className="flex items-center gap-2.5 group">
            <Image
              src="/logo.svg"
              alt="SS"
              width={32}
              height={32}
              className="transition-transform group-hover:scale-110"
            />
            <span className="font-heading text-lg font-bold tracking-tight hidden sm:inline">
              sevgin
              <span className="text-[var(--color-primary)]">.me</span>
            </span>
          </Link>

          {/* Nav Links */}
          <div className="flex items-center gap-1">
            <Link
              href={`/${locale}`}
              className="px-3 py-2 rounded-lg text-sm font-medium hover:bg-[var(--color-surface-hover)] dark:hover:bg-[var(--color-surface-hover-dark)] transition-colors"
            >
              {messages.nav.home}
            </Link>
            <Link
              href={`/${locale}#projects`}
              className="px-3 py-2 rounded-lg text-sm font-medium hover:bg-[var(--color-surface-hover)] dark:hover:bg-[var(--color-surface-hover-dark)] transition-colors"
            >
              {messages.nav.projects}
            </Link>
            <Link
              href={`/${locale}/about`}
              className="px-3 py-2 rounded-lg text-sm font-medium hover:bg-[var(--color-surface-hover)] dark:hover:bg-[var(--color-surface-hover-dark)] transition-colors"
            >
              {messages.nav.about}
            </Link>

            <div className="w-px h-5 bg-[var(--color-border)] dark:bg-[var(--color-border-dark)] mx-1" />

            <LanguageSwitcher locale={locale} />
            <ThemeToggle />
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="min-h-[calc(100vh-4rem)]">{children}</main>

      {/* Footer */}
      <footer className="border-t border-[var(--color-border)] dark:border-[var(--color-border-dark)] bg-[var(--color-bg)] dark:bg-[var(--color-bg-dark)]">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
            <div className="flex items-center gap-3">
              <Image src="/logo.svg" alt="SS" width={28} height={28} />
              <div>
                <p className="font-heading font-bold text-sm">Sevgin Serbest</p>
                <p className="text-xs text-[var(--color-text-muted)] dark:text-[var(--color-text-muted-dark)]">
                  {settings?.footerTagline ?? messages.footer.tagline}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {settings?.githubUrl && (
                <a
                  href={settings.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-[var(--color-text-muted)] dark:text-[var(--color-text-muted-dark)] hover:text-[var(--color-primary)] transition-colors"
                >
                  GitHub
                </a>
              )}
              {settings?.linkedinUrl && (
                <a
                  href={settings.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-[var(--color-text-muted)] dark:text-[var(--color-text-muted-dark)] hover:text-[var(--color-primary)] transition-colors"
                >
                  LinkedIn
                </a>
              )}
              {settings?.twitterUrl && (
                <a
                  href={settings.twitterUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-[var(--color-text-muted)] dark:text-[var(--color-text-muted-dark)] hover:text-[var(--color-primary)] transition-colors"
                >
                  Twitter
                </a>
              )}
              <a
                href="/login"
                className="text-xs text-[var(--color-text-muted)] dark:text-[var(--color-text-muted-dark)] opacity-40 hover:opacity-100 transition-opacity"
              >
                Admin
              </a>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-[var(--color-border)] dark:border-[var(--color-border-dark)]">
            <p className="text-xs text-[var(--color-text-muted)] dark:text-[var(--color-text-muted-dark)]">
              © {new Date().getFullYear()} Sevgin Serbest.{" "}
              {messages.footer.rights}
            </p>
          </div>
        </div>
      </footer>
    </NextIntlClientProvider>
  );
}
