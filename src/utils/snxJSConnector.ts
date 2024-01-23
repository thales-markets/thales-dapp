import { Provider } from '@wagmi/core';
import { ethers, Signer } from 'ethers';
import { Coins } from 'thales-utils';
import ammVaultDataContract from 'utils/contracts/ammVaultDataContract';
import liquidityPoolContract from 'utils/contracts/liquidityPoolContract';
import liquidityPoolDataContract from 'utils/contracts/liquidityPoolDataContract';
import parlayLiquidityPoolContract from 'utils/contracts/parlayLiquidityPoolContract';
import sportLiquidityPoolContract from 'utils/contracts/sportLiquidityPoolContract';
import stakingDataContract from 'utils/contracts/stakingDataContract';
import ammContract from './contracts/ammContract';
import binaryOptionsMarketDataContract from './contracts/binaryOptionsMarketDataContract';
import binaryOptionsMarketManagerContract from './contracts/binaryOptionsMarketManagerContract';
import bridgeContract from './contracts/bridgeContract';
import celerBridgeContract from './contracts/celerBridgeContract';
import chainedSpeedMarketsAMMContract from './contracts/chainedSpeedMarketsAMMContract';
import collateralContract from './contracts/collateralContract';
import escrowThales from './contracts/escrowThales';
import { gelatoContract } from './contracts/gelatoContract';
import lpStakingRewardsContract from './contracts/lpStakingRewardsContract';
import multipleCollateral from './contracts/multipleCollateralContract';
import opThalesContract from './contracts/opThalesContract';
import priceFeedContract from './contracts/priceFeedContract';
import rangedMarketAMMContract from './contracts/rangedMarketsAMM';
import speedMarketsAMMContract from './contracts/speedMarketsAMMContract';
import speedMarketsDataContract from './contracts/speedMarketsAMMDataContract';
import stakingThales from './contracts/stakingThales';
import taleOfThalesNFT from './contracts/taleOfThalesNFT';
import stakingBonusRewardsManager from './contracts/thalesAMMStakingThalesBonusRewardsManager';
import thalesContract from './contracts/thalesContract';
import unclaimedInvestorsRetroAirdropContract from './contracts/unclaimedInvestorsRetroAirdrop';
import vestingEscrow from './contracts/vestingEscrow';

type SnxJSConnector = {
    initialized: boolean;
    provider: Provider | undefined;
    signer: Signer | undefined;
    collateral?: ethers.Contract;
    multipleCollateral?: Record<Coins, ethers.Contract | undefined>;
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
    parlayLiquidityPoolContract?: ethers.Contract;
    liquidityPoolContract?: ethers.Contract;
    liquidityPoolDataContract?: ethers.Contract;
    taleOfThalesNFTContract?: ethers.Contract;
    ammVaultDataContract?: ethers.Contract;
    stakingDataContract?: ethers.Contract;
    speedMarketsAMMContract?: ethers.Contract;
    chainedSpeedMarketsAMMContract?: ethers.Contract;
    speedMarketsDataContract?: ethers.Contract;
    stakingBonusRewardsManager?: ethers.Contract;
    celerBridgeContract?: ethers.Contract;
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
        this.collateral = conditionalInitializeContract(collateralContract, contractSettings);

        this.multipleCollateral = {
            sUSD: conditionalInitializeContract(multipleCollateral.sUSD, contractSettings),
            DAI: conditionalInitializeContract(multipleCollateral.DAI, contractSettings),
            USDC: conditionalInitializeContract(multipleCollateral.USDC, contractSettings),
            USDCe: conditionalInitializeContract(multipleCollateral.USDCe, contractSettings),
            USDbC: conditionalInitializeContract(multipleCollateral.USDbC, contractSettings),
            USDT: conditionalInitializeContract(multipleCollateral.USDT, contractSettings),
            OP: conditionalInitializeContract(multipleCollateral.OP, contractSettings),
            WETH: conditionalInitializeContract(multipleCollateral.WETH, contractSettings),
            ETH: conditionalInitializeContract(multipleCollateral.ETH, contractSettings),
            ARB: conditionalInitializeContract(multipleCollateral.ARB, contractSettings),
            BUSD: conditionalInitializeContract(multipleCollateral.BUSD, contractSettings),
        };

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
        this.parlayLiquidityPoolContract = conditionalInitializeContract(parlayLiquidityPoolContract, contractSettings);
        this.liquidityPoolContract = conditionalInitializeContract(liquidityPoolContract, contractSettings);
        this.liquidityPoolDataContract = conditionalInitializeContract(liquidityPoolDataContract, contractSettings);
        this.taleOfThalesNFTContract = conditionalInitializeContract(taleOfThalesNFT, contractSettings);
        this.ammVaultDataContract = conditionalInitializeContract(ammVaultDataContract, contractSettings);
        this.stakingDataContract = conditionalInitializeContract(stakingDataContract, contractSettings);
        this.speedMarketsAMMContract = conditionalInitializeContract(speedMarketsAMMContract, contractSettings);
        this.chainedSpeedMarketsAMMContract = conditionalInitializeContract(
            chainedSpeedMarketsAMMContract,
            contractSettings
        );
        this.speedMarketsDataContract = conditionalInitializeContract(speedMarketsDataContract, contractSettings);
        this.stakingBonusRewardsManager = conditionalInitializeContract(stakingBonusRewardsManager, contractSettings);
        this.celerBridgeContract = conditionalInitializeContract(celerBridgeContract, contractSettings);
    },
};

const conditionalInitializeContract = (contract: any, contractSettings: any) => {
    const networkId = contractSettings.networkId || 1;
    const abi = contract.abis && contract.abis[networkId] ? contract.abis[networkId] : contract.abi;
    return contract.addresses[networkId] !== 'TBD'
        ? new ethers.Contract(contract.addresses[networkId], abi, snxJSConnector.provider)
        : undefined;
};

export default snxJSConnector;
