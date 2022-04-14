import { formatCurrency } from '../../../../../utils/formatters/number';
import { formatShortDate } from '../../../../../utils/formatters/date';
import { buildOptionsMarketLink } from '../../../../../utils/routes';
import { TFunction } from 'i18next';
import { getIsPolygon } from '../../../../../utils/network';

const WIN_COLOR = '#50CE99';
const LOSE_COLOR = '#C3244A';

const formatAMPM = (date: Date) => {
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12;
    const minutesString = minutes < 10 ? '0' + minutes : minutes;
    return hours + ':' + minutesString + ' ' + ampm;
};

const generateDateKey = (date: Date) => {
    const monthName = date.toLocaleString('default', { month: 'long' }); //TODO: add different languages
    const dayOfTheMonth = date.getDate();
    const year = date.getFullYear();
    return `${monthName} ${dayOfTheMonth}, ${year}`;
};

const getOptionSideLabel = (optionSide: string) => (optionSide.toLowerCase() === 'short' ? 'down' : 'up');

const generateRows = (data: any[], translator: TFunction, networkId: number) => {
    const isPolygon = getIsPolygon(networkId);
    const dateMap: Record<string, any> = {};

    data.forEach((trade) => {
        const tradeDateKey = generateDateKey(new Date(trade.timestamp));
        if (!dateMap[tradeDateKey]) {
            dateMap[tradeDateKey] = [];
        }
        dateMap[tradeDateKey].push(trade);
    });

    const rows = Object.keys(dateMap).reduce((prev: any[], curr: string) => {
        prev.push(curr);
        prev.push(...dateMap[curr]);
        return prev;
    }, []);

    return rows.map((d) => {
        if (typeof d === 'string') {
            return d;
        }
        const marketExpired = d.marketItem.result;
        const isLong = d.optionSide === 'long';
        const optionPrice = d.orderSide != 'sell' ? d.takerAmount / d.makerAmount : d.makerAmount / d.takerAmount;
        const paidAmount = d.orderSide == 'sell' ? d.makerAmount : d.takerAmount;

        return {
            dotColor: marketExpired ? (isLong ? WIN_COLOR : LOSE_COLOR) : '',
            asset: {
                currencyKey: d.marketItem.currencyKey,
                assetNameFontSize: '12px',
                currencyKeyFontSize: '12px',
            },
            cells: [
                { title: d.orderSide, value: formatAMPM(new Date(d.timestamp)) },
                {
                    title: translator('options.trading-profile.history.strike'),
                    value: '$' + formatCurrency(d.marketItem.strikePrice),
                },
                {
                    title: translator('options.trading-profile.history.price'),
                    value: '$' + formatCurrency(isPolygon ? optionPrice * 1e12 : optionPrice),
                },
                {
                    title: translator('options.trading-profile.history.amount'),
                    value: `${formatCurrency(
                        d.orderSide == 'sell' ? d.takerAmount : d.makerAmount
                    )} ${getOptionSideLabel(d.optionSide)}`,
                },
                {
                    title: translator('options.trading-profile.history.paid'),
                    value: '$' + formatCurrency(isPolygon ? paidAmount * 1e12 : paidAmount),
                },
                {
                    title: marketExpired
                        ? translator('options.trading-profile.history.expired')
                        : translator('options.trading-profile.history.expires'),
                    value: formatShortDate(new Date(d.marketItem.maturityDate)),
                },
            ],
            link: buildOptionsMarketLink(d.marketItem.address),
        };
    });
};

export default generateRows;
