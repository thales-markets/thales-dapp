import React, { useState } from 'react';
import useInterval from 'hooks/useInterval';
import CurrencyIcon from 'components/Currency/v2/CurrencyIcon';

import { USD_SIGN } from 'constants/currency';
import { formatCurrencyWithSign } from 'utils/formatters/number';
import { formatTimeDifference, calculateDifference } from 'utils/formatters/date';

import { useTranslation } from 'react-i18next';
import SPAAnchor from 'components/SPAAnchor';
import { buildRangeMarketLink } from 'utils/routes';
import StyledComponents from './styled-components';
import { CurrencyKey } from 'pages/Markets/components/MarketsCard/MarketCard';
import RangeIllustration from 'pages/AMMTrading/components/RangeIllustration';

export type HotRangedMarket = {
    fullAssetName?: string;
    currencyKey: string;
    assetName: string;
    pricePerOption: number;
    leftPrice: number;
    rightPrice: number;
    currentAssetPrice: number;
    strikePrice: string;
    timeRemaining: number;
    potentialProfit: string;
    address: string;
};

const HotMarketRanged: React.FC<HotRangedMarket> = ({
    currencyKey,
    assetName,
    pricePerOption,
    timeRemaining,
    potentialProfit,
    address,
    leftPrice,
    rightPrice,
    currentAssetPrice,
}) => {
    console.log('data: ', leftPrice, rightPrice, currentAssetPrice);
    const [time, setTime] = useState(formatTimeDifference(calculateDifference(timeRemaining)));
    const { t } = useTranslation();

    useInterval(() => {
        setTime(formatTimeDifference(calculateDifference(timeRemaining)));
    }, 1000);

    return (
        <StyledComponents.Card address={address}>
            <SPAAnchor href={buildRangeMarketLink(address)}>
                <StyledComponents.AssetInfo>
                    <CurrencyIcon currencyKey={currencyKey} width="45px" height="45px" />
                    <StyledComponents.AssetNameContainer>
                        <CurrencyKey alignSelf={'center'}>{assetName}</CurrencyKey>
                    </StyledComponents.AssetNameContainer>
                </StyledComponents.AssetInfo>
                <StyledComponents.SectionContainer>
                    <RangeIllustration
                        priceData={{
                            left: leftPrice,
                            right: rightPrice,
                            current: currentAssetPrice,
                        }}
                        marketAddress={address}
                        fontSize={24}
                        maxWidth={65}
                    />
                </StyledComponents.SectionContainer>
                <StyledComponents.SectionContainer>
                    <StyledComponents.Header>
                        {t('options.home.hot-market-card.price-per-option')}
                    </StyledComponents.Header>
                    <StyledComponents.SubHeader>
                        {pricePerOption != 0 ? formatCurrencyWithSign(USD_SIGN, pricePerOption, 2) : 'N/A'}
                    </StyledComponents.SubHeader>
                </StyledComponents.SectionContainer>
                <StyledComponents.SectionContainer>
                    <StyledComponents.Header>{t('options.home.hot-market-card.time-left')}</StyledComponents.Header>
                    <StyledComponents.SubHeader>{time}</StyledComponents.SubHeader>
                </StyledComponents.SectionContainer>
                <StyledComponents.SectionContainer>
                    <StyledComponents.Header style={{ color: '#50ce99' }}>
                        {t('options.home.hot-market-card.potential-profit')}
                    </StyledComponents.Header>
                    <StyledComponents.Percentage>{potentialProfit}</StyledComponents.Percentage>
                </StyledComponents.SectionContainer>
            </SPAAnchor>
        </StyledComponents.Card>
    );
};

export default HotMarketRanged;
