import { formatCurrency } from 'utils/formatters/number';
import { formatShortDate } from 'utils/formatters/date';
import { buildOptionsMarketLink, buildRangeMarketLink } from 'utils/routes';
import { TFunction } from 'i18next';
import { ThemeInterface } from 'types/ui';
import { POSITIONS_TO_SIDE_MAP, Positions, RANGE_SIDE } from 'constants/options';

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
    if (market.leftPrice) {
        return '$' + formatCurrency(market.leftPrice) + ' - ' + '$' + formatCurrency(market.rightPrice);
    }
    return '$' + formatCurrency(market.strikePrice);
};

const generateRows = (data: any[], translator: TFunction, theme: ThemeInterface) => {
    try {
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
            const isRanged =
                d.optionSide === RANGE_SIDE[POSITIONS_TO_SIDE_MAP[Positions.IN]] ||
                d.optionSide == RANGE_SIDE[POSITIONS_TO_SIDE_MAP[Positions.OUT]]
                    ? true
                    : false;
            const marketExpired = d.marketItem?.result;
            const optionPrice = d.orderSide != 'sell' ? d.takerAmount / d.makerAmount : d.makerAmount / d.takerAmount;
            const paidAmount = d.orderSide == 'sell' ? d.makerAmount : d.takerAmount;

            return {
                dotColor: marketExpired ? '' : theme.background.quaternary,
                asset: {
                    currencyKey: d.marketItem.currencyKey,
                    assetNameFontSize: '12px',
                    currencyKeyFontSize: '12px',
                    iconType:
                        d.optionSide === RANGE_SIDE[POSITIONS_TO_SIDE_MAP[Positions.IN]]
                            ? 1
                            : d.optionSide === RANGE_SIDE[POSITIONS_TO_SIDE_MAP[Positions.OUT]]
                            ? 2
                            : 0,
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
