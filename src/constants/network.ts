import { Network } from 'enums/network';
import { NetworkParams, SupportedNetwork } from 'types/network';
import { Chain } from 'wagmi';

export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

export const SUPPORTED_NETWORKS: Record<SupportedNetwork, string> = {
    [Network.Mainnet]: 'MAINNET',
    [Network.OptimismMainnet]: 'OPTIMISTIC',
    [Network.PolygonMainnet]: 'POLYGON-MAINNET',
    [Network.OptimismSepolia]: 'SEPOLIA-OPTIMISM',
    [Network.Arbitrum]: 'ARBITRUM-ONE',
    [Network.Base]: 'BASE',
};

export const SUPPORTED_NETWORKS_NAMES: Record<SupportedNetwork, string> = {
    [Network.Mainnet]: 'MAINNET',
    [Network.OptimismMainnet]: 'OPTIMISM MAINNET',
    [Network.PolygonMainnet]: 'POLYGON',
    [Network.OptimismSepolia]: 'OPTIMISM SEPOLIA',
    [Network.Arbitrum]: 'ARBITRUM ONE',
    [Network.Base]: 'BASE',
};

export const SWAP_SUPPORTED_NETWORKS: Network[] = [];

export const TEST_NETWORKS = [Network.OptimismSepolia];

export const DEFAULT_NETWORK: { name: string; networkId: SupportedNetwork } = {
    name: SUPPORTED_NETWORKS_NAMES[Network.OptimismMainnet],
    networkId: Network.OptimismMainnet,
};

type NetworkMapper = Record<number, number>;

export const L1_TO_L2_NETWORK_MAPPER: NetworkMapper = {
    1: 10,
    42: 69,
};

export const SUPPORTED_NETWORKS_PARAMS: Record<number, NetworkParams> = {
    [Network.OptimismMainnet]: {
        chainId: '0xA',
        chainName: 'Optimism',
        rpcUrls: ['https://mainnet.optimism.io'],
        blockExplorerUrls: ['https://optimistic.etherscan.io/'],
        iconUrls: ['https://optimism.io/images/metamask_icon.svg', 'https://optimism.io/images/metamask_icon.png'],
        nativeCurrency: {
            symbol: 'ETH',
            decimals: 18,
        },
    },
    [Network.PolygonMainnet]: {
        chainId: '0x89',
        chainName: 'Polygon Mainnet',
        rpcUrls: ['https://polygon-rpc.com'],
        blockExplorerUrls: ['https://explorer.matic.network/'],
        iconUrls: ['https://optimism.io/images/metamask_icon.svg', 'https://optimism.io/images/metamask_icon.png'],
        nativeCurrency: {
            symbol: 'MATIC',
            decimals: 18,
        },
    },
    [Network.Arbitrum]: {
        chainId: '0xA4B1',
        chainName: 'Arbitrum One',
        rpcUrls: ['https://arb1.arbitrum.io/rpc'],
        blockExplorerUrls: ['https://arbiscan.io/'],
        iconUrls: ['https://optimism.io/images/metamask_icon.svg', 'https://optimism.io/images/metamask_icon.png'],
        nativeCurrency: {
            symbol: 'ETH',
            decimals: 18,
        },
    },
    [Network.Base]: {
        chainId: '0x2105',
        chainName: 'BASE',
        rpcUrls: ['https://mainnet.base.org'],
        blockExplorerUrls: ['https://basescan.org/'],
        iconUrls: ['https://optimism.io/images/metamask_icon.svg', 'https://optimism.io/images/metamask_icon.png'],
        nativeCurrency: {
            symbol: 'ETH',
            decimals: 18,
        },
    },
};

// configuration for wagmi (https://github.com/wevm/viem/tree/main/src/chains/definitions)
export const base = {
    id: 8453,
    network: 'base',
    name: 'Base',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    rpcUrls: {
        default: {
            http: ['https://mainnet.base.org'],
        },
        public: {
            http: ['https://mainnet.base.org'],
        },
    },
    blockExplorers: {
        blockscout: {
            name: 'Basescout',
            url: 'https://base.blockscout.com',
        },
        default: {
            name: 'Basescan',
            url: 'https://basescan.org',
        },
        etherscan: {
            name: 'Basescan',
            url: 'https://basescan.org',
        },
    },
    contracts: {
        multicall3: {
            address: '0xca11bde05977b3631167028862be2a173976ca11',
            blockCreated: 5022,
        },
    },
} as Chain;
export const optimismSepolia = {
    id: 11155420,
    network: 'optimism-sepolia',
    name: 'Optimism Sepolia',
    nativeCurrency: { name: 'Sepolia Ether', symbol: 'ETH', decimals: 18 },
    rpcUrls: {
        default: {
            http: ['https://sepolia.optimism.io'],
        },
        public: {
            http: ['https://sepolia.optimism.io'],
        },
    },
    blockExplorers: {
        default: {
            name: 'Blockscout',
            url: 'https://optimism-sepolia.blockscout.com',
            apiUrl: 'https://optimism-sepolia.blockscout.com/api',
        },
    },
    contracts: {
        multicall3: {
            address: '0xca11bde05977b3631167028862be2a173976ca11',
            blockCreated: 1620204,
        },
    },
    testnet: true,
} as Chain;
