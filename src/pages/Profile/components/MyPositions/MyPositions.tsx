import PriceChart from 'components/Charts/PriceChart';
import Currency from 'components/Currency/v2';
import CurrencyIcon from 'components/Currency/v2/CurrencyIcon';
import SPAAnchor from 'components/SPAAnchor';
import Table from 'components/TableV2';
import { USD_SIGN } from 'constants/currency';
import { orderBy } from 'lodash';
import TimeRemaining from 'pages/Options/components/TimeRemaining';
import { Rates } from 'queries/rates/useExchangeRatesQuery';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { UsersAssets } from 'types/options';
import { getSynthName } from 'utils/currency';
import { formatCurrencyWithSign } from 'utils/formatters/number';
import { buildOptionsMarketLink } from 'utils/routes';
import Card from '../styled-components/Card';

type MyPositionsProps = {
    exchangeRates: Rates | null;
    positions: UsersAssets[];
    isSimpleView: boolean;
    searchText: string;
};

const MyPositions: React.FC<MyPositionsProps> = ({ exchangeRates, positions, isSimpleView, searchText }) => {
    const { t } = useTranslation();
    const data = useMemo(() => {
        const newArray: any = [];
        if (positions.length > 0) {
            positions.map((value) => {
                if (value.balances.long > 0) {
                    const modifiedValue: any = JSON.parse(JSON.stringify(value));
                    modifiedValue.link = buildOptionsMarketLink(value.market.address);
                    modifiedValue.balances.amount = value.balances.long;
                    modifiedValue.balances.type = 'UP';
                    newArray.push(modifiedValue);
                }
                if (value.balances.short > 0) {
                    const newValue: any = JSON.parse(JSON.stringify(value));
                    newValue.link = buildOptionsMarketLink(value.market.address);
                    newValue.balances.amount = value.balances.short;
                    newValue.balances.type = 'DOWN';
                    newArray.push(newValue);
                }
            });
        }

        return orderBy(newArray, 'market.maturityDate');
    }, [positions]);
    return (
        <Container>
            {isSimpleView &&
                data.length > 0 &&
                data.map((data: any, index: number) => (
                    <Content key={index}>
                        {data.balances.amount > 0 && (
                            <SPAAnchor href={buildOptionsMarketLink(data.market.address)}>
                                <Card.Wrapper>
                                    <Card>
                                        <Card.Column>
                                            <Card.Row>
                                                <CurrencyIcon
                                                    width="40px"
                                                    height="40px"
                                                    currencyKey={data.market.currencyKey}
                                                />
                                                <Card.RowTitle>{getSynthName(data.market.currencyKey)}</Card.RowTitle>
                                                <Card.RowSubtitle>{data.market.currencyKey}</Card.RowSubtitle>
                                            </Card.Row>
                                        </Card.Column>
                                        <Card.Column>
                                            <PriceChart
                                                containerStyle={{ margin: 'auto' }}
                                                currencyKey={data.market.currencyKey}
                                                showFooter
                                            />
                                        </Card.Column>
                                        <Card.Column>
                                            <Card.Row>
                                                <Card.RowTitle>
                                                    {t('options.home.market-card.current-asset-price')}
                                                </Card.RowTitle>
                                                <Card.RowSubtitle>
                                                    {formatCurrencyWithSign(
                                                        USD_SIGN,
                                                        exchangeRates?.[data.market.currencyKey] || 0
                                                    )}
                                                </Card.RowSubtitle>
                                            </Card.Row>
                                            <Card.Row>
                                                <Card.RowTitle>Strike Price</Card.RowTitle>
                                                <Card.RowSubtitle>
                                                    {formatCurrencyWithSign(USD_SIGN, data.market.strikePrice)}
                                                </Card.RowSubtitle>
                                            </Card.Row>
                                        </Card.Column>
                                        <Card.Column>
                                            <Card.Row>
                                                <Card.RowTitle>Time Left</Card.RowTitle>
                                                <Card.RowSubtitle>
                                                    <TimeRemaining
                                                        end={data.market.maturityDate}
                                                        fontSize={20}
                                                        showFullCounter={true}
                                                    />
                                                </Card.RowSubtitle>
                                            </Card.Row>
                                            <Card.Row>
                                                <Card.RowTitle>Amount</Card.RowTitle>
                                                <Card.RowSubtitle>
                                                    {data.balances.amount.toFixed(2)}
                                                    <span
                                                        style={{
                                                            color: data.balances.type === 'UP' ? '#50CE99' : '#C3244A',
                                                            marginLeft: 4,
                                                        }}
                                                    >
                                                        {data.balances.type}
                                                    </span>
                                                </Card.RowSubtitle>
                                            </Card.Row>
                                        </Card.Column>
                                    </Card>
                                </Card.Wrapper>
                            </SPAAnchor>
                        )}
                    </Content>
                ))}
            {!isSimpleView && data.length > 0 && (
                <Table
                    containerStyle={{ maxWidth: 'unset', marginTop: '-15px' }}
                    data={data}
                    searchQuery={searchText}
                    columns={[
                        {
                            Header: <>{t('options.home.markets-table.asset-col')}</>,
                            accessor: 'market.currencyKey',
                            Cell: (_props: any) => {
                                return (
                                    <Currency.Name
                                        currencyKey={_props?.cell?.value}
                                        showIcon={true}
                                        iconProps={{ type: 'asset' }}
                                        synthIconStyle={{ width: 32, height: 32 }}
                                        spanStyle={{ float: 'left' }}
                                    />
                                );
                            },
                            sortable: true,
                        },

                        {
                            Header: t(`options.home.markets-table.24h-change-col`),
                            accessor: (row: any) => (
                                <PriceChart
                                    currencyKey={row?.market?.currencyKey}
                                    height={30}
                                    width={125}
                                    showFooter={false}
                                    showPercentageChangeOnSide={true}
                                    containerStyle={{
                                        marginTop: '6px',
                                        marginBottom: '6px',
                                        marginLeft: '10px',
                                        whiteSpace: 'pre',
                                    }}
                                    footerStyle={{ fontSize: '10px' }}
                                />
                            ),
                            disableSortBy: true,
                        },
                        {
                            Header: t(`options.home.markets-table.strike-price-col`),
                            accessor: 'market.strikePrice',
                            Cell: (_props: any) => (
                                <TableText>{formatCurrencyWithSign(USD_SIGN, _props?.cell?.value, 2)}</TableText>
                            ),
                        },
                        {
                            Header: t(`options.home.markets-table.current-asset-price-col`),
                            accessor: (row: any) => (
                                <TableText>
                                    {formatCurrencyWithSign(USD_SIGN, exchangeRates?.[row.market.currencyKey] || 0)}
                                </TableText>
                            ),
                        },
                        {
                            Header: t(`options.home.markets-table.time-remaining-col`),
                            accessor: (row: any) => (
                                <TimeRemaining end={row.market.maturityDate} fontSize={15} showFullCounter={true} />
                            ),
                        },
                        {
                            Header: t('options.leaderboard.trades.table.amount-col'),
                            accessor: (row: any) => {
                                return (
                                    <TableText>
                                        {row.balances.amount.toFixed(2)}
                                        <span
                                            style={{
                                                color: row.balances.type === 'UP' ? '#50CE99' : '#C3244A',
                                                marginLeft: 4,
                                            }}
                                        >
                                            {row.balances.type}
                                        </span>
                                    </TableText>
                                );
                            },
                        },
                    ]}
                />
            )}
        </Container>
    );
};

const Content = styled.div`
    display: content;
`;

const Container = styled.div`
    display: flex;
    flex-direction: column;
    padding-top: 15px;
`;

const TableText = styled.span`
    font-family: Titillium Regular !imporant;
    font-style: normal;
    font-weight: bold;
    font-size: 15px;
    line-height: 285%;
    text-align: right;
    text-transform: uppercase;
    color: #ffffff;
`;

export default MyPositions;
