import type { ReactNode } from "react";
import { LightbulbIcon, SparkIcon, WarnIcon } from "@/components/ui/icons";
import { cn } from "@/lib/cn";

/** Three key takeaways at the top of a lesson. */
export function TLDR({ children }: { children: ReactNode }) {
  return (
    <aside
      aria-label="TL;DR"
      className="card glow relative overflow-hidden p-5 sm:p-6 [&_li+li]:mt-2 [&_ul]:mt-3"
    >
      <p className="font-hand text-3xl leading-none text-accent">TL;DR</p>
      {children}
    </aside>
  );
}

const calloutStyles = {
  tip: { icon: LightbulbIcon, cls: "border-accent/40 bg-accent-soft", iconCls: "text-accent" },
  warn: { icon: WarnIcon, cls: "border-danger/40 bg-danger-soft", iconCls: "text-danger" },
  pro: { icon: SparkIcon, cls: "border-success/40 bg-success-soft", iconCls: "text-success" },
};

/** Short highlighted note. type: tip | warn | pro */
export function Callout({
  type = "tip",
  title,
  children,
}: {
  type?: keyof typeof calloutStyles;
  title?: string;
  children: ReactNode;
}) {
  const s = calloutStyles[type];
  const Icon = s.icon;
  return (
    <div className={cn("flex gap-3 rounded-2xl border p-4", s.cls)}>
      <Icon className={cn("mt-0.5 shrink-0", s.iconCls)} />
      <div className="min-w-0 [&>*+*]:mt-2">
        {title ? <p className="font-bold">{title}</p> : null}
        {children}
      </div>
    </div>
  );
}

/** Numbered visual steps, e.g. a workflow. */
export function Steps({ items }: { items: { title: string; text?: string }[] }) {
  return (
    <ol className="!list-none !pl-0 grid gap-3 sm:grid-cols-2">
      {items.map((item, i) => (
        <li key={item.title} className="card !mt-0 flex gap-3 p-4">
          <span className="grid size-9 shrink-0 place-items-center rounded-full bg-accent font-display text-sm font-bold text-on-accent">
            {i + 1}
          </span>
          <div>
            <p className="font-bold">{item.title}</p>
            {item.text ? <p className="mt-1 text-[0.95rem] text-muted">{item.text}</p> : null}
          </div>
        </li>
      ))}
    </ol>
  );
}

/** Side-by-side "do / don't" cards. */
export function DoDont({ dont, doThis }: { dont: string[]; doThis: string[] }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <div className="rounded-2xl border border-danger/40 bg-danger-soft p-4">
        <p className="font-bold text-danger">✕ Не так</p>
        <ul className="mt-2 space-y-1.5 text-[0.95rem]">
          {dont.map(x => (
            <li key={x}>{x}</li>
          ))}
        </ul>
      </div>
      <div className="rounded-2xl border border-success/40 bg-success-soft p-4">
        <p className="font-bold text-success">✓ Так</p>
        <ul className="mt-2 space-y-1.5 text-[0.95rem]">
          {doThis.map(x => (
            <li key={x}>{x}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
