import { formatCurrency } from 'utils/formatters/number';
import { formatShortDate } from 'utils/formatters/date';
import { buildOptionsMarketLink, buildRangeMarketLink } from 'utils/routes';
import { TFunction } from 'i18next';

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

const getOptionSideLabel = (optionSide: string) => {
    switch (optionSide.toLowerCase()) {
        case 'short':
            return 'down';
        case 'long':
            return 'up';
        case 'in':
            return 'in';
        case 'out':
            return 'out';
    }
    return optionSide.toLowerCase() === 'short' ? 'down' : 'up';
};

const generateStrike = (market: any) => {
    console.log(market);
    if (market.leftPrice) {
        return '$' + formatCurrency(market.leftPrice) + ' - ' + '$' + formatCurrency(market.rightPrice);
    }
    return '$' + formatCurrency(market.strikePrice);
};

const generateRows = (data: any[], translator: TFunction) => {
    try {
        console.log(data);
        const dateMap: Record<string, any> = {};
        const sortedData = data.sort((a, b) => b.timestamp - a.timestamp);
        sortedData.forEach((trade) => {
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
            const isRanged = d.optionSide == 'in' || d.optionSide == 'out' ? true : false;
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
                    iconType: d.optionSide === 'in' ? 1 : d.optionSide === 'out' ? 2 : 0,
                },
                cells: [
                    { title: d.orderSide, value: formatAMPM(new Date(d.timestamp)) },
                    {
                        title: translator('options.trading-profile.history.strike'),
                        value: generateStrike(d.marketItem),
                    },
                    {
                        title: translator('options.trading-profile.history.price'),
                        value: '$' + formatCurrency(optionPrice),
                    },
                    {
                        title: translator('options.trading-profile.history.amount'),
                        value: `${formatCurrency(
                            d.orderSide == 'sell' ? d.takerAmount : d.makerAmount
                        )} ${getOptionSideLabel(d.optionSide)}`,
                    },
                    {
                        title: translator('options.trading-profile.history.paid'),
                        value: '$' + formatCurrency(paidAmount),
                    },
                    {
                        title: marketExpired
                            ? translator('options.trading-profile.history.expired')
                            : translator('options.trading-profile.history.expires'),
                        value: formatShortDate(new Date(d.marketItem.maturityDate)),
                    },
                ],
                link: isRanged
                    ? buildRangeMarketLink(d.marketItem.address)
                    : buildOptionsMarketLink(d.marketItem.address),
            };
        });
    } catch (e) {
        console.log(e);
    }
};

export default generateRows;
