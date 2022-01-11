import { getSynthName } from '../currency';
import { formatCurrencyWithSign } from './number';
import { USD_SIGN } from '../../constants/currency';
import { formatShortDate } from './date';
import { HistoricalOptionsMarketInfo } from '../../types/options';

export const getMarketTitleWithDate = (optionsMarket: HistoricalOptionsMarketInfo) => {
    return `${getSynthName(optionsMarket.currencyKey)} > ${formatCurrencyWithSign(
        USD_SIGN,
        optionsMarket.strikePrice
    )} @ ${formatShortDate(optionsMarket.maturityDate)}`;
};
