import React, { useMemo } from 'react';

import Container from './styled-components/Container';
import MaturityDate from '../MaturityDate';
import CurrencyIcon from 'components/Currency/v2/CurrencyIcon';

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
import { currencyKeyToDataFeedSourceMap, USD_SIGN } from 'constants/currency';
import { Trans, useTranslation } from 'react-i18next';
import { UI_COLORS } from 'constants/ui';
import { getIsBuyState } from 'redux/modules/marketWidgets';
import Tooltip from 'components/Tooltip';
import { getEtherscanAddressLink } from 'utils/etherscan';
import useRangedMarketPositionBalanceQuery from 'queries/options/rangedMarkets/useRangedMarketPositionBalanceQuery';
import { StyledMaterialTooltip, UsingAmmLink } from 'pages/Profile/components/MyPositions/MyPositions';
import { ReactComponent as InfoIcon } from 'assets/images/info.svg';
import styled from 'styled-components';

const RowCardRangedMarket: React.FC = () => {
    const marketInfo = useRangedMarketContext();
    const { t } = useTranslation();
    const isBuy = useSelector((state: RootState) => getIsBuyState(state));
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
                    <Container.ColumnContainer currency={true} alignItems={'center'}>
                        <Container.ColumnAnchorSubContainer
                            href={getEtherscanAddressLink(networkId, marketInfo.address)}
                            target="_blank"
                            rel="noreferrer"
                        >
                            <Container.SubContainer>
                                <CurrencyIcon
                                    synthIconStyle={{
                                        height: '51px',
                                        width: '51px',
                                        marginRight: '0px !important',
                                    }}
                                    iconType={3}
                                    currencyKey={marketInfo.currencyKey}
                                    width={'51px'}
                                    height={'51px'}
                                />
                            </Container.SubContainer>
                            <Container.SubContainer>
                                <Container.SubContainer.Value>
                                    {marketInfo.currencyKey}
                                    {currencyKeyToDataFeedSourceMap[marketInfo.currencyKey]?.source == 'TWAP' && (
                                        <Tooltip
                                            message={t('options.home.markets-table.twap-tooltip')}
                                            link={currencyKeyToDataFeedSourceMap[marketInfo.currencyKey]?.link}
                                            type={'info'}
                                            iconColor={'var(--color-white)'}
                                            container={{ width: '15px' }}
                                            interactive={true}
                                        />
                                    )}
                                </Container.SubContainer.Value>
                            </Container.SubContainer>
                        </Container.ColumnAnchorSubContainer>
                    </Container.ColumnContainer>
                    <Container.ColumnContainer>
                        <Container.SubContainer>
                            <Container.SubContainer.Header>
                                {t('options.market.overview.maturity-date')}
                            </Container.SubContainer.Header>
                            <Container.SubContainer.Value>
                                <MaturityDate maturityDateUnix={marketInfo.maturityDate} showFullCounter={true} />
                            </Container.SubContainer.Value>
                        </Container.SubContainer>
                        <Container.SubContainer>
                            <Container.SubContainer.Header>
                                {t('options.market.ranged-markets.strike-range')}
                            </Container.SubContainer.Header>
                            <Container.SubContainer.Value>
                                {`> ${formatCurrencyWithSign(USD_SIGN, marketInfo.leftPrice)}`}
                                <br />
                                {`< ${formatCurrencyWithSign(USD_SIGN, marketInfo.rightPrice)}`}
                            </Container.SubContainer.Value>
                        </Container.SubContainer>
                    </Container.ColumnContainer>
                    <Container.Divider />
                    <Container.ColumnContainer>
                        <Container.SubContainer>
                            <Container.SubContainer.Header>
                                {marketInfo?.phase == 'maturity'
                                    ? t('options.market.overview.final-price-label', {
                                          currencyKey: marketInfo.currencyKey,
                                      })
                                    : t('options.home.market-card.current-asset-price')}
                            </Container.SubContainer.Header>
                            <Container.SubContainer.Value>
                                {marketInfo?.phase == 'maturity'
                                    ? formatCurrencyWithSign(USD_SIGN, marketInfo.finalPrice)
                                    : formatCurrencyWithSign(USD_SIGN, marketInfo.currentPrice)}
                                {}
                            </Container.SubContainer.Value>
                        </Container.SubContainer>
                    </Container.ColumnContainer>
                    <Container.Divider />
                    <Container.ColumnContainer>
                        <Container.SubContainer>
                            <Container.SubContainer.Header>
                                {marketInfo?.phase !== 'maturity'
                                    ? t('options.market.overview.my-positions')
                                    : t('options.market.overview.my-position')}
                            </Container.SubContainer.Header>
                            <Container.SubContainer.Value>
                                {optBalances?.in > 0 && `${formatCurrency(optBalances?.in)}`}
                                {optBalances?.in > 0 && (
                                    <Container.Icon className="v2-icon v2-icon--in" color={UI_COLORS.IN_COLOR} />
                                )}
                                {optBalances?.in > 0 && optBalances?.out > 0 && ' / '}
                                {optBalances?.out > 0 && `${formatCurrency(optBalances?.out)}`}
                                {optBalances?.out > 0 && (
                                    <Container.Icon className="v2-icon v2-icon--out" color={UI_COLORS.OUT_COLOR} />
                                )}
                                {rangedMarketPositionBalance.isLoading
                                    ? '-'
                                    : optBalances?.in == 0 && optBalances?.out == 0 && 'N/A'}
                            </Container.SubContainer.Value>
                        </Container.SubContainer>
                        <Container.SubContainer>
                            <Container.SubContainer.Header>
                                {marketInfo?.phase !== 'maturity'
                                    ? t('options.market.overview.positions-value')
                                    : t('options.market.overview.position-value')}
                            </Container.SubContainer.Header>
                            <Container.SubContainer.Value>
                                <PositionPrice
                                    marketInfo={marketInfo}
                                    positionCurrentValue={positionCurrentValue}
                                    optBalances={optBalances}
                                    isLoading={ammMaxLimitsQuery.isLoading || rangedMarketPositionBalance.isLoading}
                                />
                            </Container.SubContainer.Value>
                        </Container.SubContainer>
                    </Container.ColumnContainer>
                    <Container.Divider />
                    {marketInfo.phase == 'trading' && (
                        <Container.ColumnContainer>
                            <Container.SubContainer>
                                <Container.SubContainer.Header>
                                    {t('options.market.overview.amm-liquidity')}
                                    <Tooltip
                                        message={t('options.market.overview.range-amm-liquidity-tooltip')}
                                        type={'info'}
                                        placement={'right'}
                                        container={{ alignItems: 'center' }}
                                    />
                                </Container.SubContainer.Header>
                                <Container.SubContainer.Value>
                                    {(ammData && ammData.maxIn > 0) || (ammData && ammData.maxOut > 0) ? (
                                        <>
                                            <Container.SubContainer.Value.Liquidity inLiqFlag={true}>
                                                {ammData ? ammData.maxIn?.toFixed(1) : '0'}
                                            </Container.SubContainer.Value.Liquidity>
                                            {' / '}
                                            <Container.SubContainer.Value.Liquidity inLiqFlag={false}>
                                                {ammData ? ammData.maxOut?.toFixed(1) : '0'}
                                            </Container.SubContainer.Value.Liquidity>
                                        </>
                                    ) : (
                                        <Container.SubContainer.Value.OutOfLiquidity>
                                            {ammData ? t('options.home.markets-table.out-of-liquidity') : ''}
                                        </Container.SubContainer.Value.OutOfLiquidity>
                                    )}
                                </Container.SubContainer.Value>
                            </Container.SubContainer>
                            <Container.SubContainer>
                                <Container.SubContainer.Header>
                                    {t('options.market.overview.amm-price')}
                                </Container.SubContainer.Header>
                                <Container.SubContainer.Value>
                                    <Container.SubContainer.Value.Liquidity inLiqFlag={true}>
                                        {ammData ? formatCurrencyWithSign(USD_SIGN, ammData.priceIn, 3) : '0'}
                                    </Container.SubContainer.Value.Liquidity>
                                    {' / '}
                                    <Container.SubContainer.Value.Liquidity inLiqFlag={false}>
                                        {ammData ? formatCurrencyWithSign(USD_SIGN, ammData.priceOut, 3) : '0'}
                                    </Container.SubContainer.Value.Liquidity>
                                </Container.SubContainer.Value>
                            </Container.SubContainer>
                        </Container.ColumnContainer>
                    )}
                    {marketInfo?.phase == 'maturity' && (
                        <Container.ColumnContainer>
                            <Container.SubContainer>
                                <Container.SubContainer.Header>
                                    {t('options.market.overview.final-result')}
                                </Container.SubContainer.Header>
                                <Container.SubContainer.Value>
                                    <Container.Icon
                                        className={`v2-icon ${
                                            marketInfo.result == 'in' ? 'v2-icon--in' : 'v2-icon--out'
                                        }`}
                                        color={marketInfo.result == 'out' ? UI_COLORS.OUT_COLOR : UI_COLORS.IN_COLOR}
                                    />
                                </Container.SubContainer.Value>
                            </Container.SubContainer>
                            <Container.SubContainer hidden={true}>
                                <Container.SubContainer.Header>{'Hidden'}</Container.SubContainer.Header>
                                <Container.SubContainer.Value>{'Hidden'}</Container.SubContainer.Value>
                            </Container.SubContainer>
                        </Container.ColumnContainer>
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
                    <StyledMaterialTooltip
                        arrow={true}
                        title={
                            <Trans
                                i18nKey={t('options.home.market-card.no-liquidity-tooltip')}
                                components={[
                                    <span key="1">
                                        <UsingAmmLink key="2" />
                                    </span>,
                                ]}
                            />
                        }
                        interactive
                    >
                        <StyledInfoIcon />
                    </StyledMaterialTooltip>
                </>
            )}

            {hasBothPositions && !areBothOutOfLiqudity && ' / '}

            {optBalances.out > 0 &&
                positionCurrentValue.outPositionValue > 0 &&
                `${formatCurrencyWithSign(USD_SIGN, positionCurrentValue.outPositionValue)}`}
            {isOutOutOfLiqudity && !areBothOutOfLiqudity && (
                <>
                    N/A
                    <StyledMaterialTooltip
                        arrow={true}
                        title={
                            <Trans
                                i18nKey={t('options.home.market-card.no-liquidity-tooltip')}
                                components={[
                                    <span key="1">
                                        <UsingAmmLink key="2" />
                                    </span>,
                                ]}
                            />
                        }
                        interactive
                    >
                        <StyledInfoIcon />
                    </StyledMaterialTooltip>
                </>
            )}

            {noPositions && <>N/A</>}
        </>
    );
};

export const StyledInfoIcon = styled(InfoIcon)`
    min-width: 20px;
    min-height: 20px;
    margin-left: 6px;
    margin-top: 3px;
`;

export default RowCardRangedMarket;
