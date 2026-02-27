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
    <form onSubmit={handleSubmit} className="admin-form">
      <div className="admin-form-field">
        <label htmlFor="title">Title</label>
        <input
          id="title"
          name="title"
          value={form.title}
          onChange={handleChange}
          required
        />
      </div>
      {!isEdit && (
        <div className="admin-form-field">
          <label htmlFor="slug">Slug (URL key)</label>
          <input
            id="slug"
            name="slug"
            value={form.slug}
            onChange={handleChange}
            required
            placeholder="about"
          />
        </div>
      )}
      <div className="admin-form-field">
        <label htmlFor="content">Content (Markdown)</label>
        <textarea
          id="content"
          name="content"
          value={form.content || ""}
          onChange={handleChange}
          rows={12}
        />
      </div>
      <div className="admin-form-check">
        <input
          id="isPublished"
          name="isPublished"
          type="checkbox"
          checked={form.isPublished}
          onChange={handleChange}
        />
        <label htmlFor="isPublished">Published</label>
      </div>

      {error && <p className="admin-form-error">{error}</p>}

      <div className="admin-form-actions">
        <button
          type="submit"
          disabled={loading}
          className="admin-btn admin-btn-primary"
        >
          {loading ? "Saving…" : isEdit ? "Update" : "Create"}
        </button>
        {isEdit && (
          <button
            type="button"
            onClick={handleDelete}
            className="admin-btn admin-btn-danger"
          >
            Delete
          </button>
        )}
        <Link href="/admin/pages" className="admin-btn">
          Cancel
        </Link>
      </div>
    </form>
  );
}
