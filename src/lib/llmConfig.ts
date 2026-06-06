export type LLMRuntimeConfig = {
  baseUrl: string;
  apiKey: string;
  model: string;
  timeoutMs: number;
};

export const DEFAULT_LLM_CONFIG: LLMRuntimeConfig = {
  baseUrl: "https://api.openai.com/v1",
  apiKey: "",
  model: "gpt-4o-mini",
  timeoutMs: 15000,
};

export function readEnvLLMConfig(): LLMRuntimeConfig {
  const timeoutRaw = import.meta.env.VITE_LLM_TIMEOUT_MS;
  const timeoutMs = timeoutRaw ? Number(timeoutRaw) : DEFAULT_LLM_CONFIG.timeoutMs;

  return {
    baseUrl: import.meta.env.VITE_LLM_BASE_URL || DEFAULT_LLM_CONFIG.baseUrl,
    apiKey: import.meta.env.VITE_LLM_API_KEY || "",
    model: import.meta.env.VITE_LLM_MODEL || DEFAULT_LLM_CONFIG.model,
    timeoutMs: Number.isFinite(timeoutMs) ? timeoutMs : DEFAULT_LLM_CONFIG.timeoutMs,
  };
}

export function mergeLLMConfig(override?: Partial<LLMRuntimeConfig>): LLMRuntimeConfig {
  const env = readEnvLLMConfig();
  if (!override) return env;

  return {
    baseUrl: override.baseUrl?.trim() || env.baseUrl,
    apiKey: override.apiKey?.trim() || env.apiKey,
    model: override.model?.trim() || env.model,
    timeoutMs: override.timeoutMs ?? env.timeoutMs,
  };
}

export function isLLMConfigured(config: LLMRuntimeConfig): boolean {
  return config.apiKey.length > 0 && config.baseUrl.length > 0 && config.model.length > 0;
}

export function maskApiKey(key: string): string {
  if (!key) return "Not set";
  if (key.length <= 8) return "********";
  return `${key.slice(0, 4)}...${key.slice(-4)}`;
}
