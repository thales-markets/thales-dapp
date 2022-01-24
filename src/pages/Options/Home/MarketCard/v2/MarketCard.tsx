import React from 'react';
import styled from 'styled-components';

import { HistoricalOptionsMarketInfo } from 'types/options';
import { Rates } from 'queries/rates/useExchangeRatesQuery';

import CurrencyIcon from 'components/Currency/v2/CurrencyIcon';
import PriceChart from 'components/Charts/PriceChart';

type MarketCardPros = {
    exchangeRates?: Rates | null;
    optionMarket?: HistoricalOptionsMarketInfo;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const MarketCard: React.FC<MarketCardPros> = () => {
    return (
        <MarketCardWrapper>
            <InsideContainer style={{ alignItems: 'start' }}>
                <LeftContainer>
                    <AssetContainer>
                        <CurrencyIcon currencyKey="BTC" width="50px" height="50px" />
                        <AssetNameContainer>
                            <AssetName>Ethereum</AssetName>
                            <CurrencyKey>ETH</CurrencyKey>
                            <MarketStatus>operational</MarketStatus>
                        </AssetNameContainer>
                    </AssetContainer>
                </LeftContainer>
                <RightContainer>
                    <LightHeaderText>Current Asset Price</LightHeaderText>
                    <StrongText>$3,256.98</StrongText>
                </RightContainer>
            </InsideContainer>
            <InsideContainer>
                <LeftContainer>
                    <LightHeaderText>Strike Price</LightHeaderText>
                    <StrongHeaderText>$30,333.00</StrongHeaderText>
                </LeftContainer>
                <RightContainer>
                    <LightHeaderText>Difference between current and strike price:</LightHeaderText>
                    <StrongText>+ 6.48%</StrongText>
                </RightContainer>
            </InsideContainer>
            <InsideContainer style={{ alignItems: 'end' }}>
                <LeftContainer>
                    <LightHeaderText>End Date</LightHeaderText>
                    <StrongHeaderText>Jan 29, 2022</StrongHeaderText>
                </LeftContainer>
                <RightContainer>
                    <PriceChart coin={'thales'} />
                </RightContainer>
            </InsideContainer>
        </MarketCardWrapper>
    );
};

const MarketCardWrapper = styled.div`
    display: flex;
    flex-direction: column;
    max-width: 390px;
    border: 2px solid #64d9fe;
    box-sizing: border-box;
    border-radius: 15px;
    padding: 31px;
`;

const InsideContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    flex: 1;
`;

const LeftContainer = styled.div`
    display: block;
    margin-right: 41px;
    flex: 1;
`;

const RightContainer = styled.div`
    display: block;
    flex: 1;
`;

const AssetContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: start;
    // align-items: center;
`;

const AssetNameContainer = styled.div`
    display: block;
    text-align: left;

    font-size: 15px;
    color: var(--primary-color) !important;
`;

const AssetName = styled.span`
    font-family: Titillium Regular !important;
    font-style: normal;
    display: block;
    font-weight: 300;
    text-transform: uppercase;
`;

const CurrencyKey = styled.span`
    font-family: Titillium Regular !important;
    font-style: normal;
    display: block;
    text-transform: uppercase;
    font-weight: 700;
`;

const MarketStatus = styled.span`
    font-family: Titillium Regular !important;
    font-style: normal;
    font-size: 7px;
    display: block;
`;

const LightHeaderText = styled.span`
    color: var(--primary-color);
    display: block;
    font-family: Titillium Regular !important;
    font-style: normal;
    line-height: 110%;
    font-size: 15px;
`;

const StrongHeaderText = styled(LightHeaderText)`
    font-size: 25px;
`;

const StrongText = styled(LightHeaderText)`
    font-weight: 700;
`;

export default MarketCard;
