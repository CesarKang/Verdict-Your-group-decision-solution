import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AIAgentPanel } from "./components/AIAgentPanel";
import { GroupChat, type ChatLine } from "./components/GroupChat";
import { LiveAISettings } from "./components/LiveAISettings";
import { LocationBubble } from "./components/LocationBubble";
import { PhoneFrame } from "./components/PhoneFrame";
import { PreferenceCollectPanel } from "./components/PreferenceCollectPanel";
import { SplitBillSheet } from "./components/SplitBillSheet";
import { GroupCollectionBubble } from "./components/GroupCollectionBubble";
import { RerollReasonPicker, VerdictCard } from "./components/VerdictCard";
import { VerdictReadingBubble } from "./components/VerdictReadingBubble";
import type { LiveThinkingStatus } from "./components/ThinkingIndicator";
import { dataset } from "./data/dataset";
import { groupProfile as baseGroupProfile } from "./data/groupProfile";
import {
  CURRENT_USER_ID,
  emptyAIAgentProfile,
  emptyPreference,
} from "./data/memberPreferences";
import { getVerdictAnchor, seedMessages } from "./data/seedChat";
import { analyzeStageFromChat, buildPreferenceBundle } from "./lib/groupHabit";
import { readEnvLLMConfig, type LLMRuntimeConfig } from "./lib/llmConfig";
import { getDefaultMode, getVerdict } from "./lib/verdict";
import type {
  AIAgentProfile,
  GroupHabit,
  RerollReason,
  UserPreference,
  Verdict,
  VerdictMode,
  VerdictSource,
} from "./lib/types";
import type { StageInfo } from "./lib/coordinationStage";
import { PreliminaryDirectionCard } from "./components/PreliminaryDirectionCard";
import { preliminaryDirection, videoFinalVerdict } from "./data/prebakedVideo";
import { scheduleVideoDemo } from "./lib/scheduleVideoDemo";
import {
  isVideoAutoplay,
  isVideoDemoMode,
  VIDEO_DEMO_RACHEL_PROFILE,
  VIDEO_DEMO_USER_ID,
  VIDEO_QUOTE_MESSAGE_ID,
  VIDEO_TIMELINE,
} from "./lib/videoDemo";

const READING_MS = 1400;
const GENERATING_MS = 1400;
const SPLIT_BILL_PATTERN = /@verdict\s+split\s+bill/i;
const PRIVACY_HINT_TEXT =
  "\u2726 Privacy: real-time chat reading is on \u2014 Verdict can monitor this group chat";

type DemoPhase =
  | "idle"
  | "reading"
  | "preliminary"
  | "collect-preference"
  | "generating"
  | "verdict";

const videoDemoMode = isVideoDemoMode();
const videoAutoplay = isVideoAutoplay();

function sleep(ms: number) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

export default function App() {
  const [phase, setPhase] = useState<DemoPhase>("idle");
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(null);
  const [anchorMessageId, setAnchorMessageId] = useState<string | null>(null);
  const [readingBubbleVisible, setReadingBubbleVisible] = useState(false);
  const [stageInfo, setStageInfo] = useState<StageInfo | null>(null);
  const [groupHabit, setGroupHabit] = useState<GroupHabit | null>(null);
  const [userPreference, setUserPreference] = useState<UserPreference>(emptyPreference);
  const [feedbackBudget, setFeedbackBudget] = useState("");
  const [feedbackHighlight, setFeedbackHighlight] = useState(false);
  const [messageInput, setMessageInput] = useState("");
  const [dynamicMessages, setDynamicMessages] = useState<ChatLine[]>([]);
  const [attachmentOpen, setAttachmentOpen] = useState(false);
  const [aiAgentPanelOpen, setAiAgentPanelOpen] = useState(false);
  const [aiAgentProfile, setAiAgentProfile] = useState<AIAgentProfile>(emptyAIAgentProfile);
  const [splitBillOpen, setSplitBillOpen] = useState(false);
  const [showRerollPicker, setShowRerollPicker] = useState(false);
  const [verdict, setVerdict] = useState<Verdict | null>(null);
  const [verdictSource, setVerdictSource] = useState<VerdictSource>("seed");
  const [liveLatencyMs, setLiveLatencyMs] = useState<number | undefined>();
  const [liveModel, setLiveModel] = useState<string | undefined>();
  const [liveError, setLiveError] = useState<string | undefined>();
  const [liveStatus, setLiveStatus] = useState<LiveThinkingStatus>("preparing");
  const [liveElapsedMs, setLiveElapsedMs] = useState(0);
  const [isAltVerdict, setIsAltVerdict] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [splitBillRequested, setSplitBillRequested] = useState(false);
  const [locationShared, setLocationShared] = useState(false);
  const [verdictMode, setVerdictMode] = useState<VerdictMode>(getDefaultMode());
  const [llmConfig, setLlmConfig] = useState<LLMRuntimeConfig>(() => readEnvLLMConfig());
  const [showLiveSettings, setShowLiveSettings] = useState(false);
  const elapsedTimerRef = useRef<number | null>(null);
  const messageIdRef = useRef(0);

  const flowActive = phase !== "idle";
  const verdictAnchor = useMemo(
    () => (anchorMessageId ? getVerdictAnchor(anchorMessageId) : null),
    [anchorMessageId],
  );
  const showThinking = phase === "generating";
  const highlightAnchor = anchorMessageId !== null && phase !== "idle";
  const readingActive = phase === "reading";

  const stopElapsedTimer = useCallback(() => {
    if (elapsedTimerRef.current !== null) {
      window.clearInterval(elapsedTimerRef.current);
      elapsedTimerRef.current = null;
    }
  }, []);

  const startElapsedTimer = useCallback(() => {
    stopElapsedTimer();
    const started = performance.now();
    setLiveElapsedMs(0);
    elapsedTimerRef.current = window.setInterval(() => {
      setLiveElapsedMs(Math.round(performance.now() - started));
    }, 100);
  }, [stopElapsedTimer]);

  const activeUserId = videoDemoMode ? VIDEO_DEMO_USER_ID : CURRENT_USER_ID;

  const appendDynamicMessage = useCallback(
    (
      text: string,
      isOwn = true,
      quote?: { authorName: string; text: string },
    ) => {
      messageIdRef.current += 1;
      setDynamicMessages((prev) => [
        ...prev,
        { id: `dyn-${messageIdRef.current}`, text, isOwn, kind: "text", quote },
      ]);
    },
    [],
  );

  const handleMessageSelect = useCallback(
    (messageId: string) => {
      if (flowActive) return;
      setSelectedMessageId(messageId);
    },
    [flowActive],
  );

  const handleVerdictTrigger = useCallback(
    async (messageId: string) => {
      setAnchorMessageId(messageId);
      setSelectedMessageId(messageId);
      setReadingBubbleVisible(true);
      setPhase("reading");
      setStageInfo(null);
      setVerdict(null);
      setConfirmed(false);
      setLiveError(undefined);

      if (videoDemoMode) {
        stopElapsedTimer();
        return;
      }

      if (verdictMode === "live") {
        startElapsedTimer();
        setLiveStatus("calling");
        await sleep(READING_MS);
      } else {
        stopElapsedTimer();
        await sleep(READING_MS);
      }

      const stage = await analyzeStageFromChat(seedMessages, messageId);
      setStageInfo(stage);
      stopElapsedTimer();
      setLiveStatus("preparing");
      setPhase("collect-preference");
    },
    [verdictMode, startElapsedTimer, stopElapsedTimer, videoDemoMode],
  );

  const showPreliminaryDirection = useCallback(() => {
    const messageId = anchorMessageId ?? VIDEO_QUOTE_MESSAGE_ID;
    const bundle = buildPreferenceBundle(
      seedMessages,
      messageId,
      activeUserId,
      emptyPreference(),
      VIDEO_DEMO_RACHEL_PROFILE,
    );
    setGroupHabit(bundle.groupHabit);
    setStageInfo(bundle.stage);
    setPhase("preliminary");
  }, [anchorMessageId, activeUserId]);

  const runFinalVerdict = useCallback(
    async (useAlt: boolean, preference: UserPreference, rerollReason?: RerollReason) => {
      if (!anchorMessageId) return;

      setPhase("generating");
      setShowRerollPicker(false);
      setVerdict(null);
      setConfirmed(false);
      setLiveError(undefined);
      setLiveLatencyMs(undefined);
      setLiveModel(undefined);

      const profile = videoDemoMode ? VIDEO_DEMO_RACHEL_PROFILE : aiAgentProfile;
      const bundle = buildPreferenceBundle(
        seedMessages,
        anchorMessageId,
        activeUserId,
        preference,
        profile,
      );
      setGroupHabit(bundle.groupHabit);
      setStageInfo(bundle.stage);

      if (videoDemoMode) {
        stopElapsedTimer();
        await sleep(GENERATING_MS);
        setVerdict({
          ...videoFinalVerdict,
          moreInfo: {
            ...videoFinalVerdict.moreInfo,
            hardLimitsRespected: bundle.groupHabit.hardLimits,
          },
        });
        setVerdictSource("seed");
        setIsAltVerdict(false);
        setPhase("verdict");
        return;
      }

      if (verdictMode === "live") {
        startElapsedTimer();
        setLiveStatus("calling");
      } else {
        stopElapsedTimer();
        await sleep(GENERATING_MS);
      }

      const result = await getVerdict(seedMessages, baseGroupProfile, dataset, {
        mode: verdictMode,
        useAlt,
        anchorMessageId,
        rerollReason,
        llmConfig,
        preferenceBundle: bundle,
      });

      stopElapsedTimer();

      if (verdictMode === "live" && result.source === "live") {
        setLiveStatus("parsing");
        await sleep(350);
      }

      if (result.source === "fallback") {
        setLiveStatus("fallback");
        setLiveError(result.liveError);
        await sleep(900);
      }

      setVerdict(result.verdict);
      setVerdictSource(result.source);
      setLiveLatencyMs(result.liveLatencyMs);
      setLiveModel(result.liveModel);
      setIsAltVerdict(useAlt);
      setPhase("verdict");
      setLiveStatus("preparing");
    },
    [anchorMessageId, verdictMode, llmConfig, startElapsedTimer, stopElapsedTimer, aiAgentProfile, activeUserId, videoDemoMode],
  );

  const submitVideoFeedback = useCallback(() => {
    const preference = { ...emptyPreference(), budget: feedbackBudget };
    setUserPreference(preference);
    setFeedbackHighlight(false);
    void runFinalVerdict(false, preference);
  }, [feedbackBudget, runFinalVerdict]);

  const sendVideoVerdictCommand = useCallback(() => {
    const anchor = getVerdictAnchor(VIDEO_QUOTE_MESSAGE_ID);
    appendDynamicMessage("@Verdict", true, {
      authorName: anchor.authorName,
      text: anchor.preview,
    });
    setMessageInput("");
    void handleVerdictTrigger(VIDEO_QUOTE_MESSAGE_ID);
  }, [appendDynamicMessage, handleVerdictTrigger]);

  const handlePreferenceSubmit = useCallback(() => {
    void runFinalVerdict(false, userPreference);
  }, [runFinalVerdict, userPreference]);

  const handleReroll = useCallback(
    (reason: RerollReason) => {
      void runFinalVerdict(true, userPreference, reason);
    },
    [runFinalVerdict, userPreference],
  );

  const handleSendMessage = useCallback(() => {
    const text = messageInput.trim();
    if (!text) return;

    appendDynamicMessage(text, true);
    setMessageInput("");

    if (SPLIT_BILL_PATTERN.test(text)) {
      if (phase === "verdict" && verdict) {
        setSplitBillOpen(true);
      } else {
        messageIdRef.current += 1;
        setDynamicMessages((prev) => [
          ...prev,
          {
            id: `dyn-${messageIdRef.current}`,
            text: "Need a Verdict decision first before splitting the bill.",
            kind: "system",
          },
        ]);
      }
    }
  }, [messageInput, appendDynamicMessage, phase, verdict]);

  const handleAiAgentProfileChange = useCallback((next: AIAgentProfile) => {
    const turningOn =
      !aiAgentProfile.allowRealtimeChatRead && next.allowRealtimeChatRead;
    setAiAgentProfile(next);
    if (turningOn) {
      messageIdRef.current += 1;
      setDynamicMessages((prev) => [
        ...prev,
        {
          id: `dyn-${messageIdRef.current}`,
          text: PRIVACY_HINT_TEXT,
          kind: "hint" as const,
        },
      ]);
    }
  }, [aiAgentProfile.allowRealtimeChatRead]);

  const resetDemo = useCallback(() => {
    stopElapsedTimer();
    setPhase("idle");
    setSelectedMessageId(null);
    setAnchorMessageId(null);
    setReadingBubbleVisible(false);
    setStageInfo(null);
    setGroupHabit(null);
    setUserPreference(emptyPreference());
    setMessageInput("");
    setDynamicMessages([]);
    setAttachmentOpen(false);
    setAiAgentPanelOpen(false);
    setAiAgentProfile(emptyAIAgentProfile());
    setSplitBillOpen(false);
    setShowRerollPicker(false);
    setVerdict(null);
    setVerdictSource("seed");
    setLiveLatencyMs(undefined);
    setLiveModel(undefined);
    setLiveError(undefined);
    setLiveStatus("preparing");
    setLiveElapsedMs(0);
    setIsAltVerdict(false);
    setConfirmed(false);
    setSplitBillRequested(false);
    setLocationShared(false);
  }, [stopElapsedTimer]);

  const pricePerPerson = useMemo(() => {
    if (!verdict) return 12;
    const match = verdict.actions
      .find((a) => a.type === "split_bill")
      ?.label.match(/\u00a3(\d+)/);
    return match ? Number(match[1]) : 12;
  }, [verdict]);

  const selectedPlan = useMemo(() => {
    if (!verdict) return null;
    return dataset.find((p) => p.id === verdict.verdict.planId) ?? null;
  }, [verdict]);

  const extraMessages = useMemo(() => {
    const nodes = [];

    if (readingBubbleVisible && verdictAnchor) {
      nodes.push(
        <VerdictReadingBubble
          key="reading-bubble"
          anchor={verdictAnchor}
          active={readingActive}
        />,
      );
    }

    if (phase === "preliminary") {
      nodes.push(
        <PreliminaryDirectionCard key="preliminary" verdict={preliminaryDirection} />,
      );
    }

    if (phase === "verdict" && verdict) {
      nodes.push(
        <VerdictCard
          key={`verdict-${isAltVerdict ? "alt" : "primary"}-${verdictSource}`}
          verdict={verdict}
          source={verdictSource}
          liveLatencyMs={liveLatencyMs}
          liveModel={liveModel}
          groupHabit={groupHabit ?? undefined}
          confirmed={confirmed}
          onConfirm={() => setConfirmed(true)}
          onShareLocation={() => setLocationShared(true)}
          onReroll={() => setShowRerollPicker(true)}
          showReroll={!isAltVerdict && !videoDemoMode}
          confirmLabel={videoDemoMode ? "Confirm Plan" : "Confirm"}
          hideSourceBadge={videoDemoMode}
        />,
      );
    }

    if (showRerollPicker) {
      nodes.push(
        <RerollReasonPicker
          key="reroll"
          onSelect={handleReroll}
          onCancel={() => setShowRerollPicker(false)}
        />,
      );
    }

    if (locationShared && selectedPlan) {
      nodes.push(
        <LocationBubble
          key="location"
          venueName={verdict?.verdict.name ?? selectedPlan.name}
          area={selectedPlan.area}
        />,
      );
    }

    if (splitBillRequested && verdict) {
      nodes.push(
        <GroupCollectionBubble
          key="group-collection"
          venueName={verdict.verdict.name}
          pricePerPerson={pricePerPerson}
          memberCount={baseGroupProfile.members.length}
        />,
      );
    }

    return nodes;
  }, [
    readingBubbleVisible,
    verdictAnchor,
    readingActive,
    phase,
    verdict,
    verdictSource,
    liveLatencyMs,
    liveModel,
    groupHabit,
    confirmed,
    isAltVerdict,
    showRerollPicker,
    splitBillRequested,
    locationShared,
    selectedPlan,
    pricePerPerson,
    handleReroll,
  ]);

  useEffect(() => {
    if (!videoDemoMode) return;
    setAiAgentProfile(VIDEO_DEMO_RACHEL_PROFILE);
    setVerdictMode("seed");
  }, []);

  useEffect(() => {
    if (!videoDemoMode || !videoAutoplay) return;

    const showPreliminaryTimer = window.setTimeout(
      showPreliminaryDirection,
      VIDEO_TIMELINE.readingEnd,
    );

    const cleanup = scheduleVideoDemo({
      highlightAnchor: () => {
        setSelectedMessageId(VIDEO_QUOTE_MESSAGE_ID);
        setAnchorMessageId(VIDEO_QUOTE_MESSAGE_ID);
      },
      setInput: setMessageInput,
      sendVerdictCommand: sendVideoVerdictCommand,
      setFeedback: (value) => {
        setFeedbackBudget(value);
        setFeedbackHighlight(true);
      },
      submitBudget: submitVideoFeedback,
      confirmPlan: () => setConfirmed(true),
      openSplitBill: () => {
        appendDynamicMessage("@Verdict split bill", true);
        setMessageInput("");
        setSplitBillOpen(true);
      },
      requestSplitBill: () => {
        setSplitBillOpen(false);
        setSplitBillRequested(true);
      },
    });

    return () => {
      window.clearTimeout(showPreliminaryTimer);
      cleanup();
    };
  }, [
    videoAutoplay,
    showPreliminaryDirection,
    sendVideoVerdictCommand,
    submitVideoFeedback,
  ]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setAttachmentOpen(false);
        setAiAgentPanelOpen(false);
        setSplitBillOpen(false);
        setShowLiveSettings(false);
        setShowRerollPicker(false);
        if (phase === "collect-preference") {
          setPhase("idle");
          setAnchorMessageId(null);
          setReadingBubbleVisible(false);
        }
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      stopElapsedTimer();
    };
  }, [phase, stopElapsedTimer]);

  return (
    <div className="relative">
      <PhoneFrame>
        <div className="relative flex min-h-0 flex-1 flex-col">
          {!videoDemoMode && (
          <div className="absolute left-0 right-0 top-0 z-20 flex items-center justify-between bg-white/90 px-4 py-2 backdrop-blur">
            <div className="flex items-center gap-2">
              <span className="text-[13px] font-black tracking-[0.18em] text-zymix-text">ZYMIX</span>
              {verdictMode === "live" && (
                <span className="rounded-full bg-zymix-green px-2 py-0.5 text-[10px] font-bold text-zymix-text">
                  LIVE
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowLiveSettings(true)}
                className="rounded-full px-2 py-1 text-[12px] text-zymix-secondary hover:bg-black/5"
                title="Live AI settings"
              >
                {"\u2699\uFE0F"}
              </button>
              <button
                type="button"
                onClick={resetDemo}
                className="rounded-full bg-[#F1F1F3] px-3 py-1 text-[12px] font-semibold text-zymix-text hover:bg-[#E8E8EA]"
              >
                {"\u21BB Reset demo"}
              </button>
            </div>
          </div>
          )}

          <div className={`flex min-h-0 flex-1 flex-col ${videoDemoMode ? "" : "pt-10"}`}>
            <GroupChat
              extraMessages={extraMessages}
              dynamicMessages={dynamicMessages}
              showThinking={showThinking}
              thinkingPhase="generating"
              selectedMessageId={selectedMessageId}
              anchorMessageId={anchorMessageId}
              verdictAnchor={verdictAnchor}
              stageInfo={stageInfo}
              highlightAnchor={highlightAnchor}
              liveMode={verdictMode === "live"}
              liveStatus={liveStatus}
              liveElapsedMs={liveElapsedMs}
              liveError={liveError}
              flowActive={flowActive}
              messageInput={messageInput}
              onMessageInputChange={setMessageInput}
              onSendMessage={handleSendMessage}
              onMessageSelect={handleMessageSelect}
              onVerdictTrigger={handleVerdictTrigger}
              onOpenAttachment={() => setAttachmentOpen(true)}
              attachmentOpen={attachmentOpen}
              onCloseAttachment={() => setAttachmentOpen(false)}
              onOpenVerdictProfile={() => {
                setAttachmentOpen(false);
                setAiAgentPanelOpen(true);
              }}
              currentUserId={activeUserId}
              videoDemoMode={videoDemoMode}
              feedbackBarValue={feedbackBudget}
              onFeedbackBarChange={setFeedbackBudget}
              onFeedbackBarConfirm={submitVideoFeedback}
              showFeedbackBar={videoDemoMode && phase === "preliminary"}
              feedbackBarHighlight={feedbackHighlight}
              realtimePrivacyEnabled={aiAgentProfile.allowRealtimeChatRead}
            />
          </div>

          <AIAgentPanel
            open={aiAgentPanelOpen}
            profile={aiAgentProfile}
            onChange={handleAiAgentProfileChange}
            onClose={() => setAiAgentPanelOpen(false)}
          />

          <PreferenceCollectPanel
            open={!videoDemoMode && phase === "collect-preference"}
            preference={userPreference}
            onChange={setUserPreference}
            onSubmit={handlePreferenceSubmit}
            onClose={() => {
              setPhase("idle");
              setAnchorMessageId(null);
              setReadingBubbleVisible(false);
            }}
          />

          <LiveAISettings
            open={showLiveSettings}
            onClose={() => setShowLiveSettings(false)}
            mode={verdictMode}
            onModeChange={setVerdictMode}
            config={llmConfig}
            onConfigChange={setLlmConfig}
          />

          <SplitBillSheet
            open={splitBillOpen}
            venueName={verdict?.verdict.name ?? "Spitalfields Market food stalls"}
            pricePerPerson={pricePerPerson}
            memberCount={baseGroupProfile.members.length}
            onClose={() => setSplitBillOpen(false)}
            onRequest={() => {
              setSplitBillOpen(false);
              setSplitBillRequested(true);
            }}
          />
        </div>
      </PhoneFrame>
    </div>
  );
}
