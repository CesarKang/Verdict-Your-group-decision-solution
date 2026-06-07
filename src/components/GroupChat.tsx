import { Camera, Mic, Plus, Smile } from "lucide-react";
import type { FormEvent, ReactNode } from "react";
import { groupProfile } from "../data/groupProfile";
import { seedMessages } from "../data/seedChat";
import { AttachmentGrid } from "./AttachmentSheet";
import { PreferenceFeedbackBar } from "./PreferenceFeedbackBar";
import { MessageBubble } from "./MessageBubble";
import { ThinkingIndicator, type LiveThinkingStatus, type ThinkingPhase } from "./ThinkingIndicator";
import { VerdictMention } from "./VerdictMention";
import type { StageInfo } from "../lib/coordinationStage";
import type { VerdictAnchor } from "../lib/types";

export type ChatLine = {
  id: string;
  text: string;
  isOwn?: boolean;
  kind?: "text" | "system";
  quote?: { authorName: string; text: string };
};

type GroupChatProps = {
  extraMessages?: ReactNode[];
  dynamicMessages?: ChatLine[];
  showThinking?: boolean;
  thinkingPhase?: ThinkingPhase;
  selectedMessageId?: string | null;
  anchorMessageId?: string | null;
  verdictAnchor?: VerdictAnchor | null;
  stageInfo?: StageInfo | null;
  highlightAnchor?: boolean;
  liveMode?: boolean;
  liveStatus?: LiveThinkingStatus;
  liveElapsedMs?: number;
  liveError?: string;
  flowActive?: boolean;
  messageInput: string;
  onMessageInputChange: (value: string) => void;
  onSendMessage: () => void;
  onMessageSelect: (messageId: string) => void;
  onVerdictTrigger: (messageId: string) => void;
  onOpenAttachment: () => void;
  attachmentOpen?: boolean;
  onCloseAttachment?: () => void;
  onOpenVerdictProfile?: () => void;
  currentUserId?: string;
  videoDemoMode?: boolean;
  feedbackBarValue?: string;
  onFeedbackBarChange?: (value: string) => void;
  onFeedbackBarConfirm?: () => void;
  showFeedbackBar?: boolean;
  feedbackBarHighlight?: boolean;
};

export function GroupChat({
  extraMessages = [],
  dynamicMessages = [],
  showThinking = false,
  thinkingPhase = "reading",
  selectedMessageId = null,
  anchorMessageId = null,
  verdictAnchor = null,
  stageInfo = null,
  highlightAnchor = false,
  liveMode = false,
  liveStatus = "preparing",
  liveElapsedMs = 0,
  liveError,
  flowActive = false,
  messageInput,
  onMessageInputChange,
  onSendMessage,
  onMessageSelect,
  onVerdictTrigger,
  onOpenAttachment,
  attachmentOpen = false,
  onCloseAttachment,
  onOpenVerdictProfile,
  currentUserId = "fangzhe",
  videoDemoMode = false,
  feedbackBarValue = "",
  onFeedbackBarChange,
  onFeedbackBarConfirm,
  showFeedbackBar = false,
  feedbackBarHighlight = false,
}: GroupChatProps) {
  const memberNames = Object.fromEntries(
    groupProfile.members.map((member) => [member.id, member.name]),
  );

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    onSendMessage();
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <header className="border-b border-black/5 px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#EAF7DA] text-lg font-bold">
            TS
          </div>
          <div>
            <h1 className="text-[16px] font-bold text-zymix-text">the squad</h1>
            <p className="text-[13px] text-zymix-secondary">4 Members</p>
          </div>
        </div>
      </header>

      <div className="relative min-h-0 flex-1">
        {attachmentOpen && onCloseAttachment && (
          <button
            type="button"
            aria-label="Close attachments"
            className="absolute inset-0 z-10 animate-backdrop-in bg-black/10"
            onClick={onCloseAttachment}
          />
        )}
        <div className="relative z-0 h-full space-y-2 overflow-y-auto px-3 py-3">
        {!flowActive && !videoDemoMode && (
          <p className="px-1 pb-1 text-center text-[11px] text-zymix-secondary">
            Tap a message, then {"\u2726 @Verdict"} to decide from there
          </p>
        )}

        {seedMessages.map((message) => {
          const isSelected = selectedMessageId === message.id;
          const isAnchor = highlightAnchor && message.id === anchorMessageId;
          const showMention = isSelected && !flowActive;

          return (
            <div key={message.id}>
              {showMention && (
                <VerdictMention onClick={() => onVerdictTrigger(message.id)} />
              )}
              <button
                type="button"
                className="w-full text-left disabled:cursor-default"
                disabled={flowActive}
                onClick={() => onMessageSelect(message.id)}
              >
                <MessageBubble
                  text={message.text}
                  isOwn={message.memberId === currentUserId}
                  authorName={memberNames[message.memberId]}
                  time={message.time}
                  kind={message.kind ?? "text"}
                  highlighted={isAnchor || isSelected}
                />
              </button>
            </div>
          );
        })}

        {extraMessages}

        {dynamicMessages.map((message) => (
          <MessageBubble
            key={message.id}
            text={message.text}
            isOwn={message.isOwn}
            authorName={message.isOwn ? memberNames[currentUserId] : undefined}
            kind={message.kind ?? "text"}
            quote={message.quote}
          />
        ))}

        {showThinking && (
          <ThinkingIndicator
            anchor={verdictAnchor ?? undefined}
            stage={stageInfo ?? undefined}
            phase={thinkingPhase}
            liveMode={liveMode}
            liveStatus={liveStatus}
            elapsedMs={liveElapsedMs}
            liveError={liveError}
            showStage={false}
          />
        )}
        </div>
      </div>

      <form
        className="relative z-20 border-t border-black/5 bg-white px-3 py-2 pb-4"
        onSubmit={handleSubmit}
      >
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={attachmentOpen ? onCloseAttachment : onOpenAttachment}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#F1F1F3] text-zymix-text"
            aria-label="Open attachments"
          >
            <Plus className="h-5 w-5" strokeWidth={2.2} />
          </button>
          <input
            value={messageInput}
            onChange={(event) => onMessageInputChange(event.target.value)}
            placeholder={attachmentOpen ? "Message" : 'Message\u2026 try "@Verdict"'}
            className="min-h-[40px] flex-1 rounded-full bg-[#F1F1F3] px-4 text-[15px] text-zymix-text outline-none placeholder:text-zymix-secondary focus:ring-2 focus:ring-zymix-green/40"
          />
          <Smile className="h-5 w-5 shrink-0 text-zymix-secondary" />
          <Camera className="h-5 w-5 shrink-0 text-zymix-secondary" />
          <Mic className="h-5 w-5 shrink-0 text-zymix-secondary" />
        </div>
      </form>

      {showFeedbackBar && onFeedbackBarChange && onFeedbackBarConfirm && (
        <PreferenceFeedbackBar
          value={feedbackBarValue}
          onChange={onFeedbackBarChange}
          onConfirm={onFeedbackBarConfirm}
          highlight={feedbackBarHighlight}
        />
      )}

      {attachmentOpen && onOpenVerdictProfile && (
        <div className="relative z-20 shrink-0">
          <AttachmentGrid onOpenVerdict={onOpenVerdictProfile} />
        </div>
      )}
    </div>
  );
}
