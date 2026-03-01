"use client";

import { signOut } from "next-auth/react";
import Link from "next/link";

interface PortalTopNavProps {
  user: { name?: string | null; email?: string | null };
}

export default function PortalTopNav({ user }: PortalTopNavProps) {
  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl bg-slate-950/80 border-b border-white/[0.06]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo / Brand */}
        <Link
          href="/portal/dashboard"
          className="flex items-center gap-2.5 group"
        >
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-teal-500 to-teal-700 flex items-center justify-center text-white text-xs font-bold shadow-lg shadow-teal-500/20 group-hover:shadow-teal-500/40 transition-shadow">
            S
          </div>
          <span className="text-sm font-semibold text-white/80 group-hover:text-white transition-colors">
            Portal
          </span>
        </Link>

        {/* User info + Sign out */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:block text-right">
            <p className="text-xs font-medium text-white/80 leading-none">
              {user.name ?? "User"}
            </p>
            <p className="text-[10px] text-slate-500 mt-0.5">{user.email}</p>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: "/portal/login" })}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-white hover:bg-white/[0.06] transition-all cursor-pointer"
          >
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
              />
            </svg>
            Sign out
          </button>
        </div>
      </div>
    </header>
  );
}
