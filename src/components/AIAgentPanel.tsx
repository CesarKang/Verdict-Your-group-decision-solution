import { X } from "lucide-react";
import type { AIAgentProfile } from "../lib/types";
import { ToggleSwitch } from "./ToggleSwitch";

type AIAgentPanelProps = {
  open: boolean;
  profile: AIAgentProfile;
  onChange: (profile: AIAgentProfile) => void;
  onClose: () => void;
};

export function AIAgentPanel({ open, profile, onChange, onClose }: AIAgentPanelProps) {
  if (!open) return null;

  const update = (patch: Partial<AIAgentProfile>) => {
    onChange({ ...profile, ...patch });
  };

  return (
    <div
      className="absolute inset-0 z-40 flex flex-col justify-end animate-backdrop-in bg-black/25"
      onClick={onClose}
    >
      <div
        className="animate-sheet-up max-h-[82%] overflow-y-auto rounded-t-[28px] bg-white px-5 pb-8 pt-4 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-zymix-green text-[13px] font-bold">
              {"\u2726"}
            </div>
            <span className="rounded-full bg-[#F4FFE4] px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-zymix-text">
              Verdict
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1 text-zymix-secondary hover:bg-black/5"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <label className="mb-4 block">
          <span className="mb-1.5 block text-[12px] font-bold uppercase tracking-wide text-zymix-secondary">
            Personal profile
          </span>
          <textarea
            value={profile.personalProfile}
            onChange={(e) => update({ personalProfile: e.target.value })}
            placeholder={"e.g. Usually 15\u201320 min late, prefer chill spots"}
            rows={3}
            className="w-full resize-none rounded-2xl border border-black/5 bg-[#FAFAFA] px-3 py-2.5 text-[14px] text-zymix-text outline-none focus:border-zymix-green"
          />
        </label>

        <label className="mb-5 block">
          <span className="mb-1.5 block text-[12px] font-bold uppercase tracking-wide text-zymix-secondary">
            Hard limit
          </span>
          <input
            value={profile.hardLimit}
            onChange={(e) => update({ hardLimit: e.target.value })}
            placeholder="e.g. alcohol allergy, vegetarian only"
            className="w-full rounded-2xl border border-black/5 bg-[#FAFAFA] px-3 py-2.5 text-[14px] text-zymix-text outline-none focus:border-zymix-green"
          />
        </label>

        <div className="rounded-2xl border border-black/5 bg-[#FAFAFA] px-4 py-3.5">
          <div className="flex items-center gap-4">
            <div className="min-w-0 flex-1">
              <p className="text-[14px] font-semibold leading-snug text-zymix-text">
                Allow Verdict to read chat history in real-time
              </p>
              <p className="mt-1 text-[12px] leading-snug text-zymix-secondary">
                When on, Verdict monitors the group chat and can proactively suggest
                decisions. (Demo: state saved only)
              </p>
            </div>
            <ToggleSwitch
              checked={profile.allowRealtimeChatRead}
              onChange={(checked) => update({ allowRealtimeChatRead: checked })}
              label="Allow Verdict to read chat history in real-time"
            />
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="mt-5 w-full rounded-2xl bg-zymix-green py-3.5 text-[15px] font-bold text-zymix-text"
        >
          Done
        </button>
      </div>
    </div>
  );
}
