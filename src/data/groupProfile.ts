import type { GroupProfile } from "../lib/types";

export const groupProfile: GroupProfile = {
  members: [
    { id: "fangzhe", name: "Fangzhe", isOwner: true },
    { id: "rachel", name: "Rachel" },
    { id: "ac", name: "Ac" },
    { id: "sam", name: "Sam" },
  ],
  hardLimits: [
    { memberId: "ac", label: "no alcohol" },
    { memberId: "rachel", label: "vegetarian" },
    { memberId: "sam", label: "budget \u2264 \u00a315" },
  ],
  habits: [
    "Usually 15\u201320 min late",
    "Prefer East / Central near UCL",
    "Saturday afternoons",
    "Fangzhe: no strong preference / always ends up deciding",
  ],
};
