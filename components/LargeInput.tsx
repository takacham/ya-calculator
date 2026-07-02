"use client";

import { InputHTMLAttributes } from "react";

interface LargeInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export function LargeInput({
  label,
  className = "",
  ...props
}: LargeInputProps) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-base font-medium text-gray-500">
        {label}
      </span>

      <input
        {...props}
        inputMode={label === "商品名" ? "text" : "decimal"}
        className={`w-full rounded-2xl border border-gray-200 bg-white px-6 py-5 text-3xl ${className}`}
      />
    </label>
  );
}