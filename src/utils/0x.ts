import BigNumber from 'bignumber.js';
import { toBigNumber } from './formatters/number';
import { isMainNet, NetworkId, normalize0xGasLimit } from './network';
import { getContractAddressesForChainOrThrow } from '@0x/contract-addresses';

export const SUPPORTED_NETWORKS_0X: Record<NetworkId, string | null> = {
    1: 'MAINNET',
    3: 'ROPSTEN',
    42: 'KOVAN',
    69: '',
};

export const get0xBaseURL = (networkId: NetworkId) => {
    const network = SUPPORTED_NETWORKS_0X[networkId];

    if (isMainNet(networkId) || network == null) {
        return 'https://api.0x.org/';
    }

    return `https://${network.toLowerCase()}.api.0x.org/`;
};

export const get0xWebSocketBaseURL = (networkId: NetworkId) => {
    const network = SUPPORTED_NETWORKS_0X[networkId];

    if (isMainNet(networkId) || network == null) {
        return 'wss://api.0x.org/sra/v4';
    }

    return `wss://${network.toLowerCase()}.api.0x.org/sra/v4`;
};

const PROTOCOL_FEE_GAS = toBigNumber(normalize0xGasLimit(70000));

export const calculate0xProtocolFee = (orders: Array<any>, gasPrice: BigNumber | number | null): BigNumber => {
    return toBigNumber(PROTOCOL_FEE_GAS)
        .times(gasPrice !== null ? gasPrice : 1)
        .times(orders.length);
};

export const get0xExchangeProxyAddress = (networkId: NetworkId) =>
    SUPPORTED_NETWORKS_0X[networkId] === '' ? '' : getContractAddressesForChainOrThrow(networkId).exchangeProxy;
