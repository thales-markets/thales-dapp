import { ReactComponent as OpLogo } from 'assets/images/optimism-circle-logo.svg';
import { ReactComponent as EthereumLogo } from 'assets/images/ethereum-circle-logo.svg';
import { ReactComponent as PolygonLogo } from 'assets/images/polygon-circle-logo.svg';
import { ReactComponent as BSCLogo } from 'assets/images/binance_chain.svg';
import { ReactComponent as ArbitrumLogo } from 'assets/images/arbitrum-circle-logo.svg';
import { FunctionComponent, SVGProps } from 'react';
import { hexStripZeros } from '@ethersproject/bytes';
import { BigNumber } from 'ethers';
import { Network } from 'enums/network';
import { hasEthereumInjected } from 'utils/network';

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
};

export const SUPPORTED_NETWORKS_NAMES: Record<Network, string> = {
    [Network.Mainnet]: 'MAINNET',
    [Network.OptimismMainnet]: 'OPTIMISM MAINNET',
    [Network.BSC]: 'BINANCE SMART CHAIN MAINNET',
    [Network.PolygonMainnet]: 'POLYGON',
    [Network.OptimismGoerli]: 'OPTIMISM GOERLI',
    [Network.Arbitrum]: 'ARBITRUM ONE',
};

export const defaultNetwork: { name: string; networkId: Network } = {
    name: SUPPORTED_NETWORKS_NAMES[Network.OptimismMainnet],
    networkId: Network.OptimismMainnet,
};

type NetworkMapper = Record<number, number>;

export const L1_TO_L2_NETWORK_MAPPER: NetworkMapper = {
    1: 10,
    42: 69,
};

type OptimismNetwork = {
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

const POLYGON_NETWORKS: Record<number, OptimismNetwork> = {
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

const BSC_NETWORK: Record<number, OptimismNetwork> = {
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

const ARBITRUM_NETWORK: Record<number, OptimismNetwork> = {
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

type DropdownNetwork = {
    name: string;
    icon: FunctionComponent<SVGProps<SVGSVGElement>>;
    changeNetwork: (networkId: number, callback?: VoidFunction) => Promise<void>;
    order: number;
};

const changeNetwork = async (network?: OptimismNetwork, callback?: VoidFunction, chainId?: string): Promise<void> => {
    if (hasEthereumInjected()) {
        try {
            await (window.ethereum as any).request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: network?.chainId || chainId }],
            });
            callback && callback();
        } catch (switchError: any) {
            if (network && switchError.code === 4902) {
                try {
                    await (window.ethereum as any).request({
                        method: 'wallet_addEthereumChain',
                        params: [network],
                    });
                    await (window.ethereum as any).request({
                        method: 'wallet_switchEthereumChain',
                        params: [{ chainId: network.chainId }],
                    });
                    callback && callback();
                } catch (addError) {
                    console.log(addError);
                }
            } else {
                console.log(switchError);
            }
        }
    } else {
        callback && callback();
    }
};

export const SUPPORTED_NETWORK_IDS_MAP: Record<number, DropdownNetwork> = {
    [Network.OptimismMainnet]: {
        name: 'Optimism',
        icon: OpLogo,
        changeNetwork: async (networkId: number, callback?: VoidFunction) => {
            const switchTo = L1_TO_L2_NETWORK_MAPPER[networkId] ?? 10;
            const optimismNetworkParms = OPTIMISM_NETWORKS[switchTo];
            await changeNetwork(optimismNetworkParms, callback);
        },
        order: 1,
    },
    [Network.PolygonMainnet]: {
        name: 'Polygon',
        icon: PolygonLogo,
        changeNetwork: async (networkId: number, callback?: VoidFunction) => {
            const polygonNetworkParams = POLYGON_NETWORKS[networkId];
            await changeNetwork(polygonNetworkParams, callback);
        },
        order: 3,
    },
    [Network.Mainnet]: {
        name: 'Mainnet',
        icon: EthereumLogo,
        changeNetwork: async (networkId: number, callback?: VoidFunction) => {
            const formattedChainId = hexStripZeros(BigNumber.from(networkId).toHexString());
            await changeNetwork(undefined, callback, formattedChainId);
        },
        order: 5,
    },
    [Network.BSC]: {
        name: 'BNBChain',
        icon: BSCLogo,
        changeNetwork: async (networkId: number, callback?: VoidFunction) => {
            const bscNetworkParams = BSC_NETWORK[networkId];
            await changeNetwork(bscNetworkParams, callback);
        },
        order: 4,
    },
    [Network.Arbitrum]: {
        name: 'Arbitrum',
        icon: ArbitrumLogo,
        changeNetwork: async (networkId: number, callback?: VoidFunction) => {
            const arbNetworkParams = ARBITRUM_NETWORK[networkId];
            await changeNetwork(arbNetworkParams, callback);
        },
        order: 2,
    },
};
