import { formatCurrency } from '../../../../../utils/formatters/number';
import { formatShortDate } from '../../../../../utils/formatters/date';
import { buildOptionsMarketLink } from '../../../../../utils/routes';

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

const generateRows = (data: any[]) => {
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
        const userWon = d.marketItem.result === d.optionSide;

        return {
            color: marketExpired ? (userWon ? WIN_COLOR : LOSE_COLOR) : '',
            asset: {
                currencyKey: d.marketItem.currencyKey,
                assetNameFontSize: '12px',
                currencyKeyFontSize: '12px',
            },
            cells: [
                { title: d.orderSide, value: formatAMPM(new Date(d.timestamp)) },
                { title: 'strike', value: '$' + formatCurrency(d.marketItem.strikePrice) },
                {
                    title: 'price',
                    value:
                        '$' +
                        formatCurrency(
                            d.orderSide != 'sell' ? d.takerAmount / d.makerAmount : d.makerAmount / d.takerAmount
                        ),
                },
                {
                    title: 'amount',
                    value: `${formatCurrency(d.orderSide == 'sell' ? d.takerAmount : d.makerAmount)} ${d.optionSide}`,
                },
                {
                    title: 'paid',
                    value: '$' + formatCurrency(d.orderSide == 'sell' ? d.makerAmount : d.takerAmount),
                },
                {
                    title: marketExpired ? (userWon ? 'profit' : 'loss') : 'expires @',
                    value: !marketExpired
                        ? formatShortDate(new Date(d.marketItem.maturityDate))
                        : '$' + formatCurrency(userWon ? Math.abs(d.takerAmount - d.makerAmount) : d.takerAmount),
                },
            ],
            link: buildOptionsMarketLink(d.marketItem.address),
        };
    });
};

export default generateRows;
