import React, { FC, memo } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import { CellProps, Row } from 'react-table';
import { SYNTHS_MAP, FIAT_CURRENCY_MAP, USD_SIGN } from 'constants/currency';
import { formatShortDate, formatCurrency } from 'utils/formatters';
import Table from 'components/Table';
import { CurrencyCol } from 'components/Table/common';
import { OptionsMarkets, HistoricalOptionsMarketInfo } from 'pages/Options/types';
import TimeRemaining from '../components/TimeRemaining';
import { getCurrencyKeyIcon } from 'utils/currency';
import { navigateToOptionsMarket } from 'utils/routes';

type MarketsTableProps = {
    optionsMarkets: OptionsMarkets;
    noResultsMessage?: React.ReactNode;
    isLoading?: boolean;
};

export const MarketsTable: FC<MarketsTableProps> = memo(({ optionsMarkets, noResultsMessage, isLoading }) => {
    const { t } = useTranslation();

    return (
        <Table
            columns={[
                {
                    Header: <>{t('options.home.markets-table.asset-col')}</>,
                    accessor: 'currencyKey',
                    Cell: (
                        cellProps: CellProps<HistoricalOptionsMarketInfo, HistoricalOptionsMarketInfo['currencyKey']>
                    ) => {
                        const currencyIcon = getCurrencyKeyIcon(cellProps.cell.value);
                        const { AssetIcon } = currencyIcon;
                        return (
                            <span style={{ display: 'flex', alignItems: 'center' }}>
                                <AssetIcon width="22" height="22" style={{ marginRight: 10 }} />{' '}
                                {cellProps.row.original.asset}
                            </span>
                        );
                    },
                    width: 150,
                    sortable: true,
                },
                {
                    Header: (
                        <>
                            {t('options.home.markets-table.strike-price-col', {
                                currencyKey: `${FIAT_CURRENCY_MAP.USD}`,
                            })}
                        </>
                    ),
                    accessor: 'strikePrice',
                    sortType: 'basic',
                    Cell: (
                        cellProps: CellProps<HistoricalOptionsMarketInfo, HistoricalOptionsMarketInfo['strikePrice']>
                    ) => <CurrencyCol sign={USD_SIGN} value={cellProps.cell.value} />,
                    width: 150,
                    sortable: true,
                },
                {
                    Header: <>{t('options.home.markets-table.maturity-date-col')}</>,
                    accessor: 'maturityDate',
                    Cell: (
                        cellProps: CellProps<HistoricalOptionsMarketInfo, HistoricalOptionsMarketInfo['maturityDate']>
                    ) => <span>{formatShortDate(cellProps.cell.value)}</span>,
                    width: 150,
                    sortable: true,
                },

                {
                    Header: <>{t('options.home.markets-table.long-short-col')}</>,
                    id: 'long-short',
                    Cell: (cellProps: CellProps<HistoricalOptionsMarketInfo>) => {
                        return (
                            <div>
                                <span style={{ color: '#10BA97' }}>
                                    {t('common.val-in-cents', {
                                        val: formatCurrency(cellProps.row.original.longPrice * 100),
                                    })}
                                </span>{' '}
                                /{' '}
                                <span style={{ color: '#D94454' }}>
                                    {t('common.val-in-cents', {
                                        val: formatCurrency(cellProps.row.original.shortPrice * 100),
                                    })}
                                </span>
                            </div>
                        );
                    },
                    width: 150,
                },
                {
                    Header: (
                        <Trans
                            i18nKey="options.home.markets-table.pool-size-col"
                            values={{ currencyKey: `${SYNTHS_MAP.sUSD}` }}
                            components={[<span key="pool" />]}
                        />
                    ),
                    accessor: 'poolSize',
                    sortType: 'basic',
                    Cell: (
                        cellProps: CellProps<HistoricalOptionsMarketInfo, HistoricalOptionsMarketInfo['poolSize']>
                    ) => <CurrencyCol sign={USD_SIGN} value={cellProps.cell.value} />,
                    width: 150,
                    sortable: true,
                },
                {
                    Header: <>{t('options.home.markets-table.phase-col')}</>,
                    accessor: 'phase',
                    Cell: (cellProps: CellProps<HistoricalOptionsMarketInfo, HistoricalOptionsMarketInfo['phase']>) => (
                        <span>{cellProps.cell.value}</span>
                    ),
                    width: 150,
                },
                {
                    Header: <>{t('options.home.markets-table.time-remaining-col')}</>,
                    accessor: 'timeRemaining',
                    Cell: (
                        cellProps: CellProps<HistoricalOptionsMarketInfo, HistoricalOptionsMarketInfo['timeRemaining']>
                    ) => <TimeRemaining end={cellProps.cell.value} />,
                    width: 150,
                },
            ]}
            data={optionsMarkets}
            onTableRowClick={(row: Row<HistoricalOptionsMarketInfo>) => {
                navigateToOptionsMarket(row.original.address);
            }}
            isLoading={isLoading}
            noResultsMessage={noResultsMessage}
        />
    );
});

export default MarketsTable;
