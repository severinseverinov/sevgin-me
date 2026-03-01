"use client";

import { useState, useEffect, useCallback } from "react";
import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
} from "@/app/actions/users";
import { getApps, getUsersWithApps, setUserApps } from "@/app/actions/apps";
import { createInvitation } from "@/app/actions/invitations";
import Modal from "@/components/ui/Modal";
import toast from "react-hot-toast";
import { Plus, UserCircle, Mail } from "lucide-react";
import {
  ADMIN_PAGES,
  ROLES,
  DEFAULT_PERMISSIONS,
  parsePermissions,
  roleBadgeClass,
  roleLabel,
  type Role,
  type PermissionKey,
} from "@/lib/permissions";

type UserRow = {
  id: string;
  name: string | null;
  email: string;
  role: string;
  permissions: string;
  updatedAt: Date;
  apps?: { appId: string }[];
};

type AppOption = {
  id: string;
  name: string;
  icon: string | null;
};

const inputClasses =
  "w-full px-3 py-2 rounded-lg border border-[var(--color-border)] dark:border-[var(--color-border-dark)] bg-[var(--color-bg)] dark:bg-[var(--color-bg-dark)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 transition-shadow";

const EMPTY_FORM = {
  name: "",
  email: "",
  password: "",
  role: "EDITOR" as Role,
  permissions: [] as PermissionKey[],
  appIds: [] as string[],
};

export default function UsersPage() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [apps, setApps] = useState<AppOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserRow | null>(null);
  const [userToDelete, setUserToDelete] = useState<UserRow | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteAppIds, setInviteAppIds] = useState<string[]>([]);
  const [inviteSending, setInviteSending] = useState(false);

  const loadData = useCallback(async () => {
    try {
      const [userData, appData] = await Promise.all([
        getUsersWithApps(),
        getApps(),
      ]);
      setUsers(userData as UserRow[]);
      setApps(appData as AppOption[]);
    } catch {
      toast.error("Failed to load users or apps");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // When role changes in form, auto-set default permissions
  const handleRoleChange = (role: Role) => {
    setForm((prev) => ({
      ...prev,
      role,
      permissions: editingUser ? prev.permissions : DEFAULT_PERMISSIONS[role],
    }));
  };

  const togglePermission = (key: PermissionKey) => {
    setForm((prev) => ({
      ...prev,
      permissions: prev.permissions.includes(key)
        ? prev.permissions.filter((p) => p !== key)
        : [...prev.permissions, key],
    }));
  };

  const toggleApp = (id: string) => {
    setForm((prev) => ({
      ...prev,
      appIds: prev.appIds.includes(id)
        ? prev.appIds.filter((appId) => appId !== id)
        : [...prev.appIds, id],
    }));
  };

  const toggleInviteApp = (id: string) => {
    setInviteAppIds((prev) =>
      prev.includes(id) ? prev.filter((appId) => appId !== id) : [...prev, id]
    );
  };

  const handleSendInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    const email = inviteEmail.trim();
    if (!email) {
      toast.error("Email is required");
      return;
    }
    setInviteSending(true);
    const tid = toast.loading("Sending invitation...");
    try {
      await createInvitation(email, inviteAppIds);
      toast.success("Invitation sent! The user will receive an email.", {
        id: tid,
      });
      setIsInviteModalOpen(false);
      setInviteEmail("");
      setInviteAppIds([]);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to send invitation";
      toast.error(msg, { id: tid });
    } finally {
      setInviteSending(false);
    }
  };

  const openCreate = () => {
    setEditingUser(null);
    setForm(EMPTY_FORM);
    setIsModalOpen(true);
  };

  const openEdit = (user: UserRow) => {
    setEditingUser(user);
    setForm({
      name: user.name ?? "",
      email: user.email,
      password: "",
      role: user.role as Role,
      permissions: parsePermissions(user.permissions) as PermissionKey[],
      appIds: user.apps?.map((a) => a.appId) ?? [],
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const tid = toast.loading(
      editingUser ? "Updating user..." : "Creating user...",
    );
    try {
      let userId = editingUser?.id;
      if (editingUser) {
        await updateUser(editingUser.id, form);
      } else {
        if (!form.password) {
          toast.error("Password is required", { id: tid });
          setSaving(false);
          return;
        }
        const newUser = await createUser({ ...form });
        userId = newUser.id;
      }

      // Always update app access if it's not a super admin
      if (form.role !== "SUPER_ADMIN" && userId) {
        await setUserApps(userId, form.appIds);
      }

      toast.success(editingUser ? "User updated!" : "User created!", {
        id: tid,
      });
      setIsModalOpen(false);
      loadData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to save user";
      toast.error(msg, { id: tid });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!userToDelete) return;
    const tid = toast.loading("Deleting...");
    try {
      await deleteUser(userToDelete.id);
      toast.success("User deleted", { id: tid });
      setUserToDelete(null);
      loadData();
    } catch {
      toast.error("Failed to delete user", { id: tid });
    }
  };

  if (loading)
    return (
      <div className="p-8 text-center animate-pulse text-[var(--color-primary)]">
        Loading users...
      </div>
    );

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-5xl mb-16 md:mb-0 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-heading">
            Users & Permissions
          </h1>
          <p className="text-sm text-[var(--color-text-muted)] dark:text-[var(--color-text-muted-dark)] mt-1">
            Manage who can access the admin panel and what they can do.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setInviteEmail("");
              setInviteAppIds([]);
              setIsInviteModalOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2 border border-[var(--color-primary)] text-[var(--color-primary)] rounded-lg hover:bg-[var(--color-primary)]/10 transition-colors text-sm font-medium"
          >
            <Mail className="w-4 h-4" /> Invite by email
          </button>
          <button
            onClick={openCreate}
            className="flex items-center gap-2 px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:opacity-90 transition-opacity text-sm font-medium shadow-lg shadow-[var(--color-primary)]/20"
          >
            <Plus className="w-4 h-4" /> New User
          </button>
        </div>
      </div>

      {/* Invite by email modal */}
      <Modal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        title="Invite by email"
      >
        <form onSubmit={handleSendInvite} className="space-y-4">
          <p className="text-sm text-[var(--color-text-muted)] dark:text-[var(--color-text-muted-dark)]">
            The user will receive an email with a link to set their password.
            Choose which apps they can access after signing up. You can change
            app access later from Edit User.
          </p>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] dark:text-[var(--color-text-muted-dark)] mb-1.5">
              Email *
            </label>
            <input
              className={inputClasses}
              type="email"
              required
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              placeholder="user@example.com"
            />
          </div>
          {apps.length > 0 && (
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] dark:text-[var(--color-text-muted-dark)] mb-2">
                App access
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {apps.map((app) => {
                  const checked = inviteAppIds.includes(app.id);
                  return (
                    <button
                      key={app.id}
                      type="button"
                      onClick={() => toggleInviteApp(app.id)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-medium transition-all text-left ${
                        checked
                          ? "bg-emerald-500/8 border-emerald-500/40 text-emerald-600 dark:text-emerald-400"
                          : "bg-transparent border-[var(--color-border)] dark:border-[var(--color-border-dark)] hover:border-emerald-500/30"
                      }`}
                    >
                      <span
                        className={`w-3.5 h-3.5 rounded flex items-center justify-center shrink-0 border ${checked ? "bg-emerald-500 border-emerald-500" : "border-current opacity-40"}`}
                      >
                        {checked && (
                          <svg
                            className="w-2.5 h-2.5 text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={3}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        )}
                      </span>
                      <span className="truncate flex-1">
                        {app.icon && <span className="mr-1.5">{app.icon}</span>}
                        {app.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsInviteModalOpen(false)}
              className="px-4 py-2 text-sm hover:bg-black/5 dark:hover:bg-white/5 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={inviteSending}
              className="px-4 py-2 text-sm font-medium bg-[var(--color-primary)] text-white hover:opacity-90 rounded-lg transition-opacity disabled:opacity-50"
            >
              {inviteSending ? "Sending…" : "Send invitation"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Users Table */}
      <div className="w-full overflow-x-auto rounded-xl border border-[var(--color-border)] dark:border-[var(--color-border-dark)] bg-[var(--color-surface)] dark:bg-[var(--color-surface-dark)] shadow-sm">
        <table className="w-full text-sm text-left">
          <thead className="border-b border-[var(--color-border)] dark:border-[var(--color-border-dark)] bg-[var(--color-surface-hover)] dark:bg-[#1a1d21]">
            <tr>
              {["User", "Role", "Permissions", "Last Updated", ""].map(
                (h, i) => (
                  <th
                    key={i}
                    className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] dark:text-[var(--color-text-muted-dark)]"
                  >
                    {h}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-border)] dark:divide-[var(--color-border-dark)]">
            {users.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="px-5 py-10 text-center text-sm text-[var(--color-text-muted)] dark:text-[var(--color-text-muted-dark)]"
                >
                  No users yet.
                </td>
              </tr>
            )}
            {users.map((user) => (
              <tr
                key={user.id}
                className="hover:bg-black/[0.01] dark:hover:bg-white/[0.01] transition-colors"
              >
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center text-[var(--color-primary)] shrink-0">
                      <UserCircle className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{user.name ?? "—"}</p>
                      <p className="text-xs text-[var(--color-text-muted)] dark:text-[var(--color-text-muted-dark)]">
                        {user.email}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${roleBadgeClass(user.role)}`}
                  >
                    {roleLabel(user.role)}
                  </span>
                </td>
                <td className="px-5 py-4">
                  {user.role === "SUPER_ADMIN" ? (
                    <span className="text-xs text-[var(--color-text-muted)] dark:text-[var(--color-text-muted-dark)]">
                      All pages
                    </span>
                  ) : (
                    <div className="flex flex-wrap gap-1">
                      {parsePermissions(user.permissions).length === 0 ? (
                        <span className="text-xs text-[var(--color-text-muted)] dark:text-[var(--color-text-muted-dark)]">
                          None
                        </span>
                      ) : (
                        parsePermissions(user.permissions).map((p) => (
                          <span
                            key={p}
                            className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-[var(--color-primary)]/8 text-[var(--color-primary)] capitalize"
                          >
                            {p}
                          </span>
                        ))
                      )}
                    </div>
                  )}
                </td>
                <td className="px-5 py-4 text-xs text-[var(--color-text-muted)] dark:text-[var(--color-text-muted-dark)] whitespace-nowrap">
                  {new Date(user.updatedAt).toLocaleDateString()}
                </td>
                <td className="px-5 py-4 text-right whitespace-nowrap">
                  <div className="flex items-center justify-end gap-3">
                    <button
                      onClick={() => openEdit(user)}
                      className="text-sm font-semibold text-[var(--color-primary)] hover:opacity-70 transition-opacity"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => setUserToDelete(user)}
                      className="text-sm font-semibold text-red-500 hover:text-red-700"
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
        title={editingUser ? "Edit User" : "New User"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] dark:text-[var(--color-text-muted-dark)] mb-1.5">
                Full Name
              </label>
              <input
                className={inputClasses}
                value={form.name}
                onChange={(e) =>
                  setForm((p) => ({ ...p, name: e.currentTarget.value }))
                }
                placeholder="Jane Doe"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] dark:text-[var(--color-text-muted-dark)] mb-1.5">
                Email *
              </label>
              <input
                className={inputClasses}
                type="email"
                required
                value={form.email}
                onChange={(e) =>
                  setForm((p) => ({ ...p, email: e.currentTarget.value }))
                }
                placeholder="jane@example.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] dark:text-[var(--color-text-muted-dark)] mb-1.5">
              Password{" "}
              {editingUser && (
                <span className="normal-case font-normal opacity-60">
                  (leave blank to keep current)
                </span>
              )}
            </label>
            <input
              className={inputClasses}
              type="password"
              value={form.password}
              onChange={(e) =>
                setForm((p) => ({ ...p, password: e.currentTarget.value }))
              }
              placeholder={editingUser ? "••••••••" : "Min 8 characters"}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] dark:text-[var(--color-text-muted-dark)] mb-1.5">
              Role *
            </label>
            <div className="flex gap-2 flex-wrap">
              {ROLES.map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => handleRoleChange(r)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                    form.role === r
                      ? "bg-[var(--color-primary)] border-[var(--color-primary)] text-white"
                      : "bg-transparent border-[var(--color-border)] dark:border-[var(--color-border-dark)] hover:border-[var(--color-primary)]/50"
                  }`}
                >
                  {roleLabel(r)}
                </button>
              ))}
            </div>
          </div>

          {/* Permission Grid — hidden for SUPER_ADMIN */}
          {form.role !== "SUPER_ADMIN" && (
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] dark:text-[var(--color-text-muted-dark)] mb-2">
                Page Access
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {ADMIN_PAGES.map((page) => {
                  const checked = form.permissions.includes(page.key);
                  return (
                    <button
                      key={page.key}
                      type="button"
                      onClick={() => togglePermission(page.key)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-medium transition-all text-left ${
                        checked
                          ? "bg-[var(--color-primary)]/8 border-[var(--color-primary)]/40 text-[var(--color-primary)]"
                          : "bg-transparent border-[var(--color-border)] dark:border-[var(--color-border-dark)] hover:border-[var(--color-primary)]/30"
                      }`}
                    >
                      <span
                        className={`w-3.5 h-3.5 rounded flex items-center justify-center shrink-0 border ${checked ? "bg-[var(--color-primary)] border-[var(--color-primary)]" : "border-current opacity-40"}`}
                      >
                        {checked && (
                          <svg
                            className="w-2.5 h-2.5 text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={3}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        )}
                      </span>
                      {page.label}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {form.role === "SUPER_ADMIN" && (
            <div className="p-3 rounded-xl bg-[var(--color-primary)]/5 border border-[var(--color-primary)]/20 text-xs text-[var(--color-primary)]">
              ✓ Super Admin has access to all admin pages and all portal apps by
              default.
            </div>
          )}

          {/* App Access Grid — hidden for SUPER_ADMIN */}
          {form.role !== "SUPER_ADMIN" && apps.length > 0 && (
            <div className="pt-2 border-t border-[var(--color-border)] dark:border-[var(--color-border-dark)]">
              <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] dark:text-[var(--color-text-muted-dark)] mb-2">
                User Portal: App Access
                <span className="block text-[10px] normal-case opacity-60 font-normal">
                  Toggle apps this user can see in their portal dashboard.
                </span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {apps.map((app) => {
                  const checked = form.appIds.includes(app.id);
                  return (
                    <button
                      key={app.id}
                      type="button"
                      onClick={() => toggleApp(app.id)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-medium transition-all text-left ${
                        checked
                          ? "bg-emerald-500/8 border-emerald-500/40 text-emerald-600 dark:text-emerald-400"
                          : "bg-transparent border-[var(--color-border)] dark:border-[var(--color-border-dark)] hover:border-emerald-500/30"
                      }`}
                    >
                      <span
                        className={`w-3.5 h-3.5 rounded flex items-center justify-center shrink-0 border ${checked ? "bg-emerald-500 border-emerald-500" : "border-current opacity-40"}`}
                      >
                        {checked && (
                          <svg
                            className="w-2.5 h-2.5 text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={3}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        )}
                      </span>
                      <span className="truncate flex-1">
                        {app.icon && <span className="mr-1.5">{app.icon}</span>}
                        {app.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-sm hover:bg-black/5 dark:hover:bg-white/5 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 text-sm font-medium bg-[var(--color-primary)] text-white hover:opacity-90 rounded-lg transition-opacity disabled:opacity-50"
            >
              {saving
                ? "Saving..."
                : editingUser
                  ? "Update User"
                  : "Create User"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <Modal
        isOpen={!!userToDelete}
        onClose={() => setUserToDelete(null)}
        title="Delete User?"
      >
        <div className="space-y-4">
          <p className="text-sm text-[var(--color-text-muted)] dark:text-[var(--color-text-muted-dark)]">
            Are you sure you want to delete{" "}
            <strong className="text-[var(--color-text)] dark:text-[var(--color-text-dark)]">
              {userToDelete?.name ?? userToDelete?.email}
            </strong>
            ? This cannot be undone.
          </p>
          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={() => setUserToDelete(null)}
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
