import type { ReactNode } from "react";

/** Orange arc ring from the visual reference (the quiz timer). */
export function ProgressRing({
  value,
  size = 56,
  stroke = 5,
  children,
  label,
}: {
  /** 0..1 */
  value: number;
  size?: number;
  stroke?: number;
  children?: ReactNode;
  label?: string;
}) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const v = Math.max(0, Math.min(1, value));
  return (
    <div
      className="relative inline-grid place-items-center rounded-full bg-surface shadow-raised"
      style={{ width: size, height: size }}
      role={label ? "img" : undefined}
      aria-label={label}
    >
      <svg width={size} height={size} className="absolute inset-0 -rotate-90" aria-hidden="true">
        <circle cx={size / 2} cy={size / 2} r={r} stroke="var(--surface-3)" strokeWidth={stroke} fill="none" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke="var(--accent)"
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - v)}
          style={{ transition: "stroke-dashoffset 600ms ease" }}
        />
      </svg>
      <span className="relative font-display text-sm font-semibold">{children}</span>
    </div>
  );
}
