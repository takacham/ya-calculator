"use client";

import { ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "secondary" | "danger";

interface LargeButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-accent text-white active:bg-accent-dark",
  secondary: "bg-gray-100 text-gray-900 active:bg-gray-200",
  danger: "bg-red-50 text-red-600 active:bg-red-100",
};

export function LargeButton({
  variant = "primary",
  className = "",
  children,
  ...props
}: LargeButtonProps) {
  return (
    <button
      type="button"
      {...props}
      className={`w-full rounded-2xl px-6 py-5 text-xl font-semibold transition disabled:cursor-not-allowed disabled:opacity-40 ${variantClasses[variant]} ${className}`}
    >
      {children}
    </button>
  );
}
