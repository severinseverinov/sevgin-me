"use client";

import { useEffect, useState } from "react";
import { getSiteSettings, updateSiteSettings } from "@/app/actions/settings";
import toast from "react-hot-toast";

type Settings = {
  profileImageUrl: string;
  githubUrl: string;
  linkedinUrl: string;
  twitterUrl: string;
  emailAddress: string;
  footerTagline: string;
};

const inputClasses =
  "w-full px-4 py-2.5 rounded-lg border border-[var(--color-border)] dark:border-[var(--color-border-dark)] bg-[var(--color-bg)] dark:bg-[var(--color-bg-dark)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-shadow";

const SectionIcon = ({ children }: { children: React.ReactNode }) => (
  <span className="w-8 h-8 rounded-lg bg-[var(--color-primary)]/10 flex items-center justify-center text-[var(--color-primary)] shrink-0">
    {children}
  </span>
);

export default function SettingsPage() {
  const [form, setForm] = useState<Settings>({
    profileImageUrl: "",
    githubUrl: "",
    linkedinUrl: "",
    twitterUrl: "",
    emailAddress: "",
    footerTagline: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getSiteSettings()
      .then((data) => {
        setForm({
          profileImageUrl: data?.profileImageUrl ?? "",
          githubUrl: data?.githubUrl ?? "",
          linkedinUrl: data?.linkedinUrl ?? "",
          twitterUrl: data?.twitterUrl ?? "",
          emailAddress: data?.emailAddress ?? "",
          footerTagline: data?.footerTagline ?? "",
        });
      })
      .catch(() => toast.error("Failed to load settings"))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({
      ...prev,
      [e.currentTarget.name]: e.currentTarget.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const tid = toast.loading("Saving settings...");
    try {
      await updateSiteSettings(form);
      toast.success("Settings saved!", { id: tid });
    } catch {
      toast.error("Failed to save settings", { id: tid });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-4 sm:p-6 md:p-8 max-w-2xl">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-[var(--color-surface-hover)] dark:bg-[var(--color-surface-hover-dark)] rounded w-48" />
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-12 bg-[var(--color-surface-hover)] dark:bg-[var(--color-surface-hover-dark)] rounded"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-2xl mb-16 md:mb-0">
      <h1 className="text-2xl font-bold font-heading mb-2">Site Settings</h1>
      <p className="text-sm text-[var(--color-text-muted)] dark:text-[var(--color-text-muted-dark)] mb-8">
        Manage your profile, social links and footer settings.
      </p>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Profile */}
        <section className="bg-[var(--color-surface)] dark:bg-[var(--color-surface-dark)] border border-[var(--color-border)] dark:border-[var(--color-border-dark)] rounded-xl p-6 space-y-4">
          <h2 className="text-base font-semibold font-heading flex items-center gap-3">
            <SectionIcon>
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                />
              </svg>
            </SectionIcon>
            Profile
          </h2>
          <div>
            <label
              htmlFor="profileImageUrl"
              className="block text-sm font-medium mb-1.5"
            >
              Profile Image URL
            </label>
            <input
              id="profileImageUrl"
              name="profileImageUrl"
              value={form.profileImageUrl}
              onChange={handleChange}
              type="url"
              placeholder="https://example.com/avatar.jpg"
              className={inputClasses}
            />
          </div>
        </section>

        {/* Social Links */}
        <section className="bg-[var(--color-surface)] dark:bg-[var(--color-surface-dark)] border border-[var(--color-border)] dark:border-[var(--color-border-dark)] rounded-xl p-6 space-y-4">
          <h2 className="text-base font-semibold font-heading flex items-center gap-3">
            <SectionIcon>
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m9.686-5.781a4.5 4.5 0 00-6.364-6.364L4.5 8.257a4.5 4.5 0 006.364 6.364L13.19 8.688z"
                />
              </svg>
            </SectionIcon>
            Social Links
          </h2>
          <div>
            <label
              htmlFor="githubUrl"
              className="block text-sm font-medium mb-1.5"
            >
              GitHub URL
            </label>
            <input
              id="githubUrl"
              name="githubUrl"
              value={form.githubUrl}
              onChange={handleChange}
              type="url"
              placeholder="https://github.com/username"
              className={inputClasses}
            />
          </div>
          <div>
            <label
              htmlFor="linkedinUrl"
              className="block text-sm font-medium mb-1.5"
            >
              LinkedIn URL
            </label>
            <input
              id="linkedinUrl"
              name="linkedinUrl"
              value={form.linkedinUrl}
              onChange={handleChange}
              type="url"
              placeholder="https://linkedin.com/in/username"
              className={inputClasses}
            />
          </div>
          <div>
            <label
              htmlFor="twitterUrl"
              className="block text-sm font-medium mb-1.5"
            >
              Twitter / X URL
            </label>
            <input
              id="twitterUrl"
              name="twitterUrl"
              value={form.twitterUrl}
              onChange={handleChange}
              type="url"
              placeholder="https://x.com/username"
              className={inputClasses}
            />
          </div>
        </section>

        {/* Contact & Footer */}
        <section className="bg-[var(--color-surface)] dark:bg-[var(--color-surface-dark)] border border-[var(--color-border)] dark:border-[var(--color-border-dark)] rounded-xl p-6 space-y-4">
          <h2 className="text-base font-semibold font-heading flex items-center gap-3">
            <SectionIcon>
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                />
              </svg>
            </SectionIcon>
            Contact & Footer
          </h2>
          <div>
            <label
              htmlFor="emailAddress"
              className="block text-sm font-medium mb-1.5"
            >
              Email Address
            </label>
            <input
              id="emailAddress"
              name="emailAddress"
              value={form.emailAddress}
              onChange={handleChange}
              type="email"
              className={inputClasses}
            />
          </div>
          <div>
            <label
              htmlFor="footerTagline"
              className="block text-sm font-medium mb-1.5"
            >
              Footer Tagline
            </label>
            <input
              id="footerTagline"
              name="footerTagline"
              value={form.footerTagline}
              onChange={handleChange}
              className={inputClasses}
            />
          </div>
        </section>

        <div className="pt-2">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 rounded-xl bg-[var(--color-primary)] text-white text-sm font-semibold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity cursor-pointer shadow-lg shadow-[var(--color-primary)]/25"
          >
            {saving ? "Saving…" : "Save Settings"}
          </button>
        </div>
      </form>
    </div>
  );
}
