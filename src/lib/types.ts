export type AIAgentProfile = {
  personalProfile: string;
  hardLimit: string;
  allowRealtimeChatRead: boolean;
};

export type Member = { id: string; name: string; isOwner?: boolean };

export type HardLimit = { memberId: string; label: string };

export type Plan = {
  id: string;
  name: string;
  area: string;
  type: "cafe" | "restaurant" | "bar" | "activity" | "campus_event" | "student_deal";
  pricePP: number;
  vibeTags: string[];
  capacity: number;
  dietary: string[];
  alcoholOptional: boolean;
  latecomerFriendly: boolean;
  distanceToCampus: string;
};

export type Verdict = {
  verdict: { planId: string; name: string; headline: string };
  card: { vibe: string; budget: string; location: string; time: string; constraint: string };
  rationaleOneline: string;
  moreInfo: {
    perPersonFit: { name: string; fit: number; reason: string }[];
    hardLimitsRespected: string[];
    whyNot: string;
  };
  actions: { type: "split_bill" | "share_location"; label: string }[];
  changedNote?: string;
};

export type SeedMessage = {
  id: string;
  memberId: string;
  text?: string;
  kind?: "text" | "meme";
  time?: string;
};

export type GroupProfile = {
  members: Member[];
  hardLimits: HardLimit[];
  habits: string[];
};

export type MemberProfileDraft = {
  memberId: string;
  preference: string;
  hardLimit: string;
};

export type VerdictAnchor = {
  messageId: string;
  authorName: string;
  preview: string;
};

export type UserPreference = {
  vibe: string;
  budget: string;
  location: string;
  time: string;
};

export type ResolvedMemberPreference = {
  memberId: string;
  name: string;
  preference: UserPreference;
  hardLimit?: string;
  source: "submitted" | "inferred" | "none";
};

export type GroupHabit = {
  habits: string[];
  hardLimits: string[];
  memberSummaries: { name: string; summary: string }[];
};

export type VerdictMode = "seed" | "live";

export type VerdictSource = "seed" | "live" | "fallback";

export type VerdictResult = {
  verdict: Verdict;
  source: VerdictSource;
  liveLatencyMs?: number;
  liveModel?: string;
  liveError?: string;
};

export type RerollReason = "Vibe" | "Budget" | "Time" | "Location";
