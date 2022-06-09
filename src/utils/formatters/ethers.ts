import { STABLE_DECIMALS } from 'constants/options';
import { BigNumberish } from 'ethers';
import { ethers } from 'ethers';
import { StableCoins } from 'types/options';
import { POLYGON_ID } from '../../constants/network';

export const bytesFormatter = (input: string) => ethers.utils.formatBytes32String(input);

export const parseBytes32String = (input: string) => ethers.utils.parseBytes32String(input);

export const bigNumberFormatter = (value: BigNumberish) => Number(ethers.utils.formatEther(value));

export const stableCoinFormatter = (value: BigNumberish, networkId: number, currency?: string) => {
    if (networkId == POLYGON_ID) {
        return Number(ethers.utils.formatUnits(value, 6));
    }

    if (currency && STABLE_DECIMALS[currency as StableCoins]) {
        return Number(ethers.utils.formatUnits(value, STABLE_DECIMALS[currency as StableCoins]));
    }

    return Number(ethers.utils.formatUnits(value, 18));
};

export const stableCoinParser = (value: string, networkId: number) =>
    ethers.utils.parseUnits(value, networkId === POLYGON_ID ? 6 : 18);

export const getAddress = (addr: string) => ethers.utils.getAddress(addr);
