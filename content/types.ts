/** Shared content types. Everything here must stay serializable: it crosses the server/client boundary. */

export type Locale = "uk";

export interface LessonMeta {
  slug: string;
  title: string;
  /** One short line shown on the course map. */
  summary: string;
  minutes: number;
}

export interface ModuleMeta {
  slug: string;
  title: string;
  summary: string;
  /** Short label on the module badge, e.g. "01". */
  badge: string;
  lessons: LessonMeta[];
  /** Planned module without lessons yet. */
  soon?: boolean;
}

export interface Course {
  modules: ModuleMeta[];
}

export interface GlossaryEntry {
  id: string;
  /** What is shown inline: the abbreviation or the short term. */
  abbr: string;
  /** Full name / expansion. */
  full: string;
  /** What it is, one sentence. */
  short: string;
  /** How it is used in practice, one sentence. */
  practice: string;
  related?: string[];
}

/* ---------- Quizzes ---------- */

export interface ChoiceOption {
  text: string;
  correct?: boolean;
}

interface QuizBase {
  id: string;
  question: string;
  /** Shown after answering: why the answer is what it is. */
  explain: string;
  /** Optional code / prompt shown under the question. */
  code?: string;
}

export interface SingleQuiz extends QuizBase {
  type: "single";
  options: ChoiceOption[];
}

export interface MultiQuiz extends QuizBase {
  type: "multi";
  options: ChoiceOption[];
}

export interface TrueFalseQuiz extends QuizBase {
  type: "truefalse";
  answer: boolean;
}

export interface OrderQuiz extends QuizBase {
  type: "order";
  /** Items in the correct order; the UI shuffles them. */
  items: string[];
}

export interface FindBugQuiz extends QuizBase {
  type: "findbug";
  /** Lines of a prompt / config; the user taps the problematic one(s). */
  lines: string[];
  /** Zero-based indexes of the lines that are wrong. */
  bad: number[];
}

export interface MatchQuiz extends QuizBase {
  type: "match";
  /** Left side -> right side, the UI shuffles the right column. */
  pairs: [string, string][];
}

export type QuizQuestion = SingleQuiz | MultiQuiz | TrueFalseQuiz | OrderQuiz | FindBugQuiz | MatchQuiz;

/* ---------- Tasks (textarea + validation rules) ---------- */

interface RuleBase {
  id: string;
  /** Criterion shown in the checklist. */
  label: string;
  /** Shown when the rule fails. */
  hint: string;
  /** Matching is case-insensitive unless set. */
  caseSensitive?: boolean;
}

export type TaskRule =
  | (RuleBase & { type: "includesAny"; values: string[] })
  | (RuleBase & { type: "includesAll"; values: string[] })
  | (RuleBase & { type: "notIncludes"; values: string[] })
  | (RuleBase & { type: "regex"; pattern: string; flags?: string })
  | (RuleBase & { type: "notRegex"; pattern: string; flags?: string })
  | (RuleBase & { type: "minWords"; value: number })
  | (RuleBase & { type: "maxWords"; value: number })
  | (RuleBase & { type: "xmlTag"; tag: string })
  | (RuleBase & { type: "xmlTagCount"; min: number })
  | (RuleBase & { type: "heading"; values: string[] })
  | (RuleBase & { type: "validJson" })
  | (RuleBase & { type: "jsonKeys"; keys: string[] })
  | (RuleBase & { type: "frontmatter"; keys: string[] });

export interface TaskDef {
  id: string;
  title: string;
  /** What to do, short. */
  prompt: string;
  /** Prefilled textarea content (e.g. a bad prompt to fix). */
  starter?: string;
  placeholder?: string;
  rules: TaskRule[];
  /** Optional reference answer revealed after the first check. */
  solution?: string;
  /** Monospace editor (for configs / code). Prompts use a regular font. */
  mono?: boolean;
}

/* ---------- Demos ("silent videos") ---------- */

export type DemoStep =
  /** User types a command or message. */
  | { kind: "input"; text: string }
  /** Assistant text, streamed. */
  | { kind: "output"; text: string }
  /** A tool call line, e.g. "Read(src/app.ts)". */
  | { kind: "tool"; name: string; detail: string; result?: string }
  /** A diff block. */
  | { kind: "diff"; file: string; lines: string[] }
  /** Permission prompt with the chosen answer. */
  | { kind: "ask"; question: string; options: string[]; choice: number }
  /** Muted system / status line. */
  | { kind: "note"; text: string }
  /** Caption shown above the player: what is happening right now. */
  | { kind: "caption"; text: string };

export interface DemoScript {
  id: string;
  title: string;
  /** Terminal = Claude Code, chat = claude.ai style. */
  variant: "terminal" | "chat";
  steps: DemoStep[];
}
