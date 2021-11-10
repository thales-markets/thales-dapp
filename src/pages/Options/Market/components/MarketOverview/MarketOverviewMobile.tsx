import React, { useEffect, useState } from 'react';
import { ETHBurned, Flippening, OptionsMarketInfo } from 'types/options';
import { FlexDiv, FlexDivCentered, FlexDivColumn, FlexDivColumnCentered, FlexDivRowCentered } from 'theme/common';
import CurrencyIcon from 'components/Currency/CurrencyIcon';
import { LightTooltip } from '../../components';
import { Content, GreenText, RedText, StyledLink, Title, PriceArrow, Result } from './MarketOverview';
import { getEtherscanAddressLink } from 'utils/etherscan';
import { getSynthName } from 'utils/snxJSConnector';
import { CryptoKey, CryptoName } from 'pages/Options/Home/MarketCard/MarketCard';
import { useSelector } from 'react-redux';
import { RootState } from 'redux/rootReducer';
import { getNetworkId } from 'redux/modules/wallet';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { PhaseLabel } from 'pages/Options/Home/MarketsTable/components';
import { formatCurrency, formatCurrencyWithSign, getPercentageDifference } from 'utils/formatters/number';
import { SYNTHS_MAP, USD_SIGN } from 'constants/currency';
import arrowUp from 'assets/images/arrow-up.svg';
import arrowDown from 'assets/images/arrow-down.svg';
import TimeRemaining from 'pages/Options/components/TimeRemaining';
import ReactCountryFlag from 'react-country-flag';
import { countryToCountryCode } from 'pages/Options/Home/MarketsTable/MarketsTable';
import { getIsAppReady } from 'redux/modules/app';
import useFlippeningQuery from 'queries/options/useFlippeningQuery';
import useETHBurnedCountQuery from 'queries/options/useETHBurnedCountQuery';

type MarketOverviewProps = {
    optionsMarket: OptionsMarketInfo;
};

export const MarketOverviewMobile: React.FC<MarketOverviewProps> = ({ optionsMarket }) => {
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
        <Wrapper className="market__overview--mobile">
            <FlexDivRowCentered className="market__overview--mobile__section">
                <FlexDivCentered>
                    {optionsMarket.customMarket ? (
                        <ReactCountryFlag
                            countryCode={countryToCountryCode(optionsMarket.country as any)}
                            style={{ width: 40, height: 40, marginRight: 10 }}
                            svg
                        />
                    ) : (
                        <CurrencyIcon
                            currencyKey={optionsMarket.currencyKey}
                            synthIconStyle={{ width: 40, height: 40 }}
                        />
                    )}
                    <FlexDivColumnCentered>
                        <LightTooltip title={t('options.market.overview.view-market-contract-tooltip')}>
                            <StyledLink
                                href={getEtherscanAddressLink(networkId, optionsMarket.address)}
                                target="_blank"
                                rel="noreferrer"
                            >
                                <CryptoName>
                                    {optionsMarket.customMarket
                                        ? optionsMarket.country
                                        : getSynthName(optionsMarket.currencyKey)}
                                </CryptoName>
                            </StyledLink>
                        </LightTooltip>
                        <CryptoKey>{optionsMarket.asset}</CryptoKey>
                    </FlexDivColumnCentered>
                </FlexDivCentered>
                <PhaseLabel className={optionsMarket.phase}>{t(`options.phases.${optionsMarket.phase}`)}</PhaseLabel>
            </FlexDivRowCentered>
            <FlexDivColumnCentered className="market__overview--mobile__section">
                <FlexDivRowCentered>
                    <FlexDivColumnCentered>
                        <Title>
                            {optionsMarket.customMarket
                                ? optionsMarket.eventName === 'ETH burned count'
                                    ? optionsMarket.isResolved
                                        ? t('options.market.overview.final-burn-label')
                                        : t('options.market.overview.current-burn-label')
                                    : optionsMarket.eventName === 'Flippening Markets' ||
                                      optionsMarket.eventName === 'ETH/BTC market cap ratio'
                                    ? optionsMarket.isResolved
                                        ? t('options.market.overview.final-ratio-label')
                                        : t('options.market.overview.current-ratio-label')
                                    : t('options.market.overview.event-name-label')
                                : optionsMarket.isResolved
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
                                    0.01 && !optionsMarket.customMarket
                                    ? 14
                                    : 16
                            }
                        >
                            {optionsMarket.customMarket
                                ? optionsMarket.eventName === 'Flippening Markets' ||
                                  optionsMarket.eventName === 'ETH/BTC market cap ratio'
                                    ? flippening
                                        ? formatCurrency(flippening.ratio)
                                        : '-'
                                    : optionsMarket.eventName === 'ETH burned count'
                                    ? ethBurned
                                        ? formatCurrency(ethBurned.total)
                                        : '-'
                                    : optionsMarket.eventName
                                : formatCurrencyWithSign(
                                      USD_SIGN,
                                      optionsMarket.isResolved ? optionsMarket.finalPrice : optionsMarket.currentPrice
                                  )}
                        </Content>
                    </FlexDivColumnCentered>
                    <FlexDivColumnCentered style={{ alignItems: 'flex-end' }}>
                        <Title>
                            {optionsMarket.customMarket
                                ? optionsMarket.eventName === 'XYZ airdrop claims'
                                    ? t('options.market.overview.strike-price-label')
                                    : optionsMarket.eventName === 'ETH burned count'
                                    ? t('options.market.overview.strike-burn-label')
                                    : optionsMarket.eventName === 'Flippening Markets' ||
                                      optionsMarket.eventName === 'ETH/BTC market cap ratio'
                                    ? t('options.market.overview.strike-ratio-label')
                                    : t('options.market.overview.rank-label')
                                : t('options.market.overview.strike-price-label')}
                        </Title>
                        <Content fontSize={optionsMarket.strikePrice < 0.01 && !optionsMarket.customMarket ? 14 : 16}>
                            {optionsMarket.customMarket ? (
                                formatCurrency(
                                    optionsMarket.outcome || 0,
                                    optionsMarket.eventName === 'Flippening Markets' ||
                                        optionsMarket.eventName === 'ETH/BTC market cap ratio'
                                        ? 2
                                        : 0
                                )
                            ) : (
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
                            )}
                        </Content>
                    </FlexDivColumnCentered>
                </FlexDivRowCentered>
                <FlexDivRowCentered style={{ marginTop: 16 }}>
                    <FlexDivColumnCentered>
                        <Title>
                            {t('options.market.overview.deposited-currency-label', {
                                currencyKey: SYNTHS_MAP.sUSD,
                            })}
                        </Title>
                        <Content>{formatCurrencyWithSign(USD_SIGN, optionsMarket.deposited)}</Content>
                    </FlexDivColumnCentered>
                    <FlexDivColumnCentered style={{ alignItems: 'flex-end' }}>
                        <Title>{t('options.market.overview.time-remaining-label')}</Title>
                        <Content>
                            {optionsMarket.isResolved ? (
                                <TimeRemaining end={optionsMarket.expiryDate} fontSize={16} />
                            ) : (
                                <TimeRemaining end={optionsMarket.maturityDate} fontSize={16} />
                            )}
                        </Content>
                    </FlexDivColumnCentered>
                </FlexDivRowCentered>
            </FlexDivColumnCentered>
            <FlexDivColumnCentered className="market__overview--mobile__section">
                <Title>
                    {optionsMarket.isResolved
                        ? t('options.market.overview.final-result-label')
                        : t('options.market.overview.current-result-label')}
                </Title>
                {!optionsMarket.customMarket ||
                optionsMarket.eventName === 'XYZ airdrop claims' ||
                optionsMarket.eventName === 'ETH burned count' ||
                optionsMarket.eventName === 'Flippening Markets' ||
                optionsMarket.eventName === 'ETH/BTC market cap ratio' ? (
                    <Result style={{ fontSize: 14 }} isLong={optionsMarket.result === 'long'}>
                        {optionsMarket.result}
                    </Result>
                ) : (
                    <StyledLink target="_blank" rel="noreferrer" href="http://www.espn.com/tennis/dailyResults">
                        ESPN
                    </StyledLink>
                )}
            </FlexDivColumnCentered>
        </Wrapper>
    );
};

const Wrapper = styled(FlexDivColumn)`
    background: #04045a;
    border-radius: 23px;
    max-width: 350px;
    width: 100%;
    margin: 24px auto;
`;
