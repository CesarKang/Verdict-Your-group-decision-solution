import type { MemberProfileDraft } from "../lib/types";
import { displayHardLimit, displayPreference } from "../lib/profileDefaults";
import { groupProfile } from "../data/groupProfile";

type ProfileSetupPanelProps = {
  open: boolean;
  drafts: MemberProfileDraft[];
  onChange: (drafts: MemberProfileDraft[]) => void;
  onSave: () => void;
  onClose: () => void;
};

export function ProfileSetupPanel({
  open,
  drafts,
  onChange,
  onSave,
  onClose,
}: ProfileSetupPanelProps) {
  if (!open) return null;

  const updateDraft = (memberId: string, patch: Partial<MemberProfileDraft>) => {
    onChange(
      drafts.map((draft) =>
        draft.memberId === memberId ? { ...draft, ...patch } : draft,
      ),
    );
  };

  return (
    <div className="absolute inset-0 z-40 flex flex-col justify-end bg-black/30" onClick={onClose}>
      <div
        className="max-h-[78%] overflow-y-auto rounded-t-[28px] bg-white px-5 pb-8 pt-4 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-1 flex items-start justify-between gap-3">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wide text-zymix-green-dark">
              First time in this group
            </p>
            <h3 className="text-[17px] font-bold text-zymix-text">Quick group profile</h3>
            <p className="mt-1 text-[13px] leading-snug text-zymix-secondary">
              One row per person. Leave blank for{" "}
              <span className="font-semibold text-zymix-text">No strong preference</span>
              {" \u2014 Verdict still decides."}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full px-2 py-1 text-[12px] text-zymix-secondary hover:bg-black/5"
          >
            Close
          </button>
        </div>

        <div className="mt-4">
          <p className="mb-2 text-[12px] font-bold uppercase tracking-wide text-zymix-secondary">
            Group habits
          </p>
          <div className="flex flex-wrap gap-1.5">
            {groupProfile.habits.slice(0, 3).map((habit) => (
              <span
                key={habit}
                className="rounded-full bg-[#F4FFE4] px-2.5 py-1 text-[11px] font-medium text-zymix-text"
              >
                {habit}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-4 space-y-3">
          <p className="text-[12px] font-bold uppercase tracking-wide text-zymix-secondary">
            Everyone
          </p>
          {drafts.map((draft) => {
            const member = groupProfile.members.find((m) => m.id === draft.memberId);
            if (!member) return null;

            return (
              <div
                key={draft.memberId}
                className="rounded-2xl border border-black/5 bg-[#FAFAFA] p-3"
              >
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-[14px] font-bold text-zymix-text">{member.name}</span>
                  {!draft.preference.trim() && (
                    <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-semibold text-zymix-secondary">
                      No strong preference
                    </span>
                  )}
                </div>
                <label className="mb-2 block">
                  <span className="mb-1 block text-[11px] font-semibold text-zymix-secondary">
                    Preference
                  </span>
                  <input
                    value={draft.preference}
                    onChange={(e) =>
                      updateDraft(draft.memberId, { preference: e.target.value })
                    }
                    placeholder={displayPreference("")}
                    className="w-full rounded-xl border border-black/5 bg-white px-3 py-2 text-[13px] text-zymix-text outline-none focus:border-zymix-green"
                  />
                </label>
                <label className="block">
                  <span className="mb-1 block text-[11px] font-semibold text-zymix-secondary">
                    Hard limit / dealbreaker
                  </span>
                  <input
                    value={draft.hardLimit}
                    onChange={(e) =>
                      updateDraft(draft.memberId, { hardLimit: e.target.value })
                    }
                    placeholder={displayHardLimit("")}
                    className="w-full rounded-xl border border-black/5 bg-white px-3 py-2 text-[13px] text-zymix-text outline-none focus:border-zymix-green"
                  />
                </label>
              </div>
            );
          })}
        </div>

        <button
          type="button"
          onClick={onSave}
          className="mt-5 w-full rounded-2xl bg-zymix-green py-3.5 text-[15px] font-bold text-zymix-text"
        >
          Save & let Verdict decide
        </button>
      </div>
    </div>
  );
}
