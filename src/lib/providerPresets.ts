export type ProviderPreset = {
  id: string;
  label: string;
  baseUrl: string;
  model: string;
  modelHint: string;
};

export const PROVIDER_PRESETS: ProviderPreset[] = [
  {
    id: "openai",
    label: "OpenAI",
    baseUrl: "https://api.openai.com/v1",
    model: "gpt-4o-mini",
    modelHint: "gpt-4o-mini, gpt-4o",
  },
  {
    id: "zhipu",
    label: "Zhipu GLM (BigModel)",
    baseUrl: "https://open.bigmodel.cn/api/paas/v4",
    model: "glm-4-flash",
    modelHint: "glm-4-flash, glm-4-plus, glm-4-air (lowercase)",
  },
];

export function detectProviderId(baseUrl: string): string {
  if (baseUrl.includes("bigmodel.cn")) return "zhipu";
  if (baseUrl.includes("openai.com")) return "openai";
  return "custom";
}

export function normalizeModelForProvider(model: string, baseUrl: string): string {
  const trimmed = model.trim();
  if (baseUrl.includes("bigmodel.cn")) {
    return trimmed.toLowerCase();
  }
  return trimmed;
}

export function friendlyLLMError(raw: string): string {
  if (raw.includes('"code":"1211"') || raw.includes("?????")) {
    return "Model not found. For Zhipu use lowercase, e.g. glm-4-flash (not GLM-4).";
  }
  return raw.length > 220 ? `${raw.slice(0, 220)}...` : raw;
}
