import { Network } from 'enums/network';
import { NetworkId, SUPPORTED_NETWORKS, getIsArbitrum, getIsBSC, isMainNet } from './network';

const getEtherScanBaseURL = (networkId: NetworkId) => {
    const network = SUPPORTED_NETWORKS[networkId];
    const isBSC = getIsBSC(networkId);

    if (isMainNet(networkId) || network == null) {
        return 'https://etherscan.io';
    } else if (isBSC) {
        return 'https://bscscan.com';
    } else if (getIsArbitrum(networkId)) {
        return 'https://arbiscan.io';
    } else if (networkId === Network['POLYGON-MAINNET']) {
        return 'https://polygonscan.com';
    }

    return `https://${network.toLowerCase()}.etherscan.io`;
};

export const getEtherscanTxLink = (networkId: NetworkId, txId: string) => {
    const baseURL = getEtherScanBaseURL(networkId);

    return `${baseURL}/tx/${txId}`;
};

export const getEtherscanAddressLink = (networkId: NetworkId, address: string) => {
    const baseURL = getEtherScanBaseURL(networkId);

    return `${baseURL}/address/${address}`;
};

export const getEtherscanBlockLink = (networkId: NetworkId, block: string) => {
    const baseURL = getEtherScanBaseURL(networkId);

    return `${baseURL}/block/${block}`;
};

export const getEtherscanTokenLink = (networkId: NetworkId, address: string) => {
    const baseURL = getEtherScanBaseURL(networkId);

    return `${baseURL}/token/${address}`;
};
