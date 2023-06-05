import Tooltip from 'components/TooltipV2';
import { USD_SIGN } from 'constants/currency';
import { Positions } from 'enums/options';
import { useRangedMarketContext } from 'pages/AMMTrading/contexts/RangedMarketContext';
import useRangedAMMMaxLimitsQuery, {
    RangeAmmMaxLimits,
} from 'queries/options/rangedMarkets/useRangedAMMMaxLimitsQuery';
import useRangedMarketPositionBalanceQuery from 'queries/options/rangedMarkets/useRangedMarketPositionBalanceQuery';
import useAmmMaxLimitsQuery, { AmmMaxLimits } from 'queries/options/useAmmMaxLimitsQuery';
import useBinaryOptionsAccountMarketInfoQuery from 'queries/options/useBinaryOptionsAccountMarketInfoQuery';
import React, { useMemo } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { getIsAppReady } from 'redux/modules/app';
import { getIsBuy } from 'redux/modules/marketWidgets';
import { getIsWalletConnected, getNetworkId, getWalletAddress } from 'redux/modules/wallet';
import { RootState } from 'redux/rootReducer';
import { useTheme } from 'styled-components';
import { AccountMarketInfo, OptionsMarketInfo, RangedMarketBalanceInfo, RangedMarketData } from 'types/options';
import { ThemeInterface } from 'types/ui';
import { getEtherscanAddressLink } from 'utils/etherscan';
import {
    formatCurrency,
    formatCurrencyWithPrecision,
    formatCurrencyWithSign,
    formatPricePercentageDifference,
} from 'utils/formatters/number';
import { useMarketContext } from '../../contexts/MarketContext';
import MaturityDate from '../MaturityDate';
import {
    ColumnAnchorSubContainer,
    ColumnContainer,
    Container,
    CurrencyContainer,
    CurrencyIcon,
    CurrencyLabel,
    Header,
    SubContainer,
    UsingAmmLink,
    Value,
} from './styled-components';

type RowCardProps = {
    isRangedMarket: boolean;
};

const RowCard: React.FC<RowCardProps> = ({ isRangedMarket }) => {
    const market = isRangedMarket ? useRangedMarketContext() : useMarketContext();
    const { t } = useTranslation();
    const theme: ThemeInterface = useTheme();
    const isBuy = useSelector((state: RootState) => getIsBuy(state));
    const networkId = useSelector((state: RootState) => getNetworkId(state));

    const isWalletConnected = useSelector((state: RootState) => getIsWalletConnected(state));
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state)) || '';
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));

    const accountMarketInfoQuery = useBinaryOptionsAccountMarketInfoQuery(market.address, walletAddress, {
        enabled: isAppReady && isWalletConnected && !isRangedMarket,
    });
    const rangedMarketsBalance = useRangedMarketPositionBalanceQuery(market.address, walletAddress, networkId, {
        enabled: isAppReady && isWalletConnected && isRangedMarket,
    });

    let optBalances = { in: 0, out: 0, short: 0, long: 0 };
    if (isWalletConnected && accountMarketInfoQuery.isSuccess && accountMarketInfoQuery.data && !isRangedMarket) {
        optBalances = { ...optBalances, ...(accountMarketInfoQuery.data as AccountMarketInfo) };
    }
    if (isWalletConnected && rangedMarketsBalance.isSuccess && rangedMarketsBalance.data && isRangedMarket) {
        optBalances = { ...optBalances, ...(rangedMarketsBalance.data as RangedMarketBalanceInfo) };
    }

    const ammMaxLimitsQuery = useAmmMaxLimitsQuery(market.address, networkId, {
        enabled: isAppReady && !isRangedMarket,
    });
    const rangedAmmMaxLimitsQuery = useRangedAMMMaxLimitsQuery(market.address, networkId, {
        enabled: isAppReady && isRangedMarket,
    });

    const ammMaxLimits =
        ammMaxLimitsQuery.isSuccess && ammMaxLimitsQuery.data ? (ammMaxLimitsQuery.data as AmmMaxLimits) : undefined;
    const rangedAmmMaxLimits =
        rangedAmmMaxLimitsQuery.isSuccess && rangedAmmMaxLimitsQuery.data
            ? (rangedAmmMaxLimitsQuery.data as RangeAmmMaxLimits)
            : undefined;

    const ammData = useMemo(() => {
        if (isRangedMarket ? !rangedAmmMaxLimits : !ammMaxLimits) return undefined;

        const ammData = {
            maxUp: 0,
            maxDown: 0,
            priceUp: 0,
            priceDown: 0,
            maxIn: 0,
            maxOut: 0,
            priceIn: 0,
            priceOut: 0,
        };
        if (!isRangedMarket && ammMaxLimits) {
            ammData.maxUp = isBuy ? ammMaxLimits.maxBuyLong : ammMaxLimits.maxSellLong;
            ammData.maxDown = isBuy ? ammMaxLimits.maxBuyShort : ammMaxLimits.maxSellShort;
            ammData.priceUp = isBuy ? ammMaxLimits.buyLongPrice : ammMaxLimits.sellLongPrice;
            ammData.priceDown = isBuy ? ammMaxLimits.buyShortPrice : ammMaxLimits.sellShortPrice;
        } else if (isRangedMarket && rangedAmmMaxLimits) {
            ammData.maxIn = isBuy ? rangedAmmMaxLimits.in.maxBuy : rangedAmmMaxLimits.in.maxSell;
            ammData.maxOut = isBuy ? rangedAmmMaxLimits.out.maxBuy : rangedAmmMaxLimits.out.maxSell;
            ammData.priceIn = isBuy ? rangedAmmMaxLimits.in.buyPrice : rangedAmmMaxLimits.in.sellPrice;
            ammData.priceOut = isBuy ? rangedAmmMaxLimits.out.buyPrice : rangedAmmMaxLimits.out.sellPrice;
        }
        return ammData;
    }, [isRangedMarket, ammMaxLimits, rangedAmmMaxLimits, isBuy]);

    const positionCurrentValue = useMemo(() => {
        const positionCurrentValue = {
            longPositionValue: 0,
            shortPositionValue: 0,
            inPositionValue: 0,
            outPositionValue: 0,
        };
        if (!isRangedMarket && ammMaxLimitsQuery.isSuccess && (optBalances.long > 0 || optBalances.short > 0)) {
            const { sellLongPrice, sellShortPrice } = ammMaxLimitsQuery.data;

            positionCurrentValue.longPositionValue =
                sellLongPrice && sellLongPrice > 0 && optBalances?.long > 0 ? sellLongPrice * optBalances.long : 0;
            positionCurrentValue.shortPositionValue =
                sellShortPrice && sellShortPrice > 0 && optBalances.short > 0 ? sellShortPrice * optBalances.short : 0;
        } else if (isRangedMarket && rangedAmmMaxLimitsQuery.isSuccess && (optBalances.in > 0 || optBalances.out > 0)) {
            const inPosition = rangedAmmMaxLimitsQuery.data.in;
            const outPosition = rangedAmmMaxLimitsQuery.data.out;

            positionCurrentValue.inPositionValue =
                inPosition.sellPrice && inPosition.sellPrice > 0 && optBalances.in > 0
                    ? inPosition.sellPrice * optBalances.in
                    : 0;
            positionCurrentValue.outPositionValue =
                outPosition.sellPrice && outPosition.sellPrice > 0 && optBalances.out > 0
                    ? outPosition.sellPrice * optBalances.out
                    : 0;
        }
        return positionCurrentValue;
    }, [ammMaxLimitsQuery, rangedAmmMaxLimitsQuery, optBalances]);

    const priceDifference = useMemo(() => {
        return isRangedMarket
            ? 0
            : formatPricePercentageDifference(
                  (market as OptionsMarketInfo).strikePrice,
                  market?.phase == 'maturity' ? market.finalPrice : market.currentPrice
              );
    }, [market.currentPrice, (market as OptionsMarketInfo).strikePrice, market.phase, isRangedMarket]);

    const getColorPerPosition = (position: Positions) => {
        switch (position) {
            case Positions.UP:
                return theme.positionColor.up;
            case Positions.DOWN:
                return theme.positionColor.down;
            case Positions.IN:
                return theme.positionColor.in;
            case Positions.OUT:
                return theme.positionColor.out;
            default:
                return theme.textColor.primary;
        }
    };

    const getMarketPriceSection = () => (
        <SubContainer>
            <Header>
                {market?.phase == 'maturity'
                    ? t('options.market.overview.final-price-label', {
                          currencyKey: market.currencyKey,
                      })
                    : t('options.home.market-card.current-asset-price')}
            </Header>
            <Value>
                {market?.phase == 'maturity'
                    ? formatCurrencyWithSign(USD_SIGN, market.finalPrice)
                    : formatCurrencyWithSign(USD_SIGN, market.currentPrice)}
                {}
            </Value>
        </SubContainer>
    );

    const getMyPositionsSectionValue = (
        positionLeft: Positions,
        positionRight: Positions,
        positionLeftBalance: number,
        positionRightBalance: number,
        isLoading: boolean
    ) => (
        <Value>
            {positionLeftBalance > 0 && <Value>{formatCurrencyWithPrecision(positionLeftBalance)} </Value>}
            {positionLeftBalance > 0 && <Value color={getColorPerPosition(positionLeft)}>{positionLeft}</Value>}
            {positionLeftBalance > 0 && positionRightBalance > 0 && ' / '}
            {positionRightBalance > 0 && <Value>{formatCurrencyWithPrecision(positionRightBalance)} </Value>}
            {positionRightBalance > 0 && <Value color={getColorPerPosition(positionRight)}>{positionRight}</Value>}
            {isLoading ? '-' : positionLeftBalance == 0 && positionRightBalance == 0 && 'N/A'}
        </Value>
    );

    const getLiquiditySectionValue = (
        positionLeft: Positions,
        positionRight: Positions,
        positionLeftLiquidity: number,
        positionRightLiquidity: number,
        ammData: any
    ) => (
        <Value>
            {(ammData && positionLeftLiquidity > 0) || (ammData && positionRightLiquidity > 0) ? (
                <>
                    <Value color={getColorPerPosition(positionLeft)}>
                        {ammData ? formatCurrency(positionLeftLiquidity, 0) : '0'}
                    </Value>
                    {' / '}
                    <Value color={getColorPerPosition(positionRight)}>
                        {ammData ? formatCurrency(positionRightLiquidity, 0) : '0'}
                    </Value>
                </>
            ) : (
                <Value color={ammData ? theme.warning.textColor.primary : theme.textColor.primary}>
                    {ammData ? t('options.home.markets-table.out-of-liquidity') : '-'}
                </Value>
            )}
        </Value>
    );

    const getPriceSectionValue = (
        positionLeft: Positions,
        positionRight: Positions,
        positionLeftPrice: number,
        positionRightPrice: number,
        ammData: any
    ) => (
        <Value>
            {ammData ? (
                <>
                    <Value color={getColorPerPosition(positionLeft)}>
                        {formatCurrencyWithSign(USD_SIGN, positionLeftPrice)}
                    </Value>
                    {' / '}
                    <Value color={getColorPerPosition(positionRight)}>
                        {formatCurrencyWithSign(USD_SIGN, positionRightPrice)}
                    </Value>
                </>
            ) : (
                '-'
            )}
        </Value>
    );

    const getResultSectionValue = (positionResult: Positions) => (
        <Value color={getColorPerPosition(positionResult)}>{positionResult}</Value>
    );

    return (
        <>
            {market && (
                <Container>
                    <ColumnContainer alignItems="center">
                        <ColumnAnchorSubContainer
                            href={getEtherscanAddressLink(networkId, market.address)}
                            target="_blank"
                            rel="noreferrer"
                        >
                            <CurrencyContainer>
                                <CurrencyIcon
                                    className={`currency-icon currency-icon--${market.currencyKey.toLowerCase()}`}
                                />
                                <CurrencyLabel>{market.currencyKey}</CurrencyLabel>
                            </CurrencyContainer>
                        </ColumnAnchorSubContainer>
                        {!isRangedMarket && (
                            <SubContainer>
                                <Value>
                                    {`${(market as OptionsMarketInfo).IV}% IV`}
                                    <Tooltip
                                        overlay={t('options.home.markets-table.iv-tooltip', {
                                            percentage: (market as OptionsMarketInfo).IV,
                                        })}
                                        iconFontSize={12}
                                    />
                                </Value>
                            </SubContainer>
                        )}
                    </ColumnContainer>
                    {isRangedMarket && (
                        <ColumnContainer>
                            <SubContainer>
                                <Header>{t('options.market.ranged-markets.strike-range')}</Header>
                                <Value>
                                    {`> ${formatCurrencyWithSign(USD_SIGN, (market as RangedMarketData).leftPrice)}`}
                                    <br />
                                    {`< ${formatCurrencyWithSign(USD_SIGN, (market as RangedMarketData).rightPrice)}`}
                                </Value>
                            </SubContainer>
                        </ColumnContainer>
                    )}

                    <ColumnContainer>
                        <SubContainer>
                            <Header>{t('options.market.overview.maturity-date')}</Header>
                            <Value>
                                <MaturityDate maturityDateUnix={market.maturityDate} showFullCounter={true} />
                            </Value>
                        </SubContainer>
                        {isRangedMarket ? (
                            getMarketPriceSection()
                        ) : (
                            <SubContainer>
                                <Header>{t('options.home.market-card.strike-price')}</Header>
                                <Value>
                                    {formatCurrencyWithSign(USD_SIGN, (market as OptionsMarketInfo).strikePrice)}
                                </Value>
                            </SubContainer>
                        )}
                    </ColumnContainer>
                    {!isRangedMarket && (
                        <ColumnContainer>
                            {getMarketPriceSection()}
                            <SubContainer>
                                <Header>{t('options.market.overview.price-difference')}</Header>
                                <Value
                                    color={priceDifference > 0 ? theme.textColor.quaternary : theme.textColor.tertiary}
                                >
                                    {priceDifference ? `${priceDifference.toFixed(2)}%` : 'N/A'}
                                </Value>
                            </SubContainer>
                        </ColumnContainer>
                    )}
                    <ColumnContainer>
                        <SubContainer>
                            <Header>
                                {market?.phase !== 'maturity'
                                    ? t('options.market.overview.my-positions')
                                    : t('options.market.overview.my-position')}
                            </Header>
                            {getMyPositionsSectionValue(
                                isRangedMarket ? Positions.IN : Positions.UP,
                                isRangedMarket ? Positions.OUT : Positions.DOWN,
                                isRangedMarket ? optBalances.in : optBalances.long,
                                isRangedMarket ? optBalances.out : optBalances.short,
                                isRangedMarket ? rangedMarketsBalance.isLoading : accountMarketInfoQuery.isLoading
                            )}
                        </SubContainer>
                        <SubContainer>
                            <Header>
                                {market?.phase !== 'maturity'
                                    ? t('options.market.overview.positions-value')
                                    : t('options.market.overview.position-value')}
                            </Header>
                            <Value>
                                <PositionPrice
                                    market={market}
                                    positionLeftBalance={isRangedMarket ? optBalances.in : optBalances.long}
                                    positionRightBalance={isRangedMarket ? optBalances.out : optBalances.short}
                                    positionLeftValue={
                                        isRangedMarket
                                            ? positionCurrentValue.inPositionValue
                                            : positionCurrentValue.longPositionValue
                                    }
                                    positionRightValue={
                                        isRangedMarket
                                            ? positionCurrentValue.outPositionValue
                                            : positionCurrentValue.shortPositionValue
                                    }
                                    positionResultValue={optBalances[market.result]}
                                    isLoading={
                                        isRangedMarket
                                            ? rangedAmmMaxLimitsQuery.isLoading || rangedMarketsBalance.isLoading
                                            : ammMaxLimitsQuery.isLoading || accountMarketInfoQuery.isLoading
                                    }
                                />
                            </Value>
                        </SubContainer>
                    </ColumnContainer>
                    {market.phase == 'trading' && (
                        <ColumnContainer>
                            <SubContainer>
                                <Header>
                                    {t('options.market.overview.amm-liquidity')}
                                    <Tooltip
                                        overlay={t('options.market.overview.amm-liquidity-tooltip')}
                                        iconFontSize={12}
                                    />
                                </Header>
                                {getLiquiditySectionValue(
                                    isRangedMarket ? Positions.IN : Positions.UP,
                                    isRangedMarket ? Positions.OUT : Positions.DOWN,
                                    (isRangedMarket ? ammData?.maxIn : ammData?.maxUp) || 0,
                                    (isRangedMarket ? ammData?.maxOut : ammData?.maxDown) || 0,
                                    ammData
                                )}
                            </SubContainer>
                            <SubContainer>
                                <Header>{t('options.market.overview.amm-price')}</Header>
                                {getPriceSectionValue(
                                    isRangedMarket ? Positions.IN : Positions.UP,
                                    isRangedMarket ? Positions.OUT : Positions.DOWN,
                                    (isRangedMarket ? ammData?.priceIn : ammData?.priceUp) || 0,
                                    (isRangedMarket ? ammData?.priceOut : ammData?.priceDown) || 0,
                                    ammData
                                )}
                            </SubContainer>
                        </ColumnContainer>
                    )}
                    {market?.phase == 'maturity' && (
                        <ColumnContainer>
                            <SubContainer>
                                <Header>{t('options.market.overview.final-result')}</Header>
                                {getResultSectionValue(
                                    isRangedMarket
                                        ? market.result == 'out'
                                            ? Positions.OUT
                                            : Positions.IN
                                        : market.result == 'long'
                                        ? Positions.UP
                                        : Positions.DOWN
                                )}
                            </SubContainer>
                            <SubContainer hidden={true}>
                                <Header>{'Hidden'}</Header>
                                <Value>{'Hidden'}</Value>
                            </SubContainer>
                        </ColumnContainer>
                    )}
                </Container>
            )}
        </>
    );
};

type PositionPriceProps = {
    market: OptionsMarketInfo | RangedMarketData;
    positionLeftBalance: number;
    positionRightBalance: number;
    positionLeftValue: number;
    positionRightValue: number;
    positionResultValue: number;
    isLoading: boolean;
};

const PositionPrice: React.FC<PositionPriceProps> = ({
    market,
    positionLeftBalance,
    positionRightBalance,
    positionLeftValue,
    positionRightValue,
    positionResultValue,
    isLoading,
}) => {
    const { t } = useTranslation();
    if (market.phase == 'maturity' && market.result) {
        return <>{`${formatCurrencyWithSign(USD_SIGN, positionResultValue)}`}</>;
    }

    const noPositions = positionLeftBalance == 0 && positionRightBalance == 0;
    const hasBothPositions = positionLeftBalance > 0 && positionRightBalance > 0;
    const isLeftOfLiqudity = positionLeftBalance > 0 && positionLeftValue == 0;
    const isRightOfLiqudity = positionRightBalance > 0 && positionRightValue == 0;
    const areBothOutOfLiqudity = isLeftOfLiqudity && isRightOfLiqudity;

    return isLoading ? (
        <>{'-'}</>
    ) : (
        <>
            {positionLeftBalance > 0 &&
                positionLeftValue > 0 &&
                `${formatCurrencyWithSign(USD_SIGN, positionLeftValue)}`}
            {(isLeftOfLiqudity || areBothOutOfLiqudity) && (
                <>
                    N/A
                    <Tooltip
                        overlay={
                            <Trans
                                i18nKey={t('options.home.market-card.no-liquidity-tooltip')}
                                components={[
                                    <span key="1">
                                        <UsingAmmLink key="2" />
                                    </span>,
                                ]}
                            />
                        }
                        iconFontSize={12}
                    />
                </>
            )}

            {hasBothPositions && !areBothOutOfLiqudity && ' / '}

            {positionRightValue > 0 &&
                positionRightValue > 0 &&
                `${formatCurrencyWithSign(USD_SIGN, positionRightValue)}`}
            {isRightOfLiqudity && !areBothOutOfLiqudity && (
                <>
                    N/A
                    <Tooltip
                        overlay={
                            <Trans
                                i18nKey={t('options.home.market-card.no-liquidity-tooltip')}
                                components={[
                                    <span key="1">
                                        <UsingAmmLink key="2" />
                                    </span>,
                                ]}
                            />
                        }
                        iconFontSize={12}
                    />
                </>
            )}

            {noPositions && <>N/A</>}
        </>
    );
};

export default RowCard;
