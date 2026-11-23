import clsx, { type ClassValue } from "clsx";

export const cn = (...inputs: ClassValue[]) => clsx(inputs);

/** Shared button styles. */
export const btn = {
  base: "inline-flex items-center justify-center gap-2 rounded-2xl font-semibold transition active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none min-h-12 px-5 text-base",
  primary:
    "bg-accent text-on-accent shadow-[0_8px_24px_-8px_rgb(255_138_31/0.6)] hover:bg-accent-strong",
  ghost: "bg-surface text-fg shadow-raised hover:bg-surface-2",
  subtle: "bg-transparent text-muted hover:text-fg hover:bg-surface-2",
};
