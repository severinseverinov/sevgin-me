"use client";

import { useEffect, useState } from "react";
import { getMyProfile, updateMyProfile } from "@/app/actions/profile";
import toast from "react-hot-toast";
import { Shield } from "lucide-react";

const inputClasses =
  "w-full px-4 py-2.5 rounded-lg border border-[var(--color-border)] dark:border-[var(--color-border-dark)] bg-[var(--color-bg)] dark:bg-[var(--color-bg-dark)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 transition-shadow";

export default function ProfilePage() {
  const [profile, setProfile] = useState({ name: "", email: "" });
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(true);
  const [savingInfo, setSavingInfo] = useState(false);
  const [savingPwd, setSavingPwd] = useState(false);

  useEffect(() => {
    getMyProfile()
      .then((data) => {
        if (data) setProfile({ name: data.name ?? "", email: data.email });
      })
      .catch(() => toast.error("Failed to load profile"))
      .finally(() => setLoading(false));
  }, []);

  const handleInfoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingInfo(true);
    const tid = toast.loading("Saving...");
    try {
      await updateMyProfile({ name: profile.name, email: profile.email });
      toast.success("Profile updated!", { id: tid });
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to update", {
        id: tid,
      });
    } finally {
      setSavingInfo(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }
    if (passwords.newPassword.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    setSavingPwd(true);
    const tid = toast.loading("Changing password...");
    try {
      await updateMyProfile({
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword,
      });
      toast.success("Password changed!", { id: tid });
      setPasswords({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err: unknown) {
      toast.error(
        err instanceof Error ? err.message : "Failed to change password",
        { id: tid },
      );
    } finally {
      setSavingPwd(false);
    }
  };

  if (loading)
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-4 max-w-xl">
          <div className="h-8 bg-[var(--color-surface-hover)] dark:bg-[var(--color-surface-hover-dark)] rounded w-48" />
          <div className="h-12 bg-[var(--color-surface-hover)] dark:bg-[var(--color-surface-hover-dark)] rounded" />
          <div className="h-12 bg-[var(--color-surface-hover)] dark:bg-[var(--color-surface-hover-dark)] rounded" />
        </div>
      </div>
    );

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-xl mb-16 md:mb-0 space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-xl bg-[var(--color-primary)]/10 flex items-center justify-center text-[var(--color-primary)] shrink-0">
          <Shield className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-2xl font-bold font-heading leading-tight">
            My Profile
          </h1>
          <p className="text-xs text-[var(--color-text-muted)] dark:text-[var(--color-text-muted-dark)]">
            Super Admin Account
          </p>
        </div>
      </div>

      {/* Personal Info */}
      <section className="bg-[var(--color-surface)] dark:bg-[var(--color-surface-dark)] border border-[var(--color-border)] dark:border-[var(--color-border-dark)] rounded-xl p-6 space-y-4 shadow-sm">
        <h2 className="text-base font-semibold font-heading">Personal Info</h2>
        <form onSubmit={handleInfoSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5">
              Full Name
            </label>
            <input
              className={inputClasses}
              value={profile.name}
              onChange={(e) =>
                setProfile((p) => ({ ...p, name: e.currentTarget.value }))
              }
              placeholder="Your name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">
              Email Address
            </label>
            <input
              className={inputClasses}
              type="email"
              required
              value={profile.email}
              onChange={(e) =>
                setProfile((p) => ({ ...p, email: e.currentTarget.value }))
              }
            />
          </div>
          <div className="pt-1">
            <button
              type="submit"
              disabled={savingInfo}
              className="px-5 py-2.5 rounded-xl bg-[var(--color-primary)] text-white text-sm font-semibold hover:opacity-90 disabled:opacity-50 transition-opacity shadow-lg shadow-[var(--color-primary)]/20 cursor-pointer"
            >
              {savingInfo ? "Saving…" : "Save Info"}
            </button>
          </div>
        </form>
      </section>

      {/* Change Password */}
      <section className="bg-[var(--color-surface)] dark:bg-[var(--color-surface-dark)] border border-[var(--color-border)] dark:border-[var(--color-border-dark)] rounded-xl p-6 space-y-4 shadow-sm">
        <h2 className="text-base font-semibold font-heading">
          Change Password
        </h2>
        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5">
              Current Password
            </label>
            <input
              className={inputClasses}
              type="password"
              required
              value={passwords.currentPassword}
              onChange={(e) =>
                setPasswords((p) => ({
                  ...p,
                  currentPassword: e.currentTarget.value,
                }))
              }
              placeholder="••••••••"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">
              New Password
            </label>
            <input
              className={inputClasses}
              type="password"
              required
              value={passwords.newPassword}
              onChange={(e) =>
                setPasswords((p) => ({
                  ...p,
                  newPassword: e.currentTarget.value,
                }))
              }
              placeholder="Min 8 characters"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">
              Confirm New Password
            </label>
            <input
              className={inputClasses}
              type="password"
              required
              value={passwords.confirmPassword}
              onChange={(e) =>
                setPasswords((p) => ({
                  ...p,
                  confirmPassword: e.currentTarget.value,
                }))
              }
              placeholder="••••••••"
            />
          </div>
          <div className="pt-1">
            <button
              type="submit"
              disabled={savingPwd}
              className="px-5 py-2.5 rounded-xl bg-[var(--color-primary)] text-white text-sm font-semibold hover:opacity-90 disabled:opacity-50 transition-opacity shadow-lg shadow-[var(--color-primary)]/20 cursor-pointer"
            >
              {savingPwd ? "Changing…" : "Change Password"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
