import express from 'express'
import { processAddress, getPortfolioVelcroV3 } from '../lib/utils/portfolio'
import { callGemini } from '../lib/utils/llm/gemini'
import { simplePrompt } from '../lib/utils/prompts'
import { LlmProcessOutput, LlmProcessProps, callGrok, llmMockProcess } from '../lib'

const port = 3420

const app = express()

app.use(express.json())

app.post('/', async (req, res) => {
    const { address, llm } = req.body

    const llmChoices: { [choice: string]: (props: LlmProcessProps) => Promise<LlmProcessOutput> } =
        {
            gemini: callGemini,
            grok: callGrok
        }

    const data = await processAddress({
        address,
        getPortfolio: getPortfolioVelcroV3,
        makePrompt: simplePrompt,
        llmProcessor: llmChoices[llm] || llmMockProcess
    })
    res.send(data)
})

app.listen(port, () => {
    console.log(`AdEx aura app listening on port ${port}`)
})
