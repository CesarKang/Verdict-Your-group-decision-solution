import type { VerdictAnchor } from "../lib/types";

type VerdictReferenceBubbleProps = {
  anchor: VerdictAnchor;
};

export function VerdictReferenceBubble({ anchor }: VerdictReferenceBubbleProps) {
  return (
    <div className="flex justify-start px-1">
      <div className="max-w-[92%] rounded-[18px] border border-zymix-green/30 bg-[#F4FFE4] px-3.5 py-3">
        <div className="mb-2 flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-zymix-green text-[11px] font-bold">
            {"\u2726"}
          </div>
          <span className="text-[12px] font-semibold text-zymix-text">
            Verdict replying to {anchor.authorName}
          </span>
        </div>
        <div className="rounded-xl border-l-4 border-zymix-green bg-white/80 px-3 py-2">
          <p className="text-[13px] leading-snug text-zymix-text">{anchor.preview}</p>
        </div>
        <p className="mt-2 text-[11px] text-zymix-secondary">
          Reading from here {"\u2192"} analysing the thread below
        </p>
      </div>
    </div>
  );
}
