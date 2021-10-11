import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from 'redux/rootReducer';
import { ETHBurned, Flippening, OptionsMarketInfo } from 'types/options';
import { FlexDiv, FlexDivCentered, FlexDivColumnCentered, Image } from 'theme/common';
import styled from 'styled-components';
import { formatCurrency, formatCurrencyWithSign, getPercentageDifference } from 'utils/formatters/number';
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
import { getIsAppReady } from 'redux/modules/app';
import useFlippeningQuery from 'queries/options/useFlippeningQuery';
import useETHBurnedCountQuery from 'queries/options/useETHBurnedCountQuery';

type MarketOverviewProps = {
    optionsMarket: OptionsMarketInfo;
};

export const MarketOverview: React.FC<MarketOverviewProps> = ({ optionsMarket }) => {
    const { t } = useTranslation();
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
    const [flippening, setFlippening] = useState<Flippening | undefined>(undefined);
    const [ethBurned, setEthBurned] = useState<ETHBurned | undefined>(undefined);

    const flippeningQuery = useFlippeningQuery({
        enabled: isAppReady,
    });

    useEffect(() => {
        if (flippeningQuery.isSuccess && flippeningQuery.data) {
            setFlippening(flippeningQuery.data);
        }
    }, [flippeningQuery.isSuccess, flippeningQuery.data]);

    const ethBurnedQuery = useETHBurnedCountQuery({
        enabled: isAppReady,
    });

    useEffect(() => {
        if (ethBurnedQuery.isSuccess && ethBurnedQuery.data) {
            setEthBurned(ethBurnedQuery.data);
        }
    }, [ethBurnedQuery.isSuccess, ethBurnedQuery.data]);

    return (
        <>
            {optionsMarket.customMarket ? (
                <Container>
                    <ItemContainer className="market__overview__cell">
                        <FlexDivCentered style={{ paddingLeft: 2, paddingRight: 2 }}>
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
                    <ItemContainer className="market__overview__cell">
                        <Title>
                            {optionsMarket.eventName === 'ETH burned count'
                                ? optionsMarket.isResolved
                                    ? t('options.market.overview.final-burn-label')
                                    : t('options.market.overview.current-burn-label')
                                : optionsMarket.eventName === 'Flippening Markets' ||
                                  optionsMarket.eventName === 'ETH/BTC market cap ratio'
                                ? optionsMarket.isResolved
                                    ? t('options.market.overview.final-ratio-label')
                                    : t('options.market.overview.current-ratio-label')
                                : t('options.market.overview.event-name-label')}
                        </Title>
                        <Content fontSize={16}>
                            {optionsMarket.eventName === 'Flippening Markets' ||
                            optionsMarket.eventName === 'ETH/BTC market cap ratio'
                                ? flippening
                                    ? formatCurrency(flippening.ratio)
                                    : '-'
                                : optionsMarket.eventName === 'ETH burned count'
                                ? ethBurned
                                    ? formatCurrency(ethBurned.total)
                                    : '-'
                                : optionsMarket.eventName}
                        </Content>
                    </ItemContainer>
                    <ItemContainer className="market__overview__cell">
                        <Title>
                            {optionsMarket.eventName === 'XYZ airdrop claims'
                                ? t('options.market.overview.strike-price-label')
                                : optionsMarket.eventName === 'ETH burned count'
                                ? t('options.market.overview.strike-burn-label')
                                : optionsMarket.eventName === 'Flippening Markets' ||
                                  optionsMarket.eventName === 'ETH/BTC market cap ratio'
                                ? t('options.market.overview.strike-ratio-label')
                                : t('options.market.overview.rank-label')}
                        </Title>
                        <Content fontSize={16}>
                            {formatCurrency(
                                optionsMarket.outcome || 0,
                                optionsMarket.eventName === 'Flippening Markets' ||
                                    optionsMarket.eventName === 'ETH/BTC market cap ratio'
                                    ? 2
                                    : 0
                            )}
                        </Content>
                    </ItemContainer>
                    <ItemContainer className="market__overview__cell">
                        <Title>
                            {t('options.market.overview.deposited-currency-label', {
                                currencyKey: SYNTHS_MAP.sUSD,
                            })}
                        </Title>
                        <Content>{formatCurrencyWithSign(USD_SIGN, optionsMarket.deposited)}</Content>
                    </ItemContainer>
                    <ItemContainer className="market__overview__cell">
                        <Title>{t('options.market.overview.time-remaining-label')}</Title>
                        <Content>
                            {optionsMarket.isResolved ? (
                                <TimeRemaining end={optionsMarket.expiryDate} fontSize={16} />
                            ) : (
                                <TimeRemaining end={optionsMarket.maturityDate} fontSize={16} />
                            )}
                        </Content>
                    </ItemContainer>
                    <ItemContainer className="market__overview__cell">
                        <Title>
                            {optionsMarket.isResolved
                                ? t('options.market.overview.final-result-label')
                                : t('options.market.overview.current-result-label')}
                        </Title>
                        {optionsMarket.eventName === 'XYZ airdrop claims' ||
                        optionsMarket.eventName === 'ETH burned count' ||
                        optionsMarket.eventName === 'Flippening Markets' ||
                        optionsMarket.eventName === 'ETH/BTC market cap ratio' ? (
                            <Result isLong={optionsMarket.result === 'long'}>{optionsMarket.result}</Result>
                        ) : (
                            <StyledLink
                                target="_blank"
                                rel="noreferrer"
                                href={
                                    optionsMarket.eventName?.toLowerCase().indexOf('us open') !== -1
                                        ? 'http://www.espn.com/tennis/dailyResults'
                                        : 'https://www.espn.com/olympics/summer/2020/medals/_/view/overall'
                                }
                            >
                                ESPN
                            </StyledLink>
                        )}
                    </ItemContainer>
                    <ItemContainer className="market__overview__cell">
                        <Phase className={optionsMarket.phase}>{t(`options.phases.${optionsMarket.phase}`)}</Phase>
                    </ItemContainer>
                </Container>
            ) : (
                <Container>
                    <ItemContainer className="market__overview__cell">
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
                    <ItemContainer className="market__overview__cell">
                        <Title>{t(`options.market.overview.strike-price-label`)}</Title>
                        <Content fontSize={optionsMarket.strikePrice < 0.01 ? 14 : 16}>
                            <FlexDiv>
                                {formatCurrencyWithSign(USD_SIGN, optionsMarket.strikePrice)}
                                {!optionsMarket.isResolved && (
                                    <LightTooltip title={t('options.market.overview.difference-text-tooltip')}>
                                        {optionsMarket.currentPrice > optionsMarket.strikePrice ? (
                                            <RedText className="market__overview__difference">
                                                (<PriceArrow src={arrowDown} />
                                                {getPercentageDifference(
                                                    optionsMarket.currentPrice,
                                                    optionsMarket.strikePrice
                                                ).toFixed(2)}
                                                %)
                                            </RedText>
                                        ) : (
                                            <GreenText className="market__overview__difference">
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
                    <ItemContainer className="market__overview__cell">
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
                    <ItemContainer className="market__overview__cell">
                        <Title>
                            {t('options.market.overview.deposited-currency-label', {
                                currencyKey: SYNTHS_MAP.sUSD,
                            })}
                        </Title>
                        <Content>{formatCurrencyWithSign(USD_SIGN, optionsMarket.deposited)}</Content>
                    </ItemContainer>
                    <ItemContainer className="market__overview__cell">
                        <Title>{t('options.market.overview.time-remaining-label')}</Title>
                        <Content>
                            {optionsMarket.isResolved ? (
                                <TimeRemaining end={optionsMarket.expiryDate} fontSize={16} />
                            ) : (
                                <TimeRemaining end={optionsMarket.maturityDate} fontSize={16} />
                            )}
                        </Content>
                    </ItemContainer>
                    <ItemContainer className="market__overview__cell">
                        <Title>
                            {optionsMarket.isResolved
                                ? t('options.market.overview.final-result-label')
                                : t('options.market.overview.current-result-label')}
                        </Title>
                        <Result isLong={optionsMarket.result === 'long'}>{optionsMarket.result}</Result>
                    </ItemContainer>
                    <ItemContainer className="market__overview__cell">
                        <Phase className={optionsMarket.phase}>{t(`options.phases.${optionsMarket.phase}`)}</Phase>
                    </ItemContainer>
                </Container>
            )}
        </>
    );
};

const ItemContainer: React.FC<{ className: string }> = (props) => (
    <InnerItemContainer className={props.className}>
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

export const Title = styled.p`
    font-style: normal;
    font-weight: 600;
    font-size: 13px;
    line-height: 18px;
    color: #b8c6e5;
`;

export const Content = styled.div<{ fontSize?: number }>`
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

export const PriceArrow = styled(Image)`
    width: 16px;
    height: 16px;
    margin-bottom: -2px;
`;

export const GreenText = styled.span`
    color: #01b977;
    padding-left: 5px;
    white-space: pre;
`;

export const RedText = styled.span`
    color: #be2727;
    padding-left: 5px;
    white-space: pre;
`;

export const CustomIcon = styled(Image)`
    margin-right: 6px;
    width: 24px;
    height: 24px;
`;

export default MarketOverview;
