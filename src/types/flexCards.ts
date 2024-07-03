import { Positions } from 'enums/options';

export type SharePositionType = 'potential' | 'resolved';

export type SharePositionData = {
    type: SharePositionType;
    position: Positions;
    currencyKey: string;
    strikePrice?: number | string;
    leftPrice?: number;
    rightPrice?: number;
    strikeDate: number;
    buyIn: number;
    payout: number;
};
