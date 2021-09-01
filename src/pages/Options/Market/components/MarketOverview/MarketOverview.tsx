import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from 'redux/rootReducer';
import { OptionsMarketInfo } from 'types/options';
import { FlexDiv, FlexDivCentered, FlexDivColumnCentered, Image } from 'theme/common';
import styled from 'styled-components';
import { formatCurrencyWithSign, getPercentageDifference } from 'utils/formatters/number';
import { SYNTHS_MAP, USD_SIGN } from 'constants/currency';
import { PhaseLabel } from 'pages/Options/Home/MarketsTable/components';
import { useTranslation } from 'react-i18next';
import CurrencyIcon from 'components/Currency/CurrencyIcon';
import { COLORS } from 'constants/ui';
import { LightTooltip } from '../../components';
import { getSynthName } from 'utils/snxJSConnector';
import { ReactComponent as ArrowHyperlinkIcon } from 'assets/images/arrow-hyperlink.svg';
import { getEtherscanAddressLink } from 'utils/etherscan';
import { getNetworkId } from 'redux/modules/wallet';
import TimeRemaining from 'pages/Options/components/TimeRemaining';
import arrowUp from 'assets/images/arrow-up.svg';
import arrowDown from 'assets/images/arrow-down.svg';
import { countryToCountryCode, eventToIcon } from 'pages/Options/Home/MarketsTable/MarketsTable';
import ReactCountryFlag from 'react-country-flag';

type MarketOverviewProps = {
    optionsMarket: OptionsMarketInfo;
};

export const MarketOverview: React.FC<MarketOverviewProps> = ({ optionsMarket }) => {
    const { t } = useTranslation();
    const networkId = useSelector((state: RootState) => getNetworkId(state));

    return (
        <>
            {optionsMarket.customMarket ? (
                <Container>
                    <ItemContainer>
                        <FlexDivCentered>
                            <ReactCountryFlag
                                countryCode={countryToCountryCode(optionsMarket.country as any)}
                                style={{ width: 40, height: 40, marginRight: 10 }}
                                svg
                            />
                            {!countryToCountryCode(optionsMarket.country as any) && (
                                <CustomIcon src={eventToIcon(optionsMarket.eventName as any)}></CustomIcon>
                            )}
                            <FlexDivColumnCentered>
                                <LightTooltip title={t('options.market.overview.view-market-contract-tooltip')}>
                                    <StyledLink
                                        href={getEtherscanAddressLink(networkId, optionsMarket.address)}
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        <CryptoName>{optionsMarket.country}</CryptoName>
                                        <ArrowIcon style={{ marginLeft: 4 }} width="10" height="10" />
                                    </StyledLink>
                                </LightTooltip>
                            </FlexDivColumnCentered>
                        </FlexDivCentered>
                    </ItemContainer>
                    <ItemContainer>
                        <Title>Event Name</Title>
                        <Content fontSize={16}>
                            <FlexDivCentered>{optionsMarket.eventName}</FlexDivCentered>
                        </Content>
                    </ItemContainer>
                    <ItemContainer>
                        <Title>{optionsMarket.eventName === 'XYZ airdrop claims' ? 'Strike price' : 'Rank'}</Title>
                        <Content fontSize={16}>{optionsMarket.outcome}</Content>
                    </ItemContainer>
                    <ItemContainer>
                        <Title>
                            {t('options.market.overview.deposited-currency-label', {
                                currencyKey: SYNTHS_MAP.sUSD,
                            })}
                        </Title>
                        <Content>{formatCurrencyWithSign(USD_SIGN, optionsMarket.deposited)}</Content>
                    </ItemContainer>
                    <ItemContainer>
                        <Title>{t('options.market.overview.time-remaining-label')}</Title>
                        <Content>
                            {optionsMarket.isResolved ? (
                                <TimeRemaining end={optionsMarket.expiryDate} fontSize={16} />
                            ) : (
                                <TimeRemaining end={optionsMarket.maturityDate} fontSize={16} />
                            )}
                        </Content>
                    </ItemContainer>
                    <ItemContainer>
                        <Title>
                            {optionsMarket.isResolved
                                ? t('options.market.overview.final-result-label')
                                : t('options.market.overview.current-result-label')}
                        </Title>
                        <StyledLink
                            target="_blank"
                            rel="noreferrer"
                            href="https://www.espn.com/olympics/summer/2020/medals/_/view/overall"
                        >
                            ESPN
                        </StyledLink>
                    </ItemContainer>
                    <ItemContainer>
                        <Phase className={optionsMarket.phase}>{t(`options.phases.${optionsMarket.phase}`)}</Phase>
                    </ItemContainer>
                </Container>
            ) : (
                <Container>
                    <ItemContainer>
                        <FlexDivCentered>
                            <CurrencyIcon
                                currencyKey={optionsMarket.currencyKey}
                                synthIconStyle={{ width: 40, height: 40 }}
                            />
                            <FlexDivColumnCentered>
                                <LightTooltip title={t('options.market.overview.view-market-contract-tooltip')}>
                                    <StyledLink
                                        href={getEtherscanAddressLink(networkId, optionsMarket.address)}
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        <CryptoName>{getSynthName(optionsMarket.currencyKey)}</CryptoName>{' '}
                                        <ArrowIcon width="10" height="10" />
                                    </StyledLink>
                                </LightTooltip>
                                <CryptoKey>{optionsMarket.asset}</CryptoKey>
                            </FlexDivColumnCentered>
                        </FlexDivCentered>
                    </ItemContainer>
                    <ItemContainer>
                        <Title>{t(`options.market.overview.strike-price-label`)}</Title>
                        <Content fontSize={optionsMarket.strikePrice < 0.01 ? 14 : 16}>
                            <FlexDiv>
                                {formatCurrencyWithSign(USD_SIGN, optionsMarket.strikePrice)}
                                {!optionsMarket.isResolved && (
                                    <LightTooltip title={t('options.market.overview.difference-text-tooltip')}>
                                        {optionsMarket.currentPrice > optionsMarket.strikePrice ? (
                                            <RedText>
                                                (<PriceArrow src={arrowDown} />
                                                {getPercentageDifference(
                                                    optionsMarket.currentPrice,
                                                    optionsMarket.strikePrice
                                                ).toFixed(2)}
                                                %)
                                            </RedText>
                                        ) : (
                                            <GreenText>
                                                (<PriceArrow src={arrowUp} />
                                                {getPercentageDifference(
                                                    optionsMarket.currentPrice,
                                                    optionsMarket.strikePrice
                                                ).toFixed(2)}
                                                %)
                                            </GreenText>
                                        )}
                                    </LightTooltip>
                                )}
                            </FlexDiv>
                        </Content>
                    </ItemContainer>
                    <ItemContainer>
                        <Title>
                            {optionsMarket.isResolved
                                ? t('options.market.overview.final-price-label', {
                                      currencyKey: optionsMarket.asset,
                                  })
                                : t('options.market.overview.current-price-label', {
                                      currencyKey: optionsMarket.asset,
                                  })}
                        </Title>
                        <Content
                            fontSize={
                                (optionsMarket.isResolved ? optionsMarket.finalPrice : optionsMarket.currentPrice) <
                                0.01
                                    ? 14
                                    : 16
                            }
                        >
                            {formatCurrencyWithSign(
                                USD_SIGN,
                                optionsMarket.isResolved ? optionsMarket.finalPrice : optionsMarket.currentPrice
                            )}
                        </Content>
                    </ItemContainer>
                    <ItemContainer>
                        <Title>
                            {t('options.market.overview.deposited-currency-label', {
                                currencyKey: SYNTHS_MAP.sUSD,
                            })}
                        </Title>
                        <Content>{formatCurrencyWithSign(USD_SIGN, optionsMarket.deposited)}</Content>
                    </ItemContainer>
                    <ItemContainer>
                        <Title>{t('options.market.overview.time-remaining-label')}</Title>
                        <Content>
                            {optionsMarket.isResolved ? (
                                <TimeRemaining end={optionsMarket.expiryDate} fontSize={16} />
                            ) : (
                                <TimeRemaining end={optionsMarket.maturityDate} fontSize={16} />
                            )}
                        </Content>
                    </ItemContainer>
                    <ItemContainer>
                        <Title>
                            {optionsMarket.isResolved
                                ? t('options.market.overview.final-result-label')
                                : t('options.market.overview.current-result-label')}
                        </Title>
                        <Result isLong={optionsMarket.result === 'long'}>{optionsMarket.result}</Result>
                    </ItemContainer>
                    <ItemContainer>
                        <Phase className={optionsMarket.phase}>{t(`options.phases.${optionsMarket.phase}`)}</Phase>
                    </ItemContainer>
                </Container>
            )}
        </>
    );
};

const ItemContainer: React.FC = (props) => (
    <InnerItemContainer>
        <Item>{props.children}</Item>
    </InnerItemContainer>
);

const Container = styled(FlexDiv)`
    background: #04045a;
    border-radius: 16px;
    margin-bottom: 20px;
`;

const InnerItemContainer = styled(FlexDivCentered)`
    flex: 1;
    min-height: 76px;
    &:not(:last-child) {
        border-right: 2px solid rgba(1, 38, 81, 0.5);
    }
    color: #b8c6e5;
`;

const Item = styled(FlexDivColumnCentered)`
    flex: initial;
`;

const Title = styled.p`
    font-style: normal;
    font-weight: 600;
    font-size: 13px;
    line-height: 18px;
    color: #b8c6e5;
`;

const Content = styled.div<{ fontSize?: number }>`
    font-style: normal;
    font-weight: bold;
    font-size: ${(props) => props.fontSize || 16}px;
    line-height: 18px;
    color: #f6f6fe;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
`;

const Phase = styled(PhaseLabel)`
    cursor: default;
`;

export const Result = styled(Content)<{ isLong: boolean }>`
    color: ${(props) => (props.isLong ? COLORS.LONG : COLORS.SHORT)};
    text-transform: uppercase;
`;

const CryptoName = styled.span`
    font-style: normal;
    font-weight: bold;
    font-size: 16px;
    line-height: 16px;
`;

const CryptoKey = styled.span`
    font-style: normal;
    font-weight: bold;
    font-size: 14px;
    line-height: 16px;
    color: #808191;
`;

export const StyledLink = styled.a`
    color: #f6f6fe;
    &path {
        fill: #f6f6fe;
    }
    &:hover {
        color: #00f9ff;
        & path {
            fill: #00f9ff;
        }
    }
`;

export const ArrowIcon = styled(ArrowHyperlinkIcon)``;

const PriceArrow = styled(Image)`
    width: 16px;
    height: 16px;
    margin-bottom: -2px;
`;

const GreenText = styled.span`
    color: #01b977;
    padding-left: 5px;
`;

const RedText = styled.span`
    color: #be2727;
    padding-left: 5px;
`;

export const CustomIcon = styled(Image)`
    margin-right: 6px;
    width: 24px;
    height: 24px;
`;

export default MarketOverview;
