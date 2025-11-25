import { Strategy, StrategyRisk } from '../../lib/types'
import { callGemini } from '../../lib/utils/llm/gemini'

const mockedStrategies: Strategy[] = [
    {
        actions: [
            {
                description: 'Example USDC strategy description',
                tokens: 'USDC, ETH'
            }
        ],
        name: 'Example USDC strategy name',
        risk: StrategyRisk.LOW
    }
]

jest.mock('@google/generative-ai', () => {
    const googleGemini = jest.requireActual('@google/generative-ai')
    return {
        ...googleGemini,
        GoogleGenerativeAI: jest.fn().mockImplementation(() => ({
            getGenerativeModel: jest.fn().mockReturnValue({
                generateContent: () =>
                    Promise.resolve({
                        response: { text: () => JSON.stringify(mockedStrategies) }
                    })
            })
        }))
    }
})

describe('Gemini AI unit tests', () => {
    test('should successfully call Gemini and get strategies', async () => {
        const res = await callGemini({ prompt: 'text prompt' })

        expect(res).not.toBe(null)
        expect(res).toHaveProperty('response')
        expect(res.response).toHaveLength(1)

        const expectedStrategy = mockedStrategies[0]
        const strategy = (res.response as Strategy[])[0]
        expect(strategy.name).toEqual(expectedStrategy.name)
        expect(strategy.risk).toEqual(expectedStrategy.risk)
        expect(strategy.actions.length).toEqual(expectedStrategy.actions.length)
        expect(strategy.actions[0].description).toBe(expectedStrategy.actions[0].description)
        expect(strategy.actions[0].tokens).toBe(expectedStrategy.actions[0].tokens)
    })
})
