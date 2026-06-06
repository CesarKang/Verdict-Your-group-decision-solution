import type { SeedMessage } from "./types";

export type DecisionStage =
  | "discussion-no-consensus"
  | "some-knowledge"
  | "has-clear-direction";

export type StageInfo = {
  stage: DecisionStage;
  label: string;
  detail: string;
};

const CONSENSUS_STALL = [
  "someone just pick",
  "are we deciding",
  "not me, i picked",
  "always me deciding",
];

const KNOWLEDGE_SIGNALS = [
  "broke",
  "budget",
  "veg",
  "east",
  "loud",
  "not drinking",
  "chill",
  "saturday",
];

const DIRECTION_SIGNALS = ["3pm", "15:00", "sat ", "saturday"];

export function inferDecisionStage(messages: SeedMessage[]): StageInfo {
  const text = messages
    .filter((m) => m.kind !== "meme")
    .map((m) => (m.text ?? "").toLowerCase())
    .join(" ");

  const knowledgeHits = KNOWLEDGE_SIGNALS.filter((s) => text.includes(s)).length;
  const hasDirection = DIRECTION_SIGNALS.some((s) => text.includes(s));
  const stalled = CONSENSUS_STALL.some((s) => text.includes(s));

  if (hasDirection && knowledgeHits >= 3 && !stalled) {
    return {
      stage: "has-clear-direction",
      label: "Has a clear direction",
      detail: "Time and constraints are mostly set; still needs a neutral pick.",
    };
  }

  if (knowledgeHits >= 2) {
    return {
      stage: "some-knowledge",
      label: "Some knowledge",
      detail: "Preferences and limits are emerging, but no final call yet.",
    };
  }

  return {
    stage: "discussion-no-consensus",
    label: "Discussion - no consensus",
    detail: stalled
      ? "The group is talking but nobody wants to decide."
      : "Early thread - still feeling out options.",
  };
}

export function messagesFromAnchor(
  messages: SeedMessage[],
  anchorId: string,
): SeedMessage[] {
  const index = messages.findIndex((m) => m.id === anchorId);
  return index >= 0 ? messages.slice(index) : messages;
}

export const inferCoordinationStage = inferDecisionStage;
