import { PortfolioForNetwork, ProcessAddressProps, AuraResponse_01, NetworkPortfolioLibResponse } from '../types';
export declare function getPortfolioForNetwork(address: string, networkId: string): Promise<NetworkPortfolioLibResponse>;
export declare function getPortfolioVelcroV3(address: string): Promise<PortfolioForNetwork[]>;
export declare const processAddress: ({ address, getPortfolio, makePrompt, llmProcessor }?: ProcessAddressProps) => Promise<AuraResponse_01>;
//# sourceMappingURL=portfolio.d.ts.map