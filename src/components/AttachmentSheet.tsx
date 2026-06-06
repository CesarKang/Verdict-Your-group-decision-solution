import { Camera, Contact, Gift, Image, MapPin, Sparkles } from "lucide-react";

const tiles = [
  { label: "Photos", icon: Image, action: null },
  { label: "Camera", icon: Camera, action: null },
  { label: "Cash Gift", icon: Gift, action: null },
  { label: "Location", icon: MapPin, action: null },
  { label: "Contact", icon: Contact, action: null },
  { label: "Verdict", icon: Sparkles, action: "verdict" as const },
];

type AttachmentGridProps = {
  onOpenVerdict: () => void;
};

export function AttachmentGrid({ onOpenVerdict }: AttachmentGridProps) {
  const handleTileClick = (action: (typeof tiles)[number]["action"]) => {
    if (action === "verdict") {
      onOpenVerdict();
    }
  };

  return (
    <div className="animate-sheet-up border-t border-black/5 bg-[#F2F2F4] px-6 pb-8 pt-5">
      <div className="grid grid-cols-4 gap-x-2 gap-y-5">
        {tiles.map(({ label, icon: Icon, action }) => (
          <button
            key={label}
            type="button"
            onClick={() => handleTileClick(action)}
            className="flex flex-col items-center gap-2.5"
          >
            <span className="flex h-[58px] w-[58px] items-center justify-center rounded-full bg-white shadow-[0_1px_4px_rgba(0,0,0,0.08)]">
              <Icon className="h-[26px] w-[26px] text-zymix-text" strokeWidth={1.6} />
            </span>
            <span className="text-center text-[12px] font-medium leading-tight text-zymix-text">
              {label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
