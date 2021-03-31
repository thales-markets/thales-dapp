import detectEthereumProvider from '@metamask/detect-provider';
import { DEFAULT_GAS_BUFFER } from 'constants/defaults';
import { GWEI_UNIT } from 'constants/network';

export type NetworkId = 1 | 3 | 4 | 42;

type EthereumProvider = {
    isMetaMask: boolean;
    networkVersion: string;
};

export const SUPPORTED_NETWORKS: Record<NetworkId, string> = {
    1: 'MAINNET',
    3: 'ROPSTEN',
    4: 'RINKEBY',
    42: 'KOVAN',
};

export const defaultNetwork: { name: string; networkId: NetworkId } = {
    name: 'MAINNET',
    networkId: 1,
};

export const hasEthereumInjected = () => !!window.ethereum;

export async function getEthereumNetwork() {
    try {
        if (hasEthereumInjected()) {
            const provider = (await detectEthereumProvider()) as EthereumProvider;
            if (provider && provider.networkVersion != null) {
                const networkId = Number(provider.networkVersion) as NetworkId;
                return { name: SUPPORTED_NETWORKS[networkId], networkId };
            }
        }
        return defaultNetwork;
    } catch (e) {
        console.log(e);
        return defaultNetwork;
    }
}

export const getTransactionPrice = (gasPrice: number | null, gasLimit: number | null, ethPrice: number | null) => {
    if (!gasPrice || !gasLimit || !ethPrice) return 0;

    return (gasPrice * ethPrice * gasLimit) / GWEI_UNIT;
};

export const isMainNet = (networkId: NetworkId) => networkId === 1;

export const normalizeGasLimit = (gasLimit: number) => gasLimit + DEFAULT_GAS_BUFFER;

export const gasPriceInWei = (gasPrice: number) => gasPrice * GWEI_UNIT;

export const getInfuraRpcURL = (networkId: NetworkId) => {
    const network = SUPPORTED_NETWORKS[networkId];
    return `https://${network.toLowerCase()}.infura.io/v3/${process.env.REACT_APP_INFURA_PROJECT_ID}`;
};
