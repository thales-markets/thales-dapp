import { ethers, Signer } from 'ethers';
import { synthSummaryUtilContract } from './contracts/synthSummaryUtilContract';
import binaryOptionsMarketDataContract from './contracts/binaryOptionsMarketDataContract';
import binaryOptionsMarketManagerContract from './contracts/binaryOptionsMarketManagerContract';
import vestingEscrow from './contracts/vestingEscrow';
import airdrop from './contracts/airdrop';
import ongoingAirdrop from './contracts/ongoingAirdrop';
import stakingThales from './contracts/stakingThales';
import thalesContract from './contracts/thalesContract';
import escrowThales from './contracts/escrowThales';
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
    ongoingAirdropContract?: ethers.Contract;
    stakingThalesContract?: ethers.Contract;
    thalesTokenContract?: ethers.Contract;
    escrowThalesContract?: ethers.Contract;
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
        this.synthSummaryUtilContract = initializeContract(synthSummaryUtilContract, contractSettings);
        this.binaryOptionsMarketDataContract = initializeContract(binaryOptionsMarketDataContract, contractSettings);
        this.binaryOptionsMarketManagerContract = initializeContract(
            binaryOptionsMarketManagerContract,
            contractSettings
        );
        this.retroAirdropContract = initializeContract(airdrop, contractSettings);
        this.vestingEscrowContract = initializeContract(vestingEscrow, contractSettings);
        this.ongoingAirdropContract = conditionalInitializeContract(ongoingAirdrop, contractSettings);
        this.stakingThalesContract = conditionalInitializeContract(stakingThales, contractSettings);
        this.thalesTokenContract = conditionalInitializeContract(thalesContract, contractSettings);
        this.escrowThalesContract = conditionalInitializeContract(escrowThales, contractSettings);
    },
};

const initializeContract = (contract: any, contractSettings: ContractSettings) =>
    new ethers.Contract(contract.addresses[contractSettings.networkId], contract.abi, snxJSConnector.provider);

const conditionalInitializeContract = (contract: any, contractSettings: ContractSettings) =>
    contract.addresses[contractSettings.networkId] !== 'TBD'
        ? new ethers.Contract(contract.addresses[contractSettings.networkId], contract.abi, snxJSConnector.provider)
        : undefined;

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
