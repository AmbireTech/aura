import OpenAI from 'openai'
import { zodResponseFormat } from 'openai/helpers/zod'
import { LlmProcessOutput, LlmProcessProps, Strategy } from '../../types'
import { StrategiesZodSchema } from './structures/zod'

export const XAI_MODELS = {
    grok2latest: 'grok-2-latest'
}

const apiClient = new OpenAI({
    apiKey: process.env.X_AI_API_KEY || '',
    baseURL: 'https://api.x.ai/v1'
})

export async function callGrok(llmInput: LlmProcessProps): Promise<LlmProcessOutput> {
    let output = null
    const model = llmInput.model || XAI_MODELS.grok2latest

    try {
        const completion = await apiClient.chat.completions.create({
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
            response_format: zodResponseFormat(StrategiesZodSchema, 'strategies')
        })

        const outputContent = completion.choices[0].message.content || '{}'

        try {
            const parsed = JSON.parse(outputContent) as { strategies: Strategy[] }
            output = parsed.strategies || []
        } catch (error) {
            console.error('Invalid JSON in Grok output: ', error)
        }
    } catch (error) {
        console.error(`Error querying Grok: ${error}`)
    }

    return {
        llm: {
            provider: 'xAI',
            model
        },
        response: output
    }
}
