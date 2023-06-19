import detectEthereumProvider from '@metamask/detect-provider';
import { CRYPTO_CURRENCY_MAP, SYNTHS_MAP } from 'constants/currency';
import { Network } from 'enums/network';
import { BigNumber } from 'ethers';

export type NetworkId = 1 | 3 | 42 | 10 | 69 | 420 | 80001 | 137 | 56 | 42161;

type EthereumProvider = {
    isMetaMask: boolean;
    networkVersion: string;
};

export const SUPPORTED_NETWORKS: Record<NetworkId, string> = {
    1: 'MAINNET',
    3: 'ROPSTEN',
    42: 'KOVAN',
    10: 'OPTIMISTIC',
    69: 'KOVAN-OPTIMISTIC',
    420: 'GOERLI-OPTIMISM',
    80001: 'POLYGON-MUMBAI',
    137: 'POLYGON-MAINNET',
    56: 'BSC-MAINNET',
    42161: 'ARBITRUM-ONE',
};

export const SUPPORTED_NETWORKS_NAMES: Record<NetworkId, string> = {
    1: 'MAINNET',
    3: 'ROPSTEN',
    42: 'KOVAN',
    10: 'OPTIMISM MAINNET',
    69: 'OPTIMISM KOVAN',
    420: 'OPTIMISM GOERLI',
    80001: 'POLYGON MUMBAI',
    137: 'POLYGON',
    56: 'BINANCE SMART CHAIN MAINNET',
    42161: 'ARBITRUM ONE',
};

export const defaultNetwork: { name: string; networkId: NetworkId } = {
    name: 'OPTIMISM MAINNET',
    networkId: 10,
};

export const hasEthereumInjected = () => !!window.ethereum;

// Not in use anymore as detectEthereumProvider() doesn't always return value.
// On page reload returns undefined and on hard reload returns good value from Metamask (e.g. 69)
export async function getEthereumNetwork() {
    try {
        if (hasEthereumInjected()) {
            const provider = (await detectEthereumProvider()) as EthereumProvider;
            if (provider && provider.networkVersion != null) {
                const networkId = Number(provider.networkVersion) as NetworkId;
                return { name: SUPPORTED_NETWORKS_NAMES[networkId], networkId };
            }
        }
        return defaultNetwork;
    } catch (e) {
        console.log(e);
        return defaultNetwork;
    }
}

export const isMainNet = (networkId: NetworkId) => networkId === 1;

export const isNetworkSupported = (networkId: NetworkId): boolean => {
    return !!SUPPORTED_NETWORKS[networkId];
};

export const getIsMainnet = (networkId: number): boolean => [1].includes(networkId);

export const getIsMultiCollateralSupported = (networkId: NetworkId): boolean => [10].includes(networkId);

export const getIsBSC = (networkId: number): boolean => [56].includes(networkId);

export const getIsOVM = (networkId: number): boolean => [10, 69, 420].includes(networkId);

export const getIsPolygon = (networkId: number): boolean => [137, 80001].includes(networkId);

export const getIsArbitrum = (networkId: number): boolean => [42161].includes(networkId);

export const checkAllowance = async (amount: BigNumber, token: any, walletAddress: string, spender: string) => {
    try {
        const approved = await token.allowance(walletAddress, spender);
        return approved.gte(amount);
    } catch (err: any) {
        console.log(err);
        return false;
    }
};

export const getDefaultCollateral = (networkId: NetworkId) => {
    if (getIsPolygon(networkId) || getIsArbitrum(networkId)) {
        return CRYPTO_CURRENCY_MAP.USDC;
    }
    if (networkId == Network.BSC) {
        return CRYPTO_CURRENCY_MAP.BUSD;
    }
    return SYNTHS_MAP.sUSD;
};

export const getDefaultDecimalsForNetwork = (networkId: NetworkId) => {
    if (networkId == Network.Arbitrum || networkId == Network['POLYGON-MAINNET']) return 6;
    return 18;
};
