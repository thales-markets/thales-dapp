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
import { getSynthName } from 'utils/snxJSConnector';
import { PhaseLabel } from '../MarketsTable/components';

type MarketCardPros = {
    optionMarket: HistoricalOptionsMarketInfo;
};

const MarketCard: React.FC<MarketCardPros> = ({ optionMarket }) => {
    const { t } = useTranslation();
    return (
        <Card
            id="market-card"
            onClick={() => {
                if (optionMarket.phase !== 'expiry') {
                    navigateToOptionsMarket(optionMarket.address);
                }
            }}
        >
            <Header>
                <CurrencyIcon currencyKey={optionMarket.currencyKey} />
                <FlexDivColumnCentered>
                    <CryptoName>{getSynthName(optionMarket.currencyKey)}</CryptoName>
                    <CryptoKey>{optionMarket.asset}</CryptoKey>
                </FlexDivColumnCentered>
                <FlexDivColumn style={{ paddingRight: 20, maxWidth: 130 }}>
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
            <Footer className="footer">
                <MarketSentiment long={optionMarket.longPrice} short={optionMarket.shortPrice}></MarketSentiment>
                <ViewMarket className="view-market">View Market</ViewMarket>
            </Footer>
        </Card>
    );
};

const Card = styled(FlexDivColumnCentered)`
    position: relative;
    background: linear-gradient(281.48deg, #04045a -16.58%, #141874 97.94%);
    border-radius: 24px;
    color: white;
    min-width: 300px;
    max-width: 320px;
    margin: 50px 20px 50px 20px;
    cursor: pointer;
    &:hover {
        .footer {
            padding: 0;
            .sentiment {
                display: none;
            }
            .view-market {
                display: flex;
                align-items: center;
                justify-content: center;
            }
        }
        &:after {
            position: absolute;
            top: 0;
            left: 0;
            content: '';
            width: 100%;
            height: 100%;
            background: rgba(31, 31, 31, 0.4);
            border-radius: 24px;
        }
    }
`;

const Header = styled(FlexDivCentered)`
    height: 75px;
    border-bottom: 1px solid #748bc6;

    img,
    svg {
        margin: 20px;
        width: 36px;
        height: 36px;
    }
`;
const Content = styled(FlexDivColumnCentered)`
    height: 195px;
`;
const Footer = styled(FlexDivColumnCentered)`
    position: relative;
    min-height: 67px;
    padding: 0 24px;
`;

const ViewMarket = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;
    background: #44e1e2;
    border-radius: 0px 0px 24px 24px;
    height: 67px;
    width: 100%;
    font-weight: bold;
    font-size: 20px;
    line-height: 32px;
    text-align: center;
    letter-spacing: 0.5px;
    color: #f6f6fe;
    display: none;
`;

const CryptoName = styled.p`
    font-family: Titillium Web;
    font-weight: 600;
    font-size: 16px;
    line-height: 16px;
    letter-spacing: 0.15px;
    color: #ffffff;
    margin-bottom: 4px;
`;
const CryptoKey = styled.p`
    font-family: Inter !important;
    font-weight: 600;
    font-size: 14px;
    line-height: 14px;
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
    height: 24px;
    min-width: 70px;
    padding: 0 6px;
`;

const Price = styled.p`
    margin: 0;
    margin-top: 18px !important;
    text-align: center;
    font-weight: bold;
    font-size: 24px;
    line-height: 30px;

    letter-spacing: 0.25px;
    color: #f6f6fe;
`;
const ExpireDate = styled.p`
    margin: 0;
    text-align: center;
    font-weight: 600;
    font-size: 16px;
    line-height: 16px;
    margin-bottom: 16px !important;

    letter-spacing: 0.15px;
    color: #f6f6fe;
`;

const Phase = styled(PhaseLabel)`
    font-size: 12px;
    height: 24px;
    padding: 0 !important;
    flex: 1;
    margin-bottom: 4px;
    min-width: 70px;
    width: 100%;
`;

export default MarketCard;
