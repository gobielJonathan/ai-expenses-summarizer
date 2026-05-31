import { OpenRouter } from '@openrouter/sdk'
import { env } from '../../config/env'
import { logger } from '../../shared/logger'

const OPENROUTER_MODEL = 'deepseek/deepseek-v4-flash:free'

/**
 * Routes an LLM prompt to the appropriate provider:
 *   - Production + OPEN_ROUTER_API_KEY set → DeepSeek V4 Flash via OpenRouter
 *   - Otherwise                             → Ollama (local)
 *
 * Returns the raw response text string (expected to be valid JSON).
 * Throws on network/HTTP error.
 */
export async function callLlm(prompt: string): Promise<string> {
  return callOpenRouter(prompt)
  // if (env.isProd() && env.OPEN_ROUTER_API_KEY) {
  //   return callOpenRouter(prompt)
  // }
  // return callOllama(prompt)
}

async function callOpenRouter(prompt: string): Promise<string> {
  logger.debug(`LLM router → OpenRouter (${OPENROUTER_MODEL})`)

  const client = new OpenRouter({ apiKey: env.OPEN_ROUTER_API_KEY })

  const completion = await client.chat.send({
    chatRequest: {
      model: OPENROUTER_MODEL,
      messages: [{ role: 'user', content: prompt }],
    },
  })

  const content = completion.choices[0]?.message?.content
  if (!content) throw new Error('OpenRouter returned empty content')
  return content
}

async function callOllama(prompt: string): Promise<string> {
  const url = `${env.OLLAMA_URL}/api/generate`
  logger.debug(`LLM router → Ollama (${env.OLLAMA_MODEL})`)

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 120_000)

  let res: Response
  try {
    res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: env.OLLAMA_MODEL,
        prompt,
        stream: false,
        format: 'json',
      }),
      signal: controller.signal,
    })
  } finally {
    clearTimeout(timeout)
  }

  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`Ollama API error ${res.status}: ${text}`)
  }

  const json = (await res.json()) as { response?: string }
  if (!json?.response) throw new Error('Ollama returned empty response')
  return json.response
}
