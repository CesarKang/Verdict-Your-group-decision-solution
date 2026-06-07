/** ACT 3 runtime: 0:50\u20132:15 on the full pitch = 85 seconds of screen time. */
export const VIDEO_DEMO_TOTAL_MS = 85_000;

export function isVideoDemoMode(): boolean {
  if (typeof window === "undefined") return false;
  const params = new URLSearchParams(window.location.search);
  return params.get("demo") === "video";
}

export function isVideoAutoplay(): boolean {
  if (typeof window === "undefined") return false;
  const params = new URLSearchParams(window.location.search);
  return params.get("autoplay") === "1";
}

export const VIDEO_DEMO_USER_ID = "rachel";

export const VIDEO_QUOTE_MESSAGE_ID = "m1";

export const VIDEO_DEMO_RACHEL_PROFILE = {
  personalProfile: "Usually on time \u00b7 prefers east side",
  hardLimit: "vegetarian",
  allowRealtimeChatRead: true,
};

/** Autoplay timeline offsets (ms from start). */
export const VIDEO_TIMELINE = {
  highlightAnchor: 1_500,
  typeVerdictStart: 3_000,
  sendVerdict: 6_500,
  readingEnd: 15_000,
  preliminaryHold: 40_000,
  typeBudgetStart: 41_000,
  submitBudget: 48_000,
  finalVerdict: 55_000,
  confirmPlan: 70_000,
  typeSplitBillStart: 73_000,
  openSplitBill: 78_000,
  requestSplitBill: 82_000,
  end: VIDEO_DEMO_TOTAL_MS,
} as const;
