import PriceChart from 'components/Charts/PriceChart';
import CurrencyIcon from 'components/Currency/v2/CurrencyIcon';
import SPAAnchor from 'components/SPAAnchor';
import { USD_SIGN } from 'constants/currency';
import { Rates } from 'queries/rates/useExchangeRatesQuery';
import React from 'react';
import styled from 'styled-components';
import { UsersAssets } from 'types/options';
import { getSynthName } from 'utils/currency';
import { formatCurrencyWithSign } from 'utils/formatters/number';
import { buildOptionsMarketLink } from 'utils/routes';
import Card from '../styled-components/Card';

type MaturedPositionsProps = {
    exchangeRates: Rates | null;
    positions: UsersAssets[];
};

const MaturedPositions: React.FC<MaturedPositionsProps> = ({ exchangeRates, positions }) => {
    return (
        <Container>
            {positions.map((data, index) => (
                <Content key={index}>
                    {data.balances.long > 0 && (
                        <SPAAnchor href={buildOptionsMarketLink(data.market.address)}>
                            <Card>
                                <Card.Column>
                                    <Card.Row>
                                        <CurrencyIcon width="40" height="40" currencyKey={data.market.currencyKey} />
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
                                        <Card.RowTitle>Current Asset Price</Card.RowTitle>
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
                                        <Card.RowTitle>Status</Card.RowTitle>
                                        <Card.RowSubtitle
                                            style={{ color: data.market.result === 'long' ? '#50CE99' : '#C3244A' }}
                                        >
                                            {data.market.result === 'long' ? 'Claimable' : 'RIP'}
                                        </Card.RowSubtitle>
                                    </Card.Row>
                                    <Card.Row>
                                        <Card.RowTitle>Amount</Card.RowTitle>
                                        <Card.RowSubtitle>
                                            {data.balances.long.toFixed(2)}
                                            <span style={{ color: '#50CE99', marginLeft: 4 }}>UP</span>{' '}
                                        </Card.RowSubtitle>
                                    </Card.Row>
                                </Card.Column>
                            </Card>
                        </SPAAnchor>
                    )}
                    {data.balances.short > 0 && (
                        <SPAAnchor href={buildOptionsMarketLink(data.market.address)}>
                            <Card>
                                <Card.Column>
                                    <Card.Row>
                                        <CurrencyIcon width="40" height="40" currencyKey={data.market.currencyKey} />
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
                                        <Card.RowTitle>Current Asset Price</Card.RowTitle>
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
                                        <Card.RowTitle>Status</Card.RowTitle>
                                        <Card.RowSubtitle
                                            style={{ color: data.market.result === 'short' ? '#50CE99' : '#C3244A' }}
                                        >
                                            {data.market.result === 'short' ? 'Claimable' : 'RIP'}
                                        </Card.RowSubtitle>
                                    </Card.Row>
                                    <Card.Row>
                                        <Card.RowTitle>Amount</Card.RowTitle>
                                        <Card.RowSubtitle>
                                            {data.balances.short.toFixed(2)}
                                            <span style={{ color: '#C3244A', marginLeft: 4 }}>DOWN</span>{' '}
                                        </Card.RowSubtitle>
                                    </Card.Row>
                                </Card.Column>
                            </Card>
                        </SPAAnchor>
                    )}
                </Content>
            ))}
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

export default MaturedPositions;
