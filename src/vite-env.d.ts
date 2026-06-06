/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_VERDICT_MODE?: "seed" | "live";
  readonly VITE_LLM_BASE_URL?: string;
  readonly VITE_LLM_API_KEY?: string;
  readonly VITE_LLM_MODEL?: string;
  readonly VITE_LLM_TIMEOUT_MS?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
