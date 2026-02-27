"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type FormFields = {
  title: string;
  slug: string;
  description: string;
  content: string | null;
  imageUrl: string | null;
  link: string | null;
  tags: string;
  isPublished: boolean;
  order: number;
};

type Props = {
  initialData?: Partial<FormFields> & { id?: string };
};

export default function PortfolioForm({ initialData }: Props) {
  const router = useRouter();
  const isEdit = !!initialData?.id;

  const [form, setForm] = useState<FormFields>({
    title: initialData?.title ?? "",
    slug: initialData?.slug ?? "",
    description: initialData?.description ?? "",
    content: initialData?.content ?? "",
    imageUrl: initialData?.imageUrl ?? "",
    link: initialData?.link ?? "",
    tags: initialData?.tags ?? "",
    isPublished: initialData?.isPublished ?? false,
    order: initialData?.order ?? 0,
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

    const url = isEdit ? `/api/portfolio/${initialData!.id}` : "/api/portfolio";
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

      router.push("/admin/portfolio");
      router.refresh();
    } catch {
      setError("Network error – please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this item?")) return;
    await fetch(`/api/portfolio/${initialData!.id}`, { method: "DELETE" });
    router.push("/admin/portfolio");
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
      <div className="admin-form-field">
        <label htmlFor="slug">Slug</label>
        <input
          id="slug"
          name="slug"
          value={form.slug}
          onChange={handleChange}
          required
          placeholder="my-project"
        />
      </div>
      <div className="admin-form-field">
        <label htmlFor="description">Short Description</label>
        <textarea
          id="description"
          name="description"
          value={form.description}
          onChange={handleChange}
          required
          rows={3}
        />
      </div>
      <div className="admin-form-field">
        <label htmlFor="content">Full Content (Markdown)</label>
        <textarea
          id="content"
          name="content"
          value={form.content || ""}
          onChange={handleChange}
          rows={8}
        />
      </div>
      <div className="admin-form-field">
        <label htmlFor="imageUrl">Image URL</label>
        <input
          id="imageUrl"
          name="imageUrl"
          value={form.imageUrl || ""}
          onChange={handleChange}
          type="url"
        />
      </div>
      <div className="admin-form-field">
        <label htmlFor="link">Project Link</label>
        <input
          id="link"
          name="link"
          value={form.link || ""}
          onChange={handleChange}
          type="url"
        />
      </div>
      <div className="admin-form-field">
        <label htmlFor="tags">Tags (comma separated)</label>
        <input
          id="tags"
          name="tags"
          value={form.tags}
          onChange={handleChange}
          placeholder="React, TypeScript, Next.js"
        />
      </div>
      <div className="admin-form-field">
        <label htmlFor="order">Display Order</label>
        <input
          id="order"
          name="order"
          type="number"
          value={form.order}
          onChange={handleChange}
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
        <label htmlFor="isPublished">Published (visible on public site)</label>
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
        <a href="/admin/portfolio" className="admin-btn">
          Cancel
        </a>
      </div>
    </form>
  );
}
