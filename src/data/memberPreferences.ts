import type { UserPreference } from "../lib/types";

export type HiddenMemberPreference = {
  memberId: string;
  name: string;
  fromChat: Partial<UserPreference>;
  hardLimit?: string;
};

export const hiddenMemberPreferences: HiddenMemberPreference[] = [
  {
    memberId: "rachel",
    name: "Rachel",
    fromChat: { vibe: "can eat (veg)", location: "east preferred" },
    hardLimit: "vegetarian",
  },
  {
    memberId: "ac",
    name: "Ac",
    fromChat: { vibe: "nowhere loud" },
    hardLimit: "no alcohol",
  },
  {
    memberId: "sam",
    name: "Sam",
    fromChat: { vibe: "chill", budget: "\u2264 \u00a315" },
    hardLimit: "budget \u2264 \u00a315",
  },
];

export const CURRENT_USER_ID = "fangzhe";

export const emptyPreference = (): UserPreference => ({
  vibe: "",
  budget: "",
  location: "",
  time: "",
});

export function isPreferenceEmpty(pref: UserPreference): boolean {
  return (
    !pref.vibe.trim() &&
    !pref.budget.trim() &&
    !pref.location.trim() &&
    !pref.time.trim()
  );
}

export const emptyAIAgentProfile = () => ({
  personalProfile: "",
  hardLimit: "",
  allowRealtimeChatRead: false,
});
