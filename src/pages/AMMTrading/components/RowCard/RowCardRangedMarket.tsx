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
import { useRangedMarketContext } from 'pages/AMMTrading/contexts/RangedMarketContext';
import { useSelector } from 'react-redux';
import { RootState } from 'redux/rootReducer';
import { getIsWalletConnected, getNetworkId, getWalletAddress } from 'redux/modules/wallet';
import { getIsAppReady } from 'redux/modules/app';
import useRangedAMMMaxLimitsQuery, {
    RangeAmmMaxLimits,
} from 'queries/options/rangedMarkets/useRangedAMMMaxLimitsQuery';
import { RangedMarketBalanceInfo, RangedMarketData } from 'types/options';
import { formatCurrency, formatCurrencyWithSign } from 'utils/formatters/number';
import { USD_SIGN } from 'constants/currency';
import { Trans, useTranslation } from 'react-i18next';
import { getIsBuy } from 'redux/modules/marketWidgets';
import Tooltip from 'components/TooltipV2';
import { getEtherscanAddressLink } from 'utils/etherscan';
import useRangedMarketPositionBalanceQuery from 'queries/options/rangedMarkets/useRangedMarketPositionBalanceQuery';
import { Positions } from 'constants/options';
import { ThemeInterface } from 'types/ui';
import { useTheme } from 'styled-components';

const RowCardRangedMarket: React.FC = () => {
    const marketInfo = useRangedMarketContext();
    const { t } = useTranslation();
    const theme: ThemeInterface = useTheme();
    const isBuy = useSelector((state: RootState) => getIsBuy(state));
    const networkId = useSelector((state: RootState) => getNetworkId(state));

    let optBalances = {
        in: 0,
        out: 0,
    };

    const isWalletConnected = useSelector((state: RootState) => getIsWalletConnected(state));
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state)) || '';
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));

    const rangedMarketPositionBalance = useRangedMarketPositionBalanceQuery(
        marketInfo.address,
        walletAddress,
        networkId,
        {
            enabled: isAppReady && isWalletConnected,
        }
    );
    const ammMaxLimitsQuery = useRangedAMMMaxLimitsQuery(marketInfo.address, networkId, {
        enabled: isAppReady,
    });

    if (isWalletConnected && rangedMarketPositionBalance.isSuccess && rangedMarketPositionBalance.data) {
        optBalances = rangedMarketPositionBalance.data as RangedMarketBalanceInfo;
    }

    const ammMaxLimits =
        ammMaxLimitsQuery.isSuccess && ammMaxLimitsQuery.data
            ? (ammMaxLimitsQuery.data as RangeAmmMaxLimits)
            : undefined;

    const ammData = useMemo(() => {
        if (!ammMaxLimits) return undefined;

        return {
            maxIn: isBuy ? ammMaxLimits?.in.maxBuy : ammMaxLimits?.in.maxSell,
            maxOut: isBuy ? ammMaxLimits.out.maxBuy : ammMaxLimits.out.maxSell,
            priceIn: isBuy ? ammMaxLimits.in.buyPrice : ammMaxLimits.in.sellPrice,
            priceOut: isBuy ? ammMaxLimits.out.buyPrice : ammMaxLimits.out.sellPrice,
        };
    }, [ammMaxLimits, isBuy]);

    const positionCurrentValue = useMemo(() => {
        if (ammMaxLimitsQuery?.isSuccess && (optBalances?.in > 0 || optBalances?.out > 0)) {
            const inPosition = ammMaxLimitsQuery?.data?.in;
            const outPosition = ammMaxLimitsQuery?.data?.out;
            return {
                inPositionValue:
                    inPosition.sellPrice && inPosition.sellPrice > 0 && optBalances?.in > 0
                        ? inPosition.sellPrice * optBalances?.in
                        : 0,
                outPositionValue:
                    outPosition.sellPrice && outPosition.sellPrice > 0 && optBalances?.out > 0
                        ? outPosition.sellPrice * optBalances?.out
                        : 0,
            };
        }
        return {
            inPositionValue: 0,
            outPositionValue: 0,
        };
    }, [ammMaxLimitsQuery.isLoading, optBalances?.in, optBalances?.out]);

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
                    </ColumnContainer>
                    <ColumnContainer>
                        <SubContainer>
                            <Header>{t('options.market.ranged-markets.strike-range')}</Header>
                            <Value>
                                {`> ${formatCurrencyWithSign(USD_SIGN, marketInfo.leftPrice)}`}
                                <br />
                                {`< ${formatCurrencyWithSign(USD_SIGN, marketInfo.rightPrice)}`}
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
                    </ColumnContainer>
                    <ColumnContainer>
                        <SubContainer>
                            <Header>
                                {marketInfo?.phase !== 'maturity'
                                    ? t('options.market.overview.my-positions')
                                    : t('options.market.overview.my-position')}
                            </Header>
                            <Value>
                                {optBalances?.in > 0 && <Value>{formatCurrency(optBalances?.in)} </Value>}
                                {optBalances?.in > 0 && <Value color={theme.positionColor.in}>{Positions.IN}</Value>}
                                {optBalances?.in > 0 && optBalances?.out > 0 && ' / '}
                                {optBalances?.out > 0 && <Value>{formatCurrency(optBalances?.out)} </Value>}
                                {optBalances?.out > 0 && <Value color={theme.positionColor.out}>{Positions.OUT}</Value>}
                                {rangedMarketPositionBalance.isLoading
                                    ? '-'
                                    : optBalances?.in == 0 && optBalances?.out == 0 && 'N/A'}
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
                                    isLoading={ammMaxLimitsQuery.isLoading || rangedMarketPositionBalance.isLoading}
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
                                    {(ammData && ammData.maxIn > 0) || (ammData && ammData.maxOut > 0) ? (
                                        <>
                                            <Value color={theme.positionColor.in}>
                                                {ammData ? formatCurrency(ammData.maxIn, 0) : '0'}
                                            </Value>
                                            {' / '}
                                            <Value color={theme.positionColor.out}>
                                                {ammData ? formatCurrency(ammData.maxOut, 0) : '0'}
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
                                    <Value color={theme.positionColor.in}>
                                        {ammData ? formatCurrencyWithSign(USD_SIGN, ammData.priceIn) : '0'}
                                    </Value>
                                    {' / '}
                                    <Value color={theme.positionColor.out}>
                                        {ammData ? formatCurrencyWithSign(USD_SIGN, ammData.priceOut) : '0'}
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
                                        marketInfo.result == 'out' ? theme.positionColor.out : theme.positionColor.in
                                    }
                                >
                                    {marketInfo.result == 'out' ? Positions.OUT : Positions.IN}
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
    marketInfo: RangedMarketData;
    optBalances: {
        in: number;
        out: number;
    };
    positionCurrentValue: {
        inPositionValue: number;
        outPositionValue: number;
    };
    isLoading?: boolean;
};

const PositionPrice: React.FC<PositionPriceProps> = ({ marketInfo, optBalances, positionCurrentValue, isLoading }) => {
    const { t } = useTranslation();
    if (marketInfo?.phase == 'maturity' && marketInfo?.result) {
        return <>{`${formatCurrencyWithSign(USD_SIGN, optBalances[marketInfo?.result])}`}</>;
    }

    const noPositions = optBalances.in == 0 && optBalances.out == 0;
    const hasBothPositions = optBalances.in > 0 && optBalances.out > 0;
    const isInOutOfLiqudity = optBalances.in > 0 && positionCurrentValue.inPositionValue == 0;
    const isOutOutOfLiqudity = optBalances.out > 0 && positionCurrentValue.outPositionValue == 0;
    const areBothOutOfLiqudity = isInOutOfLiqudity && isOutOutOfLiqudity;

    return isLoading ? (
        <>{'-'}</>
    ) : (
        <>
            {optBalances.in > 0 &&
                positionCurrentValue.inPositionValue > 0 &&
                `${formatCurrencyWithSign(USD_SIGN, positionCurrentValue.inPositionValue)}`}
            {(isInOutOfLiqudity || areBothOutOfLiqudity) && (
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

            {optBalances.out > 0 &&
                positionCurrentValue.outPositionValue > 0 &&
                `${formatCurrencyWithSign(USD_SIGN, positionCurrentValue.outPositionValue)}`}
            {isOutOutOfLiqudity && !areBothOutOfLiqudity && (
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

export default RowCardRangedMarket;
