import type { Verdict } from "../lib/types";

export const primaryVerdict: Verdict = {
  verdict: {
    planId: "stalls_01",
    name: "Spitalfields Market food stalls",
    headline:
      "Sat 3pm \u2014 Spitalfields Market stalls. East, ~\u00a312pp, veg-friendly, chill, no booking so latecomers are fine.",
  },
  card: {
    vibe: "chill / casual",
    budget: "free\u2013\u00a315pp",
    location: "East (near-ish UCL)",
    time: "Sat 15:00 (come by 15:30, it's flexible)",
    constraint: "group runs ~20 min late \u2192 picked a no-booking spot",
  },
  rationaleOneline: "Clears every hard limit and lands closest to what most people actually said.",
  moreInfo: {
    perPersonFit: [
      { name: "Sam", fit: 0.95, reason: "\u00a312, well under budget" },
      { name: "Rachel", fit: 0.9, reason: "East + veg stalls" },
      { name: "Ac", fit: 0.9, reason: "no alcohol needed, not loud" },
      { name: "Fangzhe", fit: 0.8, reason: "no strong pref, zero effort" },
    ],
    hardLimitsRespected: ["Ac: no alcohol", "Rachel: vegetarian", "Sam: budget \u2264 \u00a315"],
    whyNot:
      "BrewDog & Flight Club are loud + alcohol-led + pricier (Ac's out, Sam's budget). Sketch is West and \u00a340. Dishoom fits East but queues \u2014 bad when everyone's late.",
  },
  actions: [
    { type: "split_bill", label: "Split Bill \u00b7 ~\u00a312pp" },
    { type: "share_location", label: "Share Location" },
  ],
};

export const altVerdict: Verdict = {
  verdict: {
    planId: "roxy_03",
    name: "The Roxy Caf\u00e9, Bloomsbury",
    headline:
      "Switched to The Roxy Caf\u00e9, Bloomsbury \u2014 indoor, seated, 5 min from UCL, still ~\u00a313pp.",
  },
  card: {
    vibe: "chill / cosy / indoor",
    budget: "free\u2013\u00a315pp",
    location: "Central (5 min from UCL)",
    time: "Sat 15:00 (come by 15:30, it's flexible)",
    constraint: "seated indoor spot \u2014 no outdoor stalls",
  },
  rationaleOneline: "Still clears hard limits, but trades outdoor stalls for a seated caf\u00e9.",
  changedNote:
    "You wanted somewhere seated/indoor, so I moved off the outdoor stalls; kept it cheap, veg-friendly, no-alcohol-needed and right by campus.",
  moreInfo: {
    perPersonFit: [
      { name: "Sam", fit: 0.92, reason: "\u00a313, still under budget" },
      { name: "Rachel", fit: 0.88, reason: "veg menu, easy to eat" },
      { name: "Ac", fit: 0.9, reason: "quiet caf\u00e9, no alcohol needed" },
      { name: "Fangzhe", fit: 0.85, reason: "closest to campus, low effort" },
    ],
    hardLimitsRespected: ["Ac: no alcohol", "Rachel: vegetarian", "Sam: budget \u2264 \u00a315"],
    whyNot:
      "Spitalfields stalls are outdoor-only. BrewDog & Flight Club are loud bars. Dishoom queues when you're always late.",
  },
  actions: [
    { type: "split_bill", label: "Split Bill \u00b7 ~\u00a313pp" },
    { type: "share_location", label: "Share Location" },
  ],
};
