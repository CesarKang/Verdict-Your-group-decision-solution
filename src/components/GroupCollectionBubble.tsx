type GroupCollectionBubbleProps = {
  venueName: string;
  pricePerPerson: number;
  memberCount: number;
  requesterName?: string;
};

export function GroupCollectionBubble({
  venueName,
  pricePerPerson,
  memberCount,
  requesterName = "Fangzhe",
}: GroupCollectionBubbleProps) {
  const total = pricePerPerson * memberCount;
  const pendingCount = memberCount - 1;

  return (
    <div className="flex justify-start px-1">
      <div className="max-w-[92%] overflow-hidden rounded-[20px] border border-black/5 bg-white shadow-[0_4px_16px_rgba(0,0,0,0.06)]">
        <div className="border-l-4 border-zymix-green px-4 py-3">
          <div className="mb-2 flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-zymix-green text-[13px] font-bold">
              {"\u2726"}
            </div>
            <span className="rounded-full bg-[#F4FFE4] px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-zymix-text">
              Verdict
            </span>
          </div>

          <p className="text-[15px] font-bold text-zymix-text">Group collection</p>
          <p className="mt-1 text-[13px] text-zymix-secondary">
            Requested by {requesterName} {"\u00b7"} {venueName}
          </p>

          <div className="mt-3 rounded-2xl bg-[#FAFAFA] px-3 py-3">
            <div className="flex items-baseline justify-between">
              <span className="text-[13px] text-zymix-secondary">Per person</span>
              <span className="text-[18px] font-bold text-zymix-text">
                {"\u00a3"}{pricePerPerson.toFixed(2)}
              </span>
            </div>
            <div className="mt-1 flex items-baseline justify-between border-t border-black/5 pt-2">
              <span className="text-[12px] text-zymix-secondary">
                {memberCount} members
              </span>
              <span className="text-[13px] font-semibold text-zymix-text">
                {"\u00a3"}{total.toFixed(2)} total
              </span>
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between rounded-xl bg-[#F4FFE4] px-3 py-2">
            <span className="text-[12px] font-medium text-zymix-text">
              {requesterName} paid
            </span>
            <span className="text-[12px] font-semibold text-zymix-green-dark">
              {pendingCount} pending
            </span>
          </div>

          <p className="mt-2 text-[11px] text-zymix-secondary">
            Demo mock {"\u2014"} not a real payment
          </p>
        </div>
      </div>
    </div>
  );
}
