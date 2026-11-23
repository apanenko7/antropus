import type { MDXComponents } from "mdx/types";
import { Callout, DoDont, Steps, TLDR } from "@/components/learn/Blocks";
import { Demo } from "@/components/learn/Demo";
import { Flashcards } from "@/components/learn/Flashcards";
import { PromptCompare } from "@/components/learn/PromptCompare";
import { Quiz } from "@/components/learn/Quiz";
import { Task } from "@/components/learn/Task";
import { Term } from "@/components/learn/Term";

/** Components available in every lesson .mdx without imports. */
const components: MDXComponents = {
  Term,
  TLDR,
  Callout,
  Steps,
  DoDont,
  Quiz,
  Task,
  Demo,
  PromptCompare,
  Flashcards,
};

export function useMDXComponents(): MDXComponents {
  return components;
}
