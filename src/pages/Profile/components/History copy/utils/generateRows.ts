import { TFunction } from 'i18next';
import { ThemeInterface } from 'types/ui';
import { formatShortDate } from 'utils/formatters/date';
import { formatCurrency, formatCurrencyWithSign, getPercentageDifference } from 'utils/formatters/number';
import { getAmount, getIconOrText } from '../../MaturedPositions/MaturedPositions';
import { USD_SIGN } from 'constants/currency';
import { UserPosition } from 'queries/user/useAllPositions';
import { buildOptionsMarketLink, buildRangeMarketLink } from 'utils/routes';

// const getOptionSideLabel = (optionSide: string) => {
//     switch (optionSide.toLowerCase()) {
//         case 'short':
//             return 'down';
//         case 'long':
//             return 'up';
//         case 'in':
//             return 'in';
//         case 'out':
//             return 'out';
//     }
//     return optionSide.toLowerCase() === 'short' ? 'down' : 'up';
// };

// const generateStrike = (market: any) => {
//     if (market.leftPrice) {
//         return '$' + formatCurrency(market.leftPrice) + ' - ' + '$' + formatCurrency(market.rightPrice);
//     }
//     return '$' + formatCurrency(market.strikePrice);
// };

const generateStrike = (market: any) => {
    if (market.leftPrice) {
        return '$' + formatCurrency(market.leftPrice) + ' - ' + '$' + formatCurrency(market.rightPrice);
    }
    return '$' + formatCurrency(market.strikePrice);
};

const generateRows = (data: UserPosition[], translator: TFunction, theme: ThemeInterface) => {
    console.log(data);
    try {
        const dateMap: Record<string, any> = {};
        const sortedData = data.sort((a, b) => b.maturityDate - a.maturityDate);
        sortedData.forEach((trade) => {
            const tradeDateKey = `Maturity date: ${formatShortDate(trade.maturityDate).toUpperCase()}`;
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

        return rows.map((d: UserPosition) => {
            if (typeof d === 'string') {
                return d;
            }
            // const isRanged =
            //     d.optionSide === RANGE_SIDE[POSITIONS_TO_SIDE_MAP[Positions.IN]] ||
            //     d.optionSide == RANGE_SIDE[POSITIONS_TO_SIDE_MAP[Positions.OUT]]
            //         ? true
            //         : false;
            // const marketExpired = d.marketItem?.result;
            // const optionPrice = d.orderSide != 'sell' ? d.takerAmount / d.makerAmount : d.makerAmount / d.takerAmount;
            // const paidAmount = d.orderSide == 'sell' ? d.makerAmount : d.takerAmount;

            const cells: any = [
                {
                    title: translator('options.home.markets-table.final-asset-price-col'),
                    value: formatCurrencyWithSign(USD_SIGN, d.finalPrice),
                },
                {
                    title: d.isRanged
                        ? translator('options.market.ranged-markets.strike-range')
                        : translator(`options.home.markets-table.strike-price-col`),
                    value: generateStrike(d),
                },
            ];

            // if (!d.range) {
            //     cells.push({
            //         title: translator('options.home.market-card.price-difference'),
            //         value: `${getPercentageDifference(d.market.finalPrice, d.market.strikePrice).toFixed(2)}%`,
            //     });
            // }

            cells.push({
                title: translator('options.leaderboard.trades.table.amount-col'),
                value: getAmount(d.amount.toFixed(2), d.side, theme),
            });

            cells.push({
                title: translator('options.home.markets-table.status-col'),
                value: getIconOrText(d.claimable, d.claimed, translator, theme),
            });

            return {
                dotColor: theme.background.tertiary,
                backgroundColor: theme.background.secondary,
                asset: {
                    currencyKey: d.currencyKey,
                },
                cells: cells,
                link: d.isRanged ? buildRangeMarketLink(d.market) : buildOptionsMarketLink(d.market),
            };
        });
    } catch (e) {
        console.log(e);
    }
};

export default generateRows;
