import { Schema, SchemaType } from '@google/generative-ai'
import { ACTION_OPERATION_TYPES, RISK_TYPES } from './common'

export const ActionGoogleSchema: Schema = {
    type: SchemaType.OBJECT,
    properties: {
        tokens: {
            type: SchemaType.STRING,
            description:
                'Comma-separated list of symbols of the involved tokens, for example: USDC, ETH',
            nullable: false
        },
        description: {
            type: SchemaType.STRING,
            description:
                'Free text describing the action concerning the related tokens, the platform to use and expected APY',
            nullable: false
        },
        platforms: {
            type: SchemaType.ARRAY,
            description: 'The DeFi platform(s) to be used for the action',
            items: {
                type: SchemaType.OBJECT,
                properties: {
                    name: {
                        type: SchemaType.STRING,
                        description: 'DeFi platform name',
                        nullable: false
                    },
                    url: {
                        type: SchemaType.STRING,
                        description: 'Verified HTTPS URL of the DeFi platform',
                        nullable: false
                    }
                },
                required: ['name', 'url']
            }
        },
        networks: {
            type: SchemaType.ARRAY,
            description:
                'The name of the blockchain network(s) which the action is to be executed on',
            items: {
                type: SchemaType.STRING,
                description: 'Lower-cased name of blockchain network',
                nullable: false
            }
        },
        operations: {
            type: SchemaType.ARRAY,
            description: 'The DeFi operation type(s) used of the action',
            items: {
                type: SchemaType.STRING,
                description: 'DeFi operation type',
                nullable: false,
                enum: [...ACTION_OPERATION_TYPES]
            }
        },
        apy: {
            type: SchemaType.STRING,
            description:
                'The annual yield that can be expected from this action. Example values: 3%, 5%, 8-10%',
            nullable: false
        },
        flags: {
            type: SchemaType.ARRAY,
            description: 'The flags for the action',
            items: {
                type: SchemaType.STRING,
                description: 'Flag name (instructions for possible values in prompt)',
                nullable: false
            }
        }
    },
    required: ['tokens', 'description', 'platforms', 'networks', 'operations', 'apy', 'flags']
}

export const StrategyGoogleSchema: Schema = {
    type: SchemaType.OBJECT,
    properties: {
        name: {
            type: SchemaType.STRING,
            description: 'Name of the strategy',
            nullable: false
        },
        risk: {
            type: SchemaType.STRING,
            description: 'Risk level of the strategy',
            nullable: false,
            enum: [...RISK_TYPES]
        },
        actions: {
            description: 'List of actions for the strategy',
            type: SchemaType.ARRAY,
            items: ActionGoogleSchema
        }
    },
    required: ['name', 'risk', 'actions']
}

export const StrategiesGoogleSchema = {
    description: 'List of strategies',
    type: SchemaType.ARRAY,
    items: StrategyGoogleSchema
}
