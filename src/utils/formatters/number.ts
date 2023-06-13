import { USD_SIGN } from 'constants/currency';
import { Positions } from 'enums/options';
import numbro from 'numbro';

type NumericValue = string | number;

const DEFAULT_CURRENCY_DECIMALS = 2;
const SHORT_CRYPTO_CURRENCY_DECIMALS = 4;
const LONG_CRYPTO_CURRENCY_DECIMALS = 8;

// TODO: figure out a robust way to get the correct precision.
const getPrecision = (amount: NumericValue) => {
    if (Number(amount) >= 1) {
        return DEFAULT_CURRENCY_DECIMALS;
    }
    if (Number(amount) > 0.01) {
        return SHORT_CRYPTO_CURRENCY_DECIMALS;
    }
    return LONG_CRYPTO_CURRENCY_DECIMALS;
};

// TODO - refactor format methods to use only one with options as parameters
export const formatCurrency = (value: NumericValue, decimals = DEFAULT_CURRENCY_DECIMALS, trimDecimals = false) => {
    if (!value || !Number(value)) {
        return 0;
    }

    return numbro(value).format({
        thousandSeparated: true,
        // trimMantissa: decimals > DEFAULT_FIAT_DECIMALS ? true : false,
        trimMantissa: trimDecimals,
        mantissa: decimals,
    });
};

export const formatCurrencyWithPrecision = (value: NumericValue, trimDecimals = false) =>
    formatCurrency(value, getPrecision(value), trimDecimals);

export const formatPercentage = (value: NumericValue, decimals = DEFAULT_CURRENCY_DECIMALS) => {
    let percentageValue = value;
    if (!value || !Number(value)) {
        percentageValue = 0;
    }

    return numbro(percentageValue).format({
        output: 'percent',
        mantissa: decimals,
    });
};

export const formatPercentageWithSign = (value: NumericValue, decimals = DEFAULT_CURRENCY_DECIMALS) =>
    `${Number(value) > 0 ? '+' : ''}${formatPercentage(value, decimals)}`;

// TODO: use a library for this, because the sign does not always appear on the left. (perhaps something like number.toLocaleString)
export const formatCurrencyWithSign = (
    sign: string | null | undefined,
    value: NumericValue,
    decimals?: number,
    trimDecimals?: boolean
) => {
    return `${Number(value) < 0 ? '- ' : ''}${sign ? sign + ' ' : ''}${formatCurrency(
        typeof value == 'number' ? Math.abs(value) : value,
        decimals !== undefined ? decimals : getPrecision(value),
        trimDecimals
    )}`;
};

export const formatCurrencyWithKey = (
    currencyKey: string,
    value: NumericValue,
    decimals?: number,
    trimDecimals?: boolean
) => `${formatCurrency(value, decimals || getPrecision(value), trimDecimals)} ${currencyKey}`;

export const truncToDecimals = (value: NumericValue, decimals = DEFAULT_CURRENCY_DECIMALS): string => {
    const matchedValue = value.toString().match(`^-?\\\d+(?:\\\.\\\d{0,${decimals}})?`);
    return matchedValue !== null ? matchedValue[0] : '0';
};

// TODO: test it more as truncToDecimals has bug for 0.0000001
export const truncDecimals = (value: number, decimals = DEFAULT_CURRENCY_DECIMALS): string => {
    const matchedValue = value
        .toFixed(decimals + 1) // when number has more than 6 decimals with preceding zeros (e.g. 0.0000001), toString() returns string in exponential notation (e.g. 1e-7)
        .replace(/(?<=[1-9])0+/, '') // remove trailing zeros added by toFixed (excluding 0.00)
        .match(`^-?\\\d+(?:\\\.\\\d{0,${decimals}})?`);
    return matchedValue !== null ? matchedValue[0] : '0';
};

export const formatNumberShort = (value: number, trim = true) => {
    // Nine Zeroes for Billions
    return value >= 1.0e9
        ? formatCurrency(value / 1.0e9, 2, trim) + 'b'
        : // Six Zeroes for Millions
        value >= 1.0e6
        ? formatCurrency(value / 1.0e6, 2, trim) + 'm'
        : // Three Zeroes for Thousands
        value >= 1.0e3
        ? formatCurrency(value / 1.0e3, 2, trim) + 'k'
        : formatCurrency(value, 2, trim);
};

export const formatStrikePrice = (leftPrice: number, position: Positions, rightPrice?: number) => {
    let strikePrice;
    if (position === Positions.UP || position === Positions.DOWN) {
        strikePrice = `${USD_SIGN} ${formatNumberShort(leftPrice, false)}`;
    } else if (position === Positions.IN) {
        strikePrice = `${USD_SIGN} ${formatNumberShort(leftPrice, false)} <-> ${USD_SIGN} ${formatNumberShort(
            rightPrice as number,
            false
        )}`;
    } else {
        strikePrice = `<- ${USD_SIGN} ${formatNumberShort(leftPrice, false)}  ${USD_SIGN} ${formatNumberShort(
            rightPrice as number,
            false
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

export const roundNumberToDecimals = (value: number, decimals = DEFAULT_CURRENCY_DECIMALS) => {
    return +(Math.round(Number(value + 'e+' + decimals)) + 'e-' + decimals);
};

export const countDecimals = (value: number): number => {
    if (Math.floor(value) === value) return 0;

    const str = value.toString();
    if (str.indexOf('.') !== -1 && str.indexOf('-') !== -1) {
        return Number(str.split('-')[1]) || 0;
    } else if (str.indexOf('.') !== -1) {
        return str.split('.')[1].length || 0;
    }
    return Number(str.split('-')[1]) || 0;
};
