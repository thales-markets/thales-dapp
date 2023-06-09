import { USD_SIGN } from 'constants/currency';
import { orderBy } from 'lodash';
import { Rates } from 'queries/rates/useExchangeRatesQuery';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'styled-components';
import { ThemeInterface } from 'types/ui';
import { formatCurrency, formatCurrencyWithSign, formatPricePercentageDifference } from 'utils/formatters/number';
import { buildOptionsMarketLink, buildRangeMarketLink } from 'utils/routes';
import { getAmount, IconLink, TextLink } from '../styled-components';
import { UserPosition } from 'types/options';
import { useSelector } from 'react-redux';
import { RootState } from 'redux/rootReducer';
import { getIsMobile } from 'redux/modules/ui';
import TileTable from 'components/TileTable/TileTable';
import MaturityDate from 'pages/AMMTrading/components/MaturityDate/MaturityDate';
import MyPositionAction from '../MyPositionAction/MyPositionAction';
import SPAAnchor from 'components/SPAAnchor/SPAAnchor';

type OpenPositionsProps = {
    exchangeRates: Rates | null;
    livePositions: UserPosition[];
    searchText: string;
    isLoading: boolean;
};

const OpenPositions: React.FC<OpenPositionsProps> = ({ exchangeRates, livePositions, searchText, isLoading }) => {
    const { t } = useTranslation();
    const theme: ThemeInterface = useTheme();
    const isMobile = useSelector((state: RootState) => getIsMobile(state));

    const data = useMemo(() => {
        const mappedPositions = livePositions.map((position: UserPosition) => {
            return {
                ...position,
                priceDiff: position.isRanged
                    ? 0
                    : formatPricePercentageDifference(position.strikePrice, exchangeRates?.[position.currencyKey] || 0),
            };
        });

        return orderBy(mappedPositions, ['maturityDate', 'value', 'priceDiff'], ['asc', 'desc', 'asc']);
    }, [livePositions, exchangeRates]);

    const filteredData = useMemo(() => {
        if (searchText === '') return data;
        return data.filter(
            (position: UserPosition) => position.currencyKey.toLowerCase().indexOf(searchText.toLowerCase()) > -1
        );
    }, [searchText, data]);

    const generateRows = (data: UserPosition[]) => {
        try {
            const rows = data.sort((a, b) => b.maturityDate - a.maturityDate);

            return rows.map((row: UserPosition) => {
                const cells: any = [
                    {
                        title: row.isRanged
                            ? t('options.market.ranged-markets.strike-range')
                            : t(`options.home.markets-table.strike-price-col`),
                        value: row.isRanged
                            ? `$${formatCurrency(row.leftPrice)} - $${formatCurrency(row.rightPrice)}`
                            : `$${formatCurrency(row.strikePrice)}`,
                    },
                    {
                        title: t('options.home.market-card.current-asset-price'),
                        value: formatCurrencyWithSign(USD_SIGN, exchangeRates?.[row.currencyKey] || 0),
                    },
                    {
                        title: t('options.leaderboard.trades.table.amount-col'),
                        value: getAmount(formatCurrency(row.amount, 2), row.side, theme),
                    },
                    {
                        title: t('options.trading-profile.history.paid'),
                        value: `$${formatCurrency(row.paid)}`,
                    },
                    {
                        title: t('options.trading-profile.history.expires'),
                        value: <MaturityDate maturityDateUnix={row.maturityDate} showFullCounter={true} />,
                    },
                    {
                        value: <MyPositionAction position={row} isProfileAction />,
                    },
                    {
                        value: (
                            <SPAAnchor
                                href={
                                    row.isRanged
                                        ? buildRangeMarketLink(row.market, row.side)
                                        : buildOptionsMarketLink(row.market, row.side)
                                }
                            >
                                {isMobile ? (
                                    <TextLink>
                                        {t('options.trading-profile.go-to-market')}{' '}
                                        <IconLink
                                            className="icon icon--right"
                                            fontSize="10px"
                                            marginTop="-2px"
                                            color={theme.link.textColor.primary}
                                        />
                                    </TextLink>
                                ) : (
                                    <IconLink className="icon icon--right" />
                                )}
                            </SPAAnchor>
                        ),
                        width: isMobile ? undefined : '30px',
                    },
                ];

                return {
                    backgroundColor: theme.background.secondary,
                    asset: {
                        currencyKey: row.currencyKey,
                        position: row.side,
                        width: '50px',
                        displayInRowMobile: true,
                    },
                    cells: cells,
                    displayInRowMobile: true,
                    gap: '8px',
                };
            });
        } catch (e) {
            console.log(e);
        }
    };

    const rows = useMemo(() => {
        if (filteredData.length > 0) {
            return generateRows(filteredData);
        }
        return [];
    }, [filteredData]);

    return <TileTable rows={rows as any} isLoading={isLoading} hideFlow />;
};

export default OpenPositions;
