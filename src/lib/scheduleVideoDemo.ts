import { VIDEO_TIMELINE } from "../lib/videoDemo";

export type VideoDemoCallbacks = {
  highlightAnchor: () => void;
  setInput: (value: string) => void;
  sendVerdictCommand: () => void;
  setFeedback: (value: string) => void;
  submitBudget: () => void;
  confirmPlan: () => void;
  openSplitBill: () => void;
  requestSplitBill: () => void;
};

function delay(ms: number) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

async function typeInto(setter: (value: string) => void, text: string, charMs: number) {
  for (let i = 1; i <= text.length; i += 1) {
    setter(text.slice(0, i));
    await delay(charMs);
  }
}

export function scheduleVideoDemo(callbacks: VideoDemoCallbacks): () => void {
  const timers: number[] = [];

  const at = (ms: number, fn: () => void) => {
    timers.push(window.setTimeout(fn, ms));
  };

  at(VIDEO_TIMELINE.highlightAnchor, callbacks.highlightAnchor);

  at(VIDEO_TIMELINE.typeVerdictStart, () => {
    void typeInto(callbacks.setInput, "@Verdict", 110);
  });

  at(VIDEO_TIMELINE.sendVerdict, callbacks.sendVerdictCommand);

  at(VIDEO_TIMELINE.typeBudgetStart, () => {
    void typeInto(callbacks.setFeedback, "under \u00a320", 75);
  });

  at(VIDEO_TIMELINE.submitBudget, callbacks.submitBudget);
  at(VIDEO_TIMELINE.confirmPlan, callbacks.confirmPlan);

  at(VIDEO_TIMELINE.typeSplitBillStart, () => {
    void typeInto(callbacks.setInput, "@Verdict split bill", 65);
  });

  at(VIDEO_TIMELINE.openSplitBill, callbacks.openSplitBill);
  at(VIDEO_TIMELINE.requestSplitBill, callbacks.requestSplitBill);

  return () => {
    timers.forEach((timer) => window.clearTimeout(timer));
  };
}
