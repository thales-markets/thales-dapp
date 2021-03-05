import orderBy from 'lodash/orderBy';
import { SynthDefinitionMap } from 'redux/modules/synths';
import { PHASE } from '../constants/options';
import { OptionsMarkets, Phase } from '../pages/Options/types';

export const sortOptionsMarkets = (markets: OptionsMarkets, synthsMap: SynthDefinitionMap) =>
    orderBy(
        markets.map((optionsMarket) => {
            const { phase, timeRemaining } = getPhaseAndEndDate(
                optionsMarket.biddingEndDate,
                optionsMarket.maturityDate,
                optionsMarket.expiryDate
            );

            return {
                ...optionsMarket,
                phase,
                asset: synthsMap[optionsMarket.currencyKey]?.asset || optionsMarket.currencyKey,
                timeRemaining,
                phaseNum: PHASE[phase],
            };
        }),
        ['phaseNum', 'timeRemaining']
    );

export const getPhaseAndEndDate = (
    biddingEndDate: number,
    maturityDate: number,
    expiryDate: number
): { phase: Phase; timeRemaining: number } => {
    const now = Date.now();

    if (biddingEndDate > now) {
        return {
            phase: 'bidding',
            timeRemaining: biddingEndDate,
        };
    }

    if (maturityDate > now) {
        return {
            phase: 'trading',
            timeRemaining: maturityDate,
        };
    }

    if (expiryDate > now) {
        return {
            phase: 'maturity',
            timeRemaining: expiryDate,
        };
    }

    return {
        phase: 'expiry',
        timeRemaining: expiryDate,
    };
};
