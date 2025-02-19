"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.processAddress = void 0;
exports.getPortfolioForNetwork = getPortfolioForNetwork;
exports.getPortfolioVelcroV3 = getPortfolioVelcroV3;
const networks_1 = require("ambire-common/dist/src/consts/networks");
const getRpcProvider_1 = require("ambire-common/dist/src/services/provider/getRpcProvider");
const portfolio_1 = require("ambire-common/dist/src/libs/portfolio");
const mockedAI_1 = require("./mockedAI");
const prompts_1 = require("./prompts");
const __1 = require("..");
async function getPortfolioForNetwork(address, networkId) {
    const network = networks_1.networks.find((n) => n.id === networkId);
    if (!network)
        throw new Error(`Failed to find ${networkId} in configured networks`);
    const provider = (0, getRpcProvider_1.getRpcProvider)(network.rpcUrls, network.chainId);
    const portfolio = new portfolio_1.Portfolio(fetch, provider, network, 'https://relayer.ambire.com/velcro-v3');
    return portfolio.get(address, { baseCurrency: 'usd' });
}
async function getPortfolioVelcroV3(address) {
    const output = [];
    const responses = await Promise.all(networks_1.networks.map((network) => getPortfolioForNetwork(address, network.id)));
    for (const resp of responses) {
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
                network: t.networkId,
                address: t.address
            };
        });
        if (!tokens.length) {
            continue;
        }
        output.push({
            network: tokens[0].network,
            tokens
        });
    }
    return output;
}
const processAddress = async ({ address, getPortfolio, makePrompt, llmProcessor } = {
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
            strategies: __1.EMPTY_PORTFOLIO_STRATEGIES
        };
    }
    const prompt = await makePrompt({ portfolio });
    const strategies = await llmProcessor({ prompt });
    return {
        address,
        portfolio,
        strategies
    };
};
exports.processAddress = processAddress;
//# sourceMappingURL=portfolio.js.map