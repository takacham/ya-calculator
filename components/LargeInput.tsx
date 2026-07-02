"use client";

import { InputHTMLAttributes } from "react";

interface LargeInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export function LargeInput({ label, className = "", ...props }: LargeInputProps) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-base font-medium text-gray-500">{label}</span>
      <input
        {...props}
        inputMode="decimal"
        className={`w-full rounded-2xl border border-gray-200 bg-white px-5 py-4 text-3xl font-semibold text-gray-900 outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20 ${className}`}
      />
    </label>
  );
}
