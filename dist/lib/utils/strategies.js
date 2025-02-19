"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EMPTY_PORTFOLIO_STRATEGIES = void 0;
const __1 = require("..");
exports.EMPTY_PORTFOLIO_STRATEGIES = [
    {
        actions: [
            {
                description: 'Your wallet seems to be empty or have very small amounts in it. Consider buying some stablecoins, for example USDT or USDC, or some native crypto like ETH.',
                tokens: 'USDC, USDT, ETH'
            }
        ],
        name: 'Top up wallet with funds',
        risk: __1.StrategyRisk.LOW
    }
];
//# sourceMappingURL=strategies.js.map