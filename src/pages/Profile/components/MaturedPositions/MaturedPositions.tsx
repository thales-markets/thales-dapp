import PriceChart from 'components/Charts/PriceChart';
import CurrencyIcon from 'components/Currency/v2/CurrencyIcon';
import { USD_SIGN } from 'constants/currency';
import TimeRemaining from 'pages/Options/components/TimeRemaining';
import useBinaryOptionsMarketsQuery from 'queries/options/useBinaryOptionsMarketsQuery';
import useExchangeRatesMarketDataQuery from 'queries/rates/useExchangeRatesMarketDataQuery';
import useMaturedPositions from 'queries/user/useMaturedPositions';
import React from 'react';
import { useSelector } from 'react-redux';
import { getIsAppReady } from 'redux/modules/app';
import { getNetworkId, getWalletAddress } from 'redux/modules/wallet';
import { RootState } from 'redux/rootReducer';
import styled from 'styled-components';
import { getSynthName } from 'utils/currency';
import { formatCurrencyWithSign } from 'utils/formatters/number';
import Card from '../styled-components/Card';

const MaturedPositions: React.FC = () => {
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state));
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));

    const marketsQuery = useBinaryOptionsMarketsQuery(networkId, { enabled: isAppReady });

    const markets = marketsQuery.isSuccess ? marketsQuery.data : undefined;

    const userPositionsQuery = useMaturedPositions(networkId, walletAddress as any, {
        enabled: markets !== undefined && walletAddress !== null,
    });

    const positions = userPositionsQuery.isSuccess ? userPositionsQuery.data : [];

    const exchangeRatesMarketDataQuery = useExchangeRatesMarketDataQuery(networkId, markets as any, {
        enabled: isAppReady && markets !== undefined && markets?.length > 0,
        refetchInterval: false,
    });
    const exchangeRates = exchangeRatesMarketDataQuery.isSuccess ? exchangeRatesMarketDataQuery.data ?? null : null;

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

export default MaturedPositions;
