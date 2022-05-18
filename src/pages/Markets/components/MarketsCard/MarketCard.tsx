/* tslint:disable:no-unused-variable */
import React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

import { HistoricalOptionsMarketInfo } from 'types/options';
import { Rates } from 'queries/rates/useExchangeRatesQuery';

import CurrencyIcon from 'components/Currency/v2/CurrencyIcon';
import PriceChart from 'components/Charts/PriceChart';
import { FlexDivColumn } from 'theme/common';

import { formatCurrencyWithSign, getPercentageDifference } from 'utils/formatters/number';
import { formatShortDate } from 'utils/formatters/date';
// import { getSynthName } from 'utils/currency';
import { currencyKeyToDataFeedSourceMap, USD_SIGN } from 'constants/currency';
import PhaseComponent from 'components/Phase/Phase';
import Tooltip from 'components/Tooltip';

type MarketCardPros = {
    exchangeRates: Rates | null;
    optionMarket: HistoricalOptionsMarketInfo;
    marketCardStyle?: {
        maxWidth?: string;
        wrapperMargin?: string;
    };
};

const MarketCard: React.FC<MarketCardPros> = ({ optionMarket, exchangeRates, marketCardStyle }) => {
    const { t } = useTranslation();
    const currentAssetPrice = exchangeRates?.[optionMarket?.currencyKey] || 0;
    const strikeAndAssetPriceDifference = getPercentageDifference(currentAssetPrice, optionMarket?.strikePrice);

    return (
        <>
            {optionMarket && (
                <MarketCardWrapper maxWidth={marketCardStyle?.maxWidth} margin={marketCardStyle?.wrapperMargin}>
                    <InsideContainer style={{ alignItems: 'start' }}>
                        <LeftContainer>
                            <AssetContainer>
                                <CurrencyIcon currencyKey={optionMarket.currencyKey} width="50px" height="50px" />
                                <AssetNameContainer>
                                    <CurrencyKey>
                                        {optionMarket.asset}
                                        {currencyKeyToDataFeedSourceMap[optionMarket.currencyKey]?.source == 'TWAP' && (
                                            <Tooltip
                                                message={t('options.home.markets-table.twap-tooltip')}
                                                link={currencyKeyToDataFeedSourceMap[optionMarket.currencyKey]?.link}
                                                type={'info'}
                                                iconColor={'var(--primary-color)'}
                                                container={{ width: '15px' }}
                                                interactive={true}
                                            />
                                        )}
                                    </CurrencyKey>
                                    <MarketStatus>
                                        <PhaseComponent phase={optionMarket.phase}></PhaseComponent>
                                    </MarketStatus>
                                </AssetNameContainer>
                            </AssetContainer>
                        </LeftContainer>
                        <RightContainer>
                            <LightHeaderText>{t('options.home.market-card.current-asset-price')}</LightHeaderText>
                            <StrongHeaderText>
                                {currentAssetPrice ? formatCurrencyWithSign(USD_SIGN, currentAssetPrice) : 'N/A'}
                            </StrongHeaderText>
                        </RightContainer>
                    </InsideContainer>
                    <InsideContainer style={{ flex: 2, alignItems: 'flex-end' }}>
                        <LeftContainer>
                            <PriceChart
                                key={optionMarket.currencyKey}
                                currencyKey={optionMarket.currencyKey}
                                height={75}
                                isAnimationActive={false}
                            />
                        </LeftContainer>
                        <RightContainer>
                            <FlexDivColumn>
                                <LightHeaderText>
                                    {`${t('options.home.market-card.strike-price')}`}
                                    <PriceDifferenceInfo priceDiff={currentAssetPrice - optionMarket.strikePrice}>
                                        {`${strikeAndAssetPriceDifference.toFixed(2)}%`}
                                    </PriceDifferenceInfo>
                                </LightHeaderText>
                                <StrongHeaderText style={{ marginBottom: '10px' }}>
                                    {formatCurrencyWithSign(USD_SIGN, optionMarket.strikePrice)}
                                </StrongHeaderText>
                                <LightHeaderText>{t('options.home.market-card.end-date')}</LightHeaderText>
                                <StrongHeaderText>{formatShortDate(optionMarket.maturityDate)}</StrongHeaderText>
                            </FlexDivColumn>
                        </RightContainer>
                    </InsideContainer>
                </MarketCardWrapper>
            )}
        </>
    );
};

export const MarketCardWrapper = styled.div<{ maxWidth?: string; margin?: string }>`
    display: flex;
    flex-direction: column;
    max-width: ${(_props) => (_props?.maxWidth ? _props?.maxWidth : '390px')};
    min-width: 360px;
    border: 2px solid rgba(100, 217, 254, 0.5);
    box-sizing: border-box;
    border-radius: 15px;
    padding: 31px 10px 31px 31px;
    margin: ${(_props) => (_props?.margin ? _props.margin : '7.5px')};
    flex: 1;
    :hover {
        transform: scale(1.02);
        border: 2px solid rgb(100, 217, 254, 1);
    }
    cursor: pointer;
    @media (max-width: 768px) {
        min-width: 100%;
    }
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
    flex: 1;
    width: 50%;
`;

const RightContainer = styled.div`
    display: block;
    margin-left: 20px;
    flex: 1;
    width: 50%;
`;

export const AssetContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: start;
    // align-items: center;
`;

export const AssetNameContainer = styled.div`
    display: flex;
    justify-content: center;
    flex-direction: column;
    text-align: left;
    font-size: 15px;
    color: var(--primary-color) !important;
`;

export const AssetName = styled.span`
    font-family: Roboto !important;
    font-style: normal;
    display: block;
    font-weight: 300;
    font-size: 15px;
    text-transform: uppercase;
    line-height: 110%;
`;

export const CurrencyKey = styled.span<{ alignSelf?: string }>`
    display: flex;
    flex-direction: row;
    ${(_props) => (_props?.alignSelf ? `align-self: ${_props?.alignSelf}` : '')};
    font-family: Roboto !important;
    font-style: normal;
    font-size: 20px;
    text-transform: uppercase;
    font-weight: 700;
`;

export const MarketStatus = styled.span`
    font-family: Roboto !important;
    font-style: normal;
    font-size: 7px;
    display: block;
    line-height: 18px;
`;

export const LightHeaderText = styled.span`
    display: flex;
    flex-direction: row;
    color: var(--primary-color);
    font-family: Roboto !important;
    font-style: normal;
    line-height: 110%;
    font-size: 14px;
`;

export const StrongHeaderText = styled(LightHeaderText)<{ color?: string }>`
    ${(_props) => (_props?.color ? `color: ${_props.color};` : '')}
    font-size: 25px;
    font-weight: 700;
`;

const PriceDifferenceInfo = styled.span<{ priceDiff: number }>`
    ${(_props) => (_props.priceDiff > 0 ? 'color: #50CE99' : 'color: #C3244A')};
    margin-left: 5px;
    font-size: 15px;
    font-family: Roboto !important;
    font-style: normal;
`;

export default MarketCard;
