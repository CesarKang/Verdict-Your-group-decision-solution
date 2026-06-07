type MessageBubbleProps = {
  text?: string;
  isOwn?: boolean;
  authorName?: string;
  time?: string;
  kind?: "text" | "meme" | "system";
  highlighted?: boolean;
  quote?: { authorName: string; text: string };
};

export function MessageBubble({
  text,
  isOwn,
  authorName,
  time,
  kind = "text",
  highlighted = false,
  quote,
}: MessageBubbleProps) {
  const authorLabel = authorName ? (
    <p
      className={`mb-1 px-1 text-[12px] font-bold text-zymix-text ${
        isOwn ? "text-right" : "text-left"
      }`}
    >
      {authorName}
    </p>
  ) : null;
  if (kind === "system") {
    return (
      <div className="flex justify-center py-1">
        <span className="rounded-full bg-[#F1F1F3] px-3 py-1 text-[12px] text-zymix-secondary">
          {text}
        </span>
      </div>
    );
  }

  if (kind === "meme") {
    return (
      <div className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
        <div className="max-w-[72%]">
          {authorLabel}
          <div className="overflow-hidden rounded-[18px] bg-[#FFE8A3] p-3">
          <div className="flex h-24 w-40 items-center justify-center rounded-xl bg-[#FFD166] text-3xl">
            {"\u{1F3C0}\u{1F480}"}
          </div>
          <p className="mt-2 text-[11px] font-medium uppercase tracking-wide text-zymix-secondary">
            meme
          </p>
          {time && <p className="mt-1 text-right text-[11px] text-zymix-secondary">{time}</p>}
        </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
      <div className="max-w-[78%]">
        {authorLabel}
        <div
        className={`rounded-[18px] px-3.5 py-2.5 text-[15px] leading-snug ${
          isOwn ? "bg-zymix-sent text-zymix-text" : "bg-zymix-received text-zymix-text"
        } ${highlighted ? "ring-2 ring-zymix-green ring-offset-2" : ""}`}
      >
        {quote && (
          <div className="mb-2 rounded-lg border-l-[3px] border-zymix-green bg-black/[0.04] px-2.5 py-1.5">
            <p className="text-[11px] font-semibold text-zymix-text">{quote.authorName}</p>
            <p className="text-[12px] leading-snug text-zymix-secondary">{quote.text}</p>
          </div>
        )}
        <p>{text}</p>
        <div className={`mt-1 flex items-center gap-1 ${isOwn ? "justify-end" : "justify-start"}`}>
          {isOwn && <span className="text-[11px] text-zymix-green-dark">{"\u2713\u2713"}</span>}
          {time && <span className="text-[11px] text-zymix-secondary">{time}</span>}
        </div>
      </div>
      </div>
    </div>
  );
}
