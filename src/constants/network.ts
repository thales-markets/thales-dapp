import { ReactComponent as OpLogo } from 'assets/images/optimism-circle-logo.svg';
import { ReactComponent as EthereumLogo } from 'assets/images/ethereum-circle-logo.svg';
import { ReactComponent as PolygonLogo } from 'assets/images/polygon-circle-logo.svg';
import { ReactComponent as BSCLogo } from 'assets/images/binance_chain.svg';
import { ReactComponent as ArbitrumLogo } from 'assets/images/arbitrum-circle-logo.svg';
import { FunctionComponent, SVGProps } from 'react';
import { hexStripZeros } from '@ethersproject/bytes';
import { BigNumber } from 'ethers';
import { Network } from 'utils/network';

export const GWEI_UNIT = 1000000000;
export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';
export const DEAD_ADDRESS = '0x000000000000000000000000000000000000dead';
export const SAFE_BOX_ADDRESS = '0x679C0174f6c288C4bcd5C95C9Ec99D50357C59E7';
export const POLYGON_GWEI_INCREASE_PERCENTAGE = 0.2;

type NetworkMapper = Record<number, number>;
type DropdownNetwork = {
    name: string;
    icon: FunctionComponent<SVGProps<SVGSVGElement>>;
    changeNetwork: (networkId: number, callback?: VoidFunction) => void;
};

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
    10: {
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
    69: {
        chainId: '0x45',
        chainName: 'Optimism Kovan',
        rpcUrls: ['https://kovan.optimism.io'],
        blockExplorerUrls: ['https://kovan-optimistic.etherscan.io/'],
        iconUrls: ['https://optimism.io/images/metamask_icon.svg', 'https://optimism.io/images/metamask_icon.png'],
        nativeCurrency: {
            symbol: 'ETH',
            decimals: 18,
        },
    },
};

export const POLYGON_MUMBAI_ID = 80001;
export const POLYGON_ID = 137;

const POLYGON_NETWORKS: Record<number, OptimismNetwork> = {
    [POLYGON_ID]: {
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
    [POLYGON_MUMBAI_ID]: {
        chainId: '0x13881',
        chainName: 'Polygon Mumbai',
        rpcUrls: ['https://matic-mumbai.chainstacklabs.com'],
        blockExplorerUrls: ['https://mumbai-explorer.matic.today/'],
        iconUrls: ['https://optimism.io/images/metamask_icon.svg', 'https://optimism.io/images/metamask_icon.png'],
        nativeCurrency: {
            symbol: 'MATIC',
            decimals: 18,
        },
    },
};

const BSC_NETWORK: Record<number, OptimismNetwork> = {
    56: {
        chainId: '0x38',
        chainName: 'BSC',
        rpcUrls: ['https://polygon-rpc.com'],
        blockExplorerUrls: ['https://bscscan.com/'],
        iconUrls: ['https://optimism.io/images/metamask_icon.svg', 'https://optimism.io/images/metamask_icon.png'],
        nativeCurrency: {
            symbol: 'BNB',
            decimals: 18,
        },
    },
};

const ARBITRUM_NETWORK: Record<number, OptimismNetwork> = {
    42161: {
        chainId: '0xA4B1',
        chainName: 'Arbitrum One',
        rpcUrls: ['https://arb1.arbitrum.io/rpc	'],
        blockExplorerUrls: ['https://arbiscan.io/'],
        iconUrls: ['https://optimism.io/images/metamask_icon.svg', 'https://optimism.io/images/metamask_icon.png'],
        nativeCurrency: {
            symbol: 'ETH',
            decimals: 18,
        },
    },
};

export const SUPPORTED_MAINNET_NETWORK_IDS_MAP: Record<string, DropdownNetwork> = {
    10: {
        name: 'Optimism',
        icon: OpLogo,
        changeNetwork: async (networkId: number, callback?: VoidFunction) => {
            const switchTo = L1_TO_L2_NETWORK_MAPPER[networkId] ?? Network['Mainnet-Ovm'];
            const optimismNetworkParms = OPTIMISM_NETWORKS[switchTo];

            if (typeof window.ethereum !== 'undefined') {
                try {
                    await (window.ethereum as any).request({
                        method: 'wallet_switchEthereumChain',
                        params: [{ chainId: optimismNetworkParms.chainId }],
                    });
                    callback && callback();
                } catch (switchError: any) {
                    if (switchError.code === 4902) {
                        try {
                            await (window.ethereum as any).request({
                                method: 'wallet_addEthereumChain',
                                params: [optimismNetworkParms],
                            });
                            await (window.ethereum as any).request({
                                method: 'wallet_switchEthereumChain',
                                params: [{ chainId: optimismNetworkParms.chainId }],
                            });
                        } catch (addError) {
                            console.log(addError);
                        }
                    } else {
                        console.log(switchError);
                    }
                }
            }
        },
    },
    137: {
        name: 'Polygon',
        icon: PolygonLogo,
        changeNetwork: async (networkId: number, callback?: VoidFunction) => {
            // const switchTo = L1_TO_L2_NETWORK_MAPPER[networkId] ?? SnxNetworkId['Mainnet-Ovm'];
            const polygonNetworkParams = POLYGON_NETWORKS[networkId];

            if (typeof window.ethereum !== 'undefined') {
                try {
                    await (window.ethereum as any).request({
                        method: 'wallet_switchEthereumChain',
                        params: [{ chainId: polygonNetworkParams.chainId }],
                    });
                    callback && callback();
                } catch (switchError: any) {
                    if (switchError.code === 4902) {
                        try {
                            await (window.ethereum as any).request({
                                method: 'wallet_addEthereumChain',
                                params: [polygonNetworkParams],
                            });
                            await (window.ethereum as any).request({
                                method: 'wallet_switchEthereumChain',
                                params: [{ chainId: polygonNetworkParams.chainId }],
                            });
                            callback && callback();
                        } catch (addError) {
                            console.log(addError);
                        }
                    } else {
                        console.log(switchError);
                    }
                }
            }
        },
    },
    1: {
        name: 'Mainnet',
        icon: EthereumLogo,
        changeNetwork: async (networkId: number, callback?: VoidFunction) => {
            const formattedChainId = hexStripZeros(BigNumber.from(networkId).toHexString());

            if (typeof window.ethereum !== 'undefined') {
                try {
                    await (window.ethereum as any).request({
                        method: 'wallet_switchEthereumChain',
                        params: [{ chainId: formattedChainId }],
                    });
                    callback && callback();
                } catch (switchError: any) {
                    console.log(switchError);
                }
            }
        },
    },
    56: {
        name: 'BNBChain',
        icon: BSCLogo,
        changeNetwork: async (networkId: number, callback?: VoidFunction) => {
            const bscNetworkParams = BSC_NETWORK[networkId];

            if (typeof window.ethereum !== 'undefined') {
                try {
                    await (window.ethereum as any).request({
                        method: 'wallet_switchEthereumChain',
                        params: [{ chainId: bscNetworkParams.chainId }],
                    });
                    callback && callback();
                } catch (switchError: any) {
                    console.log(switchError);
                }
            }
        },
    },
    42161: {
        name: 'Arbitrum',
        icon: ArbitrumLogo,
        changeNetwork: async (networkId: number, callback?: VoidFunction) => {
            const arbNetworkParams = ARBITRUM_NETWORK[networkId];

            if (typeof window.ethereum !== 'undefined') {
                try {
                    await (window.ethereum as any).request({
                        method: 'wallet_switchEthereumChain',
                        params: [{ chainId: arbNetworkParams.chainId }],
                    });
                    callback && callback();
                } catch (switchError: any) {
                    console.log(switchError);
                }
            }
        },
    },
};

export enum OneInchLiquidityProtocol {
    UNISWAP = 'OPTIMISM_UNISWAP_V3',
    PMM6 = 'OPTIMISM_PMM6',
    VELODROME = 'OPTIMISM_VELODROME',
    BALANCER = 'OPTIMISM_BALANCER_V2',
    CURVE = 'OPTIMISM_CURVE',
}
