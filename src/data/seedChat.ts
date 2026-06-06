import type { SeedMessage } from "../lib/types";

export const seedMessages: SeedMessage[] = [
  { id: "m1", memberId: "rachel", text: "ok so saturday?? what are we actually doing \u{1F623}", time: "16:42" },
  { id: "m2", memberId: "sam", text: "idkkk anything", time: "16:43" },
  { id: "m3", memberId: "ac", text: "someone just pick pls \u{1F480}", time: "16:44" },
  { id: "m4", memberId: "rachel", text: "not me, i picked last time", time: "16:44" },
  { id: "m5", memberId: "fangzhe", text: "somehow it's always me deciding lol", time: "16:45" },
  { id: "m6", memberId: "sam", text: "somewhere chill, kinda broke rn tho \u{1F972}", time: "16:46" },
  { id: "m7", memberId: "ac", text: "yeah nowhere loud", time: "16:46" },
  { id: "m8", memberId: "rachel", text: "and pls somewhere i can actually eat (veg \u{1F331})", time: "16:47" },
  { id: "m9", memberId: "sam", kind: "meme", time: "16:48" },
  { id: "m10", memberId: "ac", text: "also i'm not drinking btw", time: "16:49" },
  { id: "m11", memberId: "rachel", text: "east is easier for me tbh", time: "16:50" },
  { id: "m12", memberId: "fangzhe", text: "we say 3pm and everyone shows up 3:30 anyway \u{1F62D}", time: "16:51" },
  { id: "m13", memberId: "sam", text: "facts", time: "16:51" },
  { id: "m14", memberId: "ac", text: "so\u2026 are we deciding or", time: "16:52" },
  { id: "m15", memberId: "rachel", text: "\u{1F62D}\u{1F62D}\u{1F62D}", time: "16:53" },
];

/** Verdict reads the coordination thread starting from this message. */
export const VERDICT_ANCHOR_MESSAGE_ID = "m1";

export function getVerdictAnchor(
  messageId: string,
  messages: SeedMessage[] = seedMessages,
) {
  const message = messages.find((m) => m.id === messageId) ?? messages[0];
  const authorNames: Record<string, string> = {
    rachel: "Rachel",
    sam: "Sam",
    ac: "Ac",
    fangzhe: "Fangzhe",
  };

  return {
    messageId: message.id,
    authorName: authorNames[message.memberId] ?? message.memberId,
    preview: message.text ?? "[meme]",
  };
}
