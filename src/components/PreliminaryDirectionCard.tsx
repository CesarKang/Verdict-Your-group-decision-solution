import type { Verdict } from "../lib/types";

type PreliminaryDirectionCardProps = {
  verdict: Verdict;
};

export function PreliminaryDirectionCard({ verdict }: PreliminaryDirectionCardProps) {
  const keyFields = [
    ["Vibe", verdict.card.vibe],
    ["Budget", verdict.card.budget],
    ["Location", verdict.card.location],
    ["Time", verdict.card.time],
    ["Constraint", verdict.card.constraint],
  ] as const;

  return (
    <div className="flex justify-start px-1">
      <div className="animate-slide-up max-w-[92%] overflow-hidden rounded-[20px] border border-black/5 bg-white shadow-[0_6px_24px_rgba(0,0,0,0.08)]">
        <div className="border-l-4 border-[#C5E87A] px-4 pb-4 pt-3">
          <div className="mb-2 flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-zymix-green text-[13px] font-bold">
              {"\u2726"}
            </div>
            <span className="rounded-full bg-[#F4FFE4] px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-zymix-text">
              Verdict
            </span>
            <span className="rounded-full bg-[#FFF4E5] px-2 py-0.5 text-[10px] font-semibold text-[#8A6A00]">
              Direction
            </span>
          </div>
          <p className="text-[14px] font-bold leading-snug text-zymix-text">{verdict.verdict.name}</p>
          <p className="mt-2 text-[13px] leading-snug text-zymix-secondary">{verdict.verdict.headline}</p>
          <div className="mt-3 space-y-2 rounded-2xl bg-[#FAFAFA] px-3 py-3">
            {keyFields.map(([label, value]) => (
              <div key={label} className="flex gap-2 text-[13px] leading-snug">
                <span className="w-[78px] shrink-0 font-semibold text-zymix-secondary">{label}:</span>
                <span className="text-zymix-text">{value}</span>
              </div>
            ))}
          </div>
          <p className="mt-3 text-[12px] font-medium text-zymix-green-dark">
            Not the final answer yet {"\u2014"} add anything for tonight below.
          </p>
        </div>
      </div>
    </div>
  );
}
