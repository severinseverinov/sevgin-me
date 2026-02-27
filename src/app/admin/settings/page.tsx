"use client";

import { useEffect, useState } from "react";

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
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((data) => {
        setForm({
          profileImageUrl: data.profileImageUrl ?? "",
          githubUrl: data.githubUrl ?? "",
          linkedinUrl: data.linkedinUrl ?? "",
          twitterUrl: data.twitterUrl ?? "",
          emailAddress: data.emailAddress ?? "",
          footerTagline: data.footerTagline ?? "",
        });
        setLoading(false);
      });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({
      ...prev,
      [e.currentTarget.name]: e.currentTarget.value,
    }));
    setSaved(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? "Something went wrong");
        return;
      }

      setSaved(true);
    } catch {
      setError("Network error – please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 max-w-2xl">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-[var(--color-surface-hover)] dark:bg-[var(--color-surface-hover-dark)] rounded w-48" />
          <div className="h-12 bg-[var(--color-surface-hover)] dark:bg-[var(--color-surface-hover-dark)] rounded" />
          <div className="h-12 bg-[var(--color-surface-hover)] dark:bg-[var(--color-surface-hover-dark)] rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-2xl">
      <h1 className="text-2xl font-bold font-heading mb-2">Site Settings</h1>
      <p className="text-sm text-[var(--color-text-muted)] dark:text-[var(--color-text-muted-dark)] mb-8">
        Manage your profile, social links, and footer settings.
      </p>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Profile */}
        <section>
          <h2 className="text-lg font-semibold font-heading mb-4 flex items-center gap-2">
            <svg
              className="w-5 h-5 text-[var(--color-primary)]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
              />
            </svg>
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
        <section>
          <h2 className="text-lg font-semibold font-heading mb-4 flex items-center gap-2">
            <svg
              className="w-5 h-5 text-[var(--color-primary)]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m9.686-5.781a4.5 4.5 0 00-6.364-6.364L4.5 8.257a4.5 4.5 0 006.364 6.364L13.19 8.688z"
              />
            </svg>
            Social Links
          </h2>
          <div className="space-y-4">
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
          </div>
        </section>

        {/* Contact & Footer */}
        <section>
          <h2 className="text-lg font-semibold font-heading mb-4 flex items-center gap-2">
            <svg
              className="w-5 h-5 text-[var(--color-primary)]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
              />
            </svg>
            Contact & Footer
          </h2>
          <div className="space-y-4">
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
          </div>
        </section>

        {error && (
          <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-sm text-red-600 dark:text-red-400 font-medium">
            {error}
          </div>
        )}

        {saved && (
          <div className="p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-sm text-green-600 dark:text-green-400 font-medium">
            ✓ Settings saved successfully
          </div>
        )}

        <div className="pt-4 border-t border-[var(--color-border)] dark:border-[var(--color-border-dark)]">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 rounded-lg bg-[var(--color-primary)] text-white text-sm font-semibold hover:bg-[var(--color-primary-dark)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            {saving ? "Saving…" : "Save Settings"}
          </button>
        </div>
      </form>
    </div>
  );
}
