import TableV3 from 'components/TableV3';

import { USD_SIGN } from 'constants/currency';
import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { Colors } from 'theme/common';
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
                accessor: (row: any) => {
                    return <TableText price={false}>{formatCurrencyWithSign(USD_SIGN, row.strikePrice, 2)}</TableText>;
                },
            },
            {
                Header: t(`options.home.markets-table.roi`),
                accessor: (row: any) => <TableText price={true}>{row.price.toFixed(0)}%</TableText>,
            },
            {
                id: 'discountedSide',
                Header: t(`options.home.markets-table.discount-col`),
                accessor: 'discountedSide',
                Cell: (_props: any) => {
                    return <TableText price={true}>{formatPercentage(_props.row.original.discount)}</TableText>;
                },
            },
        ];
    }, [t]);

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
    fontFamily: 'Inter !important',
    fontStyle: 'normal',
    fontWeight: 500,
    fontSize: 13,
    lineHeight: '90%',
    color: Colors.GRAY_LIGHT,
};

const Wrapper = styled.div`
    width: 100%;
    max-width: 344px;
`;

const TableText = styled.span<{ price: boolean }>`
    font-family: 'Titillium Web !important';
    font-style: normal;
    font-weight: 500;
    font-size: 13px;
    line-height: 285.5%;
    /* or 37px */

    text-align: center;
    text-transform: uppercase;
    color: ${(props) => (props.price ? props.theme.textColor.quaternary : props.theme.textColor.primary)};
`;

export default AssetTable;
