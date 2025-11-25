import { Fetch } from 'ambire-common/dist/src/interfaces/fetch';
import { PortfolioForNetwork, ProcessAddressProps, AuraResponse_01, NetworkPortfolioLibResponse } from '../types';
export declare function getPortfolioForNetwork(address: string, networkId: string | bigint, customFetch?: Fetch): Promise<NetworkPortfolioLibResponse>;
export declare function getPortfolioVelcroV3(address: string, customFetch?: Fetch): Promise<PortfolioForNetwork[]>;
export declare const processAddress: ({ address, getPortfolio, makePrompt, llmProcessor, model, llmOptionsOverride }?: ProcessAddressProps) => Promise<AuraResponse_01>;
//# sourceMappingURL=portfolio.d.ts.map