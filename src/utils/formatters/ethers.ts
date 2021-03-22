import snxJSConnector from '../snxJSConnector';
import { BigNumberish } from 'ethers/utils';

// TODO - this should be removed at some point, use directly from ehters lib

export const bytesFormatter = (input: string) => (snxJSConnector as any).ethersUtils.formatBytes32String(input);

export const parseBytes32String = (input: string) => (snxJSConnector as any).ethersUtils.parseBytes32String(input);

export const bigNumberFormatter = (value: BigNumberish) =>
    Number((snxJSConnector as any).ethersUtils.formatEther(value));

export const getAddress = (addr: string) => (snxJSConnector as any).ethersUtils.getAddress(addr);
