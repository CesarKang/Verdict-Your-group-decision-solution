import { groupProfile } from "../data/groupProfile";
import type { GroupProfile, MemberProfileDraft } from "./types";

export function buildDefaultMemberProfiles(): MemberProfileDraft[] {
  return groupProfile.members.map((member) => {
    const hardLimit =
      groupProfile.hardLimits.find((h) => h.memberId === member.id)?.label ?? "";

    return {
      memberId: member.id,
      preference: "",
      hardLimit,
    };
  });
}

export function mergeProfilesIntoGroup(
  base: GroupProfile,
  drafts: MemberProfileDraft[],
): GroupProfile {
  const hardLimits = drafts
    .filter((draft) => draft.hardLimit.trim().length > 0)
    .map((draft) => ({
      memberId: draft.memberId,
      label: draft.hardLimit.trim(),
    }));

  const preferenceNotes = drafts
    .map((draft) => {
      const member = base.members.find((m) => m.id === draft.memberId);
      if (!member) return null;
      const pref = draft.preference.trim();
      if (!pref) return `${member.name}: no strong preference`;
      return `${member.name}: ${pref}`;
    })
    .filter(Boolean) as string[];

  return {
    ...base,
    hardLimits,
    habits: [...base.habits, ...preferenceNotes],
  };
}

export function displayPreference(value: string): string {
  return value.trim() || "No strong preference";
}

export function displayHardLimit(value: string): string {
  return value.trim() || "None set";
}
