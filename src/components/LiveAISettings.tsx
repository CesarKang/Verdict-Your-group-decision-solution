import { useState } from "react";
import type { LLMRuntimeConfig } from "../lib/llmConfig";
import { isLLMConfigured, maskApiKey, readEnvLLMConfig } from "../lib/llmConfig";
import { testLLMConnection } from "../lib/llmClient";
import {
  detectProviderId,
  PROVIDER_PRESETS,
  type ProviderPreset,
} from "../lib/providerPresets";
import type { VerdictMode } from "../lib/types";

type LiveAISettingsProps = {
  open: boolean;
  onClose: () => void;
  mode: VerdictMode;
  onModeChange: (mode: VerdictMode) => void;
  config: LLMRuntimeConfig;
  onConfigChange: (config: LLMRuntimeConfig) => void;
};

export function LiveAISettings({
  open,
  onClose,
  mode,
  onModeChange,
  config,
  onConfigChange,
}: LiveAISettingsProps) {
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<string | null>(null);
  const envConfig = readEnvLLMConfig();
  const configured = isLLMConfigured(config);
  const activeProvider = detectProviderId(config.baseUrl);
  const activePreset = PROVIDER_PRESETS.find((preset) => preset.id === activeProvider);

  if (!open) return null;

  const applyPreset = (preset: ProviderPreset) => {
    onConfigChange({
      ...config,
      baseUrl: preset.baseUrl,
      model: preset.model,
    });
    setTestResult(null);
  };

  const runTest = async () => {
    setTesting(true);
    setTestResult(null);
    const result = await testLLMConnection(config);
    setTesting(false);
    setTestResult(
      result.ok
        ? `${result.message}${result.latencyMs ? ` \u00b7 ${result.latencyMs}ms` : ""}`
        : result.message,
    );
  };

  return (
    <div className="absolute inset-0 z-50 flex items-start justify-center bg-black/35 p-4 pt-16" onClick={onClose}>
      <div
        className="w-full max-w-[360px] rounded-[24px] bg-white p-4 shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-3 flex items-start justify-between gap-3">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wide text-zymix-green-dark">
              Live AI
            </p>
            <h3 className="text-[17px] font-bold text-zymix-text">Real-time Verdict</h3>
            <p className="mt-1 text-[12px] leading-snug text-zymix-secondary">
              Key stays in this browser session only. For permanent setup, use a local{" "}
              <code className="rounded bg-[#F1F1F3] px-1">.env</code> file.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full px-2 py-1 text-[12px] text-zymix-secondary hover:bg-black/5"
          >
            Close
          </button>
        </div>

        <div className="mb-4">
          <p className="mb-2 text-[12px] font-bold uppercase tracking-wide text-zymix-secondary">
            Mode
          </p>
          <div className="flex gap-2">
            {(["seed", "live"] as const).map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => onModeChange(item)}
                className={`rounded-full px-3 py-1.5 text-[12px] font-semibold ${
                  mode === item
                    ? "bg-zymix-green text-zymix-text"
                    : "bg-[#F1F1F3] text-zymix-secondary"
                }`}
              >
                {item === "seed" ? "Demo seed" : "Live AI"}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <p className="mb-2 text-[12px] font-bold uppercase tracking-wide text-zymix-secondary">
            Provider
          </p>
          <div className="flex flex-wrap gap-2">
            {PROVIDER_PRESETS.map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => applyPreset(preset)}
                className={`rounded-full px-3 py-1.5 text-[12px] font-semibold ${
                  activeProvider === preset.id
                    ? "bg-zymix-green text-zymix-text"
                    : "bg-[#F1F1F3] text-zymix-secondary"
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <label className="block">
            <span className="mb-1 block text-[11px] font-semibold text-zymix-secondary">
              Base URL
            </span>
            <input
              value={config.baseUrl}
              onChange={(event) => onConfigChange({ ...config, baseUrl: event.target.value })}
              placeholder="https://api.openai.com/v1"
              className="w-full rounded-xl border border-black/5 bg-[#FAFAFA] px-3 py-2 text-[13px] outline-none focus:border-zymix-green"
            />
          </label>

          <label className="block">
            <span className="mb-1 block text-[11px] font-semibold text-zymix-secondary">
              API Key
            </span>
            <input
              type="password"
              value={config.apiKey}
              onChange={(event) => onConfigChange({ ...config, apiKey: event.target.value })}
              placeholder={envConfig.apiKey ? "Loaded from .env" : "sk-..."}
              className="w-full rounded-xl border border-black/5 bg-[#FAFAFA] px-3 py-2 text-[13px] outline-none focus:border-zymix-green"
            />
            <p className="mt-1 text-[11px] text-zymix-secondary">
              Current: {maskApiKey(config.apiKey || envConfig.apiKey)}
            </p>
          </label>

          <label className="block">
            <span className="mb-1 block text-[11px] font-semibold text-zymix-secondary">
              Model
            </span>
            <input
              value={config.model}
              onChange={(event) => onConfigChange({ ...config, model: event.target.value })}
              placeholder={activePreset?.model ?? "gpt-4o-mini"}
              className="w-full rounded-xl border border-black/5 bg-[#FAFAFA] px-3 py-2 text-[13px] outline-none focus:border-zymix-green"
            />
            <p className="mt-1 text-[11px] text-zymix-secondary">
              {activePreset
                ? `Try: ${activePreset.modelHint}`
                : "Use the exact model id from your provider docs"}
            </p>
          </label>
        </div>

        <div className="mt-4 rounded-2xl bg-[#FAFAFA] px-3 py-3">
          <p className="text-[12px] font-semibold text-zymix-text">
            Status:{" "}
            {mode === "live" && configured
              ? "Live AI ready"
              : mode === "live"
                ? "Live mode selected, key missing"
                : "Demo seed mode"}
          </p>
          {mode === "live" && !configured && (
            <p className="mt-1 text-[11px] text-zymix-secondary">
              Add an API key here or in `.env`, then run Verdict again.
            </p>
          )}
          {testResult && (
            <p className={`mt-2 text-[11px] ${testResult.startsWith("Connected") ? "text-zymix-green-dark" : "text-[#8A6A00]"}`}>
              {testResult}
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={() => void runTest()}
          disabled={testing || !configured}
          className="mt-4 w-full rounded-2xl border border-black/10 bg-white py-3 text-[14px] font-semibold text-zymix-text disabled:opacity-50"
        >
          {testing ? "Testing..." : "Test connection"}
        </button>
      </div>
    </div>
  );
}
