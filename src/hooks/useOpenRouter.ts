import type { ModelResult } from '../types';

export function useOpenRouter(apiKey: string) {
  const callModel = async (modelId: string, modelName: string, prompt: string): Promise<ModelResult> => {
    const startTime = Date.now();
    try {
      if (!apiKey) {
        throw new Error('API Key가 필요합니다.');
      }

      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': window.location.origin,
          'X-Title': 'Study Note Organizer',
        },
        credentials: 'omit',
        body: JSON.stringify({
          model: modelId,
          messages: [{ role: 'user', content: prompt }],
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'API 호출 중 오류가 발생했습니다.');
      }

      const data = await response.json();
      const content = data.choices[0].message.content;
      const usage = data.usage;
      const latencyMs = Date.now() - startTime;

      return {
        modelId,
        modelName,
        content,
        latencyMs,
        tokenUsage: {
          prompt: usage.prompt_tokens,
          completion: usage.completion_tokens,
          total: usage.total_tokens,
        },
        status: 'success',
      };
    } catch (error: any) {
      console.error(error);
      return {
        modelId,
        modelName,
        content: '',
        latencyMs: Date.now() - startTime,
        status: 'error',
        errorMessage: error.message,
      };
    }
  };

  return { callModel };
}
