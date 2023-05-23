import { getContractFactory, predeploys } from '@eth-optimism/contracts';
import detectEthereumProvider from '@metamask/detect-provider';
import { CRYPTO_CURRENCY_MAP, SYNTHS_MAP } from 'constants/currency';
import { DEFAULT_GAS_BUFFER } from 'constants/defaults';
import { GWEI_UNIT, POLYGON_GWEI_INCREASE_PERCENTAGE, POLYGON_ID, POLYGON_MUMBAI_ID } from 'constants/network';
import { BigNumber, ethers, UnsignedTransaction } from 'ethers';
import { serializeTransaction } from 'ethers/lib/utils';

export type NetworkId = 1 | 3 | 42 | 10 | 69 | 420 | 80001 | 137 | 56 | 42161;

export enum Network {
    Mainnet = 1,
    Ropsten = 3,
    Rinkeby = 4,
    Goerli = 5,
    Kovan = 42,
    'Mainnet-Ovm' = 10,
    'Kovan-Ovm' = 69,
    'Goerli-Ovm' = 420,
    'POLYGON-MUMBAI' = 80001,
    'POLYGON-MAINNET' = 137,
    BSC = 56,
    Arbitrum = 42161,
}

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

export const INFURA_SUPPORTED_NETWORKS: Record<NetworkId, string> = {
    1: 'MAINNET',
    3: 'ROPSTEN',
    42: 'KOVAN',
    10: 'OPTIMISM-MAINNET',
    69: 'OPTIMISM-KOVAN',
    420: 'OPTIMISM-GOERLI',
    80001: 'POLYGON-MUMBAI',
    137: 'POLYGON-MAINNET',
    56: '',
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

export const getTransactionPrice = (
    gasPrice: number | null,
    gasLimit: number | null,
    ethPrice: number | null,
    l1Fee?: number | null
) => {
    if (!gasPrice || !gasLimit || !ethPrice) return 0;
    const transsactionPrice = (gasPrice * ethPrice * gasLimit) / GWEI_UNIT;
    const l1TranactionPrice = l1Fee && l1Fee !== null ? (l1Fee * ethPrice) / GWEI_UNIT / GWEI_UNIT : 0;
    return transsactionPrice + l1TranactionPrice;
};

export const isMainNet = (networkId: NetworkId) => networkId === 1;

export const normalizeGasLimit = (gasLimit: number) => gasLimit + DEFAULT_GAS_BUFFER;

export const normalizeL2GasLimit = (gasLimit: number) => Math.trunc(gasLimit * 1.2);

export const gasPriceInWei = (gasPrice: number) => gasPrice * GWEI_UNIT;

export const getInfuraRpcURL = (networkId: NetworkId) => {
    const network = INFURA_SUPPORTED_NETWORKS[networkId];
    if (!network) return '';
    return `https://${network?.toLowerCase()}.infura.io/v3/${process.env.REACT_APP_INFURA_PROJECT_ID}`;
};

export const getPublicRpc = (networkId: NetworkId) => {
    if (networkId == Network.BSC) return 'https://bsc-dataseed.binance.org/';
    return 'https://mainnet.optimism.io';
};

export const isNetworkSupported = (networkId: NetworkId): boolean => {
    return !!SUPPORTED_NETWORKS[networkId];
};

export const getIsMainnet = (networkId: number): boolean => [1].includes(networkId);

export const getIsMultiCollateralSupported = (networkId: NetworkId): boolean => [10].includes(networkId);

export const getIsBSC = (networkId: number): boolean => [56].includes(networkId);

export const getIsOVM = (networkId: number): boolean => [10, 69, 420].includes(networkId);

export const getIsPolygon = (networkId: number): boolean => [137, 80001].includes(networkId);

export const getIsArbitrum = (networkId: number): boolean => [42161].includes(networkId);

export const formatGwei = (wei: number) => wei / GWEI_UNIT;

export const formatGasLimit = (gasEstimate: ethers.BigNumber | number, networkId: number): number =>
    getIsOVM(networkId) ? Number(gasEstimate) : normalizeGasLimit(Number(gasEstimate));

export const formatL2GasLimit = (gasEstimate: ethers.BigNumber | number): number =>
    normalizeL2GasLimit(Number(gasEstimate));

export const getL1FeeInWei = async (txRequest: any, snxJSConnector: any) => {
    try {
        const OVM_GasPriceOracle = getContractFactory('OVM_GasPriceOracle', (snxJSConnector as any).signer).attach(
            predeploys.OVM_GasPriceOracle
        );
        const unsignedTx = (await (snxJSConnector as any).signer.populateTransaction(txRequest)) as UnsignedTransaction;
        if (unsignedTx) {
            const serializedTx = serializeTransaction({
                nonce: unsignedTx.nonce ? parseInt(unsignedTx.nonce.toString(10), 10) : 0,
                value: unsignedTx.value,
                gasPrice: unsignedTx.gasPrice,
                gasLimit: unsignedTx.gasLimit,
                to: unsignedTx.to,
                data: unsignedTx.data,
            });
            const l1FeeInWei = await OVM_GasPriceOracle.getL1Fee(serializedTx);
            return l1FeeInWei.toNumber();
        }
        return 1;
    } catch (e) {
        console.log('e ', e);
    }
};

export const checkAllowance = async (amount: BigNumber, token: any, walletAddress: string, spender: string) => {
    try {
        const approved = await token.allowance(walletAddress, spender);
        return approved.gte(amount);
    } catch (err: any) {
        console.log(err);
        return false;
    }
};

export const getProvider = (gasEstimate: BigNumber, gasInGwei: string, networkId: NetworkId) => {
    if (networkId == POLYGON_ID || networkId == POLYGON_MUMBAI_ID) {
        return {
            gasLimit: formatGasLimit(gasEstimate, networkId),
            gasPrice: ethers.utils.parseUnits(
                Math.floor(+gasInGwei + +gasInGwei * POLYGON_GWEI_INCREASE_PERCENTAGE).toString(),
                'gwei'
            ),
        };
    }

    if (networkId == Network.BSC) {
        return {
            gasLimit: formatGasLimit(gasEstimate, networkId),
        };
    }

    return {
        gasLimit: formatGasLimit(gasEstimate, networkId),
    };
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

export const getFeeCollateral = (networkId: NetworkId) => {
    if (getIsPolygon(networkId)) return CRYPTO_CURRENCY_MAP.MATIC;
    if (getIsBSC(networkId)) return CRYPTO_CURRENCY_MAP.BNB;
    return CRYPTO_CURRENCY_MAP.ETH;
};

export const getDefaultDecimalsForNetwork = (networkId: NetworkId) => {
    if (networkId == Network.Arbitrum || networkId == Network['POLYGON-MAINNET']) return 6;
    return 18;
};
