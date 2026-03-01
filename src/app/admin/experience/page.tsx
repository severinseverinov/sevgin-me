"use client";

import { useEffect, useState } from "react";
import {
  getExperiences,
  createExperience,
  updateExperience,
  deleteExperience,
} from "@/app/actions/experience";
import Modal from "@/components/ui/Modal";
import toast from "react-hot-toast";
import { Plus } from "lucide-react";

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
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [itemToDelete, setItemToDelete] = useState<ExperienceItem | null>(null);
  const [form, setForm] = useState({
    year: "",
    title: "",
    description: "",
    order: 0,
  });

  const loadItems = async () => {
    try {
      const data = await getExperiences();
      setItems(data);
    } catch {
      toast.error("Failed to load experiences");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadItems();
  }, []);

  const resetForm = () => {
    setForm({ year: "", title: "", description: "", order: items.length });
    setEditingId(null);
    setShowForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const tid = toast.loading(editingId ? "Updating..." : "Creating...");
    try {
      if (editingId) {
        await updateExperience(editingId, form);
        toast.success("Experience updated!", { id: tid });
      } else {
        await createExperience({ ...form, order: Number(form.order) });
        toast.success("Experience added!", { id: tid });
      }
      resetForm();
      loadItems();
    } catch {
      toast.error("Failed to save", { id: tid });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!itemToDelete) return;
    const tid = toast.loading("Deleting...");
    try {
      await deleteExperience(itemToDelete.id);
      toast.success("Experience deleted", { id: tid });
      setItemToDelete(null);
      loadItems();
    } catch {
      toast.error("Failed to delete", { id: tid });
    }
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
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-4xl mb-16 md:mb-0">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold font-heading mb-1">Experience</h1>
          <p className="text-sm text-[var(--color-text-muted)] dark:text-[var(--color-text-muted-dark)]">
            Manage your career timeline on the About page.
          </p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowForm(!showForm);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:opacity-90 transition-opacity text-sm font-medium shadow-lg shadow-[var(--color-primary)]/20"
        >
          <Plus className="w-4 h-4" /> New Entry
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="mb-8 bg-[var(--color-surface)] dark:bg-[var(--color-surface-dark)] border border-[var(--color-border)] dark:border-[var(--color-border-dark)] rounded-xl p-5 space-y-4"
        >
          <h2 className="font-semibold font-heading">
            {editingId ? "Edit Entry" : "New Entry"}
          </h2>
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
          <div className="flex items-center gap-3">
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
              disabled={saving}
              className="mt-5 px-5 py-2 rounded-lg bg-[var(--color-primary)] text-white text-sm font-semibold hover:opacity-90 disabled:opacity-50 transition-opacity cursor-pointer"
            >
              {saving ? "Saving…" : editingId ? "Update" : "Add Entry"}
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="mt-5 px-4 py-2 text-sm hover:bg-black/5 dark:hover:bg-white/5 rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

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
            No experience entries yet. Click &ldquo;New Entry&rdquo; to add your
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
                className="text-sm font-semibold text-[var(--color-primary)] hover:opacity-70 transition-opacity cursor-pointer"
              >
                Edit
              </button>
              <button
                onClick={() => setItemToDelete(item)}
                className="text-sm font-semibold text-red-500 hover:text-red-700 cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      <Modal
        isOpen={!!itemToDelete}
        onClose={() => setItemToDelete(null)}
        title="Delete Entry?"
      >
        <div className="space-y-4">
          <p className="text-sm text-[var(--color-text-muted)] dark:text-[var(--color-text-muted-dark)]">
            Are you sure you want to delete{" "}
            <strong className="text-[var(--color-text)] dark:text-[var(--color-text-dark)]">
              {itemToDelete?.title}
            </strong>
            ? This action cannot be undone.
          </p>
          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={() => setItemToDelete(null)}
              className="px-4 py-2 text-sm font-medium hover:bg-black/5 dark:hover:bg-white/5 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              className="px-4 py-2 text-sm font-medium bg-red-600 text-white hover:bg-red-700 rounded-lg transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
