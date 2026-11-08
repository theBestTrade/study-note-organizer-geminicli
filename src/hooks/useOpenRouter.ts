import type { ModelResult } from '../types';

interface ApiResponse {
  choices?: Array<{ message?: { content?: string } }>;
  usage?: { prompt_tokens?: number; completion_tokens?: number; total_tokens?: number };
  error?: { message?: string };
}
export function useOpenRouter() {
  const callModel = async (modelId: string, modelName: string, prompt: string): Promise<ModelResult> => {
    const startedAt = Date.now();
    try {
      const response = await fetch('/api/chat', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ model: modelId, prompt }),
      });
      const data = await response.json().catch(() => ({})) as ApiResponse;
      if (!response.ok) throw new Error(data.error?.message || `AI 요청 실패 (${response.status})`);
      const content = data.choices?.[0]?.message?.content?.trim();
      if (!content) throw new Error('모델 응답이 비어 있습니다.');
      return {
        modelId, modelName, content, latencyMs: Date.now() - startedAt,
        tokenUsage: data.usage ? {
          prompt: data.usage.prompt_tokens ?? 0,
          completion: data.usage.completion_tokens ?? 0,
          total: data.usage.total_tokens ?? 0,
        } : undefined,
        status: 'success',
      };
    } catch (error) {
      return { modelId, modelName, content: '', latencyMs: Date.now() - startedAt, status: 'error', errorMessage: error instanceof Error ? error.message : '연결 실패' };
    }
  };
  return { callModel };
}
