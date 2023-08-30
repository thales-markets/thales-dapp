export type NetworkParams = {
    chainId: string;
    chainName: string;
    rpcUrls: string[];
    blockExplorerUrls: string[];
    iconUrls: string[];
    fraudProofWindow?: number;
    nativeCurrency: {
        symbol: string;
        decimals: number;
    };
};
