import fetch from 'node-fetch'
import { networks } from 'ambire-common/dist/src/consts/networks'
import { Network } from 'ambire-common/dist/src/interfaces/network'
import { Fetch } from 'ambire-common/dist/src/interfaces/fetch'
import { getRpcProvider } from 'ambire-common/dist/src/services/provider/getRpcProvider'
import { Portfolio } from 'ambire-common/dist/src/libs/portfolio'
import { llmMockProcess } from './llm/mockedAI'
import { simplePrompt } from './prompts'
import { EMPTY_PORTFOLIO_STRATEGIES } from './strategies'
import {
    PortfolioForNetwork,
    ProcessAddressProps,
    AuraResponse_01,
    NetworkPortfolioLibResponse,
    PortfolioNetworkInfo
} from '../types'

export async function getPortfolioForNetwork(
    address: string,
    networkId: string | bigint,
    customFetch?: Fetch
): Promise<NetworkPortfolioLibResponse> {
    const network = networks.find((n: Network) => n.chainId === networkId || n.name === networkId)
    if (!network) throw new Error(`Failed to find ${networkId} in configured networks`)

    const provider = getRpcProvider(network.rpcUrls, network.chainId)
    const portfolio = new Portfolio(
        customFetch || fetch,
        provider,
        network,
        'https://relayer.ambire.com/velcro-v3'
    )

    return portfolio.get(address, { baseCurrency: 'usd' })
}

export async function getPortfolioVelcroV3(
    address: string,
    customFetch?: Fetch
): Promise<PortfolioForNetwork[]> {
    const output: PortfolioForNetwork[] = []

    const responses = await Promise.all(
        networks.map((network) => getPortfolioForNetwork(address, network.chainId, customFetch))
    )

    for (const resp of responses) {
        const tokens = resp.tokens
            .filter((t) => t.amount > 0n)
            .map((t) => {
                const balance = Number(t.amount) / Math.pow(10, t.decimals)
                const priceUSD = (t.priceIn.find((p) => p.baseCurrency === 'usd') || { price: 0 })
                    .price

                return {
                    symbol: t.symbol,
                    balance,
                    balanceUSD: balance * priceUSD,
                    address: t.address,
                    decimals: t.decimals
                }
            })

        if (!tokens.length) {
            continue
        }

        const matchedNetwork = networks.find((n) => n.chainId === resp.tokens[0].chainId) as Network
        const networkInfo: PortfolioNetworkInfo = {
            name: matchedNetwork.name,
            chainId: matchedNetwork.chainId.toString(),
            platformId: matchedNetwork.platformId,
            explorerUrl: matchedNetwork.explorerUrl,
            iconUrls: matchedNetwork.iconUrls || []
        }

        output.push({
            network: networkInfo,
            tokens
        })
    }

    return output
}

export const processAddress = async (
    {
        address,
        getPortfolio,
        makePrompt,
        llmProcessor,
        model,
        llmOptionsOverride
    }: ProcessAddressProps = {
        address: '0x69bfD720Dd188B8BB04C4b4D24442D3c15576D10',
        getPortfolio: getPortfolioVelcroV3,
        makePrompt: simplePrompt,
        llmProcessor: llmMockProcess
    }
): Promise<AuraResponse_01> => {
    const portfolio = await getPortfolio(address)

    if (!portfolio.length) {
        return {
            address,
            portfolio,
            strategies: [
                {
                    llm: {
                        provider: 'local',
                        model: 'local'
                    },
                    response: EMPTY_PORTFOLIO_STRATEGIES,
                    inputTokens: 0,
                    outputTokens: 0
                }
            ]
        }
    }

    const prompt = await makePrompt({ portfolio })
    const strategies = await llmProcessor({ prompt, model, llmOptionsOverride })

    return {
        address,
        portfolio,
        strategies: [strategies]
    }
}
