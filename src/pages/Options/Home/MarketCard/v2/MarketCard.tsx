/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

// import { useSelector } from 'react-redux';
// import { RootState } from 'redux/rootReducer';
// import { getNetworkId } from 'redux/modules/wallet';

import { HistoricalOptionsMarketInfo } from 'types/options';
import { Rates } from 'queries/rates/useExchangeRatesQuery';

import CurrencyIcon from 'components/Currency/v2/CurrencyIcon';
import PriceChart from 'components/Charts/PriceChart';

import { formatCurrencyWithSign, getPercentageDifference } from 'utils/formatters/number';
import { formatShortDate } from 'utils/formatters/date';
import { getSynthName } from 'utils/currency';
import { USD_SIGN, currencyKeyToCoinGeckoIndexMap } from 'constants/currency';

type MarketCardPros = {
    exchangeRates: Rates | null;
    optionMarket: HistoricalOptionsMarketInfo;
};

type StrongTextProps = {
    percentage?: number;
};

const MarketCard: React.FC<MarketCardPros> = ({ optionMarket, exchangeRates }) => {
    const { t } = useTranslation();
    // const networkId = useSelector((state: RootState) => getNetworkId(state));
    const currentAssetPrice = exchangeRates?.[optionMarket?.currencyKey] || 0;
    const strikeAndAssetPriceDifference = getPercentageDifference(currentAssetPrice, optionMarket?.strikePrice);

    return (
        <>
            {optionMarket && (
                <MarketCardWrapper>
                    <InsideContainer style={{ alignItems: 'start' }}>
                        <LeftContainer>
                            <AssetContainer>
                                <CurrencyIcon currencyKey={optionMarket.currencyKey} width="50px" height="50px" />
                                <AssetNameContainer>
                                    <AssetName>{getSynthName(optionMarket.currencyKey)}</AssetName>
                                    <CurrencyKey>{optionMarket.asset}</CurrencyKey>
                                    <MarketStatus>operational</MarketStatus>
                                </AssetNameContainer>
                            </AssetContainer>
                        </LeftContainer>
                        <RightContainer>
                            <LightHeaderText>{t('options.home.market-card.current-asset-price')}</LightHeaderText>
                            <StrongText>
                                {currentAssetPrice ? formatCurrencyWithSign(USD_SIGN, currentAssetPrice) : 'N/A'}
                            </StrongText>
                        </RightContainer>
                    </InsideContainer>
                    <InsideContainer>
                        <LeftContainer>
                            <LightHeaderText>{t('options.home.market-card.strike-price')}:</LightHeaderText>
                            <StrongHeaderText>
                                {formatCurrencyWithSign(USD_SIGN, optionMarket.strikePrice)}
                            </StrongHeaderText>
                        </LeftContainer>
                        <RightContainer>
                            <LightHeaderText>{t('options.home.market-card.difference-text')}:</LightHeaderText>
                            <StrongText percentage={strikeAndAssetPriceDifference}>
                                {strikeAndAssetPriceDifference.toFixed(2)}%
                            </StrongText>
                        </RightContainer>
                    </InsideContainer>
                    <InsideContainer style={{ alignItems: 'end' }}>
                        <LeftContainer>
                            <LightHeaderText>{t('options.home.market-card.end-date')}</LightHeaderText>
                            <StrongHeaderText>{formatShortDate(optionMarket.maturityDate)}</StrongHeaderText>
                        </LeftContainer>
                        <RightContainer>
                            <PriceChart
                                key={optionMarket.currencyKey}
                                coin={currencyKeyToCoinGeckoIndexMap[optionMarket.currencyKey]}
                            />
                        </RightContainer>
                    </InsideContainer>
                </MarketCardWrapper>
            )}
        </>
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
    margin: 7.5px;
    flex: 1 0 30%;
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
    margin-right: 30px;
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
    font-size: 15px;
    text-transform: uppercase;
    line-height: 110%;
`;

const CurrencyKey = styled.span`
    font-family: Titillium Regular !important;
    font-style: normal;
    display: block;
    font-size: 20px;
    text-transform: uppercase;
    font-weight: 700;
`;

const MarketStatus = styled.span`
    font-family: Titillium Regular !important;
    font-style: normal;
    font-size: 7px;
    display: block;
    line-height: 18px;
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
    font-weight: 700;
`;

const StrongText = styled(LightHeaderText)<StrongTextProps>`
    font-weight: 700;
    ${(props: StrongTextProps) =>
        props?.percentage ? (props.percentage > 0 ? 'color: #50CE99' : 'color: #C3244A') : ''};
`;

export default MarketCard;
