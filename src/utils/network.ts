import detectEthereumProvider from '@metamask/detect-provider';
import { COLLATERALS } from 'constants/currency';
import { SUPPORTED_NETWORKS, SUPPORTED_NETWORKS_NAMES, defaultNetwork } from 'constants/network';
import { Network } from 'enums/network';
import { BigNumber } from 'ethers';

type EthereumProvider = {
    isMetaMask: boolean;
    networkVersion: string;
};

export const hasEthereumInjected = () => !!window.ethereum;

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
        return defaultNetwork;
    } catch (e) {
        console.log(e);
        return defaultNetwork;
    }
}

export const isMainNet = (networkId: Network) => networkId === 1;

export const isNetworkSupported = (networkId: Network): boolean => {
    return !!SUPPORTED_NETWORKS[networkId];
};

export const getIsMainnet = (networkId: number): boolean => [1].includes(networkId);

export const getIsMultiCollateralSupported = (networkId: Network): boolean => COLLATERALS[networkId].length > 1;

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

export const getDefaultDecimalsForNetwork = (networkId: Network) => {
    if (networkId == Network.Arbitrum || networkId == Network['POLYGON-MAINNET']) return 6;
    return 18;
};

const MAX_L2_GAS_LIMIT = 29000000;
export const getMaxGasLimitForNetwork = (networkId: Network) => {
    if (networkId == Network['Mainnet-Ovm']) return MAX_L2_GAS_LIMIT;
    return null;
};
