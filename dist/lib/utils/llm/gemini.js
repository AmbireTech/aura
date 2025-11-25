"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GEMINI_MODELS = void 0;
exports.callGemini = callGemini;
const generative_ai_1 = require("@google/generative-ai");
const errors_1 = require("../errors");
const google_1 = require("./structures/google");
const timing_1 = require("../timing");
exports.GEMINI_MODELS = {
    gemini20flashExp: 'gemini-2.0-flash-exp',
    gemini25proPreview: 'gemini-2.5-pro-preview-03-25'
};
const genAI = new generative_ai_1.GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY || '');
async function callGemini(llmInput) {
    let output = null;
    let error = null;
    const model = llmInput.model || exports.GEMINI_MODELS.gemini20flashExp;
    let inputTokens;
    let outputTokens;
    try {
        const aiModel = genAI.getGenerativeModel({
            model,
            generationConfig: {
                responseMimeType: 'application/json',
                responseSchema: google_1.StrategiesGoogleSchema
            },
            ...llmInput.llmOptionsOverride
        });
        const result = await (0, timing_1.timeoutPromise)(aiModel.generateContent(llmInput.prompt), llmInput.timeout || 60, llmInput.timeoutMsg);
        // console.log(JSON.stringify(result))
        const content = result.response.text();
        inputTokens = result.response.usageMetadata?.promptTokenCount || 0;
        outputTokens = result.response.usageMetadata?.candidatesTokenCount || 0;
        try {
            output = JSON.parse(content || '[]');
        }
        catch (err) {
            error = (0, errors_1.stringifyError)(err);
            console.error(`Invalid JSON in Gemini AI output: ${error}`);
        }
    }
    catch (err) {
        error = (0, errors_1.stringifyError)(err);
        console.error(`Error querying Gemini AI: ${error}`);
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
    };
}
//# sourceMappingURL=gemini.js.map