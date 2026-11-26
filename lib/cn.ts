import clsx, { type ClassValue } from "clsx";

export const cn = (...inputs: ClassValue[]) => clsx(inputs);

/** Shared button styles. */
export const btn = {
  base: "inline-flex items-center justify-center gap-2 rounded-2xl font-semibold transition active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none min-h-12 px-5 text-base",
  primary:
    "bg-accent text-on-accent shadow-[0_8px_24px_-8px_rgb(151_196_90/0.6)] hover:bg-accent-strong",
  ghost: "bg-surface text-fg shadow-raised hover:bg-surface-3",
  subtle: "bg-transparent text-muted hover:text-fg hover:bg-surface-2",
  /** Outlined; readable on any surface, including popovers (surface-2). */
  secondary: "border border-line bg-transparent text-fg hover:border-muted/60 hover:bg-surface-3",
  /** Destructive action, first step. */
  danger: "border border-danger/50 bg-transparent text-danger hover:border-danger hover:bg-danger-soft",
  /** Destructive action, confirm step. */
  dangerSolid: "border border-danger bg-danger text-bg hover:bg-danger/85",
};
// cn() does not merge Tailwind classes: pick one variant per button instead of overriding a variant's colours.
