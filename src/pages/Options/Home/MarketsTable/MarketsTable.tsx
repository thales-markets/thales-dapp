import React, { FC, memo } from 'react';
import { OptionsMarkets } from 'types/options';
import dotenv from 'dotenv';
import { Paper, Table, TableContainer, TableHead, TableBody, TableRow, withStyles } from '@material-ui/core';
import Currency from 'components/Currency';
import { formatCurrency } from 'utils/formatters/number';
import { useTranslation } from 'react-i18next';
import TimeRemaining from 'pages/Options/components/TimeRemaining';
import { navigateToOptionsMarket } from 'utils/routes';
import { PhaseLabel, Row, StyledTableCell } from './components';

dotenv.config();

type MarketsTableProps = {
    optionsMarkets: OptionsMarkets;
    noResultsMessage?: React.ReactNode;
    isLoading?: boolean;
};

const StyledTableRow = withStyles(() => ({
    root: {
        background: '#126',
        '&:nth-of-type(odd)': {
            background: '#116',
        },
        '&.clickable': {
            cursor: 'pointer',
            '&:hover': {
                background: '#04045A',
            },
        },
    },
}))(TableRow);

const Divider: React.FC = () => {
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

const MarketsTable: FC<MarketsTableProps> = memo(({ optionsMarkets }) => {
    const { t } = useTranslation();
    return (
        <TableContainer style={{ background: 'transparent' }} component={Paper}>
            <Table aria-label="customized table">
                <TableHead>
                    <TableRow>
                        <StyledTableCell>Asset</StyledTableCell>
                        <StyledTableCell>Strike Price</StyledTableCell>
                        <StyledTableCell>Pool Size</StyledTableCell>
                        <StyledTableCell>Long/Short</StyledTableCell>
                        <StyledTableCell>Time Remaining</StyledTableCell>
                        <StyledTableCell>Open Orders</StyledTableCell>
                        <StyledTableCell>Phase</StyledTableCell>
                    </TableRow>
                    <Divider />
                </TableHead>
                <TableBody>
                    {optionsMarkets.map((market, index) => {
                        return (
                            <StyledTableRow
                                onClick={() => {
                                    if (market.phase !== 'expiry') {
                                        navigateToOptionsMarket(market.address);
                                    }
                                }}
                                className={market.phase !== 'expiry' ? 'clickable' : ''}
                                key={index}
                            >
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
                                <StyledTableCell>{market.openOrders}</StyledTableCell>
                                <StyledTableCell>
                                    <PhaseLabel className={market.phase}>
                                        {t(`options.phases.${market.phase}`)}
                                    </PhaseLabel>
                                </StyledTableCell>
                            </StyledTableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </TableContainer>
    );
});

export default MarketsTable;
