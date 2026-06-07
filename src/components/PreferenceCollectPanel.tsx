import type { UserPreference } from "../lib/types";

type PreferenceCollectPanelProps = {
  open: boolean;
  preference: UserPreference;
  onChange: (preference: UserPreference) => void;
  onSubmit: () => void;
  onClose: () => void;
};

const fields: { key: keyof UserPreference; label: string; placeholder: string }[] = [
  { key: "vibe", label: "Vibe", placeholder: "e.g. chill, outdoor" },
  { key: "budget", label: "Budget", placeholder: "e.g. free\u2013\u00a320" },
  { key: "location", label: "Location", placeholder: "e.g. east preferred" },
  { key: "time", label: "Time", placeholder: "e.g. Saturday afternoon" },
];

export function PreferenceCollectPanel({
  open,
  preference,
  onChange,
  onSubmit,
  onClose,
}: PreferenceCollectPanelProps) {
  if (!open) return null;

  return (
    <div className="absolute inset-0 z-40 flex flex-col justify-end bg-black/30" onClick={onClose}>
      <div
        className="rounded-t-[28px] bg-white px-5 pb-8 pt-4 shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-1 flex items-start justify-between gap-3">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wide text-zymix-green-dark">
              Your turn
            </p>
            <h3 className="text-[17px] font-bold text-zymix-text">Add your preferences</h3>
            <p className="mt-1 text-[13px] leading-snug text-zymix-secondary">
              Only you see this form. Leave blank for{" "}
              <span className="font-semibold text-zymix-text">No strong preference</span>.
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

        <div className="mt-4 space-y-3">
          {fields.map(({ key, label, placeholder }) => (
            <label key={key} className="block">
              <span className="mb-1 block text-[11px] font-semibold text-zymix-secondary">
                {label}
              </span>
              <input
                value={preference[key]}
                onChange={(event) =>
                  onChange({ ...preference, [key]: event.target.value })
                }
                placeholder={placeholder}
                className="w-full rounded-xl border border-black/5 bg-[#FAFAFA] px-3 py-2.5 text-[13px] text-zymix-text outline-none focus:border-zymix-green"
              />
            </label>
          ))}
        </div>

        <p className="mt-3 text-[11px] text-zymix-secondary">
          Others who haven&apos;t replied count as No strong preference. Verdict still decides.
        </p>

        <button
          type="button"
          onClick={onSubmit}
          className="mt-4 w-full rounded-2xl bg-zymix-green py-3.5 text-[15px] font-bold text-zymix-text"
        >
          Submit preferences
        </button>
      </div>
    </div>
  );
}
