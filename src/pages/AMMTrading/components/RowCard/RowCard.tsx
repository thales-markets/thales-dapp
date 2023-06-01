import React, { useMemo } from 'react';
import {
    Container,
    ColumnContainer,
    Header,
    SubContainer,
    Value,
    CurrencyContainer,
    CurrencyIcon,
    CurrencyLabel,
    ColumnAnchorSubContainer,
    UsingAmmLink,
} from './styled-components';
import MaturityDate from '../MaturityDate';
import { useMarketContext } from '../../contexts/MarketContext';
import { useSelector } from 'react-redux';
import { RootState } from 'redux/rootReducer';
import { getIsWalletConnected, getNetworkId, getWalletAddress } from 'redux/modules/wallet';
import { getIsAppReady } from 'redux/modules/app';
import useAmmMaxLimitsQuery, { AmmMaxLimits } from 'queries/options/useAmmMaxLimitsQuery';
import useBinaryOptionsAccountMarketInfoQuery from 'queries/options/useBinaryOptionsAccountMarketInfoQuery';
import { AccountMarketInfo, OptionsMarketInfo } from 'types/options';
import {
    formatCurrency,
    formatCurrencyWithPrecision,
    formatCurrencyWithSign,
    formatPricePercentageDifference,
} from 'utils/formatters/number';
import { USD_SIGN } from 'constants/currency';
import { Trans, useTranslation } from 'react-i18next';
import { getIsBuy } from 'redux/modules/marketWidgets';
import Tooltip from 'components/TooltipV2';
import { getEtherscanAddressLink } from 'utils/etherscan';
import { Positions } from 'constants/options';
import { ThemeInterface } from 'types/ui';
import { useTheme } from 'styled-components';

const RowCard: React.FC = () => {
    const marketInfo = useMarketContext();
    const { t } = useTranslation();
    const theme: ThemeInterface = useTheme();
    const isBuy = useSelector((state: RootState) => getIsBuy(state));
    const networkId = useSelector((state: RootState) => getNetworkId(state));

    let optBalances = {
        long: 0,
        short: 0,
    };

    const isWalletConnected = useSelector((state: RootState) => getIsWalletConnected(state));
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state)) || '';
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));

    const accountMarketInfoQuery = useBinaryOptionsAccountMarketInfoQuery(marketInfo.address, walletAddress, {
        enabled: isAppReady && isWalletConnected,
    });
    const ammMaxLimitsQuery = useAmmMaxLimitsQuery(marketInfo.address, networkId, {
        enabled: isAppReady,
    });

    if (isWalletConnected && accountMarketInfoQuery.isSuccess && accountMarketInfoQuery.data) {
        optBalances = accountMarketInfoQuery.data as AccountMarketInfo;
    }

    const ammMaxLimits =
        ammMaxLimitsQuery.isSuccess && ammMaxLimitsQuery.data ? (ammMaxLimitsQuery.data as AmmMaxLimits) : undefined;

    const ammData = useMemo(() => {
        if (!ammMaxLimits) return undefined;

        return {
            maxUp: isBuy ? ammMaxLimits.maxBuyLong : ammMaxLimits.maxSellLong,
            maxDown: isBuy ? ammMaxLimits.maxBuyShort : ammMaxLimits.maxSellShort,
            priceUp: isBuy ? ammMaxLimits.buyLongPrice : ammMaxLimits.sellLongPrice,
            priceDown: isBuy ? ammMaxLimits.buyShortPrice : ammMaxLimits.sellShortPrice,
        };
    }, [ammMaxLimits, isBuy]);

    const positionCurrentValue = useMemo(() => {
        if (ammMaxLimitsQuery.isSuccess && (optBalances.long > 0 || optBalances.short > 0)) {
            const { sellLongPrice, sellShortPrice } = ammMaxLimitsQuery.data;

            return {
                longPositionValue:
                    sellLongPrice && sellLongPrice > 0 && optBalances?.long > 0 ? sellLongPrice * optBalances.long : 0,
                shortPositionValue:
                    sellShortPrice && sellShortPrice > 0 && optBalances.short > 0
                        ? sellShortPrice * optBalances.short
                        : 0,
            };
        }
        return {
            longPositionValue: 0,
            shortPositionValue: 0,
        };
    }, [ammMaxLimitsQuery.isLoading, optBalances.long, optBalances.short]);

    const priceDifference = useMemo(() => {
        return formatPricePercentageDifference(
            marketInfo.strikePrice,
            marketInfo?.phase == 'maturity' ? marketInfo.finalPrice : marketInfo.currentPrice
        );
    }, [marketInfo.currentPrice, marketInfo.strikePrice, marketInfo?.phase]);

    return (
        <>
            {marketInfo && (
                <Container>
                    <ColumnContainer alignItems="center">
                        <ColumnAnchorSubContainer
                            href={getEtherscanAddressLink(networkId, marketInfo.address)}
                            target="_blank"
                            rel="noreferrer"
                        >
                            <CurrencyContainer>
                                <CurrencyIcon
                                    className={`currency-icon currency-icon--${marketInfo.currencyKey.toLowerCase()}`}
                                />
                                <CurrencyLabel>{marketInfo.currencyKey}</CurrencyLabel>
                            </CurrencyContainer>
                        </ColumnAnchorSubContainer>
                        <SubContainer>
                            <Value>
                                {`${marketInfo.IV}% IV`}
                                <Tooltip
                                    overlay={t('options.home.markets-table.iv-tooltip', {
                                        percentage: marketInfo.IV,
                                    })}
                                    iconFontSize={12}
                                />
                            </Value>
                        </SubContainer>
                    </ColumnContainer>
                    <ColumnContainer>
                        <SubContainer>
                            <Header>{t('options.market.overview.maturity-date')}</Header>
                            <Value>
                                <MaturityDate maturityDateUnix={marketInfo.maturityDate} showFullCounter={true} />
                            </Value>
                        </SubContainer>
                        <SubContainer>
                            <Header>{t('options.home.market-card.strike-price')}</Header>
                            <Value>{formatCurrencyWithSign(USD_SIGN, marketInfo.strikePrice)}</Value>
                        </SubContainer>
                    </ColumnContainer>
                    <ColumnContainer>
                        <SubContainer>
                            <Header>
                                {marketInfo?.phase == 'maturity'
                                    ? t('options.market.overview.final-price-label', {
                                          currencyKey: marketInfo.currencyKey,
                                      })
                                    : t('options.home.market-card.current-asset-price')}
                            </Header>
                            <Value>
                                {marketInfo?.phase == 'maturity'
                                    ? formatCurrencyWithSign(USD_SIGN, marketInfo.finalPrice)
                                    : formatCurrencyWithSign(USD_SIGN, marketInfo.currentPrice)}
                                {}
                            </Value>
                        </SubContainer>
                        <SubContainer>
                            <Header>{t('options.market.overview.price-difference')}</Header>
                            <Value color={priceDifference > 0 ? theme.textColor.quaternary : theme.textColor.tertiary}>
                                {priceDifference ? `${priceDifference.toFixed(2)}%` : 'N/A'}
                            </Value>
                        </SubContainer>
                    </ColumnContainer>
                    <ColumnContainer>
                        <SubContainer>
                            <Header>
                                {marketInfo?.phase !== 'maturity'
                                    ? t('options.market.overview.my-positions')
                                    : t('options.market.overview.my-position')}
                            </Header>
                            <Value>
                                {optBalances?.long > 0 && (
                                    <Value>{formatCurrencyWithPrecision(optBalances?.long)} </Value>
                                )}
                                {optBalances?.long > 0 && <Value color={theme.positionColor.up}>{Positions.UP}</Value>}
                                {optBalances?.long > 0 && optBalances?.short > 0 && ' / '}
                                {optBalances?.short > 0 && (
                                    <Value>{formatCurrencyWithPrecision(optBalances?.short)} </Value>
                                )}
                                {optBalances?.short > 0 && (
                                    <Value color={theme.positionColor.down}>{Positions.DOWN}</Value>
                                )}
                                {accountMarketInfoQuery.isLoading
                                    ? '-'
                                    : optBalances?.long == 0 && optBalances?.short == 0 && 'N/A'}
                            </Value>
                        </SubContainer>
                        <SubContainer>
                            <Header>
                                {marketInfo?.phase !== 'maturity'
                                    ? t('options.market.overview.positions-value')
                                    : t('options.market.overview.position-value')}
                            </Header>
                            <Value>
                                <PositionPrice
                                    marketInfo={marketInfo}
                                    positionCurrentValue={positionCurrentValue}
                                    optBalances={optBalances}
                                    isLoading={ammMaxLimitsQuery.isLoading || accountMarketInfoQuery.isLoading}
                                />
                            </Value>
                        </SubContainer>
                    </ColumnContainer>
                    {marketInfo.phase == 'trading' && (
                        <ColumnContainer>
                            <SubContainer>
                                <Header>
                                    {t('options.market.overview.amm-liquidity')}
                                    <Tooltip
                                        overlay={t('options.market.overview.amm-liquidity-tooltip')}
                                        iconFontSize={12}
                                    />
                                </Header>
                                <Value>
                                    {(ammData && ammData.maxUp > 0) || (ammData && ammData.maxDown > 0) ? (
                                        <>
                                            <Value color={theme.positionColor.up}>
                                                {ammData ? formatCurrency(ammData.maxUp, 0) : '0'}
                                            </Value>
                                            {' / '}
                                            <Value color={theme.positionColor.down}>
                                                {ammData ? formatCurrency(ammData.maxDown, 0) : '0'}
                                            </Value>
                                        </>
                                    ) : (
                                        <Value color={theme.warning.textColor.primary}>
                                            {ammData ? t('options.home.markets-table.out-of-liquidity') : ''}
                                        </Value>
                                    )}
                                </Value>
                            </SubContainer>
                            <SubContainer>
                                <Header>{t('options.market.overview.amm-price')}</Header>
                                <Value>
                                    <Value color={theme.positionColor.up}>
                                        {ammData ? formatCurrencyWithSign(USD_SIGN, ammData.priceUp) : '0'}
                                    </Value>
                                    {' / '}
                                    <Value color={theme.positionColor.down}>
                                        {ammData ? formatCurrencyWithSign(USD_SIGN, ammData.priceDown) : '0'}
                                    </Value>
                                </Value>
                            </SubContainer>
                        </ColumnContainer>
                    )}
                    {marketInfo?.phase == 'maturity' && (
                        <ColumnContainer>
                            <SubContainer>
                                <Header>{t('options.market.overview.final-result')}</Header>
                                <Value
                                    color={
                                        marketInfo.result == 'long' ? theme.positionColor.up : theme.positionColor.down
                                    }
                                >
                                    {marketInfo.result == 'long' ? Positions.UP : Positions.DOWN}
                                </Value>
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
    marketInfo: OptionsMarketInfo;
    optBalances: {
        long: number;
        short: number;
    };
    positionCurrentValue: {
        longPositionValue: number;
        shortPositionValue: number;
    };
    isLoading?: boolean;
};

const PositionPrice: React.FC<PositionPriceProps> = ({ marketInfo, optBalances, positionCurrentValue, isLoading }) => {
    const { t } = useTranslation();
    if (marketInfo?.phase == 'maturity' && marketInfo?.result) {
        return <>{`${formatCurrencyWithSign(USD_SIGN, optBalances[marketInfo?.result])}`}</>;
    }

    const noPositions = optBalances.long == 0 && optBalances.short == 0;
    const hasBothPositions = optBalances.long > 0 && optBalances.short > 0;
    const isLongOutOfLiqudity = optBalances.long > 0 && positionCurrentValue.longPositionValue == 0;
    const isShortOutOfLiqudity = optBalances.short > 0 && positionCurrentValue.shortPositionValue == 0;
    const areBothOutOfLiqudity = isLongOutOfLiqudity && isShortOutOfLiqudity;

    return isLoading ? (
        <>{'-'}</>
    ) : (
        <>
            {optBalances.long > 0 &&
                positionCurrentValue.longPositionValue > 0 &&
                `${formatCurrencyWithSign(USD_SIGN, positionCurrentValue.longPositionValue)}`}
            {(isLongOutOfLiqudity || areBothOutOfLiqudity) && (
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

            {optBalances.short > 0 &&
                positionCurrentValue.shortPositionValue > 0 &&
                `${formatCurrencyWithSign(USD_SIGN, positionCurrentValue.shortPositionValue)}`}
            {isShortOutOfLiqudity && !areBothOutOfLiqudity && (
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
