import React, { FC, memo } from 'react';
import { OptionsMarkets } from 'types/options';
import dotenv from 'dotenv';
import { Paper, Table, TableContainer, TableHead, TableBody, TableRow, withStyles, TableCell } from '@material-ui/core';
import Currency from 'components/Currency';
import { formatCurrency } from 'utils/formatters/number';
import { useTranslation } from 'react-i18next';
import TimeRemaining from 'pages/Options/components/TimeRemaining';
import styled from 'styled-components';

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

const StyledTableCell = withStyles(() => ({
    head: {
        border: 'none',
        background: '#127',
        fontWeight: 'bold',
        fontSize: '14px',
        lineHeight: '16px',
        letterSpacing: ' 0.5px',
        color: '#748BC6',
    },
    body: {
        border: 'none',
        fontWeight: 'bold',
        fontSize: '16px',
        lineHeight: '24px',
        letterSpacing: ' 0.25px',
        color: '#F6F6FE',
    },
}))(TableCell);

const StyledTableRow = withStyles(() => ({
    root: {
        background: '#126',
        '&:nth-of-type(odd)': {
            background: '#116',
        },
    },
}))(TableRow);

const Divider: React.FC = () => {
    const Row = styled.tr`
        height: 1px;
        background: linear-gradient(281.48deg, #04045a -16.58%, #141874 97.94%);
    `;
    return (
        <Row>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
        </Row>
    );
};

export const MarketsTable: FC<MarketsTableProps> = memo(({ optionsMarkets }) => {
    const { t } = useTranslation();
    return (
        <TableContainer component={Paper}>
            <Table aria-label="customized table">
                <TableHead>
                    <TableRow>
                        <StyledTableCell>Asset</StyledTableCell>
                        <StyledTableCell>Strike Price</StyledTableCell>
                        <StyledTableCell>Pool Size</StyledTableCell>
                        <StyledTableCell>Long/Short</StyledTableCell>
                        <StyledTableCell>Time Remaining</StyledTableCell>
                        <StyledTableCell>Phase</StyledTableCell>
                    </TableRow>
                    <Divider />
                </TableHead>
                <TableBody>
                    {optionsMarkets.map((market, index) => {
                        return (
                            <>
                                <Divider />
                                <StyledTableRow key={index}>
                                    <StyledTableCell>
                                        <Currency.Name
                                            currencyKey={market.currencyKey}
                                            name={market.asset}
                                            showIcon={true}
                                            iconProps={{ width: '24px', height: '24px', type: 'asset' }}
                                        />
                                    </StyledTableCell>
                                    <StyledTableCell>{market.strikePrice.toFixed(2)}</StyledTableCell>
                                    <StyledTableCell>{market.poolSize.toFixed(2)}</StyledTableCell>
                                    <StyledTableCell>
                                        <div>
                                            <span style={{ color: '#10BA97' }}>
                                                {t('common.val-in-cents', {
                                                    val: formatCurrency(market.longPrice * 100),
                                                })}
                                            </span>{' '}
                                            /{' '}
                                            <span style={{ color: '#D94454' }}>
                                                {t('common.val-in-cents', {
                                                    val: formatCurrency(market.shortPrice * 100),
                                                })}
                                            </span>
                                        </div>
                                    </StyledTableCell>
                                    <StyledTableCell>
                                        <TimeRemaining end={market.timeRemaining} />
                                    </StyledTableCell>
                                    <StyledTableCell>
                                        <span
                                            style={{
                                                backgroundColor: getPhaseBackgroundColor(market.phase),
                                                textTransform: 'uppercase',
                                                padding: 5,
                                            }}
                                        >
                                            {t(`options.phases.${market.phase}`)}
                                        </span>
                                    </StyledTableCell>
                                </StyledTableRow>
                                <Divider />
                            </>
                        );
                    })}
                </TableBody>
            </Table>
        </TableContainer>
    );
});

export default MarketsTable;
