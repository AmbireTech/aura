import OpenAI from 'openai'
import { zodResponseFormat } from 'openai/helpers/zod'
import { LlmProcessOutput, LlmProcessProps, Strategy } from '../../types'
import { StrategiesZodSchema } from './structures/zod'
import { stringifyError } from '../errors'
import { timeoutPromise } from '../timing'

export const XAI_MODELS = {
    grok2latest: 'grok-2-latest',
    grok3latest: 'grok-3-latest'
}

const apiClient = new OpenAI({
    apiKey: process.env.X_AI_API_KEY || '',
    baseURL: 'https://api.x.ai/v1'
})

export async function callGrok(llmInput: LlmProcessProps): Promise<LlmProcessOutput> {
    let output = null
    let error = null
    const model = llmInput.model || XAI_MODELS.grok3latest
    let inputTokens: number | undefined
    let outputTokens: number | undefined

    try {
        const completion = await timeoutPromise(
            apiClient.chat.completions.create({
                model,
                store: true,
                messages: [
                    {
                        role: 'system',
                        content:
                            'You are an expert in cryptocurrencies, DeFi applications and their use cases. Return output in JSON format.'
                    },
                    { role: 'user', content: llmInput.prompt }
                ],
                response_format: zodResponseFormat(StrategiesZodSchema, 'strategies'),
                ...llmInput.llmOptionsOverride
            }),
            llmInput.timeout || 60,
            llmInput.timeoutMsg
        )

        const outputContent = completion.choices[0].message.content || '{}'
        inputTokens = completion.usage?.prompt_tokens || 0
        outputTokens = completion.usage?.completion_tokens || 0

        try {
            const parsed = JSON.parse(outputContent) as { strategies: Strategy[] }
            output = parsed.strategies || []
        } catch (err) {
            error = stringifyError(err)
            console.error(`Invalid JSON in Grok output: ${error}`)
        }
    } catch (err) {
        error = stringifyError(err)
        console.error(`Error querying Grok: ${error}`)
    }

    return {
        llm: {
            provider: 'xAI',
            model
        },
        response: output,
        inputTokens: inputTokens || 0,
        outputTokens: outputTokens || 0,
        error
    }
}
