import { ethers, Signer } from 'ethers';
import { synthSummaryUtilContract } from './contracts/synthSummaryUtilContract';
import binaryOptionsMarketDataContract from './contracts/binaryOptionsMarketDataContract';
import binaryOptionsMarketManagerContract from './contracts/binaryOptionsMarketManagerContract';
import vestingEscrow from './contracts/vestingEscrow';
import airdrop from './contracts/airdrop';
import keyBy from 'lodash/keyBy';
import initSynthetixJS, { Synth } from '@synthetixio/contracts-interface';
import { SynthsMap, ContractSettings } from 'types/synthetix';
import { CRYPTO_CURRENCY_MAP } from 'constants/currency';

type SnxJSConnector = {
    initialized: boolean;
    snxJS: ReturnType<typeof initSynthetixJS> | null;
    synths: Synth[];
    synthsMap: SynthsMap;
    provider: ethers.providers.Provider | undefined;
    signer: Signer | undefined;
    synthSummaryUtilContract: ethers.Contract;
    binaryOptionsMarketDataContract: ethers.Contract;
    binaryOptionsMarketManagerContract: ethers.Contract;
    retroAirdropContract: ethers.Contract;
    vestingEscrowContract: ethers.Contract;
    setContractSettings: (contractSettings: ContractSettings) => void;
};

// @ts-ignore
const snxJSConnector: SnxJSConnector = {
    initialized: false,

    setContractSettings: function (contractSettings: ContractSettings) {
        this.initialized = true;
        this.snxJS = initSynthetixJS(contractSettings);
        this.synths = this.snxJS.synths;
        this.synthsMap = keyBy(this.synths, 'name');
        this.signer = contractSettings.signer;
        this.provider = contractSettings.provider;
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
        this.binaryOptionsMarketManagerContract = new ethers.Contract(
            binaryOptionsMarketManagerContract.addresses[contractSettings.networkId],
            binaryOptionsMarketManagerContract.abi,
            this.provider
        );
        this.retroAirdropContract = new ethers.Contract(
            airdrop.addresses[contractSettings.networkId],
            airdrop.abi,
            this.provider
        );
        this.vestingEscrowContract = new ethers.Contract(
            vestingEscrow.addresses[contractSettings.networkId],
            vestingEscrow.abi,
            this.provider
        );
    },
};

export const getSynthName = (currencyKey: string) => {
    switch (currencyKey) {
        case CRYPTO_CURRENCY_MAP.SNX:
            return 'Synthetix';
        case CRYPTO_CURRENCY_MAP.KNC:
            return 'Kyber Network';
        case CRYPTO_CURRENCY_MAP.REN:
            return 'REN';
        case CRYPTO_CURRENCY_MAP.LEND:
            return 'LEND';
        default:
            return snxJSConnector.synthsMap[currencyKey]?.description;
    }
};

export default snxJSConnector;
