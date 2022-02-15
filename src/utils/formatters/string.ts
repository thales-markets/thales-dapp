import { CurrencyKey } from 'constants/currency';

export const truncateAddress = (address: string, first = 5, last = 5) =>
    address ? `${address.slice(0, first)}...${address.slice(-last, address.length)}` : null;

export const formatCurrencyPair = (baseCurrencyKey: CurrencyKey, quoteCurrencyKey: CurrencyKey) =>
    `${baseCurrencyKey}/${quoteCurrencyKey}`;

export const strPadLeft = (string: string | number, pad: string, length: number) => {
    return (new Array(length + 1).join(pad) + string).slice(-length);
};

export const truncateText = (text: string, maxLength: number) =>
    text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
