type PreferenceFeedbackBarProps = {
  value: string;
  onChange: (value: string) => void;
  onConfirm: () => void;
  visible?: boolean;
  highlight?: boolean;
};

export function PreferenceFeedbackBar({
  value,
  onChange,
  onConfirm,
  visible = true,
  highlight = false,
}: PreferenceFeedbackBarProps) {
  if (!visible) return null;

  return (
    <div
      className={`border-t border-black/5 bg-white px-3 py-2.5 ${
        highlight ? "ring-2 ring-zymix-green ring-inset" : ""
      }`}
    >
      <p className="mb-2 text-[11px] font-bold uppercase tracking-wide text-zymix-secondary">
        Your feedback for tonight
      </p>
      <div className="flex items-center gap-2">
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="e.g. budget under \u00a320"
          className="min-h-[40px] flex-1 rounded-full bg-[#F1F1F3] px-4 text-[14px] text-zymix-text outline-none focus:ring-2 focus:ring-zymix-green/40"
        />
        <button
          type="button"
          onClick={onConfirm}
          className="shrink-0 rounded-full bg-zymix-green px-4 py-2.5 text-[13px] font-bold text-zymix-text"
        >
          Confirm
        </button>
      </div>
    </div>
  );
}
