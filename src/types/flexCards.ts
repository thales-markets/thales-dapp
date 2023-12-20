import { Positions } from 'enums/options';

export type SharePositionType =
    | 'potential'
    | 'resolved'
    | 'resolved-speed'
    | 'potential-speed'
    | 'chained-speed-won'
    | 'chained-speed-lost';

export type SharePositionData = {
    type: SharePositionType;
    positions: Positions[];
    currencyKey: string;
    strikePrices?: (number | string)[];
    finalPrices?: (number | string)[];
    leftPrice?: number;
    rightPrice?: number;
    strikeDate: number;
    buyIn: number;
    payout: number;
    payoutMultiplier?: number;
};
