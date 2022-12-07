import BigNumber from 'bignumber.js';
// import { DEFAULT_FIAT_DECIMALS } from 'constants/defaults';
import { CurrencyKey } from 'constants/currency';
import numbro from 'numbro';

type NumericValue = string | number;

const DEFAULT_CURRENCY_DECIMALS = 2;
export const SHORT_CRYPTO_CURRENCY_DECIMALS = 4;
export const LONG_CRYPTO_CURRENCY_DECIMALS = 8;

export const getDecimalPlaces = (value: NumericValue) => (value.toString().split('.')[1] || '').length;

export const toBigNumber = (value: BigNumber | string | number) => new BigNumber(value);

// TODO: figure out a robust way to get the correct precision.
const getPrecision = (amount: NumericValue) => {
    if (amount >= 1) {
        return DEFAULT_CURRENCY_DECIMALS;
    }
    if (amount > 0.01) {
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
    `${value > 0 ? '+' : ''}${formatPercentage(value, decimals)}`;

// TODO: use a library for this, because the sign does not always appear on the left. (perhaps something like number.toLocaleString)
export const formatCurrencyWithSign = (
    sign: string | null | undefined,
    value: NumericValue,
    decimals?: number,
    trimDecimals?: boolean
) =>
    `${value < 0 ? '- ' : ''}${sign ? sign + ' ' : ''}${formatCurrency(
        typeof value == 'number' ? Math.abs(value) : value,
        decimals !== undefined ? decimals : getPrecision(value),
        trimDecimals
    )}`;

export const formatCurrencyWithSignInRange = (
    sign: string | null | undefined,
    leftValue: NumericValue,
    rightValue: NumericValue,
    decimals?: number
) => formatCurrencyWithSign(sign, leftValue, decimals) + ' - ' + formatCurrencyWithSign(sign, rightValue, decimals);

export const formatCurrencyWithKey = (
    currencyKey: CurrencyKey,
    value: NumericValue,
    decimals?: number,
    trimDecimals?: boolean
) => `${formatCurrency(value, decimals || getPrecision(value), trimDecimals)} ${currencyKey}`;

export const getPercentageDifference = (firstNumber: number, secondNumber: number): number =>
    Math.abs(((firstNumber - secondNumber) / firstNumber) * 100);

export const truncToDecimals = (value: NumericValue, decimals = DEFAULT_CURRENCY_DECIMALS): string => {
    const matchedValue = value.toString().match(`^-?\\\d+(?:\\\.\\\d{0,${decimals}})?`);
    return matchedValue !== null ? matchedValue[0] : '0';
};

export const truncDecimals = (value: number, decimals = DEFAULT_CURRENCY_DECIMALS): string => {
    const matchedValue = value
        .toFixed(decimals) // when number has more than 6 decimals with preceding zeros (e.g. 0.0000001), toString() returns string in exponential notation (e.g. 1e-7)
        .replace(/(?<=[1-9])0+/, '') // remove trailing zeros added by toFixed (excluding 0.00)
        .match(`^-?\\\d+(?:\\\.\\\d{0,${decimals}})?`);
    return matchedValue !== null ? matchedValue[0] : '0';
};

export const formatNumberShort = (value: number) => {
    // Nine Zeroes for Billions
    return value >= 1.0e9
        ? formatCurrency(value / 1.0e9, 2, true) + 'b'
        : // Six Zeroes for Millions
        value >= 1.0e6
        ? formatCurrency(value / 1.0e6, 2, true) + 'm'
        : // Three Zeroes for Thousands
        value >= 1.0e3
        ? formatCurrency(value / 1.0e3, 2, true) + 'k'
        : formatCurrency(value, 2, true);
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
    return Math.abs(first - second) / ((first + second) / 2);
};
