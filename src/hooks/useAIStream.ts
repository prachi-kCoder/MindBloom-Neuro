import { useState, useCallback } from 'react';

const AI_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-lesson-planner`;

export function useAIStream() {
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const generate = useCallback(async (type: string, context: string) => {
    setIsLoading(true);
    setResponse('');
    let accumulated = '';

    try {
      const resp = await fetch(AI_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ type, context }),
      });

      if (!resp.ok || !resp.body) {
        const err = await resp.json().catch(() => ({ error: 'AI request failed' }));
        throw new Error(err.error || 'AI request failed');
      }

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = buffer.indexOf('\n')) !== -1) {
          let line = buffer.slice(0, newlineIndex);
          buffer = buffer.slice(newlineIndex + 1);
          if (line.endsWith('\r')) line = line.slice(0, -1);
          if (!line.startsWith('data: ')) continue;
          const jsonStr = line.slice(6).trim();
          if (jsonStr === '[DONE]') break;
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              accumulated += content;
              setResponse(accumulated);
            }
          } catch { /* partial JSON, wait */ }
        }
      }
    } catch (e: any) {
      setResponse(`Error: ${e.message}`);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const reset = useCallback(() => setResponse(''), []);

  return { response, isLoading, generate, reset };
}
