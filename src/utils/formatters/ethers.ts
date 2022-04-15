import { BigNumberish } from 'ethers';
import { ethers } from 'ethers';
import { POLYGON_ID } from '../../constants/network';

export const bytesFormatter = (input: string) => ethers.utils.formatBytes32String(input);

export const parseBytes32String = (input: string) => ethers.utils.parseBytes32String(input);

export const bigNumberFormatter = (value: BigNumberish) => Number(ethers.utils.formatEther(value));

export const stableCoinFormatter = (value: BigNumberish, networkId: number) =>
    Number(ethers.utils.formatUnits(value, networkId === POLYGON_ID ? 6 : 18));

export const stableCoinParser = (value: string, networkId: number) =>
    ethers.utils.parseUnits(value, networkId === POLYGON_ID ? 6 : 18);

export const getAddress = (addr: string) => ethers.utils.getAddress(addr);
