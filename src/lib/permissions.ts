// Permission keys matching admin sidebar routes
export const ADMIN_PAGES = [
  { key: 'portfolio',  label: 'Portfolio',  path: '/admin/portfolio' },
  { key: 'skills',     label: 'Skills',     path: '/admin/skills' },
  { key: 'experience', label: 'Experience', path: '/admin/experience' },
  { key: 'pages',      label: 'Pages',      path: '/admin/pages' },
  { key: 'settings',   label: 'Settings',   path: '/admin/settings' },
] as const;

export type PermissionKey = typeof ADMIN_PAGES[number]['key'];

export const ROLES = ['SUPER_ADMIN', 'EDITOR', 'VIEWER'] as const;
export type Role = typeof ROLES[number];

// Default permissions when creating a new user with a given role
export const DEFAULT_PERMISSIONS: Record<Role, PermissionKey[]> = {
  SUPER_ADMIN: ['portfolio', 'skills', 'experience', 'pages', 'settings'],
  EDITOR:      ['portfolio', 'skills', 'experience'],
  VIEWER:      [],
};

export function parsePermissions(raw: string): PermissionKey[] {
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/**
 * Whether a user can access a given admin page key.
 * SUPER_ADMIN bypasses all permission checks.
 */
export function hasPermission(
  role: string,
  permissions: string,
  pageKey: PermissionKey,
): boolean {
  if (role === 'SUPER_ADMIN') return true;
  const granted = parsePermissions(permissions);
  return granted.includes(pageKey);
}

/**
 * Whether a user can access the given pathname.
 * Returns true for the /admin root dashboard (always accessible).
 */
export function canAccessPathname(
  role: string,
  permissions: string,
  pathname: string,
): boolean {
  if (role === 'SUPER_ADMIN') return true;
  if (pathname === '/admin' || pathname === '/admin/') return false; // VIEWERs blocked

  const match = ADMIN_PAGES.find((p) => pathname.startsWith(p.path));
  if (!match) return role !== 'VIEWER'; // fallback
  return hasPermission(role, permissions, match.key);
}

export function roleLabel(role: string): string {
  return role.replace('_', ' ');
}

export function roleBadgeClass(role: string): string {
  switch (role) {
    case 'SUPER_ADMIN': return 'bg-[var(--color-primary)]/10 text-[var(--color-primary)]';
    case 'EDITOR':      return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300';
    case 'VIEWER':      return 'bg-slate-100 text-slate-600 dark:bg-slate-800/50 dark:text-slate-400';
    default:            return 'bg-gray-100 text-gray-600';
  }
}
