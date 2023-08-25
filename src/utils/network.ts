import { ReactComponent as OpLogo } from 'assets/images/optimism-circle-logo.svg';
import { ReactComponent as EthereumLogo } from 'assets/images/ethereum-circle-logo.svg';
import { ReactComponent as PolygonLogo } from 'assets/images/polygon-circle-logo.svg';
import { ReactComponent as ArbitrumLogo } from 'assets/images/arbitrum-circle-logo.svg';
// import { ReactComponent as BaseLogo } from 'assets/images/base-circle-logo.svg';
import { FunctionComponent, SVGProps } from 'react';
import { hexStripZeros } from '@ethersproject/bytes';
import { BigNumber } from 'ethers';
import detectEthereumProvider from '@metamask/detect-provider';
import { ADDITIONAL_COLLATERALS, COLLATERALS } from 'constants/currency';
import {
    ARBITRUM_NETWORK,
    // BASE_NETWORK,
    L1_TO_L2_NETWORK_MAPPER,
    OPTIMISM_NETWORKS,
    POLYGON_NETWORKS,
    SUPPORTED_NETWORKS,
    SUPPORTED_NETWORKS_NAMES,
    DEFAULT_NETWORK,
} from 'constants/network';
import { Network } from 'enums/network';
import { OptimismNetwork } from 'types/network';
import ROUTES from 'constants/routes';

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
                const networkId = Number(provider.networkVersion) as Network;
                return { name: SUPPORTED_NETWORKS_NAMES[networkId], networkId };
            }
        }
        return DEFAULT_NETWORK;
    } catch (e) {
        console.log(e);
        return DEFAULT_NETWORK;
    }
}

export const isNetworkSupported = (networkId: Network): boolean => {
    return !!SUPPORTED_NETWORKS[networkId];
};

export const getIsMultiCollateralSupported = (networkId: Network, includeAdditional?: boolean): boolean =>
    COLLATERALS[networkId].concat(includeAdditional ? ADDITIONAL_COLLATERALS[networkId] : []).length > 1;

export const getIsOVM = (networkId: number): boolean =>
    [Network.OptimismMainnet, Network.OptimismGoerli].includes(networkId);

export const checkAllowance = async (amount: BigNumber, token: any, walletAddress: string, spender: string) => {
    try {
        const approved = await token.allowance(walletAddress, spender);
        return approved.gte(amount);
    } catch (err: any) {
        console.log(err);
        return false;
    }
};

export const getDefaultDecimalsForNetwork = (networkId: Network) => {
    if (networkId == Network.Arbitrum || networkId == Network.PolygonMainnet || networkId === Network.Base) return 6;
    return 18;
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
            const arbNetworkParams = ARBITRUM_NETWORK[networkId];
            await changeNetwork(arbNetworkParams, callback);
        },
        order: 2,
    },
    // TODO: Release on 28.08.
    /*
    [Network.Base]: {
        name: 'Base',
        icon: BaseLogo,
        changeNetwork: async (networkId: number, callback?: VoidFunction) => {
            const baseNetworkParams = BASE_NETWORK[networkId];
            await changeNetwork(baseNetworkParams, callback);
        },
        order: 3,
    },
    */
};

export const getSupportedNetworksByRoute = (route: string): Network[] => {
    switch (route) {
        case ROUTES.Options.Home:
            return [
                Network.OptimismMainnet,
                Network.OptimismGoerli,
                Network.Arbitrum,
                // Network.Base, // TODO: Release on 28.08.
                Network.PolygonMainnet,
            ];
        case ROUTES.Options.RangeMarkets:
            return [
                Network.OptimismMainnet,
                Network.OptimismGoerli,
                Network.Arbitrum,
                // Network.Base, // TODO: Release on 28.08.
                Network.PolygonMainnet,
            ];
        case ROUTES.Options.Vaults:
            return [Network.OptimismMainnet, Network.OptimismGoerli, Network.Arbitrum];
        case ROUTES.Options.LiquidityPool:
            return [Network.OptimismMainnet, Network.OptimismGoerli, Network.Arbitrum];
        case ROUTES.Options.Referral:
            return [
                Network.OptimismMainnet,
                Network.OptimismGoerli,
                Network.Arbitrum,
                // Network.Base, // TODO: Release on 28.08.
                Network.PolygonMainnet,
            ];
        case ROUTES.Options.Token:
            return [Network.OptimismMainnet, Network.OptimismGoerli, Network.Arbitrum, Network.Mainnet];
        case ROUTES.Governance.Home:
            return [
                Network.OptimismMainnet,
                Network.OptimismGoerli,
                Network.Arbitrum,
                // Network.Base, // TODO: Release on 28.08.
                Network.PolygonMainnet,
            ];
        case ROUTES.Options.Game:
            return [
                Network.OptimismMainnet,
                Network.OptimismGoerli,
                Network.Arbitrum,
                // Network.Base, // TODO: Release on 28.08.
                Network.PolygonMainnet,
            ];
        case ROUTES.Options.Profile:
            return [
                Network.OptimismMainnet,
                Network.OptimismGoerli,
                Network.Arbitrum,
                // Network.Base, // TODO: Release on 28.08.
                Network.PolygonMainnet,
            ];
        case ROUTES.Options.CreateMarket:
            return [
                Network.OptimismMainnet,
                Network.OptimismGoerli,
                Network.Arbitrum,
                // Network.Base, // TODO: Release on 28.08.
                Network.PolygonMainnet,
            ];
        case ROUTES.Options.SpeedMarkets:
            return [
                Network.OptimismMainnet,
                Network.OptimismGoerli,
                Network.Arbitrum,
                // Network.Base, // TODO: Release on 28.08.
                Network.PolygonMainnet,
            ];
        default:
            return Object.keys(SUPPORTED_NETWORKS).map((network) => Number(network) as Network);
    }
};

// TODO: delete this method after params changes on contract
export const getFixedRewardsForNetwork = (network: Network) => {
    switch (network) {
        case Network.OptimismMainnet:
            return 45000;
        case Network.Arbitrum:
            return 18000;
        case Network.Base:
            return 15000;
        default:
            return 30000;
    }
};

// TODO: delete this method after params changes on contract
export const getBonusRewardsForNetwork = (network: Network) => {
    switch (network) {
        case Network.OptimismMainnet:
            return 15000;
        case Network.Arbitrum:
            return 7000;
        case Network.Base:
            return 5000;
        default:
            return 15000;
    }
};
