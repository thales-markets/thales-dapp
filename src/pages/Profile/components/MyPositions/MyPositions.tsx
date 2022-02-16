import PriceChart from 'components/Charts/PriceChart';
import CurrencyIcon from 'components/Currency/v2/CurrencyIcon';
import { USD_SIGN } from 'constants/currency';
import TimeRemaining from 'pages/Options/components/TimeRemaining';
import useBinaryOptionsMarketsQuery from 'queries/options/useBinaryOptionsMarketsQuery';
import useExchangeRatesMarketDataQuery from 'queries/rates/useExchangeRatesMarketDataQuery';
import useUserAssetsBalanceQuery from 'queries/user/useUserAssetsBalanceQuery';
import React from 'react';
import { useSelector } from 'react-redux';
import { getIsAppReady } from 'redux/modules/app';
import { getNetworkId, getWalletAddress } from 'redux/modules/wallet';
import { RootState } from 'redux/rootReducer';
import styled from 'styled-components';
import { getSynthName } from 'utils/currency';
import { formatCurrencyWithSign } from 'utils/formatters/number';

const MyPositions: React.FC = () => {
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state));
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));

    const marketsQuery = useBinaryOptionsMarketsQuery(networkId, { enabled: isAppReady });

    const markets = marketsQuery.isSuccess ? marketsQuery.data : undefined;

    const userPositionsQuery = useUserAssetsBalanceQuery(networkId, markets as any, walletAddress as any, {
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
                <Card key={index}>
                    <CardColumn>
                        <SectionContainer>
                            <CurrencyIcon width="40" height="40" currencyKey={data.market.currencyKey} />
                            <Header>{getSynthName(data.market.currencyKey)}</Header>
                            <SubHeader>{data.market.currencyKey}</SubHeader>
                        </SectionContainer>
                    </CardColumn>
                    <CardColumn style={{ width: 160 }}>
                        <PriceChart
                            containerStyle={{ margin: 'auto' }}
                            currencyKey={data.market.currencyKey}
                            showFooter
                        />
                    </CardColumn>
                    <CardColumn>
                        <SectionContainer>
                            <Header>Current Asset Price</Header>
                            <SubHeader>
                                {formatCurrencyWithSign(USD_SIGN, exchangeRates?.[data.market.currencyKey] || 0)}
                            </SubHeader>
                        </SectionContainer>
                        <SectionContainer>
                            <Header>Strike Price</Header>
                            <SubHeader>{formatCurrencyWithSign(USD_SIGN, data.market.strikePrice)}</SubHeader>
                        </SectionContainer>
                    </CardColumn>
                    <CardColumn>
                        <SectionContainer>
                            <Header>Time Left</Header>
                            <SubHeader>
                                <TimeRemaining end={data.market.timestamp} fontSize={14} showFullCounter={true} />
                            </SubHeader>
                        </SectionContainer>
                        <SectionContainer>
                            <Header>Amount</Header>
                            <SubHeader>{data.balances.long}UP</SubHeader>
                        </SectionContainer>
                    </CardColumn>
                </Card>
            ))}
        </Container>
    );
};

const Container = styled.div`
    display: flex;
    flex-direction: column;
    padding-top: 15px;
`;

const Card = styled.div`
    background: #04045a;
    border: 2px solid rgba(100, 217, 254, 0.5);
    box-sizing: border-box;
    border-radius: 15px;
    padding: 24px 50px;
    display: flex;
    justify-content: space-between;
    margin-bottom: 15px;
    min-height: 143px;
`;
const CardColumn = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: space-between;
`;

const CardText = styled.span`
    display: block;
    font-family: Titillium Light !important;
    color: var(--primary-color);
`;

const SectionContainer = styled.div`
    display: block;
`;

const Header = styled(CardText)`
    font-size: 15px;
    font-weight: 400;
    text-transform: capitalize;
`;

const SubHeader = styled(CardText)`
    font-size: 25px;
    font-weight: 700;
`;

export default MyPositions;
