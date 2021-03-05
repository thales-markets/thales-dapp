import throttle from 'lodash/throttle';

export type NetworkId = 1 | 3 | 4 | 42;

export const GWEI_UNIT = 1000000000;

export const SUPPORTED_NETWORKS: Record<NetworkId, string> = {
    1: 'MAINNET',
    3: 'ROPSTEN',
    4: 'RINKEBY',
    42: 'KOVAN',
};

export type WalletType = 'METAMASK';

export const SUPPORTED_WALLETS_MAP: Record<WalletType, string> = {
    METAMASK: 'Metamask',
};
export const SUPPORTED_WALLETS = Object.values(SUPPORTED_WALLETS_MAP);

export const hasEthereumInjected = () => !!window.ethereum;

export const defaultNetwork: { name: string; networkId: NetworkId } = {
    name: 'MAINNET',
    networkId: 1,
};

export async function getEthereumNetwork() {
    if (!hasEthereumInjected()) {
        return defaultNetwork;
    }

    let networkId: NetworkId = 1;

    try {
        if (window.ethereum?.networkVersion) {
            networkId = Number(window.ethereum?.networkVersion) as NetworkId;

            return { name: SUPPORTED_NETWORKS[networkId], networkId };
        } else if (window.web3?.eth?.net) {
            networkId = window.web3.eth.net.getId();

            return { name: SUPPORTED_NETWORKS[networkId], networkId: Number(networkId) as NetworkId };
        } else if (window.web3?.version?.network) {
            networkId = Number(window.web3.version.network) as NetworkId;

            return { name: SUPPORTED_NETWORKS[networkId], networkId };
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

const getPriceLimit = (networkInfo: { fast: number; average: number; safeLow: number }, gasPriceLimit: number) => {
    const fast = networkInfo.fast / 10;
    const average = networkInfo.average / 10;
    const slow = networkInfo.safeLow / 10;

    const speed = {
        fast,
        average,
        slow,
    };

    if (gasPriceLimit) {
        return {
            ...speed,
            fastestAllowed: gasPriceLimit,
            averageAllowed: Math.min(average, gasPriceLimit),
            slowAllowed: Math.min(slow, gasPriceLimit),
        };
    }
    return {
        ...speed,
        fastestAllowed: fast,
        averageAllowed: average,
        slowAllowed: slow,
    };
};

export const getGasInfo = async () => {
    try {
        const results = await fetch('https://ethgasstation.info/json/ethgasAPI.json');
        const networkInfo = await results.json();
        return getPriceLimit(networkInfo, 0);
    } catch (e) {
        console.log('Error while getting gas info', e);
    }
};

export function onMetamaskAccountChange(cb: () => void) {
    if (!window.ethereum) return;
    const listener = throttle(cb, 1000);
    window.ethereum.on('accountsChanged', listener);
}

export function onMetamaskNetworkChange(cb: () => void) {
    if (!window.ethereum) return;
    const listener = throttle(cb, 1000);
    window.ethereum.on('networkChanged', listener);
}

export function hasMetamaskInstalled() {
    return window.ethereum?.isMetaMask || false;
}

export const isMainNet = (networkId: NetworkId) => networkId === 1;
