import { SynthetixJs, ContractSettings, SynthsMap } from 'synthetix-js';

import { ethers } from 'ethers';
import { getEthereumNetwork, SUPPORTED_WALLETS_MAP, NetworkId } from './network';
import { synthSummaryUtilContract } from './contracts/synthSummaryUtilContract';
import binaryOptionsMarketDataContract from './contracts/binaryOptionsMarketDataContract';
import keyBy from 'lodash/keyBy';

type SnxJSConnector = {
    initialized: boolean;
    snxJS: SynthetixJs;
    synths: SynthetixJs['contractSettings']['synths'];
    synthsMap: SynthsMap;
    provider: SynthetixJs['contractSettings']['provider'];
    signer: SynthetixJs['contractSettings']['signer'];
    signers: typeof SynthetixJs.signers;
    utils: SynthetixJs['utils'];
    ethers: typeof ethers;
    ethersUtils: SynthetixJs['ethers']['utils'];
    synthSummaryUtilContract: ethers.Contract;
    binaryOptionsMarketDataContract: ethers.Contract;
    setContractSettings: (contractSettings: ContractSettings) => void;
    binaryOptionsUtils: SynthetixJs['binaryOptionsUtils'];
    contractSettings: ContractSettings;
};

// @ts-ignore
const snxJSConnector: SnxJSConnector = {
    initialized: false,
    signers: SynthetixJs.signers,

    setContractSettings: function (contractSettings: ContractSettings) {
        this.initialized = true;
        this.snxJS = new SynthetixJs(contractSettings);
        this.synths = this.snxJS.contractSettings.synths;
        this.synthsMap = keyBy(this.synths, 'name');
        this.signer = this.snxJS.contractSettings.signer;
        this.provider = this.snxJS.contractSettings.provider;
        this.utils = this.snxJS.utils;
        this.ethersUtils = this.snxJS.ethers.utils;
        this.binaryOptionsUtils = this.snxJS.binaryOptionsUtils;
        this.ethers = ethers;
        this.contractSettings = contractSettings;
        this.synthSummaryUtilContract = new ethers.Contract(
            synthSummaryUtilContract.addresses[contractSettings.networkId],
            synthSummaryUtilContract.abi,
            this.provider
        );
        this.binaryOptionsMarketDataContract = new ethers.Contract(
            binaryOptionsMarketDataContract.addresses[contractSettings.networkId],
            binaryOptionsMarketDataContract.abi,
            this.provider
        );
    },
};

const connectToMetamask = async (networkId: NetworkId, networkName: string) => {
    const walletState = {
        walletType: SUPPORTED_WALLETS_MAP.METAMASK,
        unlocked: false,
    };
    try {
        const accounts = await snxJSConnector.signer.getNextAddresses();
        if (accounts && accounts.length > 0) {
            return {
                ...walletState,
                currentWallet: accounts[0],
                unlocked: true,
                networkId,
                networkName: networkName.toLowerCase(),
            };
        } else {
            return {
                ...walletState,
                unlockError: 'Please connect to Metamask',
            };
        }
        // We updateWalletReducer with all the infos
    } catch (e) {
        console.log(e);
        return {
            ...walletState,
            unlockError: e.message,
        };
    }
};

const getSignerConfig = () => {
    return {};
};

export const setSigner = ({ type, networkId }: { type: string; networkId: NetworkId }) => {
    // @ts-ignore
    const signer = new snxJSConnector.signers[type](getSignerConfig());

    snxJSConnector.setContractSettings({
        networkId,
        signer,
    });
};

export const connectToWallet = async ({ wallet }: { wallet: string }) => {
    const ethereumNetwork = await getEthereumNetwork();
    if (!ethereumNetwork) {
        return {
            walletType: '',
            unlocked: false,
            unlockError: 'Network not supported',
        };
    }

    const { name, networkId } = ethereumNetwork;

    setSigner({ type: wallet, networkId });

    switch (wallet) {
        case SUPPORTED_WALLETS_MAP.METAMASK:
            return connectToMetamask(networkId, name);
        default:
            return {};
    }
};

export default snxJSConnector;
