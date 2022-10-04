import React, { useState } from 'react';
import useInterval from 'hooks/useInterval';
import CurrencyIcon from 'components/Currency/v2/CurrencyIcon';

import { USD_SIGN } from 'constants/currency';
import { formatCurrencyWithSign } from 'utils/formatters/number';
import { formatTimeDifference, calculateDifference } from 'utils/formatters/date';

import { useTranslation } from 'react-i18next';
import SPAAnchor from 'components/SPAAnchor';
import { buildOptionsMarketLink } from 'utils/routes';
import StyledComponents from './styled-components';
import styled from 'styled-components';
import { HotMarket } from 'types/options';
import { useMatomo } from '@datapunt/matomo-tracker-react';

const HotMarketCard: React.FC<HotMarket> = ({
    currencyKey,
    assetName,
    pricePerOption,
    strikePrice,
    timeRemaining,
    potentialProfit,
    discount,
    address,
}) => {
    const [time, setTime] = useState(formatTimeDifference(calculateDifference(timeRemaining)));
    const { t } = useTranslation();
    const { trackEvent } = useMatomo();

    useInterval(() => {
        setTime(formatTimeDifference(calculateDifference(timeRemaining)));
    }, 1000);

    console.log(potentialProfit);

    return (
        <StyledComponents.Card
            address={address}
            onClick={() =>
                trackEvent({
                    category: 'Markets',
                    action: 'click-on-hot-market',
                })
            }
        >
            <SPAAnchor href={buildOptionsMarketLink(address)}>
                <StyledComponents.AssetInfo>
                    <CurrencyIcon currencyKey={currencyKey} width="45px" height="45px" />
                    <StyledComponents.AssetNameContainer>
                        <CurrencyKey>{assetName}</CurrencyKey>
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

                <StyledComponents.Footer>
                    <StyledComponents.Discount>{discount}%</StyledComponents.Discount>
                    <StyledComponents.DiscountText>Discounted</StyledComponents.DiscountText>
                </StyledComponents.Footer>
            </SPAAnchor>
        </StyledComponents.Card>
    );
};

const CurrencyKey = styled.span<{ fontSize?: string }>`
    font-family: Titillium Regular !important;
    font-style: normal;
    display: block;
    font-size: ${(_props) => (_props?.fontSize ? _props.fontSize : '20px')};
    text-transform: uppercase;
    font-weight: 700;
`;

export default HotMarketCard;
