import { LightTooltip, StyledQuestionMarkIcon } from 'pages/Options/Market/components';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { TableRow, TableCell } from './OrderbookTable';
import { getStableCoinForNetwork } from '../../../../../../../../utils/currency';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../../../../../redux/rootReducer';
import { getNetworkId } from '../../../../../../../../redux/modules/wallet';

type OrderbookTableHeaderProps = {
    optionsCurrencyKey: string;
};

const OrderbookTableHeader: React.FC<OrderbookTableHeaderProps> = ({ optionsCurrencyKey }) => {
    const { t } = useTranslation();
    const networkId = useSelector((state: RootState) => getNetworkId(state));

    const columns = [
        {
            header: <></>,
            width: 14,
            justifyContent: 'left',
        },
        {
            header: (
                <p style={{ marginLeft: 14 }}>
                    {t('options.market.trade-options.orderbook.table.price-col', {
                        token: getStableCoinForNetwork(networkId),
                    })}
                </p>
            ),
            width: 300,
            justifyContent: 'left',
        },
        {
            header: (
                <>{t('options.market.trade-options.orderbook.table.amount-col', { currencyKey: optionsCurrencyKey })}</>
            ),
            width: 300,
            justifyContent: 'left',
        },
        {
            header: (
                <>
                    {t('options.market.trade-options.orderbook.table.total-col', {
                        token: getStableCoinForNetwork(networkId),
                    })}
                </>
            ),
            width: 300,
            justifyContent: 'left',
        },
        {
            header: (
                <>
                    {t('options.market.trade-options.orderbook.table.return-col')}
                    <LightTooltip title={t('options.market.trade-options.orderbook.table.return-col-tooltip')}>
                        <TableHeadQuestionMarkIcon />
                    </LightTooltip>
                </>
            ),
            className: 'return',
            width: 300,
            justifyContent: 'left',
        },
        {
            header: <>{t('options.market.trade-options.orderbook.table.time-remaining-col')}</>,
            width: 300,
            justifyContent: 'center',
            className: 'time-remaining',
        },
        {
            header: <></>,
            width: 50,
            justifyContent: 'left',
        },
    ];

    return (
        <TableRow>
            {columns.map((column: any, columnIndex: any) => (
                <TableCellHead
                    style={{ width: column.width }}
                    key={columnIndex}
                    justifyContent={column.justifyContent}
                    className={column.className}
                >
                    {column.header}
                </TableCellHead>
            ))}
        </TableRow>
    );
};

const TableCellHead = styled(TableCell)<{ justifyContent?: string }>`
    justify-content: ${(props) => props.justifyContent || 'left'};
    font-weight: bold;
    font-size: 10px;
    line-height: 16px;
    letter-spacing: 1px;
    font-family: Roboto !important;
    color: var(--table-header-text-color);
    user-select: none;
    &:first-child {
        padding-left: 0;
    }
    @media (max-width: 512px) {
        &.time-remaining {
            text-align: center;
        }
        &.return svg {
            display: none;
        }
    }
`;

const TableHeadQuestionMarkIcon = styled(StyledQuestionMarkIcon)`
    path {
        fill: var(--table-header-text-color);
    }
`;

export default OrderbookTableHeader;
