import { ReactComponent as OpLogo } from 'assets/images/optimism-circle-logo.svg';
import { ReactComponent as EthereumLogo } from 'assets/images/ethereum-circle-logo.svg';
import { ReactComponent as PolygonLogo } from 'assets/images/polygon-circle-logo.svg';
// import { ReactComponent as BSCLogo } from 'assets/images/binance_chain.svg';
import { ReactComponent as ArbitrumLogo } from 'assets/images/arbitrum-circle-logo.svg';
import { FunctionComponent, SVGProps } from 'react';
import { hexStripZeros } from '@ethersproject/bytes';
import { BigNumber } from 'ethers';
import { Network } from 'utils/network';

export const GWEI_UNIT = 1000000000;
export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';
export const POLYGON_GWEI_INCREASE_PERCENTAGE = 0.2;

export type NetworkMapper = Record<number, number>;
export type DropdownNetwork = {
    name: string;
    icon: FunctionComponent<SVGProps<SVGSVGElement>>;
    changeNetwork: (networkId: number, callback?: VoidFunction) => void;
};

export const L1_TO_L2_NETWORK_MAPPER: NetworkMapper = {
    1: 10,
    42: 69,
};

export const L2_TO_L1_NETWORK_MAPPER: NetworkMapper = {
    10: 1,
    69: 42,
};

export type OptimismNetwork = {
    chainId: string;
    chainName: string;
    rpcUrls: string[];
    blockExplorerUrls: string[];
    iconUrls: string[];
    fraudProofWindow?: number;
};

export const OPTIMISM_NETWORKS: Record<number, OptimismNetwork> = {
    10: {
        chainId: '0xA',
        chainName: 'Optimism Mainnet',
        rpcUrls: ['https://mainnet.optimism.io'],
        blockExplorerUrls: ['https://optimistic.etherscan.io/'],
        iconUrls: ['https://optimism.io/images/metamask_icon.svg', 'https://optimism.io/images/metamask_icon.png'],
    },
    69: {
        chainId: '0x45',
        chainName: 'Optimism Kovan',
        rpcUrls: ['https://kovan.optimism.io'],
        blockExplorerUrls: ['https://kovan-optimistic.etherscan.io/'],
        iconUrls: ['https://optimism.io/images/metamask_icon.svg', 'https://optimism.io/images/metamask_icon.png'],
    },
};

export const OPTIMISM_OPTIONS = [
    {
        label: 'optimism.optimistic-gateway',
        link: 'https://gateway.optimism.io/',
    },
    {
        label: 'optimism.optimistic-etherscan',
        link: 'https://optimistic.etherscan.io/',
    },
    {
        label: 'optimism.learn-more',
        link: 'https://www.optimism.io/',
    },
];

export const POLYGON_MUMBAI_ID = 80001;
export const POLYGON_ID = 137;

export const POLYGON_NETWORKS: Record<number, OptimismNetwork> = {
    [POLYGON_ID]: {
        chainId: '0x89',
        chainName: 'Polygon Mainnet',
        rpcUrls: ['https://polygon-rpc.com'],
        blockExplorerUrls: ['https://explorer.matic.network/'],
        iconUrls: ['https://optimism.io/images/metamask_icon.svg', 'https://optimism.io/images/metamask_icon.png'],
    },
    [POLYGON_MUMBAI_ID]: {
        chainId: '0x13881',
        chainName: 'Polygon Mumbai',
        rpcUrls: ['https://matic-mumbai.chainstacklabs.com'],
        blockExplorerUrls: ['https://mumbai-explorer.matic.today/'],
        iconUrls: ['https://optimism.io/images/metamask_icon.svg', 'https://optimism.io/images/metamask_icon.png'],
    },
};

export const BSC_NETWORK: Record<number, OptimismNetwork> = {
    56: {
        chainId: '0x38',
        chainName: 'BSC',
        rpcUrls: ['https://polygon-rpc.com'],
        blockExplorerUrls: ['https://bscscan.com/'],
        iconUrls: ['https://optimism.io/images/metamask_icon.svg', 'https://optimism.io/images/metamask_icon.png'],
    },
};

export const ARBITRUM_NETWORK: Record<number, OptimismNetwork> = {
    42161: {
        chainId: '0xA4B1',
        chainName: 'Arbitrum One',
        rpcUrls: ['https://arb1.arbitrum.io/rpc	'],
        blockExplorerUrls: ['https://arbiscan.io/'],
        iconUrls: ['https://optimism.io/images/metamask_icon.svg', 'https://optimism.io/images/metamask_icon.png'],
    },
};

export const SUPPORTED_MAINNET_NETWORK_IDS_MAP: Record<string, DropdownNetwork> = {
    10: {
        name: 'Optimism',
        icon: OpLogo,
        changeNetwork: async (networkId: number) => {
            const switchTo = L1_TO_L2_NETWORK_MAPPER[networkId] ?? Network['Mainnet-Ovm'];
            const optimismNetworkParms = OPTIMISM_NETWORKS[switchTo];

            if (typeof window.ethereum !== 'undefined') {
                try {
                    await (window.ethereum as any).request({
                        method: 'wallet_switchEthereumChain',
                        params: [{ chainId: optimismNetworkParms.chainId }],
                    });
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
        changeNetwork: async (networkId: number) => {
            const formattedChainId = hexStripZeros(BigNumber.from(networkId).toHexString());

            if (typeof window.ethereum !== 'undefined') {
                try {
                    await (window.ethereum as any).request({
                        method: 'wallet_switchEthereumChain',
                        params: [{ chainId: formattedChainId }],
                    });
                } catch (switchError: any) {
                    console.log(switchError);
                }
            }
        },
    },
    // 56: {
    //     name: 'BSC',
    //     icon: BSCLogo,
    //     changeNetwork: async (networkId: number) => {
    //         const bscNetworkParams = BSC_NETWORK[networkId];

    //         if (typeof window.ethereum !== 'undefined') {
    //             try {
    //                 await (window.ethereum as any).request({
    //                     method: 'wallet_switchEthereumChain',
    //                     params: [{ chainId: bscNetworkParams.chainId }],
    //                 });
    //             } catch (switchError: any) {
    //                 console.log(switchError);
    //             }
    //         }
    //     },
    // },
    42161: {
        name: 'Arbitrum',
        icon: ArbitrumLogo,
        changeNetwork: async (networkId: number) => {
            const arbNetworkParams = ARBITRUM_NETWORK[networkId];

            if (typeof window.ethereum !== 'undefined') {
                try {
                    await (window.ethereum as any).request({
                        method: 'wallet_switchEthereumChain',
                        params: [{ chainId: arbNetworkParams.chainId }],
                    });
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
