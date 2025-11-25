import { z } from 'zod'
import { ACTION_OPERATION_TYPES, RISK_TYPES } from './common'

export const ActionZodSchema = z.object({
    tokens: z.string({
        description:
            'Comma-separated list of symbols of the involved crypto currencies or tokens, for example: USDC, ETH'
    }),
    description: z.string({
        description:
            'Free text describing the action concerning the related tokens, the platform to use and expected APY'
    }),
    platforms: z.array(
        z.object({
            name: z.string({
                description: 'DeFi platform name'
            }),
            url: z.string({
                description: 'Verified HTTPS URL of the DeFi platform'
            })
        }),
        { description: 'The DeFi platform(s) to be used for the action' }
    ),
    networks: z.array(
        z.string({
            description: 'Lower-cased name of blockchain network'
        }),
        {
            description:
                'The name of the blockchain network(s) which the action is to be executed on'
        }
    ),
    operations: z.array(z.enum(ACTION_OPERATION_TYPES, { description: 'DeFi operation type' }), {
        description: 'The DeFi operation type(s) used of the action'
    }),
    apy: z.string({
        description:
            'The annual yield that can be expected from this action. Example values: 3%, 5%, 8-10%'
    }),
    flags: z.array(
        z.string({
            description: 'Flag name (instructions for possible values in prompt)'
        }),
        {
            description: 'The flags for the action. Optional (array could be empty)'
        }
    )
})

export const StrategyZodSchema = z.object({
    name: z.string({ description: 'Name of the strategy' }),
    risk: z.enum(RISK_TYPES, {
        description: 'Risk level of the strategy'
    }),
    actions: z.array(ActionZodSchema, { description: 'List of actions for the strategy' })
})

export const StrategiesZodSchema = z.object({
    strategies: z.array(StrategyZodSchema, { description: 'List of strategies' })
})
