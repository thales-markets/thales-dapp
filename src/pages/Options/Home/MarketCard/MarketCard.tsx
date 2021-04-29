import CurrencyIcon from 'components/Currency/CurrencyIcon';
import { USD_SIGN } from 'constants/currency';
import MarketSentiment from 'pages/Options/components/MarketSentiment';
import TimeRemaining from 'pages/Options/components/TimeRemaining';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { FlexDivCentered, FlexDivColumn, FlexDivColumnCentered } from 'theme/common';
import { HistoricalOptionsMarketInfo } from 'types/options';

import { formatShortDate } from 'utils/formatters/date';
import { formatCurrencyWithSign } from 'utils/formatters/number';
import { navigateToOptionsMarket } from 'utils/routes';
import snxJSConnector from 'utils/snxJSConnector';
import { PhaseLabel } from '../MarketsTable/components';

const Card = styled(FlexDivColumnCentered)`
    background: linear-gradient(281.48deg, #04045a -16.58%, #141874 97.94%);
    border-radius: 24px;
    color: white;
    width: 368px;
    max-width: 368px;
    margin: 70px 20px 70px 20px;
    cursor: pointer;
`;

const Header = styled(FlexDivCentered)`
    height: 96px;
    border-bottom: 1px solid #748bc6;
    img {
        margin: 24px 24px 24px 24px;
        width: 48px;
        height: 48px;
    }
`;
const Content = styled(FlexDivColumnCentered)`
    height: 195px;
`;
const Footer = styled(FlexDivColumnCentered)`
    height: 67px;
    padding: 0 24px;
`;

const CryptoName = styled.p`
    font-family: Titillium Web;
    font-weight: 600;
    font-size: 20px;
    line-height: 20px;
    letter-spacing: 0.15px;
    color: #ffffff;
    margin-bottom: 4px;
`;
const CryptoKey = styled.p`
    font-family: Inter !important;
    font-weight: 600;
    font-size: 14px;
    line-height: 14px;
    /* identical to box height, or 171% */

    /* State/Light */

    color: #808191;
`;

const CryptoTime = styled.div`
    font-weight: bold;
    font-size: 12px;
    line-height: 24px;
    text-align: center;
    color: #355dff;
    background: #bceaff;
    border-radius: 20px;
    margin-right: 18px;
    height: 24px;
    min-width: 95px;
    padding: 0 6px;
`;

const Price = styled.p`
    margin: 0;
    margin-top: 18px !important;
    text-align: center;
    font-weight: bold;
    font-size: 31px;
    line-height: 48px;
    letter-spacing: 0.25px;
    color: #f6f6fe;
`;
const ExpireDate = styled.p`
    margin: 0;
    margin-bottom: 30px !important;
    text-align: center;
    font-weight: 600;
    font-size: 20px;
    line-height: 20px;
    letter-spacing: 0.15px;
    color: #f6f6fe;
`;

const Phase = styled(PhaseLabel)`
    font-size: 12px;
    height: 24px;
    padding: 0;
    margin-right: 18px;
    margin-bottom: 4px;
    flex: 1;
`;

type MarketCardPros = {
    optionMarket: HistoricalOptionsMarketInfo;
};

const MarketCard: React.FC<MarketCardPros> = ({ optionMarket }) => {
    const { t } = useTranslation();
    return (
        <Card
            onClick={() => {
                if (optionMarket.phase !== 'expiry') {
                    navigateToOptionsMarket(optionMarket.address);
                }
            }}
        >
            <Header>
                <CurrencyIcon currencyKey={optionMarket.currencyKey} />
                <FlexDivColumnCentered>
                    <CryptoName>{snxJSConnector.synthsMap[optionMarket.currencyKey]?.description}</CryptoName>
                    <CryptoKey>{optionMarket.currencyKey}</CryptoKey>
                </FlexDivColumnCentered>
                <FlexDivColumn>
                    <Phase className={optionMarket.phase}>{t(`options.phases.${optionMarket.phase}`)}</Phase>
                    <CryptoTime>
                        <TimeRemaining end={optionMarket.timeRemaining}></TimeRemaining>
                    </CryptoTime>
                </FlexDivColumn>
            </Header>
            <Content>
                <Price>{formatCurrencyWithSign(USD_SIGN, optionMarket.strikePrice)}</Price>
                <ExpireDate>{t('common.by-date', { date: formatShortDate(optionMarket.maturityDate) })}</ExpireDate>
            </Content>
            <Footer>
                <MarketSentiment long={optionMarket.longPrice} short={optionMarket.shortPrice}></MarketSentiment>
            </Footer>
        </Card>
    );
};

export default MarketCard;
