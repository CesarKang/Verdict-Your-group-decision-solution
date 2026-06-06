import type { LLMRuntimeConfig } from "./llmConfig";
import { DEFAULT_LLM_CONFIG, mergeLLMConfig } from "./llmConfig";
import { friendlyLLMError, normalizeModelForProvider } from "./providerPresets";

export type ChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

export type LLMCallMeta = {
  latencyMs: number;
  model: string;
};

function resolveConfig(override?: Partial<LLMRuntimeConfig>): LLMRuntimeConfig {
  return mergeLLMConfig(override);
}

export async function callLLM(
  messages: ChatMessage[],
  override?: Partial<LLMRuntimeConfig>,
  options: { jsonMode?: boolean } = {},
): Promise<{ content: string; meta: LLMCallMeta }> {
  const config = resolveConfig(override);
  const jsonMode = options.jsonMode ?? true;
  const model = normalizeModelForProvider(config.model, config.baseUrl);

  if (!config.apiKey) {
    throw new Error("Missing API key. Add it in Live AI settings or .env.");
  }

  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), config.timeoutMs);
  const started = performance.now();

  const attempt = async (useJsonMode: boolean) => {
    const body: Record<string, unknown> = {
      model,
      messages,
      temperature: 0.3,
    };
    if (useJsonMode) {
      body.response_format = { type: "json_object" };
    }

    const response = await fetch(`${config.baseUrl.replace(/\/$/, "")}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${config.apiKey}`,
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => "");
      const detail = errorText
        ? friendlyLLMError(`LLM request failed (${response.status}): ${errorText.slice(0, 220)}`)
        : `LLM request failed (${response.status})`;
      throw new Error(detail);
    }

    const data = (await response.json()) as {
      choices?: { message?: { content?: string } }[];
    };

    const content = data.choices?.[0]?.message?.content;
    if (!content) {
      throw new Error("Empty LLM response");
    }

    return content;
  };

  try {
    let content: string;
    try {
      content = await attempt(jsonMode);
    } catch (error) {
      if (jsonMode) {
        content = await attempt(false);
      } else {
        throw error;
      }
    }

    return {
      content,
      meta: {
        latencyMs: Math.round(performance.now() - started),
        model,
      },
    };
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new Error(`LLM timed out after ${config.timeoutMs}ms`);
    }
    throw error;
  } finally {
    window.clearTimeout(timer);
  }
}

export async function testLLMConnection(
  override?: Partial<LLMRuntimeConfig>,
): Promise<{ ok: boolean; message: string; latencyMs?: number }> {
  try {
    const { meta } = await callLLM(
      [
        { role: "system", content: "Reply with exactly: ok" },
        { role: "user", content: "ping" },
      ],
      override,
      { jsonMode: false },
    );
    return {
      ok: true,
      message: `Connected (${meta.model})`,
      latencyMs: meta.latencyMs,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Connection failed";
    return { ok: false, message };
  }
}

export function parseJsonFromLLM(raw: string): unknown {
  const trimmed = raw.trim();
  const fenceMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/);
  const jsonText = fenceMatch ? fenceMatch[1].trim() : trimmed;
  return JSON.parse(jsonText);
}

export function getDefaultLLMFields(): LLMRuntimeConfig {
  return { ...DEFAULT_LLM_CONFIG, ...mergeLLMConfig() };
}
