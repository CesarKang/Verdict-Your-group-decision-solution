import { Compass, Grid2X2, MessageCircle, Play, User } from "lucide-react";

export function BottomNav() {
  return (
    <div className="border-t border-black/5 bg-white px-6 pb-6 pt-2">
      <div className="flex items-center justify-between text-zymix-secondary">
        <div className="flex flex-col items-center gap-1 rounded-full bg-[#EAF7DA] px-4 py-1.5 text-zymix-green-dark">
          <MessageCircle className="h-5 w-5" strokeWidth={2.2} />
        </div>
        <Compass className="h-5 w-5" strokeWidth={2} />
        <Play className="h-5 w-5" strokeWidth={2} />
        <Grid2X2 className="h-5 w-5" strokeWidth={2} />
        <User className="h-5 w-5" strokeWidth={2} />
      </div>
    </div>
  );
}
