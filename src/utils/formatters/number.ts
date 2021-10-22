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

export const formatPercentage = (value: NumericValue, decimals = DEFAULT_CURRENCY_DECIMALS) =>
    numbro(value).format({
        output: 'percent',
        mantissa: decimals,
    });

export const formatPercentageWithSign = (value: NumericValue, decimals = DEFAULT_CURRENCY_DECIMALS) =>
    `${value > 0 ? '+' : ''}${formatPercentage(value, decimals)}`;

// TODO: use a library for this, because the sign does not always appear on the left. (perhaps something like number.toLocaleString)
export const formatCurrencyWithSign = (sign: string | null | undefined, value: NumericValue, decimals?: number) =>
    `${sign}${formatCurrency(value, decimals || getPrecision(value))}`;

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
