import { GoogleGenerativeAI } from '@google/generative-ai'
import { LlmProcessOutput, LlmProcessProps, Strategy } from '../../types'
import { stringifyError } from '../errors'
import { StrategiesGoogleSchema } from './structures/google'
import { timeoutPromise } from '../timing'

export const GEMINI_MODELS = {
    gemini20flashExp: 'gemini-2.0-flash-exp',
    gemini25proPreview: 'gemini-2.5-pro-preview-03-25'
}

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY || '')

export async function callGemini(llmInput: LlmProcessProps): Promise<LlmProcessOutput> {
    let output = null
    let error = null
    const model = llmInput.model || GEMINI_MODELS.gemini20flashExp
    let inputTokens: number | undefined
    let outputTokens: number | undefined

    try {
        const aiModel = genAI.getGenerativeModel({
            model,
            generationConfig: {
                responseMimeType: 'application/json',
                responseSchema: StrategiesGoogleSchema
            },
            ...llmInput.llmOptionsOverride
        })
        const result = await timeoutPromise(
            aiModel.generateContent(llmInput.prompt),
            llmInput.timeout || 60,
            llmInput.timeoutMsg
        )
        // console.log(JSON.stringify(result))

        const content = result.response.text()
        inputTokens = result.response.usageMetadata?.promptTokenCount || 0
        outputTokens = result.response.usageMetadata?.candidatesTokenCount || 0

        try {
            output = JSON.parse(content || '[]') as Strategy[]
        } catch (err) {
            error = stringifyError(err)
            console.error(`Invalid JSON in Gemini AI output: ${error}`)
        }
    } catch (err) {
        error = stringifyError(err)
        console.error(`Error querying Gemini AI: ${error}`)
    }

    return {
        llm: {
            provider: 'Google',
            model
        },
        response: output,
        inputTokens: inputTokens || 0,
        outputTokens: outputTokens || 0,
        error
    }
}
