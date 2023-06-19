type Synth = {
    name: string;
    asset: string;
    description: string;
    category?: string;
    sign?: string;
    aggregator?: string;
    subclass?: string;
    inverted?: {
        entryPoint: number;
        lowerLimit: number;
        upperLimit: number;
    };
};

export type SynthsMap = Record<string, Synth>;
