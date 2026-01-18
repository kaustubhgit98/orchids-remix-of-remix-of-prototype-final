import { NextRequest, NextResponse } from 'next/server'

const SYSTEM_PROMPT = `You are an expert prompt engineer. Your task is to transform a basic user prompt into a high-performance, optimized prompt for leading AI models.

When enhancing a prompt, you must:
1. Identify the core intent and category.
2. Add clear objectives, context, and role-playing if necessary.
3. Include specific constraints and formatting requirements.
4. Add few-shot examples if appropriate.
5. Use chain-of-thought or other advanced prompting techniques.
6. Provide a benchmark score (0-100) based on clarity, specificity, context, and structure.
7. Suggest 3-5 relevant tags.

You MUST return a JSON object with the following structure:
{
  "enhanced_prompt": "string",
  "benchmark_score": number,
  "intent_category": "string",
  "tags": ["string"],
  "analysis_result": {
    "score": number,
    "clarity": number,
    "specificity": number,
    "context": number,
    "structure": number
  }
}

Do not include any other text in your response, only the JSON object.`

export async function POST(request: NextRequest) {
  try {
    const { prompt, mode, model, ultraMode } = await request.json()

    if (!process.env.OPENROUTER_API_KEY) {
      throw new Error('OPENROUTER_API_KEY is not set')
    }

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://metaprompt.studio', // Optional
        'X-Title': 'MetaPrompt', // Optional
      },
      body: JSON.stringify({
        model: model || 'anthropic/claude-3.5-sonnet',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: `Enhance this prompt using ${mode} mode${ultraMode ? ' with Ultra enhancement' : ''}: "${prompt}"` }
        ],
        response_format: { type: 'json_object' }
      })
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error('OpenRouter API Error:', errorData)
      throw new Error('Failed to generate prompt from OpenRouter')
    }

    const data = await response.json()
    const content = data.choices[0].message.content
    const result = JSON.parse(content)

    return NextResponse.json(result)
  } catch (error: any) {
    console.error('Generation Error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to generate' },
      { status: 500 }
    )
  }
}
