declare module 'synthetix-js' {
    import { JsonRpcSigner, Web3Provider } from 'ethers/providers';
    import { BigNumberish } from 'ethers/utils';
    import { ethers } from 'ethers';
    export interface ContractSettings {
        networkId: 1 | 3 | 4 | 42;
        signer?: JsonRpcSigner;
        provider?: Web3Provider;
    }

    export type Synth = {
        name: string;
        asset: string;
        category: string;
        sign: string;
        desc: string;
        aggregator?: string;
        subclass?: string;
        exchange?: string;
        index?: { symbol: string; name: string; units: number }[];
        inverted?: { entryPoint: number; upperLimit: number; lowerLimit: number };
    };

    export type Synths = Synth[];

    export type SynthsMap = Record<string, Synth>;
    export class SynthetixJs {
        constructor(contractSettings: ContractSettings);

        contractSettings: {
            synths: Synths;
            signer: JsonRpcSigner;
            provider: Web3Provider;
        };
        utils: typeof ethers.utils;
        ethers: { utils: typeof ethers.utils };
        binaryOptionsUtils: any;
        Exchanger: {
            feeRateForExchange: (quoteCurrencyKey: string, baseCurrencyKey: string) => Promise<BigNumberish>;
            maxSecsLeftInWaitingPeriod: (address: string, currencyKey: string) => Promise<BigNumberish>;
        };
        SystemStatus: {
            synthSuspension: (
                currencyKey: string
            ) => Promise<{
                suspended: boolean;
            }>;
        };
        Synthetix: {
            contract: any;
            exchange: (
                quoteCurrencyKey: string,
                amount: string,
                baseCurrencyKey: string,
                gasProps?: {
                    gasPrice: number;
                    gasLimit: number;
                }
            ) => Promise<ethers.ContractTransaction>;
        };
        sUSD: {
            contract: any;
            approve: any;
        };
    }
}
