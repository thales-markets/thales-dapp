import { Provider } from '@wagmi/core';
import { ethers, Signer } from 'ethers';
import { Coins } from 'thales-utils';
import ammVaultDataContract from 'utils/contracts/ammVaultDataContract';
import liquidityPoolContract from 'utils/contracts/liquidityPoolContract';
import liquidityPoolDataContract from 'utils/contracts/liquidityPoolDataContract';
import stakingDataContract from 'utils/contracts/stakingDataContract';
import ammContract from './contracts/ammContract';
import ammUSDCContract from './contracts/ammUSDCContract';
import binaryOptionsMarketDataContract from './contracts/binaryOptionsMarketDataContract';
import binaryOptionsMarketDataUSDCContract from './contracts/binaryOptionsMarketDataUSDCContract';
import binaryOptionsMarketManagerContract from './contracts/binaryOptionsMarketManagerContract';
import collateralContract from './contracts/collateralContract';
import multipleCollateral from './contracts/multipleCollateralContract';
import priceFeedContract from './contracts/priceFeedContract';
import rangedMarketAMMContract from './contracts/rangedMarketsAMM';
import rangedMarketsAMMUSDCContract from './contracts/rangedMarketsAMMUSDC';
import stakingThales from './contracts/stakingThales';
import taleOfThalesNFT from './contracts/taleOfThalesNFT';

type SnxJSConnector = {
    initialized: boolean;
    provider: Provider | undefined;
    signer: Signer | undefined;
    collateral?: ethers.Contract;
    multipleCollateral?: Partial<Record<Coins, ethers.Contract | undefined>>;
    binaryOptionsMarketDataContract?: ethers.Contract;
    binaryOptionsMarketDataUSDCContract?: ethers.Contract;
    binaryOptionsMarketManagerContract?: ethers.Contract;
    priceFeedContract?: ethers.Contract;
    ammContract?: ethers.Contract;
    ammUSDCContract?: ethers.Contract;
    rangedMarketAMMContract?: ethers.Contract;
    rangedMarketsAMMUSDCContract?: ethers.Contract;
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
        this.binaryOptionsMarketDataContract = conditionalInitializeContract(
            binaryOptionsMarketDataContract,
            contractSettings
        );
        this.binaryOptionsMarketDataUSDCContract = conditionalInitializeContract(
            binaryOptionsMarketDataUSDCContract,
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
        };

        this.priceFeedContract = conditionalInitializeContract(priceFeedContract, contractSettings);
        this.ammContract = conditionalInitializeContract(ammContract, contractSettings);
        this.ammUSDCContract = conditionalInitializeContract(ammUSDCContract, contractSettings);
        this.rangedMarketAMMContract = conditionalInitializeContract(rangedMarketAMMContract, contractSettings);
        this.rangedMarketsAMMUSDCContract = conditionalInitializeContract(
            rangedMarketsAMMUSDCContract,
            contractSettings
        );
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
