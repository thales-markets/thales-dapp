import { STABLE_DECIMALS } from 'constants/options';
import { BigNumberish } from 'ethers';
import { ethers } from 'ethers';
import { StableCoins } from 'types/options';
import { Network } from 'utils/network';

export const bytesFormatter = (input: string) => ethers.utils.formatBytes32String(input);

export const parseBytes32String = (input: string) => ethers.utils.parseBytes32String(input);

export const bigNumberFormatter = (value: BigNumberish, decimals?: number) =>
    Number(ethers.utils.formatUnits(value, decimals ? decimals : 18));

export const stableCoinFormatter = (value: BigNumberish, networkId: number, currency?: string) => {
    if (networkId == Network['POLYGON-MAINNET'] || networkId == Network.Arbitrum) {
        return Number(ethers.utils.formatUnits(value, 6));
    }

    if (networkId == Network.BSC) {
        return Number(ethers.utils.formatUnits(value, 18));
    }

    if (currency && STABLE_DECIMALS[currency as StableCoins]) {
        return Number(ethers.utils.formatUnits(value, STABLE_DECIMALS[currency as StableCoins]));
    }

    return Number(ethers.utils.formatUnits(value, 18));
};

export const stableCoinParser = (value: string, networkId: number, currency?: string) => {
    if (networkId == Network['POLYGON-MAINNET'] || networkId == Network.Arbitrum) {
        return ethers.utils.parseUnits(value, 6);
    }
    if (networkId == Network.BSC) {
        return ethers.utils.parseUnits(value, 18);
    }
    if (currency && STABLE_DECIMALS[currency as StableCoins]) {
        return ethers.utils.parseUnits(value, STABLE_DECIMALS[currency as StableCoins]);
    }

    return ethers.utils.parseUnits(value, 18);
};

export const getAddress = (addr: string) => ethers.utils.getAddress(addr);
