import { ethers, Signer } from 'ethers';
import binaryOptionsMarketDataContract from './contracts/binaryOptionsMarketDataContract';
import binaryOptionsMarketManagerContract from './contracts/binaryOptionsMarketManagerContract';
import vestingEscrow from './contracts/vestingEscrow';
import stakingThales from './contracts/stakingThales';
import thalesContract from './contracts/thalesContract';
import escrowThales from './contracts/escrowThales';
import priceFeedContract from './contracts/priceFeedContract';
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
import unclaimedInvestorsRetroAirdropContract from './contracts/unclaimedInvestorsRetroAirdrop';
import multipleCollateral from './contracts/multipleCollateralContract';
import sportLiquidityPoolContract from 'utils/contracts/sportLiquidityPoolContract';
import liquidityPoolContract from 'utils/contracts/liquidityPoolContract';
import liquidityPoolDataContract from 'utils/contracts/liquidityPoolDataContract';
import taleOfThalesNFT from './contracts/taleOfThalesNFT';
import ammVaultDataContract from 'utils/contracts/ammVaultDataContract';
import stakingDataContract from 'utils/contracts/stakingDataContract';

type SnxJSConnector = {
    initialized: boolean;
    provider: ethers.providers.Provider | undefined;
    signer: Signer | undefined;
    collateral?: ethers.Contract;
    multipleCollateral?: Array<ethers.Contract | undefined>;
    binaryOptionsMarketDataContract?: ethers.Contract;
    binaryOptionsMarketManagerContract?: ethers.Contract;
    retroAirdropContract?: ethers.Contract;
    vestingEscrowContract?: ethers.Contract;
    ongoingAirdropContract?: ethers.Contract;
    stakingThalesContract?: ethers.Contract;
    thalesTokenContract?: ethers.Contract;
    escrowThalesContract?: ethers.Contract;
    priceFeedContract?: ethers.Contract;
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
    sportLiquidityPoolContract?: ethers.Contract;
    liquidityPoolContract?: ethers.Contract;
    liquidityPoolDataContract?: ethers.Contract;
    taleOfThalesNFTContract?: ethers.Contract;
    ammVaultDataContract?: ethers.Contract;
    stakingDataContract?: ethers.Contract;
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

        this.multipleCollateral = [
            conditionalInitializeContract(multipleCollateral['sUSD'], contractSettings),
            conditionalInitializeContract(multipleCollateral['DAI'], contractSettings),
            conditionalInitializeContract(multipleCollateral['USDC'], contractSettings),
            conditionalInitializeContract(multipleCollateral['USDT'], contractSettings),
        ];

        this.vestingEscrowContract = conditionalInitializeContract(vestingEscrow, contractSettings);
        this.stakingThalesContract = conditionalInitializeContract(stakingThales, contractSettings);
        this.thalesTokenContract = conditionalInitializeContract(thalesContract, contractSettings);
        this.escrowThalesContract = conditionalInitializeContract(escrowThales, contractSettings);
        this.priceFeedContract = conditionalInitializeContract(priceFeedContract, contractSettings);
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
        this.unclaimedInvestorsRetroAirdropContract = conditionalInitializeContract(
            unclaimedInvestorsRetroAirdropContract,
            contractSettings
        );
        this.sportLiquidityPoolContract = conditionalInitializeContract(sportLiquidityPoolContract, contractSettings);
        this.liquidityPoolContract = conditionalInitializeContract(liquidityPoolContract, contractSettings);
        this.liquidityPoolDataContract = conditionalInitializeContract(liquidityPoolDataContract, contractSettings);
        this.taleOfThalesNFTContract = conditionalInitializeContract(taleOfThalesNFT, contractSettings);
        this.ammVaultDataContract = conditionalInitializeContract(ammVaultDataContract, contractSettings);
        this.stakingDataContract = conditionalInitializeContract(stakingDataContract, contractSettings);
    },
};

const conditionalInitializeContract = (contract: any, contractSettings: any) =>
    contract.addresses[contractSettings.networkId || 1] !== 'TBD'
        ? new ethers.Contract(
              contract.addresses[contractSettings.networkId || 1],
              contract.abi,
              snxJSConnector.provider
          )
        : undefined;

export default snxJSConnector;
