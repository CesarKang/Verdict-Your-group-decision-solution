type VerdictMentionProps = {
  onClick: () => void;
};

export function VerdictMention({ onClick }: VerdictMentionProps) {
  return (
    <div className={`flex ${"justify-start"} mb-1 px-1`}>
      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          onClick();
        }}
        className="animate-slide-up rounded-full border border-zymix-green/50 bg-[#F4FFE4] px-3 py-1 text-[12px] font-bold text-zymix-text shadow-sm hover:bg-zymix-green/30"
      >
        {"\u2726 @Verdict"}
      </button>
    </div>
  );
}
