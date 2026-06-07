import type { Verdict } from "../lib/types";

/** ACT 3 \u2014 preliminary direction (not final). */
export const preliminaryDirection: Verdict = {
  verdict: {
    planId: "roxy_03",
    name: "East / Central chill spots",
    headline:
      "Leaning caf\u00e9 or market stalls \u2014 East-side, veg-friendly, no-alcohol OK, Sat afternoon.",
  },
  card: {
    vibe: "chill",
    budget: "under \u00a320pp likely",
    location: "East / near UCL",
    time: "Sat ~15:00",
    constraint: "Ac no alcohol \u00b7 Rachel veg \u00b7 group runs late",
  },
  rationaleOneline:
    "Pieced together from chat + profiles \u2014 not the final pick yet.",
  moreInfo: {
    perPersonFit: [],
    hardLimitsRespected: ["Ac: no alcohol", "Rachel: vegetarian", "Sam: budget"],
    whyNot: "",
  },
  actions: [],
};

/** ACT 3 \u2014 final decision card. */
export const videoFinalVerdict: Verdict = {
  verdict: {
    planId: "roxy_03",
    name: "The Roxy",
    headline:
      "The Roxy, near UCL \u2014 Saturday 15:00, chill, ~\u00a314 per person.",
  },
  card: {
    vibe: "chill",
    budget: "\u00a314pp",
    location: "Near UCL (Bloomsbury)",
    time: "Sat 15:00",
    constraint: "every hard limit cleared \u00b7 latecomer-friendly",
  },
  rationaleOneline:
    "Every constraint accounted for. Alternatives ruled out in More info.",
  moreInfo: {
    perPersonFit: [],
    hardLimitsRespected: [
      "Ac: no alcohol",
      "Rachel: vegetarian + east",
      "Sam: under \u00a320 budget",
      "Fangzhe: no strong preference",
    ],
    whyNot:
      "BrewDog & Flight Club: loud, alcohol-led. Dishoom: long queues when the group runs late. Stalls: outdoor only.",
  },
  actions: [
    { type: "split_bill", label: "Split Bill \u00b7 ~\u00a312pp" },
    { type: "share_location", label: "Share Location" },
  ],
};
