import PriceChart from 'components/Charts/PriceChart';
import CurrencyIcon from 'components/Currency/v2/CurrencyIcon';
import { USD_SIGN } from 'constants/currency';
import TimeRemaining from 'pages/Options/components/TimeRemaining';

import { Rates } from 'queries/rates/useExchangeRatesQuery';

import React from 'react';

import styled from 'styled-components';
import { UsersAssets } from 'types/options';
import { getSynthName } from 'utils/currency';
import { formatCurrencyWithSign } from 'utils/formatters/number';
import Card from '../styled-components/Card';

type MyPositionsProps = {
    exchangeRates: Rates | null;
    positions: UsersAssets[];
};

const MyPositions: React.FC<MyPositionsProps> = ({ exchangeRates, positions }) => {
    return (
        <Container>
            {positions.map((data, index) => (
                <Content key={index}>
                    {data.balances.long > 0 && (
                        <Card>
                            <Card.Column>
                                <Card.Row>
                                    <CurrencyIcon width="40" height="40" currencyKey={data.market.currencyKey} />
                                    <Card.RowTitle>{getSynthName(data.market.currencyKey)}</Card.RowTitle>
                                    <Card.RowSubtitle>{data.market.currencyKey}</Card.RowSubtitle>
                                </Card.Row>
                            </Card.Column>
                            <Card.Column style={{ width: 160 }}>
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
                                    <Card.RowTitle>Time Left</Card.RowTitle>
                                    <Card.RowSubtitle>
                                        <TimeRemaining
                                            end={data.market.maturityDate}
                                            fontSize={14}
                                            showFullCounter={true}
                                        />
                                    </Card.RowSubtitle>
                                </Card.Row>
                                <Card.Row>
                                    <Card.RowTitle>Amount</Card.RowTitle>
                                    <Card.RowSubtitle>
                                        {data.balances.long}
                                        <span style={{ color: '#50CE99', marginLeft: 4 }}>UP</span>{' '}
                                    </Card.RowSubtitle>
                                </Card.Row>
                            </Card.Column>
                        </Card>
                    )}
                    {data.balances.short > 0 && (
                        <Card>
                            <Card.Column>
                                <Card.Row>
                                    <CurrencyIcon width="40" height="40" currencyKey={data.market.currencyKey} />
                                    <Card.RowTitle>{getSynthName(data.market.currencyKey)}</Card.RowTitle>
                                    <Card.RowSubtitle>{data.market.currencyKey}</Card.RowSubtitle>
                                </Card.Row>
                            </Card.Column>
                            <Card.Column style={{ width: 160 }}>
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
                                    <Card.RowTitle>Time Left</Card.RowTitle>
                                    <Card.RowSubtitle>
                                        <TimeRemaining
                                            end={data.market.maturityDate}
                                            fontSize={14}
                                            showFullCounter={true}
                                        />
                                    </Card.RowSubtitle>
                                </Card.Row>
                                <Card.Row>
                                    <Card.RowTitle>Amount</Card.RowTitle>
                                    <Card.RowSubtitle>
                                        {data.balances.short}
                                        <span style={{ color: '#C3244A', marginLeft: 4 }}>DOWN</span>{' '}
                                    </Card.RowSubtitle>
                                </Card.Row>
                            </Card.Column>
                        </Card>
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

export default MyPositions;
