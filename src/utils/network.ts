import { getContractFactory, predeploys } from '@eth-optimism/contracts';
import detectEthereumProvider from '@metamask/detect-provider';
import { DEFAULT_GAS_BUFFER } from 'constants/defaults';
import { GWEI_UNIT } from 'constants/network';
import { ethers } from 'ethers';
import { serializeTransaction, UnsignedTransaction } from 'ethers/lib/utils';
import snxJSConnector from './snxJSConnector';

export type NetworkId = 1 | 3 | 42 | 10 | 69;

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
};

export const SUPPORTED_NETWORKS_NAMES: Record<NetworkId, string> = {
    1: 'MAINNET',
    3: 'ROPSTEN',
    42: 'KOVAN',
    10: 'OPTIMISM MAINNET',
    69: 'OPTIMISM KOVAN',
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
    const network = SUPPORTED_NETWORKS[networkId];
    return `https://${network?.toLowerCase()}.infura.io/v3/${process.env.REACT_APP_INFURA_PROJECT_ID}`;
};

export const isNetworkSupported = (networkId: NetworkId): boolean => {
    switch (networkId) {
        case 1:
            return true;
        case 3:
            return true;
        case 42:
            return true;
        case 69:
            return true;
        case 10:
            return true;
        default:
            return false;
    }
};

export const getIsOVM = (networkId: number): boolean => !!~[10, 69].indexOf(networkId);

export const formatGwei = (wei: number) => wei / GWEI_UNIT;

export const formatGasLimit = (gasEstimate: ethers.BigNumber | number, networkId: number): number =>
    getIsOVM(networkId) ? Number(gasEstimate) : normalizeGasLimit(Number(gasEstimate));

export const formatL2GasLimit = (gasEstimate: ethers.BigNumber | number): number =>
    normalizeL2GasLimit(Number(gasEstimate));

export const getL1FeeInWei = async (txRequest: any) => {
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
    return null;
};
