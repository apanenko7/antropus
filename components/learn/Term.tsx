"use client";

import * as Popover from "@radix-ui/react-popover";
import Link from "next/link";
import { useRef, useState, type ReactNode } from "react";
import { useApp } from "@/components/providers";

/**
 * Inline term / abbreviation with an explanation popover.
 * Opens on hover or focus (desktop) and on tap (mobile); Esc closes it.
 *
 * <Term id="mcp" />           -> "MCP"
 * <Term id="mcp" full />      -> "MCP (Model Context Protocol)"
 * <Term id="token">токенів</Term> -> custom inline text (Ukrainian word forms)
 */
export function Term({ id, full, children }: { id: string; full?: boolean; children?: ReactNode }) {
  const { glossary, locale, t } = useApp();
  const entry = glossary[id];
  const [open, setOpen] = useState(false);
  const closeTimer = useRef<number | null>(null);
  // True while the popover is open only because of mouse hover.
  const hoverOpened = useRef(false);

  if (!entry) {
    if (process.env.NODE_ENV !== "production") console.warn(`Unknown glossary term: ${id}`);
    return <>{children ?? id}</>;
  }

  const label = children ?? entry.abbr;
  const cancelClose = () => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
  };
  const scheduleClose = () => {
    cancelClose();
    closeTimer.current = window.setTimeout(() => setOpen(false), 150);
  };

  return (
    <Popover.Root
      open={open}
      onOpenChange={next => {
        if (!next) hoverOpened.current = false;
        setOpen(next);
      }}
    >
      <Popover.Trigger asChild>
        <button
          type="button"
          className="inline cursor-help rounded-sm border-b-2 border-dotted border-accent/70 bg-transparent p-0 font-semibold text-fg hover:border-accent hover:text-accent focus-visible:text-accent"
          onPointerEnter={e => {
            if (e.pointerType === "mouse") {
              cancelClose();
              if (!open) hoverOpened.current = true;
              setOpen(true);
            }
          }}
          onPointerLeave={e => {
            if (e.pointerType === "mouse" && hoverOpened.current) scheduleClose();
          }}
          onClick={e => {
            // A click after hover-open pins the popover instead of toggling it closed.
            if (hoverOpened.current && open) {
              e.preventDefault();
              hoverOpened.current = false;
              cancelClose();
            }
          }}
          aria-label={`${typeof label === "string" ? label : entry.abbr}: ${entry.full}`}
        >
          {label}
          {full ? <span className="font-normal text-muted"> ({entry.full})</span> : null}
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          side="top"
          align="center"
          sideOffset={8}
          collisionPadding={16}
          onPointerEnter={cancelClose}
          onPointerLeave={() => {
            if (hoverOpened.current) scheduleClose();
          }}
          onOpenAutoFocus={e => e.preventDefault()}
          className="z-50 w-[min(22rem,calc(100vw-2rem))] rounded-2xl border border-line bg-surface-2 p-4 text-[0.95rem] leading-snug shadow-raised outline-none data-[state=open]:animate-[fadeIn_120ms_ease-out]"
        >
          <p className="font-display text-base font-semibold text-accent">{entry.abbr}</p>
          <p className="mt-0.5 text-sm text-muted">{entry.full}</p>
          <p className="mt-3">{entry.short}</p>
          <p className="mt-2.5 rounded-xl bg-accent-soft px-3 py-2 text-sm">
            <span className="font-bold text-accent">{t.glossary.inPractice}: </span>
            {entry.practice}
          </p>
          <Link
            href={`/${locale}/glossary#${entry.id}`}
            className="mt-3 inline-block text-sm font-semibold text-accent underline underline-offset-2"
          >
            {t.glossary.openGlossary} →
          </Link>
          <Popover.Arrow className="fill-surface-2" width={14} height={7} />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
