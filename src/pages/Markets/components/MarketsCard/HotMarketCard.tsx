import React, { useState } from 'react';
import styled from 'styled-components';
import useInterval from 'hooks/useInterval';

import { MarketCardContainer } from 'theme/common';
import { CurrencyKey } from './MarketCard';
import CurrencyIcon from 'components/Currency/v2/CurrencyIcon';

import { USD_SIGN } from 'constants/currency';
import { formatCurrencyWithSign } from 'utils/formatters/number';
import { formatTimeDifference, calculateDifference } from 'utils/formatters/date';

import { useTranslation } from 'react-i18next';
import SPAAnchor from 'components/SPAAnchor';
import { buildOptionsMarketLink } from 'utils/routes';

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
        <Card address={address}>
            <SPAAnchor href={buildOptionsMarketLink(address)}>
                <AssetInfo>
                    <CurrencyIcon currencyKey={currencyKey} width="45px" height="45px" />
                    <AssetNameContainer>
                        <CurrencyKey alignSelf={'center'}>{assetName}</CurrencyKey>
                    </AssetNameContainer>
                </AssetInfo>
                <SectionContainer>
                    <Header>{t('options.home.hot-market-card.strike-price')}</Header>
                    <SubHeader>{strikePrice}</SubHeader>
                </SectionContainer>
                <SectionContainer>
                    <Header>{t('options.home.hot-market-card.price-per-option')}</Header>
                    <SubHeader>
                        {pricePerOption != 0 ? formatCurrencyWithSign(USD_SIGN, pricePerOption, 2) : 'N/A'}
                    </SubHeader>
                </SectionContainer>
                <SectionContainer>
                    <Header>{t('options.home.hot-market-card.time-left')}</Header>
                    <SubHeader>{time}</SubHeader>
                </SectionContainer>
                <SectionContainer>
                    <Header style={{ color: '#50ce99' }}>{t('options.home.hot-market-card.potential-profit')}</Header>
                    <Percentage>{potentialProfit}</Percentage>
                </SectionContainer>
            </SPAAnchor>
        </Card>
    );
};

const Card = styled(MarketCardContainer)<{ address?: string }>`
    padding: 15px 20px;
    width: 195px;
    height: 340px;
    display: flex;
    border-radius: 15px;
    margin: 7.5px;
    background-color: var(--background);
    flex-direction: column;
    &:hover {
        box-shadow: var(--shadow);
    }
`;

const SectionContainer = styled.div`
    display: block;
    margin-bottom: 15px;
`;

const AssetInfo = styled.div`
    display: flex;
    flex-direction: row;
    margin-bottom: 12px;
    margin-right: -5px;
    margin-left: -5px;
`;

const CardText = styled.span`
    display: block;
    font-family: Roboto !important;
    color: var(--primary-color);
`;

const Header = styled(CardText)`
    font-size: 20px;
    font-weight: 300;
    text-transform: capitalize;
`;

const SubHeader = styled(CardText)`
    font-size: 25px;
    font-weight: 400;
`;

const Percentage = styled(CardText)`
    font-size: 25px;
    font-weight: 700;
    color: #50ce99;
`;

const AssetNameContainer = styled.div`
    display: flex;
    justify-content: center;
    flex-direction: column;
    text-align: left;
    font-size: 15px;
    color: var(--primary-color) !important;
    /* word-spacing: 50px; */
`;

export default HotMarketCard;
