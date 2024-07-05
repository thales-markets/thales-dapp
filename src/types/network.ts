import { Network } from 'enums/network';

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

export type SupportedNetwork = Exclude<Network, Network.ZkSync | Network.ZkSyncSepolia | Network.BlastSepolia>;
