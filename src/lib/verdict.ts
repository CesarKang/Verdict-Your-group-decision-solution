import { dataset } from "../data/dataset";
import { altVerdict, primaryVerdict } from "../data/prebaked";
import {
  inferDecisionStage,
  messagesFromAnchor,
  type StageInfo,
} from "./coordinationStage";
import type { PreferenceBundle } from "./groupHabit";
import type { LLMRuntimeConfig } from "./llmConfig";
import { callLLM, parseJsonFromLLM } from "./llmClient";
import type {
  GroupProfile,
  RerollReason,
  SeedMessage,
  Verdict,
  VerdictMode,
  VerdictResult,
} from "./types";

export const VERDICT_SYSTEM_PROMPT =
  "You are Verdict, a neutral group-decision arbiter inside a chat app. You are given (1) a messy group chat anchored at a specific message, (2) a group profile with each member's hard limits and habits, (3) the inferred coordination stage, and (4) a fixed list of London options with attributes. Read the chat to infer each person's explicit and implicit preferences. Members who said nothing have \"no strong preference\" - still decide. Respect every hard limit as a strict filter. Pick exactly ONE option from the provided list by planId. Do not invent venues. Output a single neutral verdict with a short defensible rationale, per-person fit estimates, hard limits respected, and why you rejected the main alternatives. Return STRICTLY valid JSON matching the schema and NOTHING else.";

const VERDICT_SCHEMA = `{
  "verdict": { "planId": "string", "name": "string", "headline": "string" },
  "card": { "vibe": "string", "budget": "string", "location": "string", "time": "string", "constraint": "string" },
  "rationaleOneline": "string",
  "moreInfo": {
    "perPersonFit": [{ "name": "string", "fit": 0.0, "reason": "string" }],
    "hardLimitsRespected": ["string"],
    "whyNot": "string"
  },
  "actions": [
    { "type": "split_bill", "label": "string" },
    { "type": "share_location", "label": "string" }
  ]
}`;

export type GetVerdictOptions = {
  mode?: VerdictMode;
  useAlt?: boolean;
  anchorMessageId?: string;
  rerollReason?: RerollReason;
  llmConfig?: Partial<LLMRuntimeConfig>;
  preferenceBundle?: PreferenceBundle;
};

function resolveMode(override?: VerdictMode): VerdictMode {
  if (override) return override;
  const envMode = import.meta.env.VITE_VERDICT_MODE as VerdictMode | undefined;
  return envMode === "live" ? "live" : "seed";
}

function formatChatForPrompt(messages: SeedMessage[], profile: GroupProfile): string {
  const memberMap = Object.fromEntries(profile.members.map((m) => [m.id, m.name]));
  const lines = messages.map((m) => {
    const name = memberMap[m.memberId] ?? m.memberId;
    if (m.kind === "meme") return `${name}: [meme]`;
    return `${name}: ${m.text ?? ""}`;
  });
  return lines.join("\n");
}

function isValidVerdict(value: unknown): value is Verdict {
  if (!value || typeof value !== "object") return false;
  const v = value as Verdict;
  const planExists = dataset.some((plan) => plan.id === v.verdict?.planId);
  return (
    !!v.verdict?.headline &&
    !!v.card?.vibe &&
    planExists &&
    Array.isArray(v.moreInfo?.perPersonFit) &&
    Array.isArray(v.actions)
  );
}

function enrichVerdictFromPlan(verdict: Verdict): Verdict {
  const plan = dataset.find((item) => item.id === verdict.verdict.planId);
  if (!plan) return verdict;

  const priceLabel = `\u00a3${plan.pricePP}`;
  return {
    ...verdict,
    verdict: {
      ...verdict.verdict,
      name: plan.name,
    },
    actions: [
      {
        type: "split_bill",
        label: `Split Bill \u00b7 ~${priceLabel}pp`,
      },
      { type: "share_location", label: "Share Location" },
    ],
  };
}

function buildUserPrompt(
  messages: SeedMessage[],
  profile: GroupProfile,
  stage: StageInfo,
  anchorMessageId: string | undefined,
  rerollReason?: RerollReason,
  preferenceBundle?: PreferenceBundle,
): string {
  const anchorIndex = anchorMessageId
    ? messages.findIndex((message) => message.id === anchorMessageId)
    : 0;
  const anchor = anchorIndex >= 0 ? messages[anchorIndex] : messages[0];
  const memberMap = Object.fromEntries(profile.members.map((m) => [m.id, m.name]));

  return JSON.stringify({
    anchorMessage: {
      id: anchor?.id,
      author: memberMap[anchor?.memberId ?? ""] ?? anchor?.memberId,
      text: anchor?.text ?? "[meme]",
      instruction: "Analyse the chat starting from this anchor message through the end.",
    },
    decisionStage: stage,
    chat: formatChatForPrompt(messages, profile),
    groupProfile: profile,
    groupHabit: preferenceBundle?.groupHabit ?? null,
    allPreferences: preferenceBundle?.members ?? null,
    options: dataset,
    rerollReason: rerollReason ?? null,
    schema: VERDICT_SCHEMA,
    outputRules: [
      "card must contain only the five summary fields: vibe, budget, location, time, constraint",
      "pick planId from options only",
      "if rerollReason is set, include changedNote explaining what changed",
    ],
  });
}

async function fetchLiveVerdict(
  messages: SeedMessage[],
  profile: GroupProfile,
  stage: StageInfo,
  opts: GetVerdictOptions,
): Promise<VerdictResult> {
  const { content, meta } = await callLLM(
    [
      { role: "system", content: VERDICT_SYSTEM_PROMPT },
      {
        role: "user",
        content: buildUserPrompt(
          messages,
          profile,
          stage,
          opts.anchorMessageId,
          opts.rerollReason,
          opts.preferenceBundle,
        ),
      },
    ],
    opts.llmConfig,
  );

  const parsed = parseJsonFromLLM(content);
  if (!isValidVerdict(parsed)) {
    throw new Error("Invalid verdict JSON from LLM");
  }

  return {
    verdict: enrichVerdictFromPlan(parsed),
    source: "live",
    liveLatencyMs: meta.latencyMs,
    liveModel: meta.model,
  };
}

export async function getVerdict(
  messages: SeedMessage[],
  groupProfile: GroupProfile,
  _datasetRef: typeof dataset,
  opts: GetVerdictOptions = {},
): Promise<VerdictResult> {
  const mode = resolveMode(opts.mode);
  const seedVerdict = opts.useAlt ? altVerdict : primaryVerdict;
  const scopedMessages = opts.anchorMessageId
    ? messagesFromAnchor(messages, opts.anchorMessageId)
    : messages;
  const stage =
    opts.preferenceBundle?.stage ??
    inferDecisionStage(scopedMessages);

  if (mode === "seed") {
    const verdict = { ...seedVerdict };
    if (opts.preferenceBundle?.groupHabit) {
      verdict.moreInfo = {
        ...verdict.moreInfo,
        hardLimitsRespected: opts.preferenceBundle.groupHabit.hardLimits,
      };
    }
    return { verdict, source: "seed" };
  }

  try {
    return await fetchLiveVerdict(scopedMessages, groupProfile, stage, opts);
  } catch (error) {
    return {
      verdict: seedVerdict,
      source: "fallback",
      liveError: error instanceof Error ? error.message : "Live AI failed",
    };
  }
}

export { inferDecisionStage, messagesFromAnchor };
export { inferDecisionStage as inferCoordinationStage };

export function getDefaultMode(): VerdictMode {
  return resolveMode();
}
