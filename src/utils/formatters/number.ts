import { USD_SIGN } from 'constants/currency';
import { Positions } from 'enums/options';
import { formatCurrency, formatCurrencyWithPrecision } from 'thales-utils';

export const formatNumberShort = (value: number, trim = true, negativeFactors = false) => {
    // Nine Zeroes for Billions
    return value >= 1.0e9
        ? formatCurrency(value / 1.0e9, 2, trim) + 'b'
        : // Six Zeroes for Millions
        value >= 1.0e6
        ? formatCurrency(value / 1.0e6, 2, trim) + 'm'
        : // Three Zeroes for Thousands
        value >= 1.0e3
        ? formatCurrency(value / 1.0e3, 2, trim) + 'k'
        : negativeFactors && value <= 1.0e-6
        ? formatCurrency(value * 1.0e6, 2, trim) + 'e-6'
        : formatCurrencyWithPrecision(value, trim);
};

export const formatStrikePrice = (leftPrice: number, position: Positions, rightPrice?: number) => {
    let strikePrice;
    if (position === Positions.UP || position === Positions.DOWN) {
        strikePrice = `${USD_SIGN} ${formatNumberShort(leftPrice, false)}`;
    } else if (position === Positions.IN) {
        strikePrice = `${USD_SIGN} ${formatNumberShort(leftPrice, false, true)} <-> ${USD_SIGN} ${formatNumberShort(
            rightPrice as number,
            false,
            true
        )}`;
    } else {
        strikePrice = `<- ${USD_SIGN} ${formatNumberShort(leftPrice, false)}  ${USD_SIGN} ${formatNumberShort(
            rightPrice as number,
            false,
            true
        )} ->`;
    }
    return strikePrice;
};

export const formatPricePercentageGrowth = (priceChange: number) => {
    return priceChange > 0 ? `+ ${Math.abs(priceChange).toFixed(2)}%` : `- ${Math.abs(priceChange).toFixed(2)}%`;
};

export const calculatePercentageChange = (lastPrice: number, firstPrice: number) => {
    return ((lastPrice - firstPrice) / lastPrice) * 100;
};

export const formatPricePercentageDifference = (targetPrice: number, currentPrice: number) => {
    return ((currentPrice - targetPrice) / currentPrice) * 100;
};

export const calculateAndFormatPercentage = (first: number, second: number) => {
    const greater = first > second ? first : second;
    const smaller = first > second ? second : first;
    return (greater - smaller) / smaller;
};
