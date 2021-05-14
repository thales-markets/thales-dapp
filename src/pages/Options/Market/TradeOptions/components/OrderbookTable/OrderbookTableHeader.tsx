import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { TableRow, TableCell } from './OrderbookTable';

const OrderbookTableHeader: React.FC = () => {
    const { t } = useTranslation();
    const columns = [
        {
            header: <></>,
            width: 14,
        },
        {
            header: <p style={{ marginLeft: 14 }}>{t('options.market.trade-options.orderbook.table.price-col')}</p>,
            width: 300,
        },
        {
            header: <>{t('options.market.trade-options.orderbook.table.amount-col')}</>,
            width: 300,
        },
        {
            header: <>{t('options.market.trade-options.orderbook.table.total-col')}</>,
            width: 300,
        },
        {
            header: <>{t('options.market.trade-options.orderbook.table.filled-col')}</>,
            width: 300,
        },
        {
            header: <>{t('options.market.trade-options.orderbook.table.time-remaining-col')}</>,
            width: 300,
        },
        {
            header: <></>,
            width: 30,
        },
    ];

    return (
        <TableRow>
            {columns.map((column: any, columnIndex: any) => (
                <TableCellHead style={{ width: column.width }} key={columnIndex}>
                    {column.header}
                </TableCellHead>
            ))}
        </TableRow>
    );
};

const TableCellHead = styled(TableCell)`
    text-transform: uppercase;
    font-weight: bold;
    font-size: 10px;
    line-height: 16px;
    letter-spacing: 1px;
    text-transform: uppercase;
    color: #748bc6;
    user-select: none;
    background: rgba(228, 228, 228, 0.05);
    &:first-child {
        padding-left: 0;
    }
`;

export default OrderbookTableHeader;
