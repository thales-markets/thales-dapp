import React, { useState } from 'react';
import useInterval from 'hooks/useInterval';
import { CurrencyKey } from './MarketCard';
import CurrencyIcon from 'components/Currency/v2/CurrencyIcon';

import { USD_SIGN } from 'constants/currency';
import { formatCurrencyWithSign } from 'utils/formatters/number';
import { formatTimeDifference, calculateDifference } from 'utils/formatters/date';

import { useTranslation } from 'react-i18next';
import SPAAnchor from 'components/SPAAnchor';
import { buildOptionsMarketLink } from 'utils/routes';
import StyledComponents from './styled-components';

export type HotMarket = {
    fullAssetName?: string;
    currencyKey: string;
    assetName: string;
    pricePerOption: number;
    strikePrice: string;
    timeRemaining: number;
    potentialProfit: string;
    address: string;
};

const HotMarketCard: React.FC<HotMarket> = ({
    currencyKey,
    assetName,
    pricePerOption,
    strikePrice,
    timeRemaining,
    potentialProfit,
    address,
}) => {
    const [time, setTime] = useState(formatTimeDifference(calculateDifference(timeRemaining)));
    const { t } = useTranslation();

    useInterval(() => {
        setTime(formatTimeDifference(calculateDifference(timeRemaining)));
    }, 1000);

    return (
        <StyledComponents.Card address={address}>
            <SPAAnchor href={buildOptionsMarketLink(address)}>
                <StyledComponents.AssetInfo>
                    <CurrencyIcon currencyKey={currencyKey} width="45px" height="45px" />
                    <StyledComponents.AssetNameContainer>
                        <CurrencyKey alignSelf={'center'}>{assetName}</CurrencyKey>
                    </StyledComponents.AssetNameContainer>
                </StyledComponents.AssetInfo>
                <StyledComponents.SectionContainer>
                    <StyledComponents.Header>{t('options.home.hot-market-card.strike-price')}</StyledComponents.Header>
                    <StyledComponents.SubHeader>{strikePrice}</StyledComponents.SubHeader>
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

export default HotMarketCard;
