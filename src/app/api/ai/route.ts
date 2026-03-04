import { NextRequest, NextResponse } from 'next/server'

const ANTHROPIC_API = 'https://api.anthropic.com/v1/messages'
const MODEL = 'claude-sonnet-4-20250514'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { type, messages, context } = body

    let systemPrompt = ''
    let userMessages = messages

    switch (type) {
      case 'qa':
        systemPrompt = `You are an expert JavaScript interview coach helping a developer prepare for frontend interviews (1-3 years experience level).

The user is asking about this specific JS interview question:
"${context.question}"

The official answer/explanation is:
${context.answer}

Your role:
- Answer follow-up questions clearly and concisely
- Use simple code examples when helpful (use plain text code blocks, not markdown)
- Connect concepts to real-world React/frontend use cases
- If they seem confused, try a different explanation angle
- Keep responses focused and under 200 words unless a longer answer is truly needed
- Be encouraging and supportive`
        break

      case 'evaluate':
        systemPrompt = `You are a strict but fair JavaScript interview evaluator.

The interview question is: "${context.question}"

The ideal answer covers: ${context.idealAnswer}

Evaluate the candidate's answer and respond with ONLY a JSON object in this exact format:
{
  "score": <number 1-10>,
  "grade": "<A/B/C/D/F>",
  "verdict": "<one line summary>",
  "strengths": ["<point 1>", "<point 2>"],
  "missing": ["<concept 1>", "<concept 2>"],
  "betterAnswer": "<a concise improved version of their answer in 2-3 sentences>"
}

Be honest. Score 8+ only if they covered the key concepts well. Score 1-4 if they missed the main point.`
        break

      case 'studyplan':
        systemPrompt = `You are a JavaScript interview coach creating a personalized study plan.

The developer has the following profile:
- Experience: 1-3 years frontend
- Mastered questions: ${context.masteredIds?.length || 0} out of 21
- Quiz history scores: ${JSON.stringify(context.quizScores?.slice(-5) || [])}
- Weak categories (low mastery): ${JSON.stringify(context.weakCategories || [])}
- Strong categories (high mastery): ${JSON.stringify(context.strongCategories || [])}
- Interview date: ${context.interviewDate || 'not set'}

Respond with ONLY a JSON object in this exact format:
{
  "readinessScore": <number 0-100>,
  "readinessLabel": "<Not Ready / Getting There / Almost Ready / Interview Ready>",
  "summary": "<2 sentence honest assessment>",
  "weakSpots": [
    {"category": "<name>", "reason": "<why they struggle>", "tip": "<specific advice>"}
  ],
  "dailyPlan": [
    {"day": 1, "focus": "<category>", "tasks": ["<task 1>", "<task 2>", "<task 3>"], "timeMinutes": <number>}
  ],
  "quickWins": ["<thing they can improve fast 1>", "<thing 2>", "<thing 3>"],
  "focusQuestions": [<question id 1>, <question id 2>, <question id 3>, <question id 4>, <question id 5>]
}`
        break

      case 'mock':
        systemPrompt = `You are a senior frontend engineer conducting a realistic JavaScript technical interview at a product company (think Razorpay, Swiggy, Flipkart level).

Interview style:
- Start with a mid-level JS question
- Follow up based on their answer — dig deeper, probe edge cases, ask "what if" scenarios
- If they answer well, increase difficulty. If they struggle, offer a hint or simplify
- Be professional but conversational, not robotic
- Ask ONE question or follow-up at a time
- After 6-8 exchanges, wrap up with honest feedback

Rules:
- Never reveal you are an AI during the interview
- React naturally to their answers ("Interesting approach", "Good point, but what about...")
- Keep your messages concise (2-4 sentences max per turn)
- End the interview after ~8 turns with a realistic verdict: "I think we have enough to evaluate, thanks for your time. Overall feedback: [honest assessment]"

Start the interview now with your first question.`
        break

      default:
        return NextResponse.json({ error: 'Invalid type' }, { status: 400 })
    }

    const response = await fetch(ANTHROPIC_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY || '',
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 1024,
        system: systemPrompt,
        messages: userMessages,
      }),
    })

    if (!response.ok) {
      const err = await response.text()
      console.error('Anthropic API error:', err)
      return NextResponse.json({ error: 'AI service error' }, { status: 500 })
    }

    const data = await response.json()
    const text = data.content?.[0]?.text || ''
    return NextResponse.json({ text })
  } catch (err) {
    console.error('AI route error:', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
