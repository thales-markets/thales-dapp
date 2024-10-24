import { hexStripZeros } from '@ethersproject/bytes';
import detectEthereumProvider from '@metamask/detect-provider';
import { ReactComponent as ArbitrumLogo } from 'assets/images/arbitrum-circle-logo.svg';
import { ReactComponent as BaseLogo } from 'assets/images/base-circle-logo.svg';
import { ReactComponent as EthereumLogo } from 'assets/images/ethereum-circle-logo.svg';
import { ReactComponent as OpLogo } from 'assets/images/optimism-circle-logo.svg';
import { ReactComponent as PolygonLogo } from 'assets/images/polygon-circle-logo.svg';
import { COLLATERALS, DEPRECATED_COLLATERALS } from 'constants/currency';
import {
    DEFAULT_NETWORK,
    L1_TO_L2_NETWORK_MAPPER,
    SUPPORTED_NETWORKS,
    SUPPORTED_NETWORKS_NAMES,
    SUPPORTED_NETWORKS_PARAMS,
} from 'constants/network';
import ROUTES from 'constants/routes';
import { Network } from 'enums/network';
import { BigNumber } from 'ethers';
import { FunctionComponent, SVGProps } from 'react';
import { NetworkParams, SupportedNetwork } from '../types/network';

type EthereumProvider = {
    isMetaMask: boolean;
    networkVersion: string;
};

const hasEthereumInjected = () => !!window.ethereum;

// Not in use anymore as detectEthereumProvider() doesn't always return value.
// On page reload returns undefined and on hard reload returns good value from Metamask (e.g. 69)
export async function getEthereumNetwork() {
    try {
        if (hasEthereumInjected()) {
            const provider = (await detectEthereumProvider()) as EthereumProvider;
            if (provider && provider.networkVersion != null) {
                const networkId = Number(provider.networkVersion) as SupportedNetwork;
                return { name: SUPPORTED_NETWORKS_NAMES[networkId], networkId };
            }
        }
        return DEFAULT_NETWORK;
    } catch (e) {
        console.log(e);
        return DEFAULT_NETWORK;
    }
}

export const isNetworkSupported = (networkId: SupportedNetwork): boolean => {
    return !!SUPPORTED_NETWORKS[networkId];
};

export const getIsMultiCollateralSupported = (networkId: SupportedNetwork, isDeprecatedCurrency: boolean): boolean =>
    (isDeprecatedCurrency ? DEPRECATED_COLLATERALS : COLLATERALS)[networkId].length > 1;

export const getIsOVM = (networkId: number): boolean =>
    [Network.OptimismMainnet, Network.OptimismSepolia].includes(networkId);

export const checkAllowance = async (amount: BigNumber, token: any, walletAddress: string, spender: string) => {
    try {
        const approved = await token.allowance(walletAddress, spender);
        return approved.gte(amount);
    } catch (err: any) {
        console.log(err);
        return false;
    }
};

const changeNetwork = async (network?: NetworkParams, callback?: VoidFunction, chainId?: string): Promise<void> => {
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

type DropdownNetwork = {
    name: string;
    icon: FunctionComponent<SVGProps<SVGSVGElement>>;
    changeNetwork: (networkId: number, callback?: VoidFunction) => Promise<void>;
    order: number;
};

export const SUPPORTED_NETWORK_IDS_MAP: Record<number, DropdownNetwork> = {
    [Network.OptimismMainnet]: {
        name: 'Optimism',
        icon: OpLogo,
        changeNetwork: async (networkId: number, callback?: VoidFunction) => {
            const switchTo = L1_TO_L2_NETWORK_MAPPER[networkId] ?? 10;
            const optimismNetworkParms = SUPPORTED_NETWORKS_PARAMS[switchTo];
            await changeNetwork(optimismNetworkParms, callback);
        },
        order: 1,
    },
    [Network.PolygonMainnet]: {
        name: 'Polygon',
        icon: PolygonLogo,
        changeNetwork: async (networkId: number, callback?: VoidFunction) => {
            const polygonNetworkParams = SUPPORTED_NETWORKS_PARAMS[networkId];
            await changeNetwork(polygonNetworkParams, callback);
        },
        order: 4,
    },
    [Network.Mainnet]: {
        name: 'Mainnet',
        icon: EthereumLogo,
        changeNetwork: async (networkId: number, callback?: VoidFunction) => {
            const formattedChainId = hexStripZeros(BigNumber.from(networkId).toHexString());
            await changeNetwork(undefined, callback, formattedChainId);
        },
        order: 6,
    },
    [Network.Arbitrum]: {
        name: 'Arbitrum',
        icon: ArbitrumLogo,
        changeNetwork: async (networkId: number, callback?: VoidFunction) => {
            const arbNetworkParams = SUPPORTED_NETWORKS_PARAMS[networkId];
            await changeNetwork(arbNetworkParams, callback);
        },
        order: 2,
    },
    [Network.Base]: {
        name: 'Base',
        icon: BaseLogo,
        changeNetwork: async (networkId: number, callback?: VoidFunction) => {
            const baseNetworkParams = SUPPORTED_NETWORKS_PARAMS[networkId];
            await changeNetwork(baseNetworkParams, callback);
        },
        order: 3,
    },
};

export const getSupportedNetworksByRoute = (route: string): Network[] => {
    switch (route) {
        case ROUTES.Options.Home:
        case ROUTES.Options.RangeMarkets:
        case ROUTES.Options.CreateMarket:
        case ROUTES.Options.Profile:
        case ROUTES.Options.Game:
            return [Network.OptimismMainnet, Network.Arbitrum, Network.Base, Network.PolygonMainnet];
        case ROUTES.Options.Vaults:
            return [Network.OptimismMainnet, Network.Arbitrum];
        case ROUTES.Options.LiquidityPool:
            return [Network.OptimismMainnet, Network.Arbitrum, Network.Base];
        case ROUTES.Options.Wizard:
            return [Network.OptimismMainnet, Network.Arbitrum, Network.Base, Network.PolygonMainnet, Network.Mainnet];
        default:
            return Object.keys(SUPPORTED_NETWORKS).map((network) => Number(network) as Network);
    }
};
