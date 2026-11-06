/**
 * Groq chat completions, with a fallback model. Server-only.
 *
 * Groq retires models on short notice: llama-3.3-70b-versatile was shut down on
 * 16 Aug 2026 and took every AI feature down with it. /api/health/ai checks both
 * models below daily, so update this list when Groq announces a deprecation:
 * https://console.groq.com/docs/deprecations
 *
 * Rate limits apply per model, so the fallback also absorbs bursts on the primary.
 */

const GROQ_API = "https://api.groq.com/openai/v1/chat/completions";
const REQUEST_TIMEOUT_MS = 20_000;

export const GROQ_MODELS: { id: string; params?: Record<string, unknown> }[] = [
  // Production model. Reasoning tokens count against max_tokens, and on the
  // default effort they cut long JSON replies off mid-object.
  { id: "openai/gpt-oss-120b", params: { reasoning_effort: "low" } },
  // Preview model: Groq says these aren't for production use, so fallback only.
  { id: "qwen/qwen3.8-27b" },
];

export class GroqError extends Error {
  constructor(
    readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = "GroqError";
  }
}

export interface GroqRequest {
  systemPrompt: string;
  messages: { role: string; content: string }[];
  maxTokens?: number;
  temperature?: number;
  /** Makes Groq guarantee valid JSON. The prompt must ask for JSON. */
  json?: boolean;
}

export async function callGroqModel(
  model: (typeof GROQ_MODELS)[number],
  { systemPrompt, messages, maxTokens = 1024, temperature = 1, json }: GroqRequest,
): Promise<string> {
  const response = await fetch(GROQ_API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
    },
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    body: JSON.stringify({
      model: model.id,
      ...model.params,
      max_tokens: maxTokens,
      temperature,
      ...(json ? { response_format: { type: "json_object" } } : {}),
      messages: [{ role: "system", content: systemPrompt }, ...messages],
    }),
  });

  if (!response.ok) {
    throw new GroqError(
      response.status,
      `${model.id} returned ${response.status}: ${await response.text()}`,
    );
  }

  const data = await response.json();
  const text: string = data.choices?.[0]?.message?.content ?? "";
  if (!text.trim()) throw new GroqError(502, `${model.id} returned no content`);
  return text;
}

/** Tries each model in turn and throws the last error if they all fail. */
export async function callGroq(request: GroqRequest): Promise<string> {
  let lastError: unknown;
  for (const model of GROQ_MODELS) {
    try {
      return await callGroqModel(model, request);
    } catch (err) {
      console.error("[groq] model failed:", err);
      lastError = err;
    }
  }
  throw lastError;
}
