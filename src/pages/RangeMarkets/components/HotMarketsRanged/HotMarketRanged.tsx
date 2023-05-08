import React, { useState } from 'react';
import useInterval from 'hooks/useInterval';

import { USD_SIGN } from 'constants/currency';
import { formatCurrencyWithSign } from 'utils/formatters/number';
import { formatTimeDifference, calculateDifference } from 'utils/formatters/date';

import { useTranslation } from 'react-i18next';
import SPAAnchor from 'components/SPAAnchor';
import { buildRangeMarketLink } from 'utils/routes';
import StyledComponents from './styled-components';
import CurrencyIcon from 'components/Currency/v2/CurrencyIcon';
import styled from 'styled-components';
import { useMatomo } from '@datapunt/matomo-tracker-react';

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
}) => {
    const [time, setTime] = useState(formatTimeDifference(calculateDifference(timeRemaining)));
    const { t } = useTranslation();
    const { trackEvent } = useMatomo();

    useInterval(() => {
        setTime(formatTimeDifference(calculateDifference(timeRemaining)));
    }, 1000);

    return (
        <StyledComponents.Card
            address={address}
            onClick={() => trackEvent({ category: 'RangedMarkets', action: 'click-on-hot-market' })}
        >
            <SPAAnchor href={buildRangeMarketLink(address, assetName.includes('IN') ? 'in' : 'out')}>
                <StyledComponents.AssetInfo>
                    <CurrencyIcon
                        currencyKey={currencyKey}
                        width="45px"
                        height="45px"
                        iconType={assetName.includes('IN') ? 1 : 2}
                    />
                    <StyledComponents.AssetNameContainer>
                        <CurrencyKey>{assetName}</CurrencyKey>
                    </StyledComponents.AssetNameContainer>
                </StyledComponents.AssetInfo>
                <StyledComponents.SectionContainer>
                    <StyledComponents.Header>{t('options.market.ranged-markets.strike-range')}</StyledComponents.Header>
                    <StyledComponents.SubHeader>
                        {`> ${formatCurrencyWithSign(USD_SIGN, leftPrice, 2)}`}
                        <br />
                        {`< ${formatCurrencyWithSign(USD_SIGN, rightPrice, 2)}`}
                    </StyledComponents.SubHeader>
                    {/* <RangeIllustration
                        priceData={{
                            left: leftPrice,
                            right: rightPrice,
                            current: currentAssetPrice,
                        }}
                        marketAddress={address}
                        fontSize={24}
                        maxWidth={65}
                    /> */}
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

const CurrencyKey = styled.span<{ fontSize?: string }>`
    font-family: ${(props) => props.theme.fontFamily};
    font-style: normal;
    display: block;
    font-size: ${(_props) => (_props?.fontSize ? _props.fontSize : '20px')};
    text-transform: uppercase;
    font-weight: 700;
`;

export default HotMarketRanged;
