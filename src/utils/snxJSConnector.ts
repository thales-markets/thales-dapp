import { SynthetixJs, ContractSettings, SynthsMap } from 'synthetix-js';
import { ethers } from 'ethers';
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
    synthSummaryUtilContract: ethers.Contract;
    binaryOptionsMarketDataContract: ethers.Contract;
    setContractSettings: (contractSettings: ContractSettings) => void;
    binaryOptionsUtils: SynthetixJs['binaryOptionsUtils'];
    contractSettings: ContractSettings;
};

// @ts-ignore
const snxJSConnector: SnxJSConnector = {
    initialized: false,

    setContractSettings: function (contractSettings: ContractSettings) {
        this.initialized = true;
        this.snxJS = new SynthetixJs(contractSettings);
        this.synths = this.snxJS.contractSettings.synths;
        this.synthsMap = keyBy(this.synths, 'name');
        this.signer = this.snxJS.contractSettings.signer;
        this.provider = this.snxJS.contractSettings.provider;
        this.binaryOptionsUtils = this.snxJS.binaryOptionsUtils;
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

export default snxJSConnector;
