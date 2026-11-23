"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useApp } from "@/components/providers";
import { PauseIcon, PlayIcon, RestartIcon, StepIcon } from "@/components/ui/icons";
import type { DemoScript, DemoStep } from "@/content/types";
import { cn } from "@/lib/cn";

const TYPE_MS = 38; // per char, user input
const STREAM_MS = 12; // per char, assistant output
const PAUSE_MS = 650; // after each step

function textOf(step: DemoStep) {
  return step.kind === "input" || step.kind === "output" ? step.text : "";
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return reduced;
}

/**
 * "Silent video": plays a scripted Claude Code / chat session step by step.
 * Autoplays once when scrolled into view; pause, step and restart controls.
 */
export function Demo({ script }: { script: DemoScript }) {
  const { t } = useApp();
  const reduced = usePrefersReducedMotion();
  const steps = script.steps;
  const [shownState, setShown] = useState(0); // fully shown steps
  const [chars, setChars] = useState(0); // chars of the current step
  const [playingState, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const started = useRef(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const screenRef = useRef<HTMLDivElement>(null);
  // Reduced motion: show the whole session at once, no playback.
  const shown = reduced ? steps.length : shownState;
  const finished = shown >= steps.length;
  const playing = playingState && !finished;

  // Autoplay on first view.
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && !started.current) {
          started.current = true;
          if (!reduced) setPlaying(true);
        }
      },
      { threshold: 0.5 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reduced]);

  // Playback clock.
  useEffect(() => {
    if (!playing) return;
    const step = steps[shown];
    const full = textOf(step);
    let delay: number;
    let next: () => void;
    if (full && chars < full.length) {
      const per = step.kind === "input" ? TYPE_MS : STREAM_MS;
      const chunk = step.kind === "input" ? 1 : 3;
      delay = per * chunk;
      next = () => setChars(c => Math.min(full.length, c + chunk));
    } else {
      delay = step.kind === "caption" ? 150 : PAUSE_MS;
      next = () => {
        setShown(s => s + 1);
        setChars(0);
      };
    }
    const id = window.setTimeout(next, delay / speed);
    return () => window.clearTimeout(id);
  }, [playing, shown, chars, steps, speed]);

  // Keep the newest line visible.
  useEffect(() => {
    const el = screenRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [shown, chars]);

  const caption = useMemo(() => {
    for (let i = Math.min(shown, steps.length - 1); i >= 0; i--) {
      const s = steps[i];
      if (s.kind === "caption" && i <= shown) return s.text;
    }
    return null;
  }, [shown, steps]);

  const restart = () => {
    setShown(0);
    setChars(0);
    setPlaying(true);
  };

  const stepForward = () => {
    setPlaying(false);
    // Skip captions so one press always reveals something visible.
    let s = shown + 1;
    while (s < steps.length && steps[s - 1]?.kind === "caption") s++;
    setShown(Math.min(steps.length, s));
    setChars(0);
  };

  const visible = steps.slice(0, Math.min(shown + 1, steps.length));
  const progressValue = steps.length ? Math.min(1, (shown + (finished ? 0 : 0.5)) / steps.length) : 0;

  return (
    <figure ref={rootRef} className="not-prose my-8" aria-label={`${t.demo.demo}: ${script.title}`}>
      <div className="overflow-hidden rounded-3xl border border-line bg-[#121316] shadow-raised">
        {/* Window chrome */}
        <div className="flex items-center gap-2 border-b border-line bg-surface px-4 py-2.5">
          <span className="size-3 rounded-full bg-[#ff5f57]" aria-hidden="true" />
          <span className="size-3 rounded-full bg-[#febc2e]" aria-hidden="true" />
          <span className="size-3 rounded-full bg-[#28c840]" aria-hidden="true" />
          <span className="ml-2 truncate text-xs font-semibold text-muted">
            {script.variant === "terminal" ? `claude — ${script.title}` : script.title}
          </span>
        </div>

        {/* Caption */}
        <div className="flex min-h-11 items-center gap-2 border-b border-line/60 bg-accent-soft px-4 py-2 text-sm font-semibold text-accent" aria-live="polite">
          <span className="font-hand text-xl leading-none">{t.demo.demo}:</span>
          <span className="min-w-0">{caption ?? script.title}</span>
        </div>

        {/* Screen */}
        <div
          ref={screenRef}
          className={cn(
            "h-80 overflow-y-auto px-4 py-4 sm:h-96",
            script.variant === "terminal" ? "font-mono text-[0.82rem] leading-relaxed sm:text-sm" : "text-[0.95rem]",
          )}
        >
          <div className={cn(script.variant === "chat" ? "flex flex-col gap-3" : "space-y-2.5")}>
            {visible.map((step, i) => {
              const isCurrent = i === shown && !finished;
              const text = textOf(step);
              const partial = isCurrent && text ? text.slice(0, chars) : text;
              return (
                <StepView
                  key={i}
                  step={step}
                  variant={script.variant}
                  text={partial}
                  typing={isCurrent && Boolean(text) && chars < text.length}
                />
              );
            })}
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2 border-t border-line bg-surface px-3 py-2">
          <button
            type="button"
            onClick={() => (finished ? restart() : setPlaying(p => !p))}
            className="grid size-11 place-items-center rounded-full bg-accent text-on-accent"
            aria-label={playing ? t.demo.pause : t.demo.play}
          >
            {playing ? <PauseIcon size={18} /> : <PlayIcon size={18} />}
          </button>
          <button
            type="button"
            onClick={stepForward}
            disabled={finished}
            className="grid size-11 place-items-center rounded-full text-muted hover:bg-surface-2 hover:text-fg disabled:opacity-30"
            aria-label={t.demo.step}
          >
            <StepIcon size={18} />
          </button>
          <button
            type="button"
            onClick={restart}
            className="grid size-11 place-items-center rounded-full text-muted hover:bg-surface-2 hover:text-fg"
            aria-label={t.demo.restart}
          >
            <RestartIcon size={18} />
          </button>
          <div className="mx-2 h-1.5 flex-1 overflow-hidden rounded-full bg-surface-3" aria-hidden="true">
            <div className="h-full rounded-full bg-accent transition-[width] duration-300" style={{ width: `${progressValue * 100}%` }} />
          </div>
          <button
            type="button"
            onClick={() => setSpeed(s => (s === 1 ? 2 : s === 2 ? 0.5 : 1))}
            className="min-h-11 min-w-12 rounded-full px-2 text-sm font-bold text-muted hover:bg-surface-2 hover:text-fg"
            aria-label={`${t.demo.speed}: ${speed}x`}
          >
            {speed}x
          </button>
        </div>
      </div>
    </figure>
  );
}

function Cursor() {
  return <span className="ml-0.5 inline-block h-[1.1em] w-[0.5em] translate-y-[0.2em] bg-accent animate-[blink_1s_steps(1)_infinite]" aria-hidden="true" />;
}

function StepView({
  step,
  variant,
  text,
  typing,
}: {
  step: DemoStep;
  variant: DemoScript["variant"];
  text: string;
  typing: boolean;
}) {
  if (step.kind === "caption") return null;

  if (variant === "chat") {
    if (step.kind === "input")
      return (
        <div className="ml-auto max-w-[85%] rounded-2xl rounded-br-md bg-surface-3 px-4 py-2.5 whitespace-pre-wrap">
          {text}
          {typing ? <Cursor /> : null}
        </div>
      );
    if (step.kind === "output")
      return (
        <div className="flex max-w-[92%] gap-2.5">
          <span className="mt-1 grid size-7 shrink-0 place-items-center rounded-full bg-accent text-xs font-bold text-on-accent" aria-hidden="true">
            C
          </span>
          <div className="rounded-2xl rounded-tl-md bg-surface px-4 py-2.5 whitespace-pre-wrap">
            {text}
            {typing ? <Cursor /> : null}
          </div>
        </div>
      );
    return <p className="text-center text-xs text-muted">{"text" in step ? step.text : ""}</p>;
  }

  switch (step.kind) {
    case "input":
      return (
        <div className="rounded-lg border border-line bg-surface/60 px-3 py-2 whitespace-pre-wrap">
          <span className="text-accent">&gt; </span>
          {text}
          {typing ? <Cursor /> : null}
        </div>
      );
    case "output":
      return (
        <p className="whitespace-pre-wrap">
          <span className="text-accent">● </span>
          {text}
          {typing ? <Cursor /> : null}
        </p>
      );
    case "tool":
      return (
        <div>
          <p>
            <span className="text-success">● </span>
            <span className="font-bold">{step.name}</span>
            <span className="text-muted">({step.detail})</span>
          </p>
          {step.result ? <p className="pl-4 whitespace-pre-wrap text-muted">⎿ {step.result}</p> : null}
        </div>
      );
    case "diff":
      return (
        <div className="overflow-hidden rounded-lg border border-line">
          <p className="border-b border-line bg-surface px-3 py-1 text-xs text-muted">{step.file}</p>
          <div className="overflow-x-auto">
            {step.lines.map((l, i) => (
              <p
                key={i}
                className={cn(
                  "px-3 whitespace-pre",
                  l.startsWith("+") && "bg-success-soft text-success",
                  l.startsWith("-") && "bg-danger-soft text-danger",
                )}
              >
                {l}
              </p>
            ))}
          </div>
        </div>
      );
    case "ask":
      return (
        <div className="rounded-lg border border-accent/50 bg-accent-soft p-3">
          <p className="font-bold">{step.question}</p>
          <ul className="mt-1.5">
            {step.options.map((o, i) => (
              <li key={o} className={cn(i === step.choice ? "text-accent" : "text-muted")}>
                {i === step.choice ? "❯ " : "  "}
                {i + 1}. {o}
              </li>
            ))}
          </ul>
        </div>
      );
    case "note":
      return <p className="text-xs text-muted">{step.text}</p>;
  }
}
