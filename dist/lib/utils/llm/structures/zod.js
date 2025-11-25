"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StrategiesZodSchema = exports.StrategyZodSchema = exports.ActionZodSchema = void 0;
const zod_1 = require("zod");
const common_1 = require("./common");
exports.ActionZodSchema = zod_1.z.object({
    tokens: zod_1.z.string({
        description: 'Comma-separated list of symbols of the involved crypto currencies or tokens, for example: USDC, ETH'
    }),
    description: zod_1.z.string({
        description: 'Free text describing the action concerning the related tokens, the platform to use and expected APY'
    }),
    platforms: zod_1.z.array(zod_1.z.object({
        name: zod_1.z.string({
            description: 'DeFi platform name'
        }),
        url: zod_1.z.string({
            description: 'Verified HTTPS URL of the DeFi platform'
        })
    }), { description: 'The DeFi platform(s) to be used for the action' }),
    networks: zod_1.z.array(zod_1.z.string({
        description: 'Lower-cased name of blockchain network'
    }), {
        description: 'The name of the blockchain network(s) which the action is to be executed on'
    }),
    operations: zod_1.z.array(zod_1.z.enum(common_1.ACTION_OPERATION_TYPES, { description: 'DeFi operation type' }), {
        description: 'The DeFi operation type(s) used of the action'
    }),
    apy: zod_1.z.string({
        description: 'The annual yield that can be expected from this action. Example values: 3%, 5%, 8-10%'
    }),
    flags: zod_1.z.array(zod_1.z.string({
        description: 'Flag name (instructions for possible values in prompt)'
    }), {
        description: 'The flags for the action. Optional (array could be empty)'
    })
});
exports.StrategyZodSchema = zod_1.z.object({
    name: zod_1.z.string({ description: 'Name of the strategy' }),
    risk: zod_1.z.enum(common_1.RISK_TYPES, {
        description: 'Risk level of the strategy'
    }),
    actions: zod_1.z.array(exports.ActionZodSchema, { description: 'List of actions for the strategy' })
});
exports.StrategiesZodSchema = zod_1.z.object({
    strategies: zod_1.z.array(exports.StrategyZodSchema, { description: 'List of strategies' })
});
//# sourceMappingURL=zod.js.map