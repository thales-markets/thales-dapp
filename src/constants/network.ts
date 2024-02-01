import { Network } from 'enums/network';
import { NetworkParams } from 'types/network';
import { Chain } from 'wagmi';

export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';
export const DEAD_ADDRESS = '0x000000000000000000000000000000000000dead';
export const OP_SAFE_BOX_ADDRESS = '0x679C0174f6c288C4bcd5C95C9Ec99D50357C59E7';
export const ARB_SAFE_BOX_ADDRESS = '0xE9F5E7579931a46e4beaC08Ca9ab52961AD66203';
export const BASE_SAFE_BOX_ADDRESS = '0x860C4DD827DdDd98755e0843b89d909f5A0347Ff';

export const SUPPORTED_NETWORKS: Record<Network, string> = {
    [Network.Mainnet]: 'MAINNET',
    [Network.OptimismMainnet]: 'OPTIMISTIC',
    [Network.PolygonMainnet]: 'POLYGON-MAINNET',
    [Network.OptimismGoerli]: 'GOERLI-OPTIMISM',
    [Network.OptimismSepolia]: 'SEPOLIA-OPTIMISM',
    [Network.Arbitrum]: 'ARBITRUM-ONE',
    [Network.Base]: 'BASE',
    [Network.ZkSync]: 'ZKSYNC',
    [Network.ZkSyncSepolia]: 'ZKSYNC-SEPOLIA',
    [Network.BlastSepolia]: 'BLAST-SEPOLIA',
};

export const SUPPORTED_NETWORKS_NAMES: Record<Network, string> = {
    [Network.Mainnet]: 'MAINNET',
    [Network.OptimismMainnet]: 'OPTIMISM MAINNET',
    [Network.PolygonMainnet]: 'POLYGON',
    [Network.OptimismGoerli]: 'OPTIMISM GOERLI',
    [Network.OptimismSepolia]: 'OPTIMISM SEPOLIA',
    [Network.Arbitrum]: 'ARBITRUM ONE',
    [Network.Base]: 'BASE',
    [Network.ZkSync]: 'ZKSYNC',
    [Network.ZkSyncSepolia]: 'ZKSYNC SEPOLIA',
    [Network.BlastSepolia]: 'BLAST SEPOLIA',
};

export const SWAP_SUPPORTED_NETWORKS: Network[] = [];

export const TEST_NETWORKS = [Network.OptimismGoerli, Network.OptimismSepolia, Network.ZkSyncSepolia];

export const DEFAULT_NETWORK: { name: string; networkId: Network } = {
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
    [Network.ZkSync]: {
        chainId: '0x144',
        chainName: 'zkSync',
        rpcUrls: ['https://mainnet.era.zksync.io'],
        blockExplorerUrls: ['https://explorer.zksync.io/'],
        iconUrls: ['https://optimism.io/images/metamask_icon.svg', 'https://optimism.io/images/metamask_icon.png'],
        nativeCurrency: {
            symbol: 'ETH',
            decimals: 18,
        },
    },
    [Network.BlastSepolia]: {
        chainId: '0xa0c71fd',
        chainName: 'Blast Sepolia',
        rpcUrls: ['https://sepolia.blast.io'],
        blockExplorerUrls: ['https://testnet.blastscan.io/'],
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
export const zkSyncSepolia = {
    id: 300,
    network: 'zksync-sepolia-testnet',
    name: 'zkSync Sepolia Testnet',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    rpcUrls: {
        default: {
            http: ['https://sepolia.era.zksync.dev'],
            webSocket: ['wss://sepolia.era.zksync.dev/ws'],
        },
        public: {
            http: ['https://sepolia.era.zksync.dev'],
            webSocket: ['wss://sepolia.era.zksync.dev/ws'],
        },
    },
    blockExplorers: {
        default: {
            name: 'zkExplorer',
            url: 'https://sepolia.explorer.zksync.io/',
        },
    },
    contracts: {
        multicall3: {
            address: '0xF9cda624FBC7e059355ce98a31693d299FACd963',
        },
    },
    testnet: true,
} as Chain;
export const BlastSepolia = {
    id: 168587773,
    network: 'blast-sepolia',
    name: 'Blast Sepolia',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    rpcUrls: {
        default: {
            http: ['https://sepolia.blast.io'],
            webSocket: ['wss://sepolia.blast.io/ws'],
        },
        public: {
            http: ['https://sepolia.blast.io'],
            webSocket: ['wss://sepolia.blast.io/ws'],
        },
    },
    blockExplorers: {
        default: {
            name: 'zkExplorer',
            url: 'https://testnet.blastscan.io/',
        },
    },
    testnet: true,
} as Chain;

export const BRIDGE_SUPPORTED_NETWORKS = [Network.OptimismMainnet, Network.Arbitrum, Network.Base];
