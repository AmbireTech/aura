"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.XAI_MODELS = void 0;
exports.callGrok = callGrok;
const tslib_1 = require("tslib");
const openai_1 = tslib_1.__importDefault(require("openai"));
const zod_1 = require("openai/helpers/zod");
const zod_2 = require("./structures/zod");
const errors_1 = require("../errors");
const timing_1 = require("../timing");
exports.XAI_MODELS = {
    grok2latest: 'grok-2-latest',
    grok3latest: 'grok-3-latest'
};
const apiClient = new openai_1.default({
    apiKey: process.env.X_AI_API_KEY || '',
    baseURL: 'https://api.x.ai/v1'
});
async function callGrok(llmInput) {
    let output = null;
    let error = null;
    const model = llmInput.model || exports.XAI_MODELS.grok3latest;
    let inputTokens;
    let outputTokens;
    try {
        const completion = await (0, timing_1.timeoutPromise)(apiClient.chat.completions.create({
            model,
            store: true,
            messages: [
                {
                    role: 'system',
                    content: 'You are an expert in cryptocurrencies, DeFi applications and their use cases. Return output in JSON format.'
                },
                { role: 'user', content: llmInput.prompt }
            ],
            response_format: (0, zod_1.zodResponseFormat)(zod_2.StrategiesZodSchema, 'strategies'),
            ...llmInput.llmOptionsOverride
        }), llmInput.timeout || 60, llmInput.timeoutMsg);
        const outputContent = completion.choices[0].message.content || '{}';
        inputTokens = completion.usage?.prompt_tokens || 0;
        outputTokens = completion.usage?.completion_tokens || 0;
        try {
            const parsed = JSON.parse(outputContent);
            output = parsed.strategies || [];
        }
        catch (err) {
            error = (0, errors_1.stringifyError)(err);
            console.error(`Invalid JSON in Grok output: ${error}`);
        }
    }
    catch (err) {
        error = (0, errors_1.stringifyError)(err);
        console.error(`Error querying Grok: ${error}`);
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
    };
}
//# sourceMappingURL=grok.js.map