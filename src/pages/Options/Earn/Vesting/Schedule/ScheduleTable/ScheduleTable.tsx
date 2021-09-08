import React, { FC, memo } from 'react';
import { useTranslation } from 'react-i18next';
import { CellProps } from 'react-table';
import { THALES_CURRENCY } from 'constants/currency';
import { formatCurrencyWithKey } from 'utils/formatters/number';
import { formatTxTimestamp } from 'utils/formatters/date';
import Table from 'components/Table';
import { VestingScheduleItem, VestingSchedule } from 'types/token';

type ScheduleTableProps = {
    schedule: VestingSchedule;
    noResultsMessage?: React.ReactNode;
    isLoading: boolean;
};

export const ScheduleTable: FC<ScheduleTableProps> = memo(({ schedule, noResultsMessage, isLoading }) => {
    const { t } = useTranslation();

    return (
        <>
            <Table
                columns={[
                    {
                        Header: <>{t('options.earn.vesting.schedule.table.date-time-col')}</>,
                        accessor: 'date',
                        Cell: (cellProps: CellProps<VestingScheduleItem, VestingScheduleItem['date']>) => (
                            <p>{formatTxTimestamp(cellProps.cell.value)}</p>
                        ),
                        width: 150,
                        sortable: true,
                    },
                    {
                        Header: <>{t('options.earn.vesting.schedule.table.amount-col')}</>,
                        sortType: 'basic',
                        accessor: 'amount',
                        Cell: (cellProps: CellProps<VestingScheduleItem, VestingScheduleItem['amount']>) => (
                            <p>{formatCurrencyWithKey(THALES_CURRENCY, cellProps.cell.value)}</p>
                        ),
                        width: 150,
                        sortable: true,
                    },
                ]}
                data={schedule}
                isLoading={isLoading}
                noResultsMessage={noResultsMessage}
            />
        </>
    );
});

export default ScheduleTable;
