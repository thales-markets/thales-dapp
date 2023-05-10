import TableV3 from 'components/TableV3';

import { USD_SIGN } from 'constants/currency';
import { Positions } from 'constants/options';
import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { Colors, FlexDivColumn } from 'theme/common';
import { MarketInfo, RangedMarketPerPosition } from 'types/options';
import { formatCurrencyWithSign, formatPercentage } from 'utils/formatters/number';

type TableProps = {
    markets: MarketInfo[] | RangedMarketPerPosition[];
    setMarket: React.Dispatch<React.SetStateAction<MarketInfo | RangedMarketPerPosition | undefined>>;
    position: Positions;
    // highlightMarkets: Set<string>;
};

const AssetTable: React.FC<TableProps> = ({ markets, setMarket, position }) => {
    // selectors
    const { t } = useTranslation();

    // states
    const [rowIndex, setRowIndex] = useState<number>();
    const [firstMarketAddress, setFirstMarketAddress] = useState(markets.length ? markets[0].address : '');

    // queries

    // hooks
    useEffect(() => {
        const marketAddress = markets.length ? markets[0].address : '';
        if (firstMarketAddress !== marketAddress) {
            setRowIndex(undefined);
            setMarket(undefined);
        }
        setFirstMarketAddress(marketAddress);
    }, [markets, setMarket, firstMarketAddress]);

    const columns: Array<any> = useMemo(() => {
        return [
            {
                id: 'strikePrice',
                Header: t(`options.home.markets-table.strike-price-col`),
                accessor: (row: any, index: number) => {
                    return (
                        <TableText selected={rowIndex === index} price={false}>
                            {position === Positions.UP || position === Positions.DOWN
                                ? formatCurrencyWithSign(USD_SIGN, row.strikePrice, 2)
                                : `${formatCurrencyWithSign(USD_SIGN, row.leftPrice, 2)} - ${formatCurrencyWithSign(
                                      USD_SIGN,
                                      row.rightPrice,
                                      2
                                  )}`}
                        </TableText>
                    );
                },
                width: '180px',
            },
            {
                Header: t(`options.home.markets-table.roi`),
                accessor: (row: any, index: number) => (
                    <TableText selected={rowIndex === index} price={true}>
                        {row.price.toFixed(0)}%
                    </TableText>
                ),
                width: '60px',
            },
            {
                id: 'discountedSide',
                Header: t(`options.home.markets-table.discount-col`),
                accessor: 'discountedSide',
                Cell: (_props: any) => {
                    return (
                        <TableText selected={rowIndex === _props.row.index} price={true}>
                            {formatPercentage(_props.row.original.discount)}
                        </TableText>
                    );
                },
                width: '80px',
                headWidth: '87px',
            },
        ];
    }, [t, position, rowIndex]);

    return (
        <Wrapper>
            <TableV3
                hover="#1B1C33"
                onTableRowClick={(row) => {
                    setRowIndex(row.index);
                    setMarket({ ...row.original, positionType: position });
                }}
                tableHeadCellStyles={TableHeaderStyle}
                data={markets}
                columns={columns}
                selectedRowIndex={rowIndex}
                showCurrentPrice={position === Positions.UP || position === Positions.DOWN}
            />
        </Wrapper>
    );
};

const TableHeaderStyle: React.CSSProperties = {
    fontFamily: 'Inter !important',
    fontStyle: 'normal',
    fontWeight: 500,
    fontSize: 13,
    lineHeight: '90%',
    color: Colors.GRAY_LIGHT,
};

const Wrapper = styled(FlexDivColumn)`
    width: 100%;
    height: calc(100% - 20px);
    max-width: 344px;
`;

const TableText = styled.span<{ price: boolean; selected: boolean }>`
    font-family: 'Titillium Web !important';
    font-style: normal;
    font-weight: ${(props) => (props.selected ? 700 : 500)};
    font-size: 13px;
    line-height: 285.5%;
    /* or 37px */

    text-align: center;
    text-transform: uppercase;
    white-space: nowrap;
    color: ${(props) =>
        props.selected
            ? props.theme.background.primary
            : props.price
            ? props.theme.textColor.quaternary
            : props.theme.textColor.primary};
`;

export default AssetTable;
