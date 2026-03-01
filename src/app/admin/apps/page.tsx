"use client";

import { useState, useEffect, useCallback } from "react";
import { getApps, createApp, updateApp, deleteApp } from "@/app/actions/apps";
import Modal from "@/components/ui/Modal";
import toast from "react-hot-toast";
import { Plus } from "lucide-react";

type AppRow = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  icon?: string | null;
  type: string;
  url?: string | null;
  color?: string | null;
  isPublished: boolean;
  order: number;
};

const EMPTY_FORM = {
  name: "",
  slug: "",
  description: "",
  icon: "🚀",
  type: "internal",
  url: "",
  color: "#0D9488",
  isPublished: true,
  order: 0,
};

const PRESET_COLORS = [
  "#0D9488",
  "#3B82F6",
  "#8B5CF6",
  "#EC4899",
  "#F59E0B",
  "#10B981",
  "#EF4444",
  "#06B6D4",
];
const PRESET_ICONS = [
  "🚀",
  "📊",
  "🗂️",
  "💬",
  "📝",
  "🔧",
  "🎯",
  "📱",
  "🌐",
  "🔒",
  "⚡",
  "📂",
];

const inputCls =
  "w-full px-3 py-2 rounded-lg border border-[var(--color-border)] dark:border-[var(--color-border-dark)] bg-[var(--color-bg)] dark:bg-[var(--color-bg-dark)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 transition-shadow";

export default function AdminAppsPage() {
  const [apps, setApps] = useState<AppRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingApp, setEditingApp] = useState<AppRow | null>(null);
  const [appToDelete, setAppToDelete] = useState<AppRow | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);

  const load = useCallback(async () => {
    try {
      setApps((await getApps()) as AppRow[]);
    } catch {
      toast.error("Failed to load apps");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const openCreate = () => {
    setEditingApp(null);
    setForm(EMPTY_FORM);
    setIsModalOpen(true);
  };

  const openEdit = (app: AppRow) => {
    setEditingApp(app);
    setForm({
      name: app.name,
      slug: app.slug,
      description: app.description ?? "",
      icon: app.icon ?? "🚀",
      type: app.type,
      url: app.url ?? "",
      color: app.color ?? "#0D9488",
      isPublished: app.isPublished,
      order: app.order,
    });
    setIsModalOpen(true);
  };

  // Auto-generate slug from name
  const handleNameChange = (name: string) => {
    const slug = name
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");
    setForm((p) => ({ ...p, name, ...(!editingApp ? { slug } : {}) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const tid = toast.loading(editingApp ? "Updating..." : "Creating...");
    try {
      if (editingApp) {
        await updateApp(editingApp.id, form);
        toast.success("App updated!", { id: tid });
      } else {
        await createApp({
          ...form,
          description: form.description || undefined,
          url: form.url || undefined,
        });
        toast.success("App created!", { id: tid });
      }
      setIsModalOpen(false);
      load();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed", { id: tid });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!appToDelete) return;
    const tid = toast.loading("Deleting...");
    try {
      await deleteApp(appToDelete.id);
      toast.success("App deleted", { id: tid });
      setAppToDelete(null);
      load();
    } catch {
      toast.error("Failed to delete", { id: tid });
    }
  };

  if (loading)
    return (
      <div className="p-8 text-center animate-pulse text-[var(--color-primary)]">
        Loading apps...
      </div>
    );

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-5xl mb-16 md:mb-0 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-heading">Applications</h1>
          <p className="text-sm text-[var(--color-text-muted)] dark:text-[var(--color-text-muted-dark)] mt-1">
            Create and manage apps. Assign them to users in the Users page.
          </p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:opacity-90 transition-opacity text-sm font-medium shadow-lg shadow-[var(--color-primary)]/20 cursor-pointer"
        >
          <Plus className="w-4 h-4" /> New App
        </button>
      </div>

      {/* Apps table */}
      <div className="w-full overflow-x-auto rounded-xl border border-[var(--color-border)] dark:border-[var(--color-border-dark)] bg-[var(--color-surface)] dark:bg-[var(--color-surface-dark)] shadow-sm">
        <table className="w-full text-sm text-left">
          <thead className="border-b border-[var(--color-border)] dark:border-[var(--color-border-dark)] bg-[var(--color-surface-hover)] dark:bg-[#1a1d21]">
            <tr>
              {["App", "Type", "URL / Path", "Status", ""].map((h, i) => (
                <th
                  key={i}
                  className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] dark:text-[var(--color-text-muted-dark)]"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-border)] dark:divide-[var(--color-border-dark)]">
            {apps.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="px-5 py-10 text-center text-sm text-[var(--color-text-muted)] dark:text-[var(--color-text-muted-dark)]"
                >
                  No apps yet. Create your first one!
                </td>
              </tr>
            )}
            {apps.map((app) => (
              <tr
                key={app.id}
                className="hover:bg-black/[0.01] dark:hover:bg-white/[0.01] transition-colors"
              >
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-lg shrink-0"
                      style={{ background: `${app.color ?? "#0D9488"}18` }}
                    >
                      {app.icon ?? "🚀"}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{app.name}</p>
                      <p className="text-xs text-[var(--color-text-muted)] dark:text-[var(--color-text-muted-dark)]">
                        {app.slug}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                      app.type === "internal"
                        ? "bg-[var(--color-primary)]/10 text-[var(--color-primary)]"
                        : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                    }`}
                  >
                    {app.type === "internal" ? "Internal" : "External"}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <span className="text-xs font-mono text-[var(--color-text-muted)] dark:text-[var(--color-text-muted-dark)] truncate max-w-[200px] block">
                    {app.type === "internal"
                      ? `/portal/apps/${app.slug}`
                      : (app.url ?? "—")}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                      app.isPublished
                        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                        : "bg-slate-100 text-slate-600 dark:bg-slate-800/50 dark:text-slate-400"
                    }`}
                  >
                    {app.isPublished ? "Published" : "Hidden"}
                  </span>
                </td>
                <td className="px-5 py-4 text-right whitespace-nowrap">
                  <div className="flex items-center justify-end gap-3">
                    <button
                      onClick={() => openEdit(app)}
                      className="text-sm font-semibold text-[var(--color-primary)] hover:opacity-70 transition-opacity cursor-pointer"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => setAppToDelete(app)}
                      className="text-sm font-semibold text-red-500 hover:text-red-700 cursor-pointer"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Create / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingApp ? "Edit App" : "New App"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name + Slug */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] dark:text-[var(--color-text-muted-dark)] mb-1.5">
                Name *
              </label>
              <input
                required
                className={inputCls}
                value={form.name}
                onChange={(e) => handleNameChange(e.currentTarget.value)}
                placeholder="My Tool"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] dark:text-[var(--color-text-muted-dark)] mb-1.5">
                Slug *
              </label>
              <input
                required
                className={inputCls}
                value={form.slug}
                onChange={(e) =>
                  setForm((p) => ({ ...p, slug: e.currentTarget.value }))
                }
                placeholder="my-tool"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] dark:text-[var(--color-text-muted-dark)] mb-1.5">
              Description
            </label>
            <input
              className={inputCls}
              value={form.description}
              onChange={(e) =>
                setForm((p) => ({ ...p, description: e.currentTarget.value }))
              }
              placeholder="What does this app do?"
            />
          </div>

          {/* Icon picker */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] dark:text-[var(--color-text-muted-dark)] mb-1.5">
              Icon (emoji)
            </label>
            <div className="flex items-center gap-2">
              <input
                className={`${inputCls} w-20 text-center text-lg`}
                value={form.icon}
                onChange={(e) =>
                  setForm((p) => ({ ...p, icon: e.currentTarget.value }))
                }
                maxLength={2}
              />
              <div className="flex gap-1 flex-wrap">
                {PRESET_ICONS.map((ic) => (
                  <button
                    key={ic}
                    type="button"
                    onClick={() => setForm((p) => ({ ...p, icon: ic }))}
                    className={`w-8 h-8 rounded-lg text-base flex items-center justify-center transition-all cursor-pointer ${form.icon === ic ? "bg-[var(--color-primary)]/15 ring-1 ring-[var(--color-primary)]" : "hover:bg-[var(--color-surface-hover)] dark:hover:bg-[var(--color-surface-hover-dark)]"}`}
                  >
                    {ic}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Color picker */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] dark:text-[var(--color-text-muted-dark)] mb-1.5">
              Accent Color
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                className="w-9 h-9 rounded-lg border border-[var(--color-border)] dark:border-[var(--color-border-dark)] cursor-pointer"
                value={form.color}
                onChange={(e) =>
                  setForm((p) => ({ ...p, color: e.currentTarget.value }))
                }
              />
              <div className="flex gap-1.5">
                {PRESET_COLORS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setForm((p) => ({ ...p, color: c }))}
                    className={`w-6 h-6 rounded-full border-2 transition-all cursor-pointer ${form.color === c ? "border-white scale-110" : "border-transparent"}`}
                    style={{ background: c }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Type + URL */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] dark:text-[var(--color-text-muted-dark)] mb-1.5">
              Type
            </label>
            <div className="flex gap-2">
              {["internal", "external"].map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setForm((p) => ({ ...p, type: t }))}
                  className={`px-4 py-1.5 rounded-lg text-xs font-semibold border transition-all capitalize cursor-pointer ${form.type === t ? "bg-[var(--color-primary)] border-[var(--color-primary)] text-white" : "border-[var(--color-border)] dark:border-[var(--color-border-dark)]"}`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {form.type === "external" && (
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] dark:text-[var(--color-text-muted-dark)] mb-1.5">
                External URL *
              </label>
              <input
                required
                className={inputCls}
                value={form.url}
                onChange={(e) =>
                  setForm((p) => ({ ...p, url: e.currentTarget.value }))
                }
                placeholder="https://app.example.com"
              />
            </div>
          )}

          {/* Options row */}
          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 cursor-pointer text-sm">
              <input
                type="checkbox"
                className="w-4 h-4 accent-[var(--color-primary)]"
                checked={form.isPublished}
                onChange={(e) =>
                  setForm((p) => ({
                    ...p,
                    isPublished: e.currentTarget.checked,
                  }))
                }
              />
              Published (visible to users)
            </label>
            <div className="flex items-center gap-2">
              <label className="text-xs text-[var(--color-text-muted)] dark:text-[var(--color-text-muted-dark)]">
                Order
              </label>
              <input
                type="number"
                className={`${inputCls} w-16`}
                value={form.order}
                onChange={(e) =>
                  setForm((p) => ({
                    ...p,
                    order: Number(e.currentTarget.value),
                  }))
                }
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-sm hover:bg-black/5 dark:hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 text-sm font-medium bg-[var(--color-primary)] text-white hover:opacity-90 rounded-lg transition-opacity disabled:opacity-50 cursor-pointer"
            >
              {saving ? "Saving..." : editingApp ? "Update" : "Create App"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete modal */}
      <Modal
        isOpen={!!appToDelete}
        onClose={() => setAppToDelete(null)}
        title="Delete App?"
      >
        <div className="space-y-4">
          <p className="text-sm text-[var(--color-text-muted)] dark:text-[var(--color-text-muted-dark)]">
            Are you sure you want to delete{" "}
            <strong className="text-[var(--color-text)] dark:text-[var(--color-text-dark)]">
              {appToDelete?.name}
            </strong>
            ? All user assignments will also be removed.
          </p>
          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={() => setAppToDelete(null)}
              className="px-4 py-2 text-sm font-medium hover:bg-black/5 dark:hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              className="px-4 py-2 text-sm font-medium bg-red-600 text-white hover:bg-red-700 rounded-lg transition-colors cursor-pointer"
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
