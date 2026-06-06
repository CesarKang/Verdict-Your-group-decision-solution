import { Sparkles } from "lucide-react";
import type { VerdictAnchor } from "../lib/types";
import type { StageInfo } from "../lib/coordinationStage";

export type LiveThinkingStatus =
  | "preparing"
  | "calling"
  | "parsing"
  | "fallback";

export type ThinkingPhase = "reading" | "generating";

type ThinkingIndicatorProps = {
  anchor?: VerdictAnchor;
  stage?: StageInfo;
  phase?: ThinkingPhase;
  liveMode?: boolean;
  liveStatus?: LiveThinkingStatus;
  elapsedMs?: number;
  liveError?: string;
  showStage?: boolean;
};

export function ThinkingIndicator({
  anchor,
  stage,
  phase = "reading",
  liveMode = false,
  liveStatus = "preparing",
  elapsedMs = 0,
  liveError,
  showStage = true,
}: ThinkingIndicatorProps) {
  const readingLine = liveMode
    ? liveStatus === "calling"
      ? "Calling AI to read the thread..."
      : liveStatus === "parsing"
        ? "Parsing thread context..."
        : "Preparing live read..."
    : `Reading from here${"\u2026"}`;

  const generatingLine = liveMode
    ? liveStatus === "calling"
      ? "Calling AI for final decision..."
      : "Building group habit + generating verdict..."
    : phase === "generating"
      ? "Building group habit + generating verdict..."
      : readingLine;

  return (
    <div className="flex justify-start px-1">
      <div className="max-w-[92%] rounded-[18px] border border-black/5 bg-white px-4 py-3 shadow-sm">
        <div className="mb-2 flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-zymix-green text-[13px] font-bold text-zymix-text">
            {"\u2726"}
          </div>
          <span className="text-[14px] font-semibold text-zymix-text">Verdict</span>
          {liveMode && (
            <span className="rounded-full bg-[#F4FFE4] px-2 py-0.5 text-[10px] font-bold uppercase text-zymix-text">
              Live AI
            </span>
          )}
        </div>

        {anchor && phase === "reading" && (
          <div className="mb-3 rounded-xl bg-[#FAFAFA] px-3 py-2">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-zymix-secondary">
              Reading from
            </p>
            <p className="mt-1 text-[12px] text-zymix-secondary">{anchor.authorName}</p>
            <p className="text-[13px] leading-snug text-zymix-text">{anchor.preview}</p>
          </div>
        )}

        <p className="animate-pulse-soft text-[15px] text-zymix-text">
          {phase === "generating" ? generatingLine : readingLine}
        </p>

        {liveMode && (
          <p className="mt-1 text-[12px] font-medium text-zymix-green-dark">
            {(elapsedMs / 1000).toFixed(1)}s elapsed
          </p>
        )}

        {showStage && stage && phase === "reading" && (
          <div className="mt-2 rounded-full bg-[#F4FFE4] px-3 py-1.5">
            <p className="text-[12px] font-semibold text-zymix-text">
              Decision stage: {stage.label}
            </p>
            <p className="text-[11px] text-zymix-secondary">{stage.detail}</p>
          </div>
        )}

        {phase === "generating" && (
          <p className="mt-2 text-[12px] italic text-zymix-secondary">
            Chat + group habit + all submitted preferences
          </p>
        )}

        {liveError && liveStatus === "fallback" && (
          <p className="mt-2 rounded-xl bg-[#FFF4E5] px-3 py-2 text-[11px] text-[#8A6A00]">
            {liveError}
          </p>
        )}

        <div className="mt-3 flex gap-1">
          <span className="h-2 w-2 animate-pulse rounded-full bg-zymix-green" />
          <span className="h-2 w-2 animate-pulse rounded-full bg-zymix-green [animation-delay:150ms]" />
          <span className="h-2 w-2 animate-pulse rounded-full bg-zymix-green [animation-delay:300ms]" />
        </div>
        <Sparkles className="mt-2 h-4 w-4 text-zymix-green-dark opacity-60" />
      </div>
    </div>
  );
}
