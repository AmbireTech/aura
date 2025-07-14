"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.processAddress = void 0;
exports.getPortfolioForNetwork = getPortfolioForNetwork;
exports.getPortfolioVelcroV3 = getPortfolioVelcroV3;
const tslib_1 = require("tslib");
const node_fetch_1 = tslib_1.__importDefault(require("node-fetch"));
const networks_1 = require("ambire-common/dist/src/consts/networks");
const getRpcProvider_1 = require("ambire-common/dist/src/services/provider/getRpcProvider");
const portfolio_1 = require("ambire-common/dist/src/libs/portfolio");
const mockedAI_1 = require("./llm/mockedAI");
const prompts_1 = require("./prompts");
const strategies_1 = require("./strategies");
async function getPortfolioForNetwork(address, networkId, customFetch) {
    const network = networks_1.networks.find((n) => n.chainId === networkId || n.name === networkId);
    if (!network)
        throw new Error(`Failed to find ${networkId} in configured networks`);
    const provider = (0, getRpcProvider_1.getRpcProvider)(network.rpcUrls, network.chainId);
    const portfolio = new portfolio_1.Portfolio(customFetch || node_fetch_1.default, provider, network, 'https://relayer.ambire.com/velcro-v3');
    return portfolio.get(address, { baseCurrency: 'usd' });
}
async function getPortfolioVelcroV3(address, customFetch) {
    const output = [];
    const responses = await Promise.all(networks_1.networks.map((network) => getPortfolioForNetwork(address, network.chainId, customFetch)));
    for (const resp of responses) {
        const network = networks_1.networks.find((n) => n.chainId === resp.tokens[0].chainId);
        const tokens = resp.tokens
            .filter((t) => t.amount > 0n)
            .map((t) => {
            const balance = Number(t.amount) / Math.pow(10, t.decimals);
            const priceUSD = (t.priceIn.find((p) => p.baseCurrency === 'usd') || { price: 0 })
                .price;
            return {
                symbol: t.symbol,
                balance,
                balanceUSD: balance * priceUSD,
                network: network.name,
                chainId: network.chainId.toString(),
                platformId: network.platformId,
                address: t.address
            };
        });
        if (!tokens.length) {
            continue;
        }
        output.push({
            network: tokens[0].network,
            chainId: network.chainId.toString(),
            platformId: network.platformId,
            iconUrls: network.iconUrls,
            tokens
        });
    }
    return output;
}
const processAddress = async ({ address, getPortfolio, makePrompt, llmProcessor, model, llmOptionsOverride } = {
    address: '0x69bfD720Dd188B8BB04C4b4D24442D3c15576D10',
    getPortfolio: getPortfolioVelcroV3,
    makePrompt: prompts_1.simplePrompt,
    llmProcessor: mockedAI_1.llmMockProcess
}) => {
    const portfolio = await getPortfolio(address);
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
                    response: strategies_1.EMPTY_PORTFOLIO_STRATEGIES,
                    inputTokens: 0,
                    outputTokens: 0
                }
            ]
        };
    }
    const prompt = await makePrompt({ portfolio });
    const strategies = await llmProcessor({ prompt, model, llmOptionsOverride });
    return {
        address,
        portfolio,
        strategies: [strategies]
    };
};
exports.processAddress = processAddress;
//# sourceMappingURL=portfolio.js.map