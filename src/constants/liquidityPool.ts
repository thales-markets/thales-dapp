import { Coins, NetworkId } from 'thales-utils';
import { LiquidityPoolCollateral } from '../enums/liquidityPool';
import { LiquidityPool } from '../types/liquidityPool';
import { SupportedNetwork } from '../types/network';
import { CRYPTO_CURRENCY_MAP, SYNTHS_MAP } from './currency';

export const LiquidityPoolMap: Partial<
    Record<SupportedNetwork, Partial<Record<LiquidityPoolCollateral, LiquidityPool>> | undefined>
> = {
    [NetworkId.OptimismMainnet]: {
        [LiquidityPoolCollateral.USDC]: {
            name: 'USDC LP',
            address: '0x47Da40be6B617d0199ADF1Ec3550f3875b246124',
            collateral: CRYPTO_CURRENCY_MAP.USDC as Coins,
        },
        [LiquidityPoolCollateral.sUSD]: {
            name: 'sUSD LP',
            address: '0xC10a0A6fF6496E0BD896F9f6da5a7B640b85ea40',
            collateral: SYNTHS_MAP.sUSD as Coins,
        },
    },
    [NetworkId.Arbitrum]: {
        [LiquidityPoolCollateral.USDCe]: {
            name: 'USDC LP',
            address: '0xea4c2343Fd3C239c23Dd37dd3ee51AEc84544735',
            collateral: CRYPTO_CURRENCY_MAP.USDCe as Coins,
        },
    },
    [NetworkId.Base]: {
        [LiquidityPoolCollateral.USDbC]: {
            name: 'USDC LP',
            address: '0x5713ab44042D92C642444bd2F0fee9c2336F9E3b',
            collateral: CRYPTO_CURRENCY_MAP.USDbC as Coins,
        },
    },
};
