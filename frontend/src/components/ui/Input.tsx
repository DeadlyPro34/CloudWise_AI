import type { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, id, className = "", ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label
          htmlFor={id}
          className="text-sm font-semibold tracking-wide"
          style={{ color: "var(--color-text-secondary)" }}
        >
          {label}
        </label>
      )}
      <input
        id={id}
        className={`input-field ${error ? "!border-[var(--color-danger)] !shadow-[0_0_0_3px_rgba(248,113,113,0.18)]" : ""} ${className}`}
        {...props}
      />
      {error && (
        <span
          className="text-sm font-medium animate-fade-in"
          style={{ color: "var(--color-danger)" }}
        >
          {error}
        </span>
      )}
    </div>
  );
}
