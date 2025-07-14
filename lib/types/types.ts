import { TokenResult } from 'ambire-common/dist/src/libs/portfolio/interfaces'

export type PortfolioLibToken = Pick<
    TokenResult,
    'symbol' | 'address' | 'chainId' | 'decimals' | 'amount' | 'priceIn'
>
export type NetworkPortfolioLibResponse = {
    tokens: PortfolioLibToken[]
}

export type PortfolioToken = {
    address: string
    balance: number
    balanceUSD: number
    symbol: string
    network: string
    chainId: string
    platformId: string
}

export type PortfolioForNetwork = {
    network: string
    chainId: string
    platformId: string
    iconUrls?: string[]
    tokens: PortfolioToken[]
}

export enum StrategyRisk {
    LOW = 'low',
    MODERATE = 'moderate',
    HIGH = 'high',
    OPPORTUNISTIC = 'opportunistic'
}

export type StrategyAction = {
    tokens: string
    description: string
    platforms?: Array<{ name: string; url: string }>
    networks?: string[]
    operations?: string[]
    apy?: string
}

export type Strategy = {
    name: string
    risk: StrategyRisk
    actions: StrategyAction[]
}

export type LlmProcessProps = {
    prompt: string
    model?: string
    llmOptionsOverride?: { [x: string]: any }
    timeout?: number
    timeoutMsg?: string
}

export type LlmProcessOutput = {
    llm: {
        provider: string
        model: string
    }
    response: Strategy[] | null
    inputTokens: number
    outputTokens: number
    error?: string | null
}

export type ProcessAddressProps = {
    address: string
    getPortfolio: (address: string) => Promise<PortfolioForNetwork[]>
    makePrompt: (props: PromptProps) => Promise<string>
    llmProcessor: (props: LlmProcessProps) => Promise<LlmProcessOutput>
    model?: string
    llmOptionsOverride?: any
}

export type PromptProps = {
    portfolio: PortfolioForNetwork[]
}

export type AuraResponse_01 = {
    address: string
    portfolio: PortfolioForNetwork[]
    strategies: LlmProcessOutput[]
}
