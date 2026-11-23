"use client";

import * as Tabs from "@radix-ui/react-tabs";
import { useApp } from "@/components/providers";
import { CheckIcon, XIcon } from "@/components/ui/icons";
import { cn } from "@/lib/cn";

interface Side {
  prompt: string;
  /** What the model returns for this prompt (shortened). */
  result?: string;
  /** Why it's bad / good, short bullet points. */
  notes?: string[];
}

function Panel({ side, kind }: { side: Side; kind: "bad" | "good" }) {
  const { t } = useApp();
  const good = kind === "good";
  return (
    <div className={cn("flex h-full flex-col rounded-2xl border p-4", good ? "border-success/40 bg-success-soft" : "border-danger/40 bg-danger-soft")}>
      <p className={cn("flex items-center gap-2 text-sm font-bold uppercase tracking-wider", good ? "text-success" : "text-danger")}>
        {good ? <CheckIcon size={18} /> : <XIcon size={18} />}
        {good ? t.compare.good : t.compare.bad}
      </p>
      <pre className="mt-3 rounded-xl bg-[#141518] p-3 font-mono text-[0.85rem] leading-relaxed whitespace-pre-wrap">{side.prompt}</pre>
      {side.result ? (
        <>
          <p className="mt-3 text-xs font-bold uppercase tracking-wider text-muted">{t.compare.result}</p>
          <p className="mt-1 text-[0.95rem] whitespace-pre-line">{side.result}</p>
        </>
      ) : null}
      {side.notes?.length ? (
        <ul className="mt-3 space-y-1 text-[0.95rem]">
          {side.notes.map(n => (
            <li key={n}>{n}</li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

/** Bad vs good prompt: tabs on mobile, side by side from md up. */
export function PromptCompare({ bad, good }: { bad: Side; good: Side }) {
  const { t } = useApp();
  return (
    <div className="not-prose my-8">
      <div className="hidden gap-4 md:grid md:grid-cols-2">
        <Panel side={bad} kind="bad" />
        <Panel side={good} kind="good" />
      </div>
      <Tabs.Root defaultValue="bad" className="md:hidden">
        <Tabs.List className="pressed mb-3 grid grid-cols-2 gap-1 rounded-2xl p-1" aria-label={`${t.compare.bad} / ${t.compare.good}`}>
          <Tabs.Trigger
            value="bad"
            className="min-h-11 rounded-xl text-sm font-bold text-muted data-[state=active]:bg-danger-soft data-[state=active]:text-danger"
          >
            {t.compare.bad}
          </Tabs.Trigger>
          <Tabs.Trigger
            value="good"
            className="min-h-11 rounded-xl text-sm font-bold text-muted data-[state=active]:bg-success-soft data-[state=active]:text-success"
          >
            {t.compare.good}
          </Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="bad">
          <Panel side={bad} kind="bad" />
        </Tabs.Content>
        <Tabs.Content value="good">
          <Panel side={good} kind="good" />
        </Tabs.Content>
      </Tabs.Root>
    </div>
  );
}
