"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type FormFields = {
  title: string;
  slug: string;
  content: string | null;
  isPublished: boolean;
};

type Props = {
  initialData?: Partial<FormFields> & { id?: string; slugKey?: string };
};

const inputClasses =
  "w-full px-4 py-2.5 rounded-lg border border-[var(--color-border)] dark:border-[var(--color-border-dark)] bg-[var(--color-bg)] dark:bg-[var(--color-bg-dark)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-shadow";

export default function PageForm({ initialData }: Props) {
  const router = useRouter();
  const isEdit = !!initialData?.id;

  const [form, setForm] = useState<FormFields>({
    title: initialData?.title ?? "",
    slug: initialData?.slug ?? initialData?.slugKey ?? "",
    content: initialData?.content ?? "",
    isPublished: initialData?.isPublished ?? true,
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value, type } = e.currentTarget;
    setForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? (e.currentTarget as HTMLInputElement).checked
          : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const url = isEdit ? `/api/pages/${initialData!.slugKey}` : "/api/pages";
    const method = isEdit ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? "Something went wrong");
        return;
      }
      router.push("/admin/pages");
      router.refresh();
    } catch {
      setError("Network error – please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Delete this page?")) return;
    await fetch(`/api/pages/${initialData!.slugKey}`, { method: "DELETE" });
    router.push("/admin/pages");
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-w-2xl">
      <div>
        <label htmlFor="title" className="block text-sm font-medium mb-1.5">
          Title
        </label>
        <input
          id="title"
          name="title"
          value={form.title}
          onChange={handleChange}
          required
          className={inputClasses}
        />
      </div>

      {!isEdit && (
        <div>
          <label htmlFor="slug" className="block text-sm font-medium mb-1.5">
            Slug (URL key)
          </label>
          <input
            id="slug"
            name="slug"
            value={form.slug}
            onChange={handleChange}
            required
            placeholder="about"
            className={inputClasses}
          />
        </div>
      )}

      <div>
        <label htmlFor="content" className="block text-sm font-medium mb-1.5">
          Content (Markdown)
        </label>
        <textarea
          id="content"
          name="content"
          value={form.content || ""}
          onChange={handleChange}
          rows={12}
          className={inputClasses}
        />
      </div>

      <div className="flex items-center gap-3">
        <input
          id="isPublished"
          name="isPublished"
          type="checkbox"
          checked={form.isPublished}
          onChange={handleChange}
          className="w-4 h-4 rounded border-[var(--color-border)] text-[var(--color-primary)] focus:ring-[var(--color-primary)] cursor-pointer"
        />
        <label
          htmlFor="isPublished"
          className="text-sm font-medium cursor-pointer"
        >
          Published
        </label>
      </div>

      {error && (
        <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-sm text-red-600 dark:text-red-400 font-medium">
          {error}
        </div>
      )}

      <div className="flex items-center gap-3 pt-4 border-t border-[var(--color-border)] dark:border-[var(--color-border-dark)]">
        <button
          type="submit"
          disabled={loading}
          className="px-5 py-2.5 rounded-lg bg-[var(--color-primary)] text-white text-sm font-semibold hover:bg-[var(--color-primary-dark)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
        >
          {loading ? "Saving…" : isEdit ? "Update" : "Create"}
        </button>
        {isEdit && (
          <button
            type="button"
            onClick={handleDelete}
            className="px-5 py-2.5 rounded-lg border border-red-300 dark:border-red-800 text-sm font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors cursor-pointer"
          >
            Delete
          </button>
        )}
        <Link
          href="/admin/pages"
          className="px-5 py-2.5 rounded-lg border border-[var(--color-border)] dark:border-[var(--color-border-dark)] text-sm font-semibold hover:bg-[var(--color-surface-hover)] dark:hover:bg-[var(--color-surface-hover-dark)] transition-colors"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
