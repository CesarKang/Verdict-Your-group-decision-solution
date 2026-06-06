import { X } from "lucide-react";

type SplitBillSheetProps = {
  open: boolean;
  venueName: string;
  pricePerPerson: number;
  memberCount: number;
  onClose: () => void;
  onRequest: () => void;
};

export function SplitBillSheet({
  open,
  venueName,
  pricePerPerson,
  memberCount,
  onClose,
  onRequest,
}: SplitBillSheetProps) {
  if (!open) return null;

  const total = pricePerPerson * memberCount;

  return (
    <div className="absolute inset-0 z-40 flex flex-col justify-end bg-black/30" onClick={onClose}>
      <div
        className="rounded-t-[28px] bg-white px-5 pb-8 pt-4 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <div>
            <div className="mb-1 flex items-center gap-2">
              <h3 className="text-[17px] font-bold text-zymix-text">Split Bill</h3>
              <span className="rounded bg-[#F1F1F3] px-1.5 py-0.5 text-[10px] font-bold uppercase text-zymix-secondary">
                demo
              </span>
            </div>
            <p className="text-[14px] text-zymix-secondary">{venueName}</p>
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

        <div className="rounded-2xl bg-[#FAFAFA] p-4">
          <div className="flex items-center justify-between text-[15px]">
            <span className="text-zymix-secondary">Est. per person</span>
            <span className="font-bold text-zymix-text">{"\u00a3"}{pricePerPerson}</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-[15px]">
            <span className="text-zymix-secondary">Group ({memberCount})</span>
            <span className="font-bold text-zymix-text">{"\u00a3"}{total} total</span>
          </div>
        </div>

        <p className="mt-3 text-[12px] text-zymix-secondary">
          Visual mock only - not a real payment or transaction.
        </p>

        <button
          type="button"
          onClick={onRequest}
          className="mt-4 w-full rounded-2xl bg-zymix-green py-3.5 text-[15px] font-bold text-zymix-text"
        >
          Request from group
        </button>
      </div>
    </div>
  );
}
