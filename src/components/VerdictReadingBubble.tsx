import type { VerdictAnchor } from "../lib/types";

type VerdictReadingBubbleProps = {
  anchor: VerdictAnchor;
  active?: boolean;
};

export function VerdictReadingBubble({ anchor, active = true }: VerdictReadingBubbleProps) {
  return (
    <div className="flex justify-start px-1">
      <div className="max-w-[92%] rounded-[18px] border border-zymix-green/25 bg-white px-4 py-3 shadow-sm">
        <div className="mb-2 flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-zymix-green text-[13px] font-bold">
            {"\u2726"}
          </div>
          <span className="text-[14px] font-semibold text-zymix-text">Verdict</span>
        </div>
        <p className={`text-[15px] text-zymix-text ${active ? "animate-pulse-soft" : ""}`}>
          Verdict is reading the chat{active ? "\u2026" : ""}
        </p>
        <div className="mt-2 rounded-xl border-l-4 border-zymix-green bg-[#FAFAFA] px-3 py-2">
          <p className="text-[11px] font-semibold text-zymix-secondary">{anchor.authorName}</p>
          <p className="text-[13px] leading-snug text-zymix-text">{anchor.preview}</p>
        </div>
        <p className="mt-2 text-[12px] text-zymix-secondary">
          Reading from here {"\u2192"} analysing thread below
        </p>
      </div>
    </div>
  );
}
