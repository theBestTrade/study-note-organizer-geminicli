import type { ModelOption, AppSettings } from '../types';

export const MODEL_OPTIONS: ModelOption[] = [
  { id: "deepseek/deepseek-v4-flash", name: "DeepSeek V4 Flash", provider: "DeepSeek", isFree: false },
  { id: "tencent/hy3-preview", name: "Tencent Hy3", provider: "Tencent", isFree: false },
  { id: "anthropic/claude-opus-4.7", name: "Claude Opus 4.7", provider: "Anthropic", isFree: false },
  { id: "anthropic/claude-sonnet-4.6", name: "Claude Sonnet 4.6", provider: "Anthropic", isFree: false },
  { id: "google/gemini-3-flash-preview", name: "Gemini 3 Flash", provider: "Google", isFree: false },
  { id: "moonshotai/kimi-k2.6", name: "Kimi K2.6", provider: "Moonshot", isFree: false },
  { id: "qwen/qwen3.6-plus", name: "Qwen 3.6 Plus", provider: "Qwen", isFree: false },
  { id: "qwen/qwen3.5-flash-02-23", name: "Qwen 3.5 Flash", provider: "Qwen", isFree: false },
  { id: "openai/gpt-5.5", name: "GPT-5.5", provider: "OpenAI", isFree: false },
  { id: "openai/gpt-5-mini", name: "GPT-5 Mini", provider: "OpenAI", isFree: false },
  { id: "openai/gpt-oss-120b:free", name: "GPT-OSS 120B (Free)", provider: "OpenAI", isFree: true },
  { id: "z-ai/glm-4.5-air:free", name: "GLM 4.5 Air (Free)", provider: "Z-AI", isFree: true },
  { id: "arcee-ai/trinity-large-thinking:free", name: "Trinity Large (Free)", provider: "Arcee", isFree: true },
];

export const DEFAULT_SETTINGS: AppSettings = {
  baseModel1: "anthropic/claude-sonnet-4.6",
  baseModel2: "google/gemini-3-flash-preview",
  mergeModel: "anthropic/claude-opus-4.7",
  theme: "light",
};

export const STORAGE_KEYS = {
  SETTINGS: 'study-note-organizer-settings',
  HISTORY: 'study-note-organizer-history',
  DRAFT: 'study-note-organizer-draft',
};
