import { LlmProcessProps, LlmProcessOutput, StrategyRisk } from '../../types'

export async function llmMockProcess({ prompt }: LlmProcessProps): Promise<LlmProcessOutput> {
    console.log({ prompt })
    return {
        llm: {
            provider: 'mock',
            model: 'mock'
        },
        response: [
            {
                actions: [
                    {
                        description:
                            '[EXAMPLE] Stake ADX on the AdEx platform for a steady yield. This is a relatively low-risk option.',
                        tokens: 'ADX'
                    }
                ],
                name: 'ADX Staking',
                risk: StrategyRisk.LOW
            },
            {
                actions: [
                    {
                        description: `[EXAMPLE] Use the 0.031 ETH to provide liquidity on a decentralized exchange (DEX) like Uniswap or Sushiswap in an ETH-paired pool. 
                    Choose a pool with sufficient volume but be aware of impermanent loss risks. 
                     Pairing with a stable coin will be lower risk, while an alt-coin will be higher risk.`,
                        tokens: 'ETH'
                    }
                ],
                name: 'DEX Liquidity Provision',
                risk: StrategyRisk.MODERATE
            },
            {
                actions: [
                    {
                        description: `[EXAMPLE] Bridge a portion of the 0.031 ETH to a Layer-2 network (e.g. Arbitrum or Optimism) and explore higher-yield farming opportunities. 
                    Look for reputable protocols on L2s, and exercise caution with high APY offers as they usually carry higher risks. 
                     A smaller portion of ETH should be used for exploring high risk/high reward options.`,
                        tokens: 'ETH'
                    }
                ],
                name: 'L2 Yield Farming',
                risk: StrategyRisk.HIGH
            }
        ],
        inputTokens: 0,
        outputTokens: 0
    }
}
