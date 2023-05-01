import TableV3 from 'components/TableV3';

import { USD_SIGN } from 'constants/currency';
import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { MarketInfo } from 'types/options';
import { formatCurrencyWithSign, formatPercentage } from 'utils/formatters/number';

type TableProps = {
    markets: MarketInfo[];
    setMarket: React.Dispatch<React.SetStateAction<MarketInfo | undefined>>;
    // highlightMarkets: Set<string>;
};

const AssetTable: React.FC<TableProps> = ({ markets, setMarket }) => {
    // selectors
    const { t } = useTranslation();

    // states
    const [rowIndex, setRowIndex] = useState<number>();

    // queries

    // hooks

    const columns: Array<any> = useMemo(() => {
        return [
            {
                id: 'strikePrice',
                Header: t(`options.home.markets-table.strike-price-col`),
                accessor: (row: any) => {
                    return <TableText>{formatCurrencyWithSign(USD_SIGN, row.strikePrice, 2)}</TableText>;
                },
            },
            {
                Header: t(`options.home.markets-table.price-up-down-col`),
                accessor: (row: any) => <TableText>{formatCurrencyWithSign(USD_SIGN, row.price, 2)}</TableText>,
            },
            {
                id: 'discountedSide',
                Header: t(`options.home.markets-table.discount-col`),
                accessor: 'discountedSide',
                Cell: (_props: any) => {
                    return <TableText>{formatPercentage(_props.row.original.discount)}</TableText>;
                },
            },
        ];
    }, [markets]);

    return (
        <Wrapper>
            <TableV3
                hover="#1B1C33"
                onTableRowClick={(row) => {
                    setRowIndex(row.index);
                    setMarket(row.original);
                }}
                tableHeadCellStyles={TableHeaderStyle}
                data={markets}
                columns={columns}
                selectedRowIndex={rowIndex}
                selectedRowColor="#4E9D9D"
                showCurrentPrice={true}
            />
        </Wrapper>
    );
};

const TableHeaderStyle: React.CSSProperties = {
    fontFamily: 'Roboto',
    fontStyle: 'normal',
    fontWeight: 400,
    fontSize: 14,
    lineHeight: '16px',
    color: 'rgba(255, 255, 255, 0.4)',
};

const Wrapper = styled.div`
    width: 100%;
`;

const TableText = styled.span`
    font-family: 'Roboto';
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    line-height: 16px;

    color: var(--color-white);
`;

export default AssetTable;
