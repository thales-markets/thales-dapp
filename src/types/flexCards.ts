import { Positions } from 'enums/options';

export type SharePositionType =
    | 'potential'
    | 'resolved'
    | 'resolved-speed'
    | 'potential-speed'
    | 'resolved-chained-speed'
    | 'potential-chained-speed';

export type SharePositionData = {
    type: SharePositionType;
    positions: Positions[];
    currencyKey: string;
    strikePrice?: number | string;
    leftPrice?: number;
    rightPrice?: number;
    strikeDate: number;
    buyIn: number;
    payout: number;
};
