"use client";

import { ReactNode } from "react";
import { Pencil, Trash2 } from "lucide-react";

export interface Column<T> {
  key: keyof T | string;
  header: string;
  render?: (item: T) => ReactNode;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  keyExtractor: (item: T) => string;
}

export default function DataTable<T>({
  data,
  columns,
  onEdit,
  onDelete,
  keyExtractor,
}: DataTableProps<T>) {
  if (data.length === 0) {
    return (
      <div className="p-8 text-center border border-dashed rounded-xl border-[var(--color-border)] dark:border-[var(--color-border-dark)] text-[var(--color-text-muted)] dark:text-[var(--color-text-muted-dark)]">
        No records found.
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto rounded-xl border border-[var(--color-border)] dark:border-[var(--color-border-dark)] bg-[var(--color-surface)] dark:bg-[var(--color-surface-dark)] shadow-sm">
      <table className="w-full text-sm text-left">
        <thead className="bg-[#f8f9fa] dark:bg-[#1a1d21] border-b border-[var(--color-border)] dark:border-[var(--color-border-dark)]">
          <tr>
            {columns.map((col, i) => (
              <th
                key={String(col.key) + i}
                className="px-6 py-4 font-medium text-[var(--color-text-muted)] dark:text-[var(--color-text-muted-dark)] uppercase tracking-wider text-xs"
              >
                {col.header}
              </th>
            ))}
            {(onEdit || onDelete) && (
              <th className="px-6 py-4 font-medium text-[var(--color-text-muted)] dark:text-[var(--color-text-muted-dark)] uppercase tracking-wider text-xs text-right">
                Actions
              </th>
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--color-border)] dark:divide-[var(--color-border-dark)]">
          {data.map((item) => (
            <tr
              key={keyExtractor(item)}
              className="hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors"
            >
              {columns.map((col, i) => (
                <td
                  key={String(col.key) + i}
                  className="px-6 py-4 whitespace-nowrap"
                >
                  {col.render
                    ? col.render(item)
                    : String(item[col.key as keyof T] ?? "")}
                </td>
              ))}
              {(onEdit || onDelete) && (
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <div className="flex items-center justify-end gap-2">
                    {onEdit && (
                      <button
                        onClick={() => onEdit(item)}
                        className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                    )}
                    {onDelete && (
                      <button
                        onClick={() => onDelete(item)}
                        className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
