import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/*
 * Schematic diagrams for lessons: an abstract overview of a process
 * ("prompt → tokens → result"). Server components, props are plain data
 * so they can be written inline in MDX.
 */

type Tone = "accent" | "default" | "muted";

const toneCls: Record<Tone, string> = {
  accent: "border-accent/60 bg-accent-soft",
  default: "border-line bg-surface-2",
  muted: "border-dashed border-line bg-transparent text-muted",
};

function Figure({ title, caption, children, className }: { title?: string; caption?: string; children: ReactNode; className?: string }) {
  return (
    <figure className={cn("not-prose card relative overflow-hidden p-4 sm:p-5", className)}>
      {title ? <p className="mb-4 text-xs font-bold uppercase tracking-wider text-accent">{title}</p> : null}
      {children}
      {caption ? <figcaption className="mt-4 text-[0.95rem] text-muted">{caption}</figcaption> : null}
    </figure>
  );
}

/* ------------------------------------------------------------------ Flow */

type Dir = "→" | "←" | "↔";
type Link = Dir | { dir?: Dir; label?: string };

interface FlowNode {
  label: string;
  sub?: string;
  tone?: Tone;
}

/** Animated connector: dashes travel in the direction of the arrow. */
function Arrow({ dir, className }: { dir: Dir; className: string }) {
  const head = "fill-none stroke-current [stroke-linecap:round] [stroke-linejoin:round]";
  return (
    <svg viewBox="0 0 44 16" width="36" height="13" aria-hidden="true" className={cn("shrink-0 rotate-90 text-accent", className)}>
      {dir === "↔" ? (
        <>
          <line x1="8" y1="5" x2="36" y2="5" strokeWidth="2" strokeDasharray="4 4" className="flow-dash stroke-current" />
          <line x1="8" y1="11" x2="36" y2="11" strokeWidth="2" strokeDasharray="4 4" className="flow-dash-rev stroke-current opacity-60" />
          <path d="M35 1 L41 5 L35 9" strokeWidth="2" className={head} />
          <path d="M9 7 L3 11 L9 15" strokeWidth="2" className={cn(head, "opacity-60")} />
        </>
      ) : (
        <g transform={dir === "←" ? "matrix(-1 0 0 1 44 0)" : undefined}>
          <line x1="3" y1="8" x2="36" y2="8" strokeWidth="2" strokeDasharray="4 4" className="flow-dash stroke-current" />
          <path d="M33 3 L40 8 L33 13" strokeWidth="2" className={head} />
        </g>
      )}
    </svg>
  );
}

/* Static class sets so Tailwind sees every class name. */
const narrowLayout = {
  fig: "",
  ol: "sm:flex-row",
  node: "sm:min-h-24 sm:basis-0",
  conn: "sm:flex-col sm:gap-0.5 sm:px-1 sm:py-0",
  arrow: "sm:rotate-0",
  label: "sm:max-w-20",
  loop: "max-sm:hidden",
};

const wideLayout = {
  fig: "lg:-mx-20",
  ol: "lg:flex-row",
  node: "lg:min-h-24 lg:basis-0",
  conn: "lg:flex-col lg:gap-0.5 lg:px-1 lg:py-0",
  arrow: "lg:rotate-0",
  label: "lg:max-w-16",
  loop: "max-lg:hidden",
};

/**
 * Linear process: boxes joined by animated arrows. Horizontal from `sm`
 * (from `lg` for 4+ nodes, which then extend past the text column),
 * vertical below that. `links[i]` joins nodes i and i+1 (default "→").
 * `loop` draws a return path from the last node back to the first.
 */
export function Flow({
  title,
  nodes,
  links = [],
  loop,
  caption,
}: {
  title?: string;
  nodes: FlowNode[];
  links?: Link[];
  loop?: string;
  caption?: string;
}) {
  const l = nodes.length > 3 ? wideLayout : narrowLayout;
  return (
    <Figure title={title} caption={caption} className={l.fig}>
      <ol className={cn("flex flex-col items-stretch", l.ol)}>
        {nodes.map((node, i) => {
          const raw = links[i] ?? "→";
          const link = typeof raw === "string" ? { dir: raw } : { dir: raw.dir ?? "→", label: raw.label };
          return (
            <li key={`${i}-${node.label}`} className="contents">
              <div
                className={cn(
                  "flex min-w-0 flex-1 flex-col justify-center rounded-2xl border px-2.5 py-2.5 text-center",
                  l.node,
                  toneCls[node.tone ?? (i === 0 || i === nodes.length - 1 ? "accent" : "default")],
                )}
              >
                <span className="text-[0.9rem] font-bold leading-tight [overflow-wrap:break-word]">{node.label}</span>
                {node.sub ? <span className="mt-1 text-[0.8rem] leading-snug text-muted">{node.sub}</span> : null}
              </div>
              {i < nodes.length - 1 ? (
                <div className={cn("flex shrink-0 items-center justify-center gap-2 py-1", l.conn)} aria-hidden={link.label ? undefined : true}>
                  <Arrow dir={link.dir} className={l.arrow} />
                  {link.label ? <span className={cn("text-center text-[0.7rem] leading-tight text-muted", l.label)}>{link.label}</span> : null}
                </div>
              ) : null}
            </li>
          );
        })}
      </ol>
      {loop ? (
        <div className={cn("relative mx-6 mt-1 h-6 rounded-b-2xl border-x-2 border-b-2 border-dashed border-accent/50", l.loop)} aria-hidden="true">
          <svg viewBox="0 0 12 10" width="12" height="10" className="absolute -left-[7px] -top-2 text-accent/80">
            <path d="M1 9 L6 2 L11 9" className="fill-none stroke-current [stroke-linecap:round]" strokeWidth="2" />
          </svg>
        </div>
      ) : null}
      {loop ? (
        <p className="mt-2 text-center text-[0.85rem] text-muted">
          <span aria-hidden="true" className="text-accent">
            ↺{" "}
          </span>
          {loop}
        </p>
      ) : null}
    </Figure>
  );
}

/* ----------------------------------------------------------------- Cycle */

const VB = 480;
const C = VB / 2;
const R = 160;
const NODE_W = 150;
const NODE_H = 58;

/** Angle where the circle leaves a node's box, searched outward from the node centre. */
function exitAngle(a0: number, step: number) {
  let a = a0;
  const cx = C + R * Math.cos(a0);
  const cy = C + R * Math.sin(a0);
  for (let k = 0; k < 400; k++) {
    a += step;
    const x = C + R * Math.cos(a);
    const y = C + R * Math.sin(a);
    if (Math.abs(x - cx) > NODE_W / 2 + 8 || Math.abs(y - cy) > NODE_H / 2 + 8) return a;
  }
  return a;
}

const pt = (a: number) => `${(C + R * Math.cos(a)).toFixed(1)} ${(C + R * Math.sin(a)).toFixed(1)}`;

/**
 * Closed loop of 3–5 steps drawn as SVG (e.g. the agent loop:
 * gather context → act → check). `center` is the label in the middle.
 */
export function Cycle({ title, nodes, center, caption }: { title?: string; nodes: FlowNode[]; center?: string; caption?: string }) {
  const n = nodes.length;
  const angles = nodes.map((_, i) => -Math.PI / 2 + (2 * Math.PI * i) / n);

  return (
    <Figure title={title} caption={caption}>
      <svg viewBox={`0 0 ${VB} ${VB}`} className="mx-auto block w-full max-w-[26rem]" aria-hidden="true">
        <defs>
          <marker id="cycle-head" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M1 1 L8 5 L1 9" className="fill-none stroke-accent" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </marker>
          <radialGradient id="cycle-glow">
            <stop offset="0" stopColor="#97c45a" stopOpacity="0.18" />
            <stop offset="1" stopColor="#97c45a" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx={C} cy={C} r={R - 40} fill="url(#cycle-glow)" />
        {angles.map((a, i) => {
          const from = exitAngle(a, 0.005);
          const to = exitAngle(angles[(i + 1) % n] + (i === n - 1 ? 2 * Math.PI : 0), -0.005);
          return (
            <path
              key={`arc-${i}`}
              d={`M ${pt(from)} A ${R} ${R} 0 0 1 ${pt(to)}`}
              strokeWidth="2.5"
              strokeDasharray="6 6"
              markerEnd="url(#cycle-head)"
              className="flow-dash fill-none stroke-accent"
            />
          );
        })}
        {nodes.map((node, i) => {
          const x = C + R * Math.cos(angles[i]);
          const y = C + R * Math.sin(angles[i]);
          const tone = node.tone ?? (i === 0 ? "accent" : "default");
          return (
            <g key={`${i}-${node.label}`}>
              <rect
                x={x - NODE_W / 2}
                y={y - NODE_H / 2}
                width={NODE_W}
                height={NODE_H}
                rx="16"
                strokeWidth="1.5"
                className={tone === "accent" ? "fill-[#3a2a1a] stroke-accent" : "fill-surface-2 stroke-line"}
              />
              <text
                x={x}
                y={node.sub ? y - 4 : y + 6}
                textAnchor="middle"
                fontSize="17"
                fontWeight="600"
                className="fill-fg font-display"
              >
                {node.label}
              </text>
              {node.sub ? (
                <text x={x} y={y + 17} textAnchor="middle" fontSize="13.5" className="fill-muted">
                  {node.sub}
                </text>
              ) : null}
            </g>
          );
        })}
        {center ? (
          <text x={C} y={C + 6} textAnchor="middle" fontSize="26" fontWeight="700" className="fill-accent font-hand">
            {center}
          </text>
        ) : null}
      </svg>
      <ol className="sr-only">
        {nodes.map((node, i) => (
          <li key={`${i}-${node.label}`}>
            {node.label}
            {node.sub ? `: ${node.sub}` : ""}
          </li>
        ))}
        <li>{center ?? "…"} ↺</li>
      </ol>
    </Figure>
  );
}

/* ---------------------------------------------------------------- Layers */

/**
 * Stacked layers inside one frame, height proportional to `size`
 * (e.g. what fills the context window). tone "muted" = free space.
 */
export function Layers({
  title,
  items,
  frame,
  caption,
}: {
  title?: string;
  items: (FlowNode & { size?: number })[];
  frame?: string;
  caption?: string;
}) {
  return (
    <Figure title={title} caption={caption}>
      <div className="relative rounded-2xl border-2 border-accent/50 p-2 pt-3">
        {frame ? <span className="absolute -top-3 left-4 bg-surface px-2 text-xs font-bold text-accent">{frame}</span> : null}
        <ul className="flex flex-col gap-1.5">
          {items.map(item => (
            <li
              key={item.label}
              style={{ minHeight: `${Math.max(2.75, (item.size ?? 1) * 2.75)}rem` }}
              className={cn(
                "flex flex-wrap items-center justify-between gap-x-3 gap-y-0.5 rounded-xl border px-3 py-2",
                toneCls[item.tone ?? "default"],
              )}
            >
              <span className="font-semibold">{item.label}</span>
              {item.sub ? <span className="text-[0.85rem] text-muted">{item.sub}</span> : null}
            </li>
          ))}
        </ul>
      </div>
    </Figure>
  );
}
