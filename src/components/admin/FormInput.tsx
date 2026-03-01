"use client";

import { InputHTMLAttributes, TextareaHTMLAttributes } from "react";

interface BaseProps {
  label: string;
  error?: string;
  helperText?: string;
}

type InputProps = BaseProps &
  InputHTMLAttributes<HTMLInputElement> & { as?: "input" };
type TextareaProps = BaseProps &
  TextareaHTMLAttributes<HTMLTextAreaElement> & { as: "textarea" };
type Props = InputProps | TextareaProps;

export default function FormInput(props: Props) {
  const {
    label,
    error,
    helperText,
    as = "input",
    className = "",
    ...rest
  } = props;

  const baseStyles =
    "w-full px-4 py-2 border rounded-xl bg-[var(--color-bg)] dark:bg-[var(--color-bg-dark)] border-[var(--color-border)] dark:border-[var(--color-border-dark)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 transition-all";

  return (
    <div className="space-y-1.5 w-full">
      <label className="text-sm font-medium tracking-tight text-[var(--color-text)] dark:text-[var(--color-text-dark)]">
        {label}
      </label>

      {as === "textarea" ? (
        <textarea
          className={`${baseStyles} min-h-[120px] resize-y ${className}`}
          {...(rest as TextareaHTMLAttributes<HTMLTextAreaElement>)}
        />
      ) : (
        <input
          className={`${baseStyles} ${className}`}
          {...(rest as InputHTMLAttributes<HTMLInputElement>)}
        />
      )}

      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
      {!error && helperText && (
        <p className="text-xs text-[var(--color-text-muted)] dark:text-[var(--color-text-muted-dark)] mt-1 opacity-80">
          {helperText}
        </p>
      )}
    </div>
  );
}
