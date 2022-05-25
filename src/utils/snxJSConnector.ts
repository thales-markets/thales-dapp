import { ethers, Signer } from 'ethers';
import binaryOptionsMarketDataContract from './contracts/binaryOptionsMarketDataContract';
import binaryOptionsMarketManagerContract from './contracts/binaryOptionsMarketManagerContract';
import vestingEscrow from './contracts/vestingEscrow';
import airdrop from './contracts/airdrop';
import ongoingAirdrop from './contracts/ongoingAirdrop';
import stakingThales from './contracts/stakingThales';
import thalesContract from './contracts/thalesContract';
import escrowThales from './contracts/escrowThales';
import priceFeedContract from './contracts/priceFeedContract';
import limitOrderProtocol1inchContract from './contracts/limitOrderProtocol1inchContract';
import ammContract from './contracts/ammContract';
import rangedMarketAMMContract from './contracts/rangedMarketsAMM';
import thalesRoyaleContract from './contracts/thalesRoyalContract';
import thalesExchangerContract from './contracts/thalesExchangerContract';
import opThalesContract from './contracts/opThalesContract';
import lpStakingRewardsContract from './contracts/lpStakingRewardsContract';
import { gelatoContract } from './contracts/gelatoContract';
import thalesRoyalePassContract from './contracts/thalesRoyalePassContract';
import thalesRoyalePassportContract from './contracts/thalesRoyalePassportContract';
import bridgeContract from './contracts/bridgeContract';
import usdcContract from './contracts/collateralContract';
import unclaimedRetroAirdropContract from './contracts/unclaimedRetroAirdrop';
import unclaimedInvestorsRetroAirdropContract from './contracts/unclaimedInvestorsRetroAirdrop';

type SnxJSConnector = {
    initialized: boolean;
    provider: ethers.providers.Provider | undefined;
    signer: Signer | undefined;
    collateral?: ethers.Contract;
    binaryOptionsMarketDataContract?: ethers.Contract;
    binaryOptionsMarketManagerContract?: ethers.Contract;
    retroAirdropContract?: ethers.Contract;
    vestingEscrowContract?: ethers.Contract;
    ongoingAirdropContract?: ethers.Contract;
    stakingThalesContract?: ethers.Contract;
    thalesTokenContract?: ethers.Contract;
    escrowThalesContract?: ethers.Contract;
    priceFeedContract?: ethers.Contract;
    limitOrderProtocol1inchContract?: ethers.Contract;
    ammContract?: ethers.Contract;
    rangedMarketAMMContract?: ethers.Contract;
    thalesRoyaleContract?: ethers.Contract;
    thalesRoyalePassContract?: ethers.Contract;
    thalesRoyalePassportContract?: ethers.Contract;
    thalesExchangerContract?: ethers.Contract;
    opThalesTokenContract?: ethers.Contract;
    lpStakingRewardsContract?: ethers.Contract;
    gelatoContract?: ethers.Contract;
    bridgeContract?: ethers.Contract;
    unclaimedRetroAirdropContract?: ethers.Contract;
    unclaimedInvestorsRetroAirdropContract?: ethers.Contract;
    setContractSettings: (contractSettings: any) => void;
};

// @ts-ignore
const snxJSConnector: SnxJSConnector = {
    initialized: false,

    setContractSettings: function (contractSettings: any) {
        this.initialized = true;
        this.signer = contractSettings.signer;
        this.provider = contractSettings.provider;
        this.binaryOptionsMarketDataContract = conditionalInitializeContract(
            binaryOptionsMarketDataContract,
            contractSettings
        );
        this.binaryOptionsMarketManagerContract = conditionalInitializeContract(
            binaryOptionsMarketManagerContract,
            contractSettings
        );
        this.collateral = conditionalInitializeContract(usdcContract, contractSettings);
        this.retroAirdropContract = conditionalInitializeContract(airdrop, contractSettings);
        this.vestingEscrowContract = conditionalInitializeContract(vestingEscrow, contractSettings);
        this.ongoingAirdropContract = conditionalInitializeContract(ongoingAirdrop, contractSettings);
        this.stakingThalesContract = conditionalInitializeContract(stakingThales, contractSettings);
        this.thalesTokenContract = conditionalInitializeContract(thalesContract, contractSettings);
        this.escrowThalesContract = conditionalInitializeContract(escrowThales, contractSettings);
        this.priceFeedContract = conditionalInitializeContract(priceFeedContract, contractSettings);
        this.limitOrderProtocol1inchContract = conditionalInitializeContract(
            limitOrderProtocol1inchContract,
            contractSettings
        );
        this.ammContract = conditionalInitializeContract(ammContract, contractSettings);
        this.rangedMarketAMMContract = conditionalInitializeContract(rangedMarketAMMContract, contractSettings);
        this.thalesRoyaleContract = conditionalInitializeContract(thalesRoyaleContract, contractSettings);
        this.thalesRoyalePassContract = conditionalInitializeContract(thalesRoyalePassContract, contractSettings);
        this.thalesRoyalePassportContract = conditionalInitializeContract(
            thalesRoyalePassportContract,
            contractSettings
        );
        this.thalesExchangerContract = conditionalInitializeContract(thalesExchangerContract, contractSettings);
        this.opThalesTokenContract = conditionalInitializeContract(opThalesContract, contractSettings);
        this.lpStakingRewardsContract = conditionalInitializeContract(lpStakingRewardsContract, contractSettings);
        this.gelatoContract = conditionalInitializeContract(gelatoContract, contractSettings);
        this.bridgeContract = conditionalInitializeContract(bridgeContract, contractSettings);
        this.unclaimedRetroAirdropContract = conditionalInitializeContract(
            unclaimedRetroAirdropContract,
            contractSettings
        );
        this.unclaimedInvestorsRetroAirdropContract = conditionalInitializeContract(
            unclaimedInvestorsRetroAirdropContract,
            contractSettings
        );
    },
};

// const initializeContract = (contract: any, contractSettings: any) =>
//     new ethers.Contract(contract.addresses[contractSettings.networkId || 1], contract.abi, snxJSConnector.provider);

const conditionalInitializeContract = (contract: any, contractSettings: any) =>
    contract.addresses[contractSettings.networkId || 1] !== 'TBD'
        ? new ethers.Contract(
              contract.addresses[contractSettings.networkId || 1],
              contract.abi,
              snxJSConnector.provider
          )
        : undefined;

export default snxJSConnector;
