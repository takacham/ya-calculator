"use client";

interface ResultDisplayProps {
  label?: string;
  value: string;
  unit?: string;
  prominent?: boolean;
}

export function ResultDisplay({
  label,
  value,
  unit,
  prominent = false,
}: ResultDisplayProps) {
  if (prominent) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="rounded-3xl bg-accent px-6 py-10 text-center shadow-sm"
      >
        {label && (
          <p className="mb-3 text-sm font-semibold text-white/90">{label}</p>
        )}
        <p className="text-5xl font-bold tracking-tight text-white sm:text-6xl">
          {value}
        </p>
        {unit && (
          <p className="mt-2 text-xl font-medium text-white/90">{unit}</p>
        )}
      </div>
    );
  }

  return (
    <div
      role="status"
      aria-live="polite"
      className="rounded-3xl bg-accent-light px-6 py-8 text-center"
    >
      {label && (
        <p className="mb-2 text-sm font-medium text-accent-dark">{label}</p>
      )}
      <p className="text-4xl font-bold text-accent-dark sm:text-5xl">{value}</p>
      {unit && (
        <p className="mt-1 text-lg font-medium text-accent-dark">{unit}</p>
      )}
    </div>
  );
}
