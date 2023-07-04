import { Network } from 'enums/network';

interface RequestArguments {
    method: string;
    params?: unknown[] | Record<string, unknown>;
}

declare global {
    interface Window {
        web3?: {
            eth?: {
                net: {
                    getId: () => Network;
                };
            };
            version: {
                getNetwork(cb: (err: Error | undefined, networkId: string) => void): void;
                network: Network;
            };
        };
        ethereum?: {
            on: (event: string, cb: () => void) => void;
            networkVersion: Network;
            request: (args: RequestArguments) => Promise<unknown>;
            isMetaMask: boolean;
        };
        MSStream;
        opera;
    }
}
