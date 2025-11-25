"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StrategiesGoogleSchema = exports.StrategyGoogleSchema = exports.ActionGoogleSchema = void 0;
const generative_ai_1 = require("@google/generative-ai");
const common_1 = require("./common");
exports.ActionGoogleSchema = {
    type: generative_ai_1.SchemaType.OBJECT,
    properties: {
        tokens: {
            type: generative_ai_1.SchemaType.STRING,
            description: 'Comma-separated list of symbols of the involved tokens, for example: USDC, ETH',
            nullable: false
        },
        description: {
            type: generative_ai_1.SchemaType.STRING,
            description: 'Free text describing the action concerning the related tokens, the platform to use and expected APY',
            nullable: false
        },
        platforms: {
            type: generative_ai_1.SchemaType.ARRAY,
            description: 'The DeFi platform(s) to be used for the action',
            items: {
                type: generative_ai_1.SchemaType.OBJECT,
                properties: {
                    name: {
                        type: generative_ai_1.SchemaType.STRING,
                        description: 'DeFi platform name',
                        nullable: false
                    },
                    url: {
                        type: generative_ai_1.SchemaType.STRING,
                        description: 'Verified HTTPS URL of the DeFi platform',
                        nullable: false
                    }
                },
                required: ['name', 'url']
            }
        },
        networks: {
            type: generative_ai_1.SchemaType.ARRAY,
            description: 'The name of the blockchain network(s) which the action is to be executed on',
            items: {
                type: generative_ai_1.SchemaType.STRING,
                description: 'Lower-cased name of blockchain network',
                nullable: false
            }
        },
        operations: {
            type: generative_ai_1.SchemaType.ARRAY,
            description: 'The DeFi operation type(s) used of the action',
            items: {
                type: generative_ai_1.SchemaType.STRING,
                description: 'DeFi operation type',
                nullable: false,
                enum: [...common_1.ACTION_OPERATION_TYPES]
            }
        },
        apy: {
            type: generative_ai_1.SchemaType.STRING,
            description: 'The annual yield that can be expected from this action. Example values: 3%, 5%, 8-10%',
            nullable: false
        },
        flags: {
            type: generative_ai_1.SchemaType.ARRAY,
            description: 'The flags for the action',
            items: {
                type: generative_ai_1.SchemaType.STRING,
                description: 'Flag name (instructions for possible values in prompt)',
                nullable: false
            }
        }
    },
    required: ['tokens', 'description', 'platforms', 'networks', 'operations', 'apy', 'flags']
};
exports.StrategyGoogleSchema = {
    type: generative_ai_1.SchemaType.OBJECT,
    properties: {
        name: {
            type: generative_ai_1.SchemaType.STRING,
            description: 'Name of the strategy',
            nullable: false
        },
        risk: {
            type: generative_ai_1.SchemaType.STRING,
            description: 'Risk level of the strategy',
            nullable: false,
            enum: [...common_1.RISK_TYPES]
        },
        actions: {
            description: 'List of actions for the strategy',
            type: generative_ai_1.SchemaType.ARRAY,
            items: exports.ActionGoogleSchema
        }
    },
    required: ['name', 'risk', 'actions']
};
exports.StrategiesGoogleSchema = {
    description: 'List of strategies',
    type: generative_ai_1.SchemaType.ARRAY,
    items: exports.StrategyGoogleSchema
};
//# sourceMappingURL=google.js.map