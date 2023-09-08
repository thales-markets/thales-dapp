import { Positions } from 'enums/options';

export type SharePositionType = 'potential' | 'resolved' | 'resolved-speed' | 'potential-speed';

export type SharePositionData = {
    type: SharePositionType;
    position: Positions;
    currencyKey: string;
    strikePrice?: number | string;
    leftPrice?: number;
    rightPrice?: number;
    strikeDate: number;
    marketDuration?: number;
    buyIn: number;
    payout: number;
};
