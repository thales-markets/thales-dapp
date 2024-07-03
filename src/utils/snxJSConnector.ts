import { Provider } from '@wagmi/core';
import { ethers, Signer } from 'ethers';
import { Coins } from 'thales-utils';
import ammVaultDataContract from 'utils/contracts/ammVaultDataContract';
import liquidityPoolContract from 'utils/contracts/liquidityPoolContract';
import liquidityPoolDataContract from 'utils/contracts/liquidityPoolDataContract';
import ammContract from './contracts/ammContract';
import binaryOptionsMarketDataContract from './contracts/binaryOptionsMarketDataContract';
import binaryOptionsMarketManagerContract from './contracts/binaryOptionsMarketManagerContract';
import collateralContract from './contracts/collateralContract';
import multipleCollateral from './contracts/multipleCollateralContract';
import priceFeedContract from './contracts/priceFeedContract';
import rangedMarketAMMContract from './contracts/rangedMarketsAMM';
import taleOfThalesNFT from './contracts/taleOfThalesNFT';
import stakingDataContract from 'utils/contracts/stakingDataContract';
import stakingThales from './contracts/stakingThales';

type SnxJSConnector = {
    initialized: boolean;
    provider: Provider | undefined;
    signer: Signer | undefined;
    collateral?: ethers.Contract;
    multipleCollateral?: Record<Coins, ethers.Contract | undefined>;
    binaryOptionsMarketDataContract?: ethers.Contract;
    binaryOptionsMarketManagerContract?: ethers.Contract;
    priceFeedContract?: ethers.Contract;
    ammContract?: ethers.Contract;
    rangedMarketAMMContract?: ethers.Contract;
    liquidityPoolContract?: ethers.Contract;
    liquidityPoolDataContract?: ethers.Contract;
    taleOfThalesNFTContract?: ethers.Contract;
    ammVaultDataContract?: ethers.Contract;
    stakingDataContract?: ethers.Contract;
    stakingThalesContract?: ethers.Contract;
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

        this.priceFeedContract = conditionalInitializeContract(priceFeedContract, contractSettings);
        this.ammContract = conditionalInitializeContract(ammContract, contractSettings);
        this.rangedMarketAMMContract = conditionalInitializeContract(rangedMarketAMMContract, contractSettings);
        this.liquidityPoolContract = conditionalInitializeContract(liquidityPoolContract, contractSettings);
        this.liquidityPoolDataContract = conditionalInitializeContract(liquidityPoolDataContract, contractSettings);
        this.taleOfThalesNFTContract = conditionalInitializeContract(taleOfThalesNFT, contractSettings);
        this.ammVaultDataContract = conditionalInitializeContract(ammVaultDataContract, contractSettings);
        this.stakingDataContract = conditionalInitializeContract(stakingDataContract, contractSettings);
        this.stakingThalesContract = conditionalInitializeContract(stakingThales, contractSettings);
    },
};

const conditionalInitializeContract = (contract: any, contractSettings: any) => {
    const networkId = contractSettings.networkId || 1;
    return contract.addresses[networkId] !== 'TBD'
        ? new ethers.Contract(contract.addresses[networkId], contract.abi, snxJSConnector.provider)
        : undefined;
};

export default snxJSConnector;
