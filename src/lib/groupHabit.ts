import { groupProfile } from "../data/groupProfile";
import { hiddenMemberPreferences } from "../data/memberPreferences";
import { prebakedGroupHabit } from "../data/prebakedGroupHabit";
import type {
  AIAgentProfile,
  GroupHabit,
  ResolvedMemberPreference,
  SeedMessage,
  UserPreference,
} from "./types";
import { inferDecisionStage, messagesFromAnchor } from "./coordinationStage";

export type PreferenceBundle = {
  stage: ReturnType<typeof inferDecisionStage>;
  members: ResolvedMemberPreference[];
  groupHabit: GroupHabit;
};

function summarizePreference(pref: UserPreference): string {
  const parts = [pref.vibe, pref.budget, pref.location, pref.time]
    .map((p) => p.trim())
    .filter(Boolean);
  return parts.length ? parts.join(", ") : "No strong preference";
}

export function resolveAllPreferences(
  currentUserId: string,
  currentUserPref: UserPreference,
  aiAgentProfile?: Pick<AIAgentProfile, "personalProfile" | "hardLimit">,
): ResolvedMemberPreference[] {
  return groupProfile.members.map((member) => {
    if (member.id === currentUserId) {
      const empty =
        !currentUserPref.vibe.trim() &&
        !currentUserPref.budget.trim() &&
        !currentUserPref.location.trim() &&
        !currentUserPref.time.trim() &&
        !aiAgentProfile?.personalProfile.trim();

      const hardLimit = aiAgentProfile?.hardLimit.trim() || undefined;

      return {
        memberId: member.id,
        name: member.name,
        preference: currentUserPref,
        hardLimit,
        source: empty ? "none" : "submitted",
      };
    }

    const hidden = hiddenMemberPreferences.find((h) => h.memberId === member.id);
    if (hidden) {
      return {
        memberId: member.id,
        name: member.name,
        preference: {
          vibe: hidden.fromChat.vibe ?? "",
          budget: hidden.fromChat.budget ?? "",
          location: hidden.fromChat.location ?? "",
          time: hidden.fromChat.time ?? "",
        },
        hardLimit: hidden.hardLimit,
        source: "inferred",
      };
    }

    return {
      memberId: member.id,
      name: member.name,
      preference: { vibe: "", budget: "", location: "", time: "" },
      source: "none",
    };
  });
}

export function buildGroupHabit(
  members: ResolvedMemberPreference[],
  currentUserId?: string,
  aiAgentPersonalProfile?: string,
): GroupHabit {
  const hardLimits = members
    .filter((m) => m.hardLimit)
    .map((m) => `${m.name}: ${m.hardLimit}`);

  const memberSummaries = members.map((m) => {
    if (m.memberId === currentUserId && aiAgentPersonalProfile?.trim()) {
      const profile = aiAgentPersonalProfile.trim();
      return {
        name: m.name,
        summary: m.hardLimit ? `${profile} \u00b7 ${m.hardLimit}` : profile,
      };
    }

    return {
      name: m.name,
      summary:
        m.source === "none"
          ? "No strong preference"
          : m.hardLimit
            ? `${summarizePreference(m.preference)} \u00b7 ${m.hardLimit}`
            : summarizePreference(m.preference),
    };
  });

  return {
    habits: [...prebakedGroupHabit.habits],
    hardLimits: hardLimits.length ? hardLimits : [...prebakedGroupHabit.hardLimits],
    memberSummaries,
  };
}

export function buildPreferenceBundle(
  messages: SeedMessage[],
  anchorId: string,
  currentUserId: string,
  currentUserPref: UserPreference,
  aiAgentProfile?: Pick<AIAgentProfile, "personalProfile" | "hardLimit">,
): PreferenceBundle {
  const scoped = messagesFromAnchor(messages, anchorId);
  const stage = inferDecisionStage(scoped);
  const members = resolveAllPreferences(currentUserId, currentUserPref, aiAgentProfile);
  const groupHabit = buildGroupHabit(
    members,
    currentUserId,
    aiAgentProfile?.personalProfile,
  );

  return { stage, members, groupHabit };
}

export async function analyzeStageFromChat(
  messages: SeedMessage[],
  anchorId: string,
): Promise<ReturnType<typeof inferDecisionStage>> {
  const scoped = messagesFromAnchor(messages, anchorId);
  return inferDecisionStage(scoped);
}

export function getSeedGroupHabit(): GroupHabit {
  return prebakedGroupHabit;
}
