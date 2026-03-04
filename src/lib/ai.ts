// Shared AI utility - calls Anthropic API
// Used by: AI Q&A chat, answer evaluator, study plan, mock interview, weak spot detection

export async function callAI(systemPrompt: string, userMessage: string, history: {role: 'user'|'assistant', content: string}[] = []): Promise<string> {
  const messages = [
    ...history,
    { role: 'user' as const, content: userMessage }
  ]

  const response = await fetch('/api/ai', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ systemPrompt, messages })
  })

  if (!response.ok) throw new Error('AI request failed')
  const data = await response.json()
  return data.content
}
