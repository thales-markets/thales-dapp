import orderBy from 'lodash/orderBy';
import { PHASE } from '../constants/options';
import { OptionsMarkets, Phase } from '../types/options';
import { getSynthAsset } from './currency';
import { formatCurrency } from './formatters/number';

export const sortOptionsMarkets = (markets: OptionsMarkets) =>
    orderBy(
        markets.map((optionsMarket) => {
            const { phase, timeRemaining } = getPhaseAndEndDate(optionsMarket.maturityDate, optionsMarket.expiryDate);

            return {
                ...optionsMarket,
                phase,
                asset: getSynthAsset(optionsMarket.currencyKey),
                timeRemaining,
                phaseNum: PHASE[phase],
            };
        }),
        ['phaseNum', 'discountedSide', 'ammLiquidity'],
        ['asc', 'asc', 'desc']
    );

export const getPhaseAndEndDate = (
    maturityDate: number,
    expiryDate: number
): { phase: Phase; timeRemaining: number } => {
    const now = Date.now();

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

export const convertPriceImpactToBonus = (priceImpact: number): number => -((priceImpact / (1 + priceImpact)) * 100);

export const getFormattedBonus = (bonus: number | undefined) => `+${formatCurrency(Number(bonus))}%`;
