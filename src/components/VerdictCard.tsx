import { ChevronDown, MapPin } from "lucide-react";
import { useState } from "react";
import type { GroupHabit, Verdict, VerdictSource } from "../lib/types";

type VerdictCardProps = {
  verdict: Verdict;
  source?: VerdictSource;
  liveLatencyMs?: number;
  liveModel?: string;
  groupHabit?: GroupHabit;
  confirmed?: boolean;
  onConfirm: () => void;
  onShareLocation: () => void;
  onReroll: () => void;
  showReroll?: boolean;
};

export function VerdictCard({
  verdict,
  source = "seed",
  liveLatencyMs,
  liveModel,
  groupHabit,
  confirmed = false,
  onConfirm,
  onShareLocation,
  onReroll,
  showReroll = true,
}: VerdictCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [personalPrefExpanded, setPersonalPrefExpanded] = useState(false);
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
        <div className="border-l-4 border-zymix-green px-4 pb-4 pt-3">
          <div className="mb-2 flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-zymix-green text-[13px] font-bold">
              {"\u2726"}
            </div>
            <span className="rounded-full bg-[#F4FFE4] px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-zymix-text">
              Verdict
            </span>
            {source === "live" && (
              <span className="rounded-full bg-zymix-green px-2 py-0.5 text-[10px] font-bold text-zymix-text">
                Live AI{liveLatencyMs ? ` \u00b7 ${(liveLatencyMs / 1000).toFixed(1)}s` : ""}
              </span>
            )}
            {source === "seed" && (
              <span className="rounded-full bg-[#F1F1F3] px-2 py-0.5 text-[10px] font-semibold text-zymix-secondary">
                Demo seed
              </span>
            )}
            {source === "fallback" && (
              <span className="rounded-full bg-[#FFF4E5] px-2 py-0.5 text-[10px] font-semibold text-[#8A6A00]">
                Backup
              </span>
            )}
          </div>

          {liveModel && source === "live" && (
            <p className="mb-2 text-[11px] text-zymix-secondary">Model: {liveModel}</p>
          )}

          <p className="text-[14px] font-bold leading-snug text-zymix-text">{verdict.verdict.name}</p>

          {verdict.changedNote && (
            <p className="mt-2 rounded-xl bg-[#F4FFE4] px-3 py-2 text-[13px] leading-snug text-zymix-text">
              {verdict.changedNote}
            </p>
          )}

          <div className="mt-3 space-y-2 rounded-2xl bg-[#FAFAFA] px-3 py-3">
            {keyFields.map(([label, value]) => (
              <div key={label} className="flex gap-2 text-[13px] leading-snug">
                <span className="w-[78px] shrink-0 font-semibold text-zymix-secondary">{label}:</span>
                <span className="text-zymix-text">{value}</span>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="mt-3 flex items-center gap-1 text-[13px] font-semibold text-zymix-green-dark"
          >
            More info
            <ChevronDown
              className={`h-4 w-4 transition-transform ${expanded ? "rotate-180" : ""}`}
            />
          </button>

          {expanded && (
            <div className="animate-expand mt-3 space-y-4 border-t border-black/5 pt-3">
              <div>
                <p className="mb-2 inline-block rounded-full bg-[#F4FFE4] px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-zymix-text">
                  Decision
                </p>
                <p className="text-[13px] leading-snug text-zymix-text">{verdict.verdict.headline}</p>
                <p className="mt-2 text-[13px] leading-snug text-zymix-secondary">
                  {verdict.rationaleOneline}
                </p>
              </div>

              {groupHabit && (
                <div>
                  <p className="mb-2 inline-block rounded-full bg-[#F4FFE4] px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-zymix-text">
                    Group habit (AI inferred)
                  </p>
                  <ul className="mb-2 space-y-1 text-[13px] text-zymix-text">
                    {groupHabit.habits.map((habit) => (
                      <li key={habit}>{"\u2022 "}{habit}</li>
                    ))}
                  </ul>
                  <button
                    type="button"
                    onClick={() => setPersonalPrefExpanded((v) => !v)}
                    className="mb-2 inline-flex items-center gap-1 rounded-full bg-[#F4FFE4] px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-zymix-text"
                  >
                    Personal preference
                    <ChevronDown
                      className={`h-3.5 w-3.5 transition-transform ${personalPrefExpanded ? "rotate-180" : ""}`}
                    />
                  </button>
                  {personalPrefExpanded && (
                    <div className="animate-expand space-y-1">
                      {groupHabit.memberSummaries.map((member) => (
                        <p key={member.name} className="text-[12px] text-zymix-secondary">
                          <span className="font-semibold text-zymix-text">{member.name}:</span>{" "}
                          {member.summary}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <div>
                <p className="mb-2 inline-block rounded-full bg-[#F4FFE4] px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-zymix-text">
                  Hard limits respected
                </p>
                <ul className="space-y-1 text-[13px] text-zymix-text">
                  {verdict.moreInfo.hardLimitsRespected.map((item) => (
                    <li key={item}>{"\u2022 "}{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={onConfirm}
              disabled={confirmed}
              className={`rounded-full px-4 py-2 text-[13px] font-bold transition ${
                confirmed
                  ? "bg-zymix-green text-zymix-text"
                  : "bg-zymix-green text-zymix-text hover:brightness-95"
              }`}
            >
              {confirmed ? "\u2713 Confirmed" : "Confirm"}
            </button>
            <button
              type="button"
              onClick={onShareLocation}
              className="rounded-full bg-[#F1F1F3] px-4 py-2 text-[13px] font-bold text-zymix-text transition hover:bg-[#E8E8EA]"
            >
              Share Location
            </button>
          </div>

          {showReroll && (
            <button
              type="button"
              onClick={onReroll}
              className="mt-3 text-[12px] font-medium text-zymix-secondary underline-offset-2 hover:underline"
            >
              Someone&apos;s not feeling it
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export function RerollReasonPicker({
  onSelect,
  onCancel,
}: {
  onSelect: (reason: "Vibe" | "Budget" | "Time" | "Location") => void;
  onCancel: () => void;
}) {
  const reasons = ["Vibe", "Budget", "Time", "Location"] as const;

  return (
    <div className="flex justify-start px-1">
      <div className="rounded-[18px] bg-zymix-received px-4 py-3">
        <p className="mb-2 text-[13px] font-semibold text-zymix-text">What&apos;s off?</p>
        <div className="flex flex-wrap gap-2">
          {reasons.map((reason) => (
            <button
              key={reason}
              type="button"
              onClick={() => onSelect(reason)}
              className="rounded-full border border-black/10 bg-white px-3 py-1.5 text-[12px] font-semibold text-zymix-text hover:border-zymix-green"
            >
              {reason}
            </button>
          ))}
          <button
            type="button"
            onClick={onCancel}
            className="rounded-full px-3 py-1.5 text-[12px] text-zymix-secondary"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export function LocationBubble({ venueName, area }: { venueName: string; area: string }) {
  return (
    <div className="flex justify-start px-1">
      <div className="max-w-[78%] overflow-hidden rounded-[18px] bg-zymix-received">
        <div className="relative flex h-28 items-end bg-gradient-to-br from-[#C8E6C9] via-[#A5D6A7] to-[#81C784] p-3">
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-3xl">
            {"\u{1F4CD}"}
          </div>
          <div className="rounded-lg bg-white/90 px-2 py-1 text-[11px] font-medium text-zymix-secondary">
            Map preview (demo)
          </div>
        </div>
        <div className="flex items-start gap-2 px-3 py-2.5">
          <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-zymix-green-dark" />
          <div>
            <p className="text-[14px] font-semibold text-zymix-text">{venueName}</p>
            <p className="text-[12px] text-zymix-secondary">{area}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
