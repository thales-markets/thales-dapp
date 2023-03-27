import TableV3 from 'components/TableV3';
import { Icon } from 'components/Tooltip/styled-components/components';
import { USD_SIGN } from 'constants/currency';
import { UI_COLORS } from 'constants/ui';

import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { OptionsMarkets } from 'types/options';
import { formatCurrencyWithSign } from 'utils/formatters/number';

type TableProps = {
    markets: OptionsMarkets;
    setMarket: React.Dispatch<React.SetStateAction<string>>;
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
                id: 'discountedSide',
                Header: t(`options.home.markets-table.discount-col`),
                accessor: 'discountedSide',
                Cell: (_props: any) => {
                    if (
                        _props.cell.value &&
                        (_props.row.original.availableLongs > 0 || _props.row.original.availableShorts > 0)
                    ) {
                        return (
                            <>
                                <Icon
                                    style={{
                                        color: _props.cell.value === 'DOWN' ? '#e53720' : '#4fbf67',
                                        marginRight: 8,
                                    }}
                                    className={`v2-icon v2-icon--${_props.cell.value.toLowerCase()}`}
                                ></Icon>
                                <TableText>{_props.row.original.discount}%</TableText>
                            </>
                        );
                    } else {
                        return <TableText>/</TableText>;
                    }
                },
            },
            {
                Header: t(`options.home.markets-table.amm-size-col`),
                accessor: (row: any) => {
                    if (Number(row.availableLongs) > 0 || Number(row.availableShorts) > 0) {
                        return (
                            <RatioText
                                green={Number(row.availableLongs).toFixed(1)}
                                red={Number(row.availableShorts).toFixed(1)}
                            />
                        );
                    }
                    return (
                        <YellowText>
                            {row?.phase !== 'maturity'
                                ? t('options.home.markets-table.out-of-liquidity')
                                : t('options.market.overview.maturity-label')}
                        </YellowText>
                    );
                },
            },
            {
                Header: t(`options.home.markets-table.price-up-down-col`),
                accessor: (row: any) => (
                    <RatioText
                        green={formatCurrencyWithSign(USD_SIGN, row.longPrice, 2)}
                        red={formatCurrencyWithSign(USD_SIGN, row.shortPrice, 2)}
                    />
                ),
            },
            {
                id: 'poolSize',
                Header: t(`options.home.markets-table.pool-size-col`),
                accessor: (row: any) => {
                    return <TableText>{formatCurrencyWithSign(USD_SIGN, row.poolSize, 2)}</TableText>;
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
                    setMarket(row.original.address);
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

    color: #ffffff;
`;

const GreenText = styled(TableText)`
    color: ${UI_COLORS.GREEN};
`;

const RedText = styled(TableText)`
    color: ${UI_COLORS.RED};
`;

const YellowText = styled(TableText)`
    color: ${UI_COLORS.YELLOW};
`;

const RatioText: React.FC<{ green: string; red: string }> = ({ green, red }) => {
    return (
        <TableText>
            <GreenText>{green}</GreenText> / <RedText>{red}</RedText>
        </TableText>
    );
};

export default AssetTable;
