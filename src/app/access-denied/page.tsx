import Link from "next/link";

export default function AccessDeniedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg)] dark:bg-[var(--color-bg-dark)]">
      <div className="text-center max-w-sm px-6">
        <div className="w-16 h-16 rounded-2xl bg-red-100 dark:bg-red-900/20 flex items-center justify-center mx-auto mb-6">
          <svg
            className="w-8 h-8 text-red-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
            />
          </svg>
        </div>
        <h1 className="text-2xl font-bold font-heading mb-2">Access Denied</h1>
        <p className="text-sm text-[var(--color-text-muted)] dark:text-[var(--color-text-muted-dark)] mb-8">
          You don&apos;t have permission to access the admin panel. Please
          contact a Super Admin if you believe this is a mistake.
        </p>
        <Link
          href="/api/auth/signout"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[var(--color-primary)] text-white text-sm font-semibold hover:opacity-90 transition-opacity"
        >
          Sign Out
        </Link>
      </div>
    </div>
  );
}
