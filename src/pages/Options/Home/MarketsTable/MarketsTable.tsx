import React, { FC, memo } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import { CellProps, Row } from 'react-table';
import { SYNTHS_MAP, FIAT_CURRENCY_MAP, USD_SIGN } from 'constants/currency';
import { formatCurrency } from 'utils/formatters/number';
import { formatShortDate } from 'utils/formatters/date';
import Table from 'components/Table';
import { CurrencyCol } from 'components/Table/common';
import { OptionsMarkets, HistoricalOptionsMarketInfo } from 'types/options';
import TimeRemaining from '../../components/TimeRemaining';
import Currency from 'components/Currency';
import dotenv from 'dotenv';
import { navigateToOptionsMarket } from 'utils/routes';

dotenv.config();

type MarketsTableProps = {
    optionsMarkets: OptionsMarkets;
    noResultsMessage?: React.ReactNode;
    isLoading?: boolean;
};
const getPhaseBackgroundColor = (phase: string) => {
    switch (phase) {
        case 'bidding':
            return '#fbe6b8';
        case 'trading':
            return '#9fe3d5';
        case 'maturity':
            return '#c5d5ff';
        case 'expiry':
            return '#f5607066';
        default:
            break;
    }
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
                    ) => (
                        <Currency.Name
                            currencyKey={cellProps.cell.value}
                            name={cellProps.row.original.asset}
                            showIcon={true}
                            iconProps={{ width: '24px', height: '24px', type: 'asset' }}
                        />
                    ),
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
                        <span
                            style={{
                                backgroundColor: getPhaseBackgroundColor(cellProps.cell.value),
                                textTransform: 'uppercase',
                                padding: 5,
                            }}
                        >
                            {t(`options.phases.${cellProps.cell.value}`)}
                        </span>
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
                {
                    Header: <>{t('options.home.markets-table.openorders')}</>,
                    accessor: 'openOrders',
                    Cell: (
                        cellProps: CellProps<HistoricalOptionsMarketInfo, HistoricalOptionsMarketInfo['openOrders']>
                    ) => (
                        <span
                            title={cellProps.row.original.orders ? JSON.stringify(cellProps.row.original.orders) : ''}
                        >
                            {cellProps.row.original.phase == 'trading' ? cellProps.cell.value : 'N/A'}
                        </span>
                    ),
                    width: 150,
                    sortable: true,
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
