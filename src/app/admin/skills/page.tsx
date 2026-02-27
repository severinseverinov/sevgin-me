"use client";

import { useEffect, useState } from "react";

type Skill = {
  id: string;
  name: string;
  category: string;
  order: number;
};

const categories = [
  { value: "language", label: "Language" },
  { value: "frontend", label: "Frontend" },
  { value: "backend", label: "Backend" },
  { value: "database", label: "Database" },
  { value: "devops", label: "DevOps" },
];

const categoryBadge: Record<string, string> = {
  language: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
  frontend: "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300",
  backend:
    "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
  database: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300",
  devops:
    "bg-slate-100 text-slate-700 dark:bg-slate-800/50 dark:text-slate-300",
};

const inputClasses =
  "w-full px-3 py-2 rounded-lg border border-[var(--color-border)] dark:border-[var(--color-border-dark)] bg-[var(--color-bg)] dark:bg-[var(--color-bg-dark)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-shadow";

const selectClasses =
  "px-3 py-2 rounded-lg border border-[var(--color-border)] dark:border-[var(--color-border-dark)] bg-[var(--color-bg)] dark:bg-[var(--color-bg-dark)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent";

export default function SkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [newName, setNewName] = useState("");
  const [newCategory, setNewCategory] = useState("language");
  const [newOrder, setNewOrder] = useState(0);
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    name: "",
    category: "",
    order: 0,
  });

  const fetchSkills = async () => {
    const res = await fetch("/api/skills");
    const data = await res.json();
    setSkills(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    setAdding(true);

    await fetch("/api/skills", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: newName,
        category: newCategory,
        order: newOrder,
      }),
    });

    setNewName("");
    setNewOrder(skills.length);
    await fetchSkills();
    setAdding(false);
  };

  const startEdit = (skill: Skill) => {
    setEditingId(skill.id);
    setEditForm({
      name: skill.name,
      category: skill.category,
      order: skill.order,
    });
  };

  const handleUpdate = async (id: string) => {
    await fetch(`/api/skills/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editForm),
    });
    setEditingId(null);
    await fetchSkills();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this skill?")) return;
    await fetch(`/api/skills/${id}`, { method: "DELETE" });
    await fetchSkills();
  };

  return (
    <div className="p-8 max-w-4xl">
      <h1 className="text-2xl font-bold font-heading mb-2">Skills</h1>
      <p className="text-sm text-[var(--color-text-muted)] dark:text-[var(--color-text-muted-dark)] mb-8">
        Manage the skills displayed on your About page.
      </p>

      {/* Add Skill Form */}
      <form
        onSubmit={handleAdd}
        className="flex items-end gap-3 mb-8 bg-[var(--color-surface)] dark:bg-[var(--color-surface-dark)] border border-[var(--color-border)] dark:border-[var(--color-border-dark)] rounded-xl p-5"
      >
        <div className="flex-1">
          <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] dark:text-[var(--color-text-muted-dark)] mb-1.5">
            Name
          </label>
          <input
            value={newName}
            onChange={(e) => setNewName(e.currentTarget.value)}
            placeholder="e.g. React"
            required
            className={inputClasses}
          />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] dark:text-[var(--color-text-muted-dark)] mb-1.5">
            Category
          </label>
          <select
            value={newCategory}
            onChange={(e) => setNewCategory(e.currentTarget.value)}
            className={selectClasses}
          >
            {categories.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </div>
        <div className="w-20">
          <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] dark:text-[var(--color-text-muted-dark)] mb-1.5">
            Order
          </label>
          <input
            type="number"
            value={newOrder}
            onChange={(e) => setNewOrder(Number(e.currentTarget.value))}
            className={inputClasses}
          />
        </div>
        <button
          type="submit"
          disabled={adding}
          className="px-5 py-2 rounded-lg bg-[var(--color-primary)] text-white text-sm font-semibold hover:bg-[var(--color-primary-dark)] disabled:opacity-50 transition-colors cursor-pointer whitespace-nowrap"
        >
          {adding ? "Adding…" : "+ Add"}
        </button>
      </form>

      {/* Skills Table */}
      <div className="bg-[var(--color-surface)] dark:bg-[var(--color-surface-dark)] border border-[var(--color-border)] dark:border-[var(--color-border-dark)] rounded-xl overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-[var(--color-border)] dark:border-[var(--color-border-dark)]">
              <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] dark:text-[var(--color-text-muted-dark)]">
                Name
              </th>
              <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] dark:text-[var(--color-text-muted-dark)]">
                Category
              </th>
              <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] dark:text-[var(--color-text-muted-dark)]">
                Order
              </th>
              <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] dark:text-[var(--color-text-muted-dark)]">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-border)] dark:divide-[var(--color-border-dark)]">
            {loading && (
              <tr>
                <td
                  colSpan={4}
                  className="px-5 py-8 text-center text-sm text-[var(--color-text-muted)] dark:text-[var(--color-text-muted-dark)]"
                >
                  Loading…
                </td>
              </tr>
            )}
            {!loading && skills.length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  className="px-5 py-8 text-center text-sm text-[var(--color-text-muted)] dark:text-[var(--color-text-muted-dark)]"
                >
                  No skills yet. Add your first skill above!
                </td>
              </tr>
            )}
            {skills.map((skill) => (
              <tr
                key={skill.id}
                className="hover:bg-[var(--color-surface-hover)] dark:hover:bg-[var(--color-surface-hover-dark)] transition-colors"
              >
                {editingId === skill.id ? (
                  <>
                    <td className="px-5 py-3">
                      <input
                        value={editForm.name}
                        onChange={(e) =>
                          setEditForm((p) => ({
                            ...p,
                            name: e.currentTarget.value,
                          }))
                        }
                        className={inputClasses}
                      />
                    </td>
                    <td className="px-5 py-3">
                      <select
                        value={editForm.category}
                        onChange={(e) =>
                          setEditForm((p) => ({
                            ...p,
                            category: e.currentTarget.value,
                          }))
                        }
                        className={selectClasses}
                      >
                        {categories.map((c) => (
                          <option key={c.value} value={c.value}>
                            {c.label}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-5 py-3">
                      <input
                        type="number"
                        value={editForm.order}
                        onChange={(e) =>
                          setEditForm((p) => ({
                            ...p,
                            order: Number(e.currentTarget.value),
                          }))
                        }
                        className={inputClasses + " w-20"}
                      />
                    </td>
                    <td className="px-5 py-3 flex gap-2">
                      <button
                        onClick={() => handleUpdate(skill.id)}
                        className="text-sm font-semibold text-[var(--color-primary)] hover:text-[var(--color-primary-dark)] cursor-pointer"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="text-sm font-semibold text-[var(--color-text-muted)] hover:text-[var(--color-text)] cursor-pointer"
                      >
                        Cancel
                      </button>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="px-5 py-3.5 text-sm font-medium">
                      {skill.name}
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${categoryBadge[skill.category] ?? "bg-slate-100 text-slate-600"}`}
                      >
                        {skill.category}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-sm">{skill.order}</td>
                    <td className="px-5 py-3.5 flex gap-3">
                      <button
                        onClick={() => startEdit(skill)}
                        className="text-sm font-semibold text-[var(--color-primary)] hover:text-[var(--color-primary-dark)] cursor-pointer"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(skill.id)}
                        className="text-sm font-semibold text-red-500 hover:text-red-700 cursor-pointer"
                      >
                        Delete
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
