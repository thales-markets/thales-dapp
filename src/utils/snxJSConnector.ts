import { ethers, Signer } from 'ethers';
import ammVaultDataContract from 'utils/contracts/ammVaultDataContract';
import liquidityPoolContract from 'utils/contracts/liquidityPoolContract';
import liquidityPoolDataContract from 'utils/contracts/liquidityPoolDataContract';
import sportLiquidityPoolContract from 'utils/contracts/sportLiquidityPoolContract';
import stakingDataContract from 'utils/contracts/stakingDataContract';
import ammContract from './contracts/ammContract';
import binaryOptionsMarketDataContract from './contracts/binaryOptionsMarketDataContract';
import binaryOptionsMarketManagerContract from './contracts/binaryOptionsMarketManagerContract';
import bridgeContract from './contracts/bridgeContract';
import usdcContract from './contracts/collateralContract';
import escrowThales from './contracts/escrowThales';
import { gelatoContract } from './contracts/gelatoContract';
import lpStakingRewardsContract from './contracts/lpStakingRewardsContract';
import multipleCollateral from './contracts/multipleCollateralContract';
import opThalesContract from './contracts/opThalesContract';
import priceFeedContract from './contracts/priceFeedContract';
import rangedMarketAMMContract from './contracts/rangedMarketsAMM';
import stakingThales from './contracts/stakingThales';
import taleOfThalesNFT from './contracts/taleOfThalesNFT';
import thalesContract from './contracts/thalesContract';
import unclaimedInvestorsRetroAirdropContract from './contracts/unclaimedInvestorsRetroAirdrop';
import vestingEscrow from './contracts/vestingEscrow';

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
    stakingThalesContract?: ethers.Contract;
    thalesTokenContract?: ethers.Contract;
    escrowThalesContract?: ethers.Contract;
    priceFeedContract?: ethers.Contract;
    ammContract?: ethers.Contract;
    rangedMarketAMMContract?: ethers.Contract;
    opThalesTokenContract?: ethers.Contract;
    lpStakingRewardsContract?: ethers.Contract;
    gelatoContract?: ethers.Contract;
    bridgeContract?: ethers.Contract;
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
