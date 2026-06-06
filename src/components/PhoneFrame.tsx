import { Battery, Signal, Wifi } from "lucide-react";
import type { ReactNode } from "react";

type PhoneFrameProps = {
  children: ReactNode;
  footer?: ReactNode;
};

export function PhoneFrame({ children, footer }: PhoneFrameProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f5f5f7] p-4">
      <div className="relative flex h-[min(840px,100dvh)] w-full max-w-[390px] flex-col overflow-hidden rounded-[40px] bg-white shadow-[0_24px_80px_rgba(0,0,0,0.12)]">
        <div className="flex items-center justify-between px-6 pb-1 pt-3 text-[13px] font-semibold text-zymix-text">
          <span>17:10</span>
          <div className="flex items-center gap-1.5 text-zymix-text">
            <Signal className="h-3.5 w-3.5" strokeWidth={2.5} />
            <Wifi className="h-3.5 w-3.5" strokeWidth={2.5} />
            <Battery className="h-3.5 w-3.5" strokeWidth={2.5} />
          </div>
        </div>
        <div className="flex min-h-0 flex-1 flex-col">{children}</div>
        {footer}
      </div>
    </div>
  );
}
