import { isMainNet, isRopsten, NetworkId } from './network';

export const SUPPORTED_NETWORKS_0X: Record<NetworkId, string | null> = {
    1: 'MAINNET',
    3: 'ROPSTEN',
    4: null,
    42: 'KOVAN',
};

export const get0xBaseURL = (networkId: NetworkId) => {
    const network = SUPPORTED_NETWORKS_0X[networkId];

    if (isMainNet(networkId) || network == null) {
        return 'https://api.0x.org/sra/v4/';
    }

    if (isRopsten(networkId)) {
        return 'https://ropsten.api.0x.org/sra/v4/';
    }

    return `https://${network.toLowerCase()}.api.0x.org/sra/v3/`;
};

export const isV4 = (networkId: NetworkId) => networkId === 1 || networkId === 3;
