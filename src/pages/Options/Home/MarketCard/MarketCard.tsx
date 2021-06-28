import CurrencyIcon from 'components/Currency/CurrencyIcon';
import { FIAT_CURRENCY_MAP } from 'constants/currency';
import TimeRemaining from 'pages/Options/components/TimeRemaining';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { FlexDivCentered, FlexDivColumn, FlexDivColumnCentered } from 'theme/common';
import { HistoricalOptionsMarketInfo } from 'types/options';
import { formatShortDate } from 'utils/formatters/date';
import { formatCurrencyWithKey } from 'utils/formatters/number';
import { navigateToOptionsMarket } from 'utils/routes';
import { getSynthName } from 'utils/snxJSConnector';
import { PhaseLabel } from '../MarketsTable/components';

type MarketCardPros = {
    optionMarket: HistoricalOptionsMarketInfo;
};

const MarketCard: React.FC<MarketCardPros> = ({ optionMarket }) => {
    const { t } = useTranslation();
    return (
        <>
            {optionMarket && (
                <Card
                    id="market-card"
                    onClick={() => {
                        if (optionMarket.phase !== 'expiry') {
                            navigateToOptionsMarket(optionMarket.address);
                        }
                    }}
                >
                    <Header>
                        <CurrencyIcon
                            currencyKey={optionMarket.currencyKey}
                            synthIconStyle={{ width: 48, height: 48 }}
                        />
                        <FlexDivColumnCentered>
                            <CryptoName>{getSynthName(optionMarket.currencyKey)}</CryptoName>
                            <CryptoKey>{optionMarket.asset}</CryptoKey>
                        </FlexDivColumnCentered>
                        <FlexDivColumn
                            style={{
                                padding: '16px 20px 16px 0',
                                maxWidth: 130,
                                height: '100%',
                                justifyContent: 'space-between',
                            }}
                        >
                            <Phase className={optionMarket.phase}>{t(`options.phases.${optionMarket.phase}`)}</Phase>
                            <CryptoTime>
                                <TimeRemaining fontSize={11} end={optionMarket.timeRemaining}></TimeRemaining>
                            </CryptoTime>
                        </FlexDivColumn>
                    </Header>
                    <Content>
                        <Price>{formatCurrencyWithKey(FIAT_CURRENCY_MAP.USD, optionMarket.strikePrice)}</Price>
                        <ExpireDate>at {formatShortDate(optionMarket.maturityDate)}</ExpireDate>
                    </Content>
                    <Footer className="footer">
                        <ViewMarket className="view-market">View Market</ViewMarket>
                    </Footer>
                </Card>
            )}
        </>
    );
};

const Card = styled(FlexDivColumnCentered)`
    position: relative;
    background-color: #1c1a71;
    background-clip: padding-box;
    border: solid 2px transparent;
    border-radius: 24px;
    color: #f6f6fe;
    min-width: 336px;
    max-width: 356px;
    margin: 50px 20px 50px 20px;
    cursor: pointer;
    height: 280px;
    &:before {
        content: '';
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        z-index: -1;
        margin: -2px;
        border-radius: inherit;
        background: linear-gradient(#ca91dc, #6ac1d5);
    }
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
            background: rgba(10, 46, 102, 0.3);
            border-radius: 24px;
        }
    }
`;

const Header = styled(FlexDivCentered)`
    height: 96px;
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
    background: #3936c7;
    border-radius: 0px 0px 21px 21px;
    height: 82px;
    width: 100%;
    font-weight: 700;
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
    color: #808191;
`;

const CryptoTime = styled.div`
    font-weight: bold;
    font-size: 12px;
    line-height: 24px;
    text-align: center;
    color: #00f9ff;
    background: #0a2e66;
    border-radius: 20px;
    height: 24px;
    min-width: 70px;
    padding: 0 6px;
`;

const Price = styled.p`
    margin: 0;
    margin-top: 28px !important;
    text-align: center;
    font-weight: bold;
    font-size: 31px;
    line-height: 34px;
    letter-spacing: 0.25px;
    color: #f6f6fe;
`;
const ExpireDate = styled.p`
    margin: 0;
    text-align: center;
    font-weight: 500;
    font-size: 20px;
    line-height: 20px;
    margin-bottom: 16px !important;
    letter-spacing: 0.15px;
    color: #f6f6fe;
`;

const Phase = styled(PhaseLabel)`
    font-size: 11px;
    height: 24px;
    padding: 0 !important;
    flex: 1;
    margin-bottom: 4px;
    min-width: 70px;
    width: 100%;
    max-height: 24px;
`;

export default MarketCard;
