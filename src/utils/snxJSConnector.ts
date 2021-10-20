import { ethers, Signer } from 'ethers';
import binaryOptionsMarketDataContract from './contracts/binaryOptionsMarketDataContract';
import binaryOptionsMarketManagerContract from './contracts/binaryOptionsMarketManagerContract';
import vestingEscrow from './contracts/vestingEscrow';
import airdrop from './contracts/airdrop';
import ongoingAirdrop from './contracts/ongoingAirdrop';
import stakingThales from './contracts/stakingThales';
import thalesContract from './contracts/thalesContract';
import escrowThales from './contracts/escrowThales';
import keyBy from 'lodash/keyBy';
import { synthetix, Synth, SynthetixJS, Config } from '@synthetixio/contracts-interface';
import { SynthsMap } from 'types/synthetix';
import { CRYPTO_CURRENCY_MAP } from 'constants/currency';

type SnxJSConnector = {
    initialized: boolean;
    snxJS: SynthetixJS | null;
    synths: Synth[];
    synthsMap: SynthsMap;
    provider: ethers.providers.Provider | undefined;
    signer: Signer | undefined;
    binaryOptionsMarketDataContract: ethers.Contract;
    binaryOptionsMarketManagerContract: ethers.Contract;
    retroAirdropContract?: ethers.Contract;
    vestingEscrowContract?: ethers.Contract;
    ongoingAirdropContract?: ethers.Contract;
    stakingThalesContract?: ethers.Contract;
    thalesTokenContract?: ethers.Contract;
    escrowThalesContract?: ethers.Contract;
    setContractSettings: (contractSettings: Config) => void;
};

// @ts-ignore
const snxJSConnector: SnxJSConnector = {
    initialized: false,

    setContractSettings: function (contractSettings: Config) {
        this.initialized = true;
        this.snxJS = synthetix(contractSettings);
        this.synths = this.snxJS.synths;
        this.synthsMap = keyBy(this.synths, 'name');
        this.signer = contractSettings.signer;
        this.provider = contractSettings.provider;
        this.binaryOptionsMarketDataContract = initializeContract(binaryOptionsMarketDataContract, contractSettings);
        this.binaryOptionsMarketManagerContract = initializeContract(
            binaryOptionsMarketManagerContract,
            contractSettings
        );
        this.retroAirdropContract = conditionalInitializeContract(airdrop, contractSettings);
        this.vestingEscrowContract = conditionalInitializeContract(vestingEscrow, contractSettings);
        this.ongoingAirdropContract = conditionalInitializeContract(ongoingAirdrop, contractSettings);
        this.stakingThalesContract = conditionalInitializeContract(stakingThales, contractSettings);
        this.thalesTokenContract = conditionalInitializeContract(thalesContract, contractSettings);
        this.escrowThalesContract = conditionalInitializeContract(escrowThales, contractSettings);
    },
};

const initializeContract = (contract: any, contractSettings: Config) =>
    new ethers.Contract(contract.addresses[contractSettings.networkId || 1], contract.abi, snxJSConnector.provider);

const conditionalInitializeContract = (contract: any, contractSettings: Config) =>
    contract.addresses[contractSettings.networkId || 1] !== 'TBD'
        ? new ethers.Contract(
              contract.addresses[contractSettings.networkId || 1],
              contract.abi,
              snxJSConnector.provider
          )
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
