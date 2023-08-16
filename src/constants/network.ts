import { Network } from 'enums/network';
import { OptimismNetwork } from 'types/network';
import { Chain } from 'wagmi';

export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';
export const DEAD_ADDRESS = '0x000000000000000000000000000000000000dead';
export const SAFE_BOX_ADDRESS = '0x679C0174f6c288C4bcd5C95C9Ec99D50357C59E7';

export const SUPPORTED_NETWORKS: Record<Network, string> = {
    [Network.Mainnet]: 'MAINNET',
    [Network.OptimismMainnet]: 'OPTIMISTIC',
    [Network.BSC]: 'BSC-MAINNET',
    [Network.PolygonMainnet]: 'POLYGON-MAINNET',
    [Network.OptimismGoerli]: 'GOERLI-OPTIMISM',
    [Network.Arbitrum]: 'ARBITRUM-ONE',
    [Network.Base]: 'BASE',
};

export const SUPPORTED_NETWORKS_NAMES: Record<Network, string> = {
    [Network.Mainnet]: 'MAINNET',
    [Network.OptimismMainnet]: 'OPTIMISM MAINNET',
    [Network.BSC]: 'BINANCE SMART CHAIN MAINNET',
    [Network.PolygonMainnet]: 'POLYGON',
    [Network.OptimismGoerli]: 'OPTIMISM GOERLI',
    [Network.Arbitrum]: 'ARBITRUM ONE',
    [Network.Base]: 'BASE',
};

export const SWAP_SUPPORTED_NETWORKS = [
    Network.Mainnet,
    Network.OptimismMainnet,
    Network.BSC,
    Network.PolygonMainnet,
    Network.Arbitrum,
];

export const DEFAULT_NETWORK: { name: string; networkId: Network } = {
    name: SUPPORTED_NETWORKS_NAMES[Network.OptimismMainnet],
    networkId: Network.OptimismMainnet,
};

type NetworkMapper = Record<number, number>;

export const L1_TO_L2_NETWORK_MAPPER: NetworkMapper = {
    1: 10,
    42: 69,
};

export const OPTIMISM_NETWORKS: Record<number, OptimismNetwork> = {
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
};

export const POLYGON_NETWORKS: Record<number, OptimismNetwork> = {
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
};

export const BSC_NETWORK: Record<number, OptimismNetwork> = {
    [Network.BSC]: {
        chainId: '0x38',
        chainName: 'BSC',
        rpcUrls: ['https://bsc-dataseed.binance.org/'],
        blockExplorerUrls: ['https://bscscan.com/'],
        iconUrls: ['https://optimism.io/images/metamask_icon.svg', 'https://optimism.io/images/metamask_icon.png'],
        nativeCurrency: {
            symbol: 'BNB',
            decimals: 18,
        },
    },
};

export const ARBITRUM_NETWORK: Record<number, OptimismNetwork> = {
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
};

export const BASE_NETWORK: Record<number, OptimismNetwork> = {
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

// configuration for wagmi
export const base = {
    id: 8453,
    network: 'base',
    name: 'Base',
    nativeCurrency: { name: 'Base', symbol: 'ETH', decimals: 18 },
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
