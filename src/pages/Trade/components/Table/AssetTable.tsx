import SimpleLoader from 'components/SimpleLoader/SimpleLoader';
import TableV3 from 'components/TableV3';

import { Positions } from 'constants/options';
import { ScreenSizeBreakpoint } from 'constants/ui';

import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import styled, { useTheme } from 'styled-components';
import { FlexDivColumn } from 'theme/common';
import { MarketInfo, RangedMarketPerPosition } from 'types/options';
import { ThemeInterface } from 'types/ui';
import { formatPercentage, formatStrikePrice } from 'utils/formatters/number';
import { buildOptionsMarketLink, buildRangeMarketLink } from 'utils/routes';

type TableProps = {
    markets: MarketInfo[] | RangedMarketPerPosition[];
    setMarket: React.Dispatch<React.SetStateAction<MarketInfo | RangedMarketPerPosition | undefined>>;
    position: Positions;
    isLoading: boolean;
    // highlightMarkets: Set<string>;
};

const AssetTable: React.FC<TableProps> = ({ markets, setMarket, position, isLoading }) => {
    // selectors
    const { t } = useTranslation();
    const theme: ThemeInterface = useTheme();
    const navigate = useHistory();

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

    const noMarkets = markets.length === 0;

    const columns: Array<any> = useMemo(() => {
        return [
            {
                id: 'strikePrice',
                Header: t(`options.home.markets-table.strike-price-col`),
                accessor: (row: any, index: number) => {
                    return (
                        <TableText selected={rowIndex === index} price={false}>
                            {formatStrikePrice(
                                position === Positions.UP || position === Positions.DOWN
                                    ? row.strikePrice
                                    : row.leftPrice,
                                position,
                                row.rightPrice
                            )}
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
                Cell: (props: any) => {
                    return (
                        <>
                            <TableText selected={rowIndex === props.row.index} price={true}>
                                {formatPercentage(props.row.original.discount)}
                            </TableText>
                            <Icon selected={rowIndex === props.row.index} className="icon icon--arrow-down" />
                        </>
                    );
                },
                width: '90px',
                headWidth: '97px',
            },
        ];
    }, [t, position, rowIndex]);

    return (
        <Wrapper>
            {isLoading ? (
                <SimpleLoader />
            ) : noMarkets ? (
                <NoMarketsText>{t(`options.home.markets-table.no-markets`)}</NoMarketsText>
            ) : (
                <TableV3
                    onTableRowClick={(row) => {
                        setRowIndex(row.index);
                        setMarket({ ...row.original, positionType: position });
                        if (rowIndex === row.index) {
                            let url = '';
                            if (position === Positions.UP || position === Positions.DOWN) {
                                url = buildOptionsMarketLink(row.original.address);
                            } else {
                                url = buildRangeMarketLink(row.original.address);
                            }
                            navigate.push(url);
                        }
                    }}
                    tableHeadCellStyles={getTableHeaderStyle(theme.textColor.secondary)}
                    data={markets}
                    columns={columns}
                    selectedRowIndex={rowIndex}
                    showCurrentPrice={position === Positions.UP || position === Positions.DOWN}
                />
            )}
        </Wrapper>
    );
};

const Icon = styled.i<{ selected: boolean }>`
    color: ${(props) => props.theme.button.textColor.primary};
    transform: rotate(-90deg);
    font-size: 14px;
    margin-left: 10px;
    visibility: ${(props) => (props.selected ? 'show' : 'hidden')}; ;
`;

const getTableHeaderStyle = (color: string): React.CSSProperties => {
    return {
        fontWeight: 500,
        fontSize: 13,
        lineHeight: '90%',
        color,
    };
};

const Wrapper = styled(FlexDivColumn)`
    width: 100%;
    height: calc(100% - 20px);
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        max-width: initial;
        height: calc(100% - 80px);
    }
    position: relative;
`;

const TableText = styled.span<{ price?: boolean; selected?: boolean }>`
    font-weight: ${(props) => (props.selected ? 700 : 500)};
    font-size: 13px;
    line-height: 285.5%;
    text-align: center;
    text-transform: uppercase;
    white-space: pre;
    color: ${(props) =>
        props.selected
            ? props.theme.background.primary
            : props.price
            ? props.theme.textColor.quaternary
            : props.theme.textColor.primary};
`;

const NoMarketsText = styled(TableText)`
    color: ${(props) => props.theme.textColor.secondary};
`;

export default AssetTable;
