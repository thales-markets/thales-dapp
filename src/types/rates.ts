export type BaseRateUpdate = {
    timestamp: number;
    rate: number;
};

type RateUpdate = BaseRateUpdate & {
    block: number;
    synth: string;
    date: string;
    hash: string;
};

export type RateUpdates = RateUpdate[];
