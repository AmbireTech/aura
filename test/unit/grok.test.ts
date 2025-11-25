import { Strategy, StrategyRisk } from '../../lib/types'
import { callGrok } from '../../lib/utils/llm/grok'

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

jest.mock('openai', () => {
    return jest.fn().mockImplementation(() => ({
        chat: {
            completions: {
                create: () =>
                    Promise.resolve({
                        choices: [
                            {
                                message: {
                                    content: JSON.stringify({ strategies: mockedStrategies })
                                }
                            }
                        ]
                    })
            }
        }
    }))
})

describe('Grok unit tests', () => {
    test('should successfully call Grok and get strategies', async () => {
        const res = await callGrok({ prompt: 'text prompt' })

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
