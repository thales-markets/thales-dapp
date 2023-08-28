import { Network } from 'enums/network';
import { SUPPORTED_NETWORKS } from 'constants/network';

const getEtherScanBaseURL = (networkId: Network) => {
    const network = SUPPORTED_NETWORKS[networkId];

    if (networkId === Network.Mainnet || network == null) {
        return 'https://etherscan.io';
    } else if (networkId === Network.Arbitrum) {
        return 'https://arbiscan.io';
    } else if (networkId === Network.Base) {
        return 'https://basescan.org';
    } else if (networkId === Network.PolygonMainnet) {
        return 'https://polygonscan.com';
    }

    return `https://${network.toLowerCase()}.etherscan.io`;
};

export const getEtherscanTxLink = (networkId: Network, txId: string) => {
    const baseURL = getEtherScanBaseURL(networkId);

    return `${baseURL}/tx/${txId}`;
};

export const getEtherscanAddressLink = (networkId: Network, address: string) => {
    const baseURL = getEtherScanBaseURL(networkId);

    return `${baseURL}/address/${address}`;
};

export const getEtherscanBlockLink = (networkId: Network, block: string) => {
    const baseURL = getEtherScanBaseURL(networkId);

    return `${baseURL}/block/${block}`;
};

export const getEtherscanTokenLink = (networkId: Network, address: string) => {
    const baseURL = getEtherScanBaseURL(networkId);

    return `${baseURL}/token/${address}`;
};
