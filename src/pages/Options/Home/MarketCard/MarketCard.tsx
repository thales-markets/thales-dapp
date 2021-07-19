import CurrencyIcon from 'components/Currency/CurrencyIcon';
import { USD_SIGN } from 'constants/currency';
import TimeRemaining from 'pages/Options/components/TimeRemaining';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { FlexDivCentered, FlexDivColumn, FlexDivColumnCentered, Image, Text } from 'theme/common';
import CircularProgress from '@material-ui/core/CircularProgress';
import { HistoricalOptionsMarketInfo } from 'types/options';
import { formatShortDate } from 'utils/formatters/date';
import { formatCurrencyWithSign, getPercentageDifference } from 'utils/formatters/number';
import { navigateToOptionsMarket } from 'utils/routes';
import { getSynthName } from 'utils/snxJSConnector';
import { PhaseLabel } from '../MarketsTable/components';
import { Rates } from '../../../../queries/rates/useExchangeRatesQuery';
import arrowUp from '../../../../assets/images/arrow-up.svg';
import arrowDown from '../../../../assets/images/arrow-down.svg';

type MarketCardPros = {
    exchangeRates: Rates | null;
    optionMarket: HistoricalOptionsMarketInfo;
};

const MarketCard: React.FC<MarketCardPros> = ({ optionMarket, exchangeRates }) => {
    const { t } = useTranslation();
    const currentAssetPrice = exchangeRates?.[optionMarket?.currencyKey] || 0;
    const strikeAndAssetPriceDifference = getPercentageDifference(currentAssetPrice, optionMarket?.strikePrice);
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
                                padding: '15px 20px 15px 0',
                                maxWidth: 130,
                                height: '100%',
                                justifyContent: 'space-between',
                            }}
                        >
                            <Phase className={optionMarket.phase}>{t(`options.phases.${optionMarket.phase}`)}</Phase>
                            <GradientBorderWrapper style={{ borderRadius: '12px', margin: 0 }}>
                                <GradientBorderContent>
                                    <TimeRemaining fontSize={11} end={optionMarket.timeRemaining} />
                                </GradientBorderContent>
                            </GradientBorderWrapper>
                        </FlexDivColumn>
                    </Header>

                    <Content>
                        <Text>{t('options.home.market-card.strike-price')}</Text>
                        <Price>{formatCurrencyWithSign(USD_SIGN, optionMarket.strikePrice)}</Price>
                        <div style={{ visibility: isFinite(strikeAndAssetPriceDifference) ? 'visible' : 'hidden' }}>
                            <Text>{t('options.home.market-card.difference-text')}:</Text>
                            {currentAssetPrice > optionMarket.strikePrice ? (
                                <FlexDivCentered
                                    style={{
                                        paddingTop: '5px',
                                    }}
                                >
                                    <Arrow src={arrowDown} />
                                    <RedText>{strikeAndAssetPriceDifference.toFixed(2)}%</RedText>
                                </FlexDivCentered>
                            ) : (
                                <FlexDivCentered
                                    style={{
                                        paddingTop: '5px',
                                    }}
                                >
                                    <Arrow src={arrowUp} />
                                    <GreenText>{strikeAndAssetPriceDifference.toFixed(2)}%</GreenText>
                                </FlexDivCentered>
                            )}
                        </div>
                    </Content>
                    <Footer className="footer">
                        <GradientBorderWrapper>
                            <MarketInfo>
                                <MarketInfoTitle>{t('options.home.market-card.current-asset-price')}:</MarketInfoTitle>
                                <span style={{ fontWeight: 'bold' }}>
                                    {currentAssetPrice ? formatCurrencyWithSign(USD_SIGN, currentAssetPrice) : 'N/A'}
                                </span>
                            </MarketInfo>
                        </GradientBorderWrapper>
                        <GradientBorderWrapper>
                            <MarketInfo>
                                <MarketInfoTitle>{t('options.home.market-card.pool-size')}:</MarketInfoTitle>
                                <span style={{ fontWeight: 'bold' }}>
                                    {formatCurrencyWithSign(USD_SIGN, optionMarket.poolSize)}
                                </span>
                            </MarketInfo>
                        </GradientBorderWrapper>
                        <GradientBorderWrapper>
                            <MarketInfo>
                                <MarketInfoTitle>{t('options.home.market-card.end-date')}:</MarketInfoTitle>
                                <span style={{ fontWeight: 'bold' }}>{formatShortDate(optionMarket.maturityDate)}</span>
                            </MarketInfo>
                        </GradientBorderWrapper>
                        <GradientBorderWrapper>
                            <MarketInfo>
                                <MarketInfoTitle>{t('options.home.market-card.open-orders')}:</MarketInfoTitle>
                                <span style={{ fontWeight: 'bold' }}>
                                    {optionMarket.openOrders ?? (
                                        <div style={{ height: '16px', width: '100%', position: 'relative' }}>
                                            <StyledLoader />
                                        </div>
                                    )}
                                </span>
                            </MarketInfo>
                        </GradientBorderWrapper>
                        <ViewMarket className="view-market">View Market</ViewMarket>
                    </Footer>
                </Card>
            )}
        </>
    );
};

const StyledLoader = styled(CircularProgress)`
    height: 16px !important;
    width: 16px !important;
`;

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
    height: 306px;
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
    height: 89px;
    border-bottom: 1px solid rgba(202, 145, 220, 0.6);
    img,
    svg {
        margin: 20px;
        width: 36px;
        height: 36px;
    }
`;
const Content = styled(FlexDivColumnCentered)`
    height: 195px;
    text-align: center;
    font-size: 14px;
    padding-top: 11px;
`;
const Footer = styled(FlexDivColumnCentered)`
    position: relative;
    min-height: 67px;
    padding: 15px 33px 0 33px;
    display: grid;
    grid-template-columns: 50% 50%;
    grid-column-gap: 10%;
    grid-row-gap: 5%;
`;

const ViewMarket = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;
    background: #3936c7;
    border-radius: 0px 0px 22px 22px;
    height: 108px;
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

const GradientBorderWrapper = styled.div`
    border-radius: 18px;
    background: linear-gradient(to right, #3936c7, #2d83d2, #23a5dd, #35dadb);
    margin-bottom: 6px;
`;

const GradientBorderContent = styled.div`
    font-weight: bold;
    font-size: 12px;
    line-height: 24px;
    text-align: center;
    border-radius: 20px;
    height: 24px;
    min-width: 70px;
    background-color: #1c1a71;
    margin: 1px;
    padding: 0 6px;
`;

const Price = styled.p`
    margin: 0;
    text-align: center;
    font-weight: bold;
    font-size: 25px;
    line-height: 34px;
    letter-spacing: 0.25px;
    color: #f6f6fe;
    margin-bottom: 3px;
`;

const MarketInfo = styled(GradientBorderContent)`
    font-size: 14px;
    height: 36px;
    border-radius: 18px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    font-weight: normal;
    padding: 5px 0;
    line-height: 16px;
`;

const MarketInfoTitle = styled(Text)`
    margin-right: 4px;
    font-size: 12px;
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

const Arrow = styled(Image)`
    width: 20px;
    height: 20px;
`;

const GreenText = styled.span`
    color: #01b977;
    font-size: 20px;
`;

const RedText = styled.span`
    color: #be2727;
    font-size: 20px;
`;

export default MarketCard;
