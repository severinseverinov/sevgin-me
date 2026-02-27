"use client";

import { useEffect, useState } from "react";

type ExperienceItem = {
  id: string;
  year: string;
  title: string;
  description: string;
  order: number;
};

const inputClasses =
  "w-full px-3 py-2 rounded-lg border border-[var(--color-border)] dark:border-[var(--color-border-dark)] bg-[var(--color-bg)] dark:bg-[var(--color-bg-dark)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-shadow";

export default function ExperiencePage() {
  const [items, setItems] = useState<ExperienceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    year: "",
    title: "",
    description: "",
    order: 0,
  });

  const fetchItems = async () => {
    const res = await fetch("/api/experience");
    const data = await res.json();
    setItems(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const resetForm = () => {
    setForm({ year: "", title: "", description: "", order: items.length });
    setEditingId(null);
    setShowForm(false);
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdding(true);

    if (editingId) {
      await fetch(`/api/experience/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    } else {
      await fetch("/api/experience", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    }

    resetForm();
    await fetchItems();
    setAdding(false);
  };

  const startEdit = (item: ExperienceItem) => {
    setEditingId(item.id);
    setForm({
      year: item.year,
      title: item.title,
      description: item.description,
      order: item.order,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this experience entry?")) return;
    await fetch(`/api/experience/${id}`, { method: "DELETE" });
    await fetchItems();
  };

  return (
    <div className="p-8 max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold font-heading mb-1">Experience</h1>
          <p className="text-sm text-[var(--color-text-muted)] dark:text-[var(--color-text-muted-dark)]">
            Manage your career timeline on the About page.
          </p>
        </div>
        <button
          onClick={() => {
            setShowForm(!showForm);
            setEditingId(null);
            setForm({
              year: "",
              title: "",
              description: "",
              order: items.length,
            });
          }}
          className="inline-flex items-center px-4 py-2 rounded-lg bg-[var(--color-primary)] text-white text-sm font-semibold hover:bg-[var(--color-primary-dark)] transition-colors cursor-pointer"
        >
          {showForm ? "Cancel" : "+ New Entry"}
        </button>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <form
          onSubmit={handleAdd}
          className="mb-8 bg-[var(--color-surface)] dark:bg-[var(--color-surface-dark)] border border-[var(--color-border)] dark:border-[var(--color-border-dark)] rounded-xl p-5 space-y-4"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] dark:text-[var(--color-text-muted-dark)] mb-1.5">
                Year / Period
              </label>
              <input
                value={form.year}
                onChange={(e) =>
                  setForm((p) => ({ ...p, year: e.currentTarget.value }))
                }
                placeholder="2024 — Present"
                required
                className={inputClasses}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] dark:text-[var(--color-text-muted-dark)] mb-1.5">
                Job Title
              </label>
              <input
                value={form.title}
                onChange={(e) =>
                  setForm((p) => ({ ...p, title: e.currentTarget.value }))
                }
                placeholder="Full-Stack Developer"
                required
                className={inputClasses}
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] dark:text-[var(--color-text-muted-dark)] mb-1.5">
              Description
            </label>
            <textarea
              value={form.description}
              onChange={(e) =>
                setForm((p) => ({ ...p, description: e.currentTarget.value }))
              }
              rows={3}
              required
              className={inputClasses}
            />
          </div>
          <div className="flex items-end gap-3">
            <div className="w-24">
              <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] dark:text-[var(--color-text-muted-dark)] mb-1.5">
                Order
              </label>
              <input
                type="number"
                value={form.order}
                onChange={(e) =>
                  setForm((p) => ({
                    ...p,
                    order: Number(e.currentTarget.value),
                  }))
                }
                className={inputClasses}
              />
            </div>
            <button
              type="submit"
              disabled={adding}
              className="px-5 py-2 rounded-lg bg-[var(--color-primary)] text-white text-sm font-semibold hover:bg-[var(--color-primary-dark)] disabled:opacity-50 transition-colors cursor-pointer"
            >
              {adding ? "Saving…" : editingId ? "Update" : "Add Entry"}
            </button>
          </div>
        </form>
      )}

      {/* Experience List */}
      <div className="space-y-4">
        {loading && (
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-24 bg-[var(--color-surface-hover)] dark:bg-[var(--color-surface-hover-dark)] rounded-xl"
              />
            ))}
          </div>
        )}
        {!loading && items.length === 0 && (
          <div className="text-center py-12 text-sm text-[var(--color-text-muted)] dark:text-[var(--color-text-muted-dark)]">
            No experience entries yet. Click &quot;+ New Entry&quot; to add your
            first one!
          </div>
        )}
        {items.map((item) => (
          <div
            key={item.id}
            className="bg-[var(--color-surface)] dark:bg-[var(--color-surface-dark)] border border-[var(--color-border)] dark:border-[var(--color-border-dark)] rounded-xl p-5 flex justify-between items-start gap-4"
          >
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <span className="text-xs font-semibold text-[var(--color-primary)] uppercase tracking-wider">
                  {item.year}
                </span>
                <span className="text-xs text-[var(--color-text-muted)] dark:text-[var(--color-text-muted-dark)]">
                  #{item.order}
                </span>
              </div>
              <h3 className="text-base font-bold font-heading mb-1">
                {item.title}
              </h3>
              <p className="text-sm text-[var(--color-text-muted)] dark:text-[var(--color-text-muted-dark)] leading-relaxed">
                {item.description}
              </p>
            </div>
            <div className="flex gap-2 shrink-0">
              <button
                onClick={() => startEdit(item)}
                className="text-sm font-semibold text-[var(--color-primary)] hover:text-[var(--color-primary-dark)] cursor-pointer"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(item.id)}
                className="text-sm font-semibold text-red-500 hover:text-red-700 cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
