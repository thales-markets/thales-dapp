import { isMainNet, NetworkId } from './network';
import { getContractAddressesForChainOrThrow } from '@0x/contract-addresses';

export const SUPPORTED_NETWORKS_0X: Record<NetworkId, string | null> = {
    1: 'MAINNET',
    3: 'ROPSTEN',
    42: 'KOVAN',
    10: '',
    69: '',
};

export const get0xBaseURL = (networkId: NetworkId) => {
    const network = SUPPORTED_NETWORKS_0X[networkId];

    if (isMainNet(networkId) || network == null) {
        return 'https://api.0x.org/';
    }

    return `https://${network.toLowerCase()}.api.0x.org/`;
};

export const get0xExchangeProxyAddress = (networkId: NetworkId) =>
    SUPPORTED_NETWORKS_0X[networkId] === '' ? '' : getContractAddressesForChainOrThrow(networkId).exchangeProxy;
