import { STABLE_DECIMALS } from 'constants/currency';
import { BigNumberish, ethers } from 'ethers';
import { StableCoins } from 'types/options';
import { getDefaultDecimalsForNetwork } from 'utils/network';

export const bytesFormatter = (input: string) => ethers.utils.formatBytes32String(input);

export const parseBytes32String = (input: string) => ethers.utils.parseBytes32String(input);

export const bigNumberFormatter = (value: BigNumberish, decimals?: number) =>
    Number(ethers.utils.formatUnits(value, decimals !== undefined ? decimals : 18));

export const stableCoinFormatter = (value: BigNumberish, networkId: number, currency?: StableCoins) => {
    const decimals = currency ? STABLE_DECIMALS[currency] : getDefaultDecimalsForNetwork(networkId);

    return Number(ethers.utils.formatUnits(value, decimals));
};

export const stableCoinParser = (value: string, networkId: number, currency?: StableCoins) => {
    const decimals = currency ? STABLE_DECIMALS[currency] : getDefaultDecimalsForNetwork(networkId);

    return ethers.utils.parseUnits(value, decimals);
};

export const getAddress = (addr: string) => ethers.utils.getAddress(addr);
