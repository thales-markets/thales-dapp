import { NetworkId } from '@synthetixio/js';
import { ethers, Signer } from 'ethers';

export type Token = {
    address: string;
    asset?: string;
    decimals: number;
    feed?: string;
    index?: Array<{
        asset: string;
        category: string;
        description: string;
        sign: string;
        units: number;
        weight: number;
    }>;
    inverted?: {
        entryPoint: number;
        lowerLimit: number;
        upperLimit: number;
    };
    name: string;
    symbol: string;
};

export type Feed = {
    asset: string;
    category: string;
    description?: string;
    exchange?: string;
    feed?: string;
    sign: string;
};

export type Synth = {
    name: string;
    asset: string;
    category: string;
    sign: string;
    description: string;
    aggregator?: string;
    subclass?: string;
    inverted?: {
        entryPoint: number;
        lowerLimit: number;
        upperLimit: number;
    };
};

export type Synths = Synth[];

export type SynthsMap = Record<string, Synth>;

export type TokensMap = Record<string, Token>;

export type ContractSettings = {
    networkId: NetworkId;
    provider?: ethers.providers.Provider;
    signer?: Signer;
};
