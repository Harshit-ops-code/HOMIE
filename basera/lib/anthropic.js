const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

/**
 * Call Groq API (replacing callClaude integration)
 * @param {Array} messages - Conversation history [{role, content}]
 * @param {string} systemPrompt - System prompt string
 * @param {number} maxTokens - Max response tokens (default 1024)
 */
export async function callClaude(messages, systemPrompt, maxTokens = 450) {
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    throw new Error('GROQ_API_KEY not configured');
  }

  const response = await fetch(GROQ_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'openai/gpt-oss-120b',
      max_tokens: maxTokens,
      messages: [
        ...(systemPrompt ? [{ role: 'system', content: systemPrompt }] : []),
        ...messages
      ],
      temperature: 0.65,
      top_p: 0.95
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Groq API error: ${error.error?.message || response.statusText}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}


export function extractJSON(text) {
  // Remove markdown code fences if present
  const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
  // Find JSON object or array
  const match = cleaned.match(/[\{\[][\s\S]*[\}\]]/);
  if (!match) throw new Error('No JSON found in Claude response');
  return JSON.parse(match[0]);
}
