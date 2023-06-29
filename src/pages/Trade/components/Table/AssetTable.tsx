import SimpleLoader from 'components/SimpleLoader/SimpleLoader';
import TableV3 from 'components/TableV3';
import Tooltip from 'components/Tooltip';
import { Positions } from 'enums/options';
import { ScreenSizeBreakpoint } from 'enums/ui';
import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled, { useTheme } from 'styled-components';
import { FlexDivColumn } from 'styles/common';
import { MarketInfo, RangedMarketPerPosition } from 'types/options';
import { ThemeInterface } from 'types/ui';
import { formatStrikePrice } from 'utils/formatters/number';

type TableProps = {
    markets: MarketInfo[] | RangedMarketPerPosition[];
    setMarket: React.Dispatch<React.SetStateAction<MarketInfo | RangedMarketPerPosition | undefined>>;
    position: Positions;
    isLoading: boolean;
};

const TOOLTIP_DELAY_SEC = 0.3;

const AssetTable: React.FC<TableProps> = ({ markets, setMarket, position, isLoading }) => {
    // selectors
    const { t } = useTranslation();
    const theme: ThemeInterface = useTheme();

    // states
    const [rowIndex, setRowIndex] = useState<number>();
    const [firstPositionMarketAddress, setFirstPositionMarketAddress] = useState(
        markets.length ? position + markets[0].address : ''
    );

    // hooks
    useEffect(() => {
        const positionMarketAddress = markets.length ? position + markets[0].address : '';
        if (firstPositionMarketAddress !== positionMarketAddress) {
            setRowIndex(undefined);
            setMarket(undefined);
        }
        setFirstPositionMarketAddress(positionMarketAddress);
    }, [markets, setMarket, firstPositionMarketAddress]);

    const noMarkets = markets.length === 0;
    const isRangedMarkets = position === Positions.IN || position === Positions.OUT;

    const columns: Array<any> = useMemo(() => {
        return [
            {
                id: 'strikePrice',
                Header: isRangedMarkets ? (
                    <Tooltip overlay={t('markets.table.tooltip.strike-range')} mouseEnterDelay={TOOLTIP_DELAY_SEC}>
                        <div>{t(`markets.table.strike-range-col`)}</div>
                    </Tooltip>
                ) : (
                    <Tooltip overlay={t('markets.table.tooltip.strike-price')} mouseEnterDelay={TOOLTIP_DELAY_SEC}>
                        <div>{t(`markets.table.strike-price-col`)}</div>
                    </Tooltip>
                ),
                accessor: (row: any, index: number) => {
                    return (
                        <TableText selected={rowIndex === index} price={false}>
                            {formatStrikePrice(
                                isRangedMarkets ? row.leftPrice : row.strikePrice,
                                position,
                                row.rightPrice
                            )}
                        </TableText>
                    );
                },
                width: '180px',
            },
            {
                id: 'roi',
                Header: (
                    <Tooltip overlay={t('markets.table.tooltip.roi')} mouseEnterDelay={TOOLTIP_DELAY_SEC}>
                        <div>{t(`markets.table.roi`)}</div>
                    </Tooltip>
                ),
                accessor: (row: any, index: number) => (
                    <PriceContainer>
                        <TableText selected={rowIndex === index} price={true}>
                            {row.roi.toFixed(0)}%
                        </TableText>
                        {row.discount > 0 && (
                            <TableText selected={rowIndex === index} bonus={true} price={false}>
                                + {row.discount.toFixed(0)}%
                            </TableText>
                        )}
                    </PriceContainer>
                ),
                width: '75px',
            },
            {
                id: 'price',
                Header: (
                    <Tooltip overlay={t('markets.table.tooltip.price')} mouseEnterDelay={TOOLTIP_DELAY_SEC}>
                        <div>{t(`markets.table.price`)}</div>
                    </Tooltip>
                ),
                accessor: 'price',
                Cell: (props: any) => {
                    return (
                        <>
                            <TableText selected={rowIndex === props.row.index} price={false}>
                                {props.row.original.price}
                            </TableText>
                            <Tooltip overlay={t('common.tooltip.open-market')}>
                                <Icon selected={rowIndex === props.row.index} className="icon icon--caret-down" />
                            </Tooltip>
                        </>
                    );
                },
                width: '70px',
                headWidth: '110px',
            },
        ];
    }, [t, position, rowIndex]);

    return (
        <Wrapper>
            {isLoading ? (
                <SimpleLoader />
            ) : noMarkets ? (
                <NoMarketsText>{t(`markets.table.no-markets`)}</NoMarketsText>
            ) : (
                <TableV3
                    onTableRowClick={(row) => {
                        setRowIndex(row.index);
                        setMarket({ ...row.original, positionType: position });
                    }}
                    tableHeadCellStyles={getTableHeaderStyle(theme.textColor.secondary)}
                    data={markets}
                    columns={columns}
                    selectedRowIndex={rowIndex}
                    showCurrentPrice={!isRangedMarkets}
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
    margin-bottom: 1px;
    visibility: ${(props) => (props.selected ? 'visible' : 'hidden')};
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

const TableText = styled.span<{ price?: boolean; selected?: boolean; bonus?: boolean }>`
    font-weight: ${(props) => (props.selected ? 700 : 500)};
    font-size: 13px;
    line-height: 285.5%;
    text-align: center;
    text-transform: uppercase;
    white-space: pre;
    color: ${(props) =>
        props.selected
            ? props.theme.table.textColor.secondary
            : props.price
            ? props.theme.table.textColor.quaternary
            : props.bonus
            ? props.theme.table.textColor.tertiary
            : props.theme.table.textColor.primary};
    margin-left: ${(props) => (props.bonus ? '4px' : 0)}; ;
`;

const NoMarketsText = styled(TableText)`
    color: ${(props) => props.theme.textColor.secondary};
`;

const PriceContainer = styled.div`
    display: flex;
    width: 100%;
    justify-content: flex-start;
    align-items: center;
`;

export default AssetTable;
