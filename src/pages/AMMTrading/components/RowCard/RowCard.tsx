import React, { useMemo } from 'react';
import { useDispatch } from 'react-redux';

import PriceChart from 'components/Charts/PriceChart';
import Container from './styled-components/Container';
import MaturityDate from '../MaturityDate';
import CurrencyIcon from 'components/Currency/v2/CurrencyIcon';

import { useMarketContext } from '../../contexts/MarketContext';

import { useSelector } from 'react-redux';
import { RootState } from 'redux/rootReducer';
import { getIsWalletConnected, getWalletAddress } from 'redux/modules/wallet';
import { getIsAppReady } from 'redux/modules/app';

import useAmmMaxLimitsQuery, { AmmMaxLimits } from 'queries/options/useAmmMaxLimitsQuery';
import useBinaryOptionsAccountMarketInfoQuery from 'queries/options/useBinaryOptionsAccountMarketInfoQuery';

import { AccountMarketInfo, OptionsMarketInfo } from 'types/options';
import { formatCurrency, formatCurrencyWithSign, formatPricePercentageDifference } from 'utils/formatters/number';
import { USD_SIGN } from 'constants/currency';
import { useTranslation } from 'react-i18next';
import { UI_COLORS } from 'constants/ui';
import Button from 'components/Button';
import { getIsBuyState, getSimilarMarketsVisibility, setSimilarMarketVisibility } from 'redux/modules/marketWidgets';

const RowCard: React.FC = () => {
    const marketInfo = useMarketContext();
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const similarMarketsVisibility = useSelector((state: RootState) => getSimilarMarketsVisibility(state));
    const isBuy = useSelector((state: RootState) => getIsBuyState(state));

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
    const ammMaxLimitsQuery = useAmmMaxLimitsQuery(marketInfo.address, {
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
            maxUp: isBuy ? ammMaxLimits?.maxBuyLong : ammMaxLimits?.maxSellLong,
            maxDown: isBuy ? ammMaxLimits.maxBuyShort : ammMaxLimits.maxSellShort,
            priceUp: isBuy ? ammMaxLimits.buyLongPrice : ammMaxLimits.sellLongPrice,
            priceDown: isBuy ? ammMaxLimits.buyShortPrice : ammMaxLimits.sellShortPrice,
        };
    }, [ammMaxLimits, isBuy]);

    const positionCurrentValue = useMemo(() => {
        if (ammMaxLimitsQuery?.isSuccess && (optBalances?.long > 0 || optBalances?.short > 0)) {
            const { sellLongPrice, sellShortPrice } = ammMaxLimitsQuery?.data;

            return {
                longPositionValue:
                    sellLongPrice && sellLongPrice > 0 && optBalances?.long > 0
                        ? sellLongPrice * optBalances?.long
                        : null,
                shortPositionValue:
                    sellShortPrice && sellShortPrice > 0 && optBalances?.short > 0
                        ? sellShortPrice * optBalances?.short
                        : null,
            };
        }
    }, [ammMaxLimitsQuery.isLoading, optBalances?.long, optBalances?.short]);

    const priceDifference = useMemo(() => {
        return formatPricePercentageDifference(marketInfo.strikePrice, marketInfo.currentPrice);
    }, [marketInfo.currentPrice, marketInfo.strikePrice]);

    return (
        <>
            {marketInfo && (
                <Container>
                    <Container.ColumnContainer currency={true} alignItems={'center'}>
                        <Container.SubContainer>
                            <CurrencyIcon
                                synthIconStyle={{
                                    height: '51px',
                                    width: '51px',
                                    marginRight: '0px !important',
                                }}
                                currencyKey={marketInfo.currencyKey}
                                width={'51px'}
                                height={'51px'}
                            />
                        </Container.SubContainer>
                        <Container.SubContainer>
                            <Container.SubContainer.Value>{marketInfo.currencyKey}</Container.SubContainer.Value>
                        </Container.SubContainer>
                    </Container.ColumnContainer>
                    <Container.ColumnContainer>
                        <Container.SubContainer>
                            <Container.SubContainer.Header>
                                {t('options.market.overview.maturity-date')}
                            </Container.SubContainer.Header>
                            <Container.SubContainer.Value>
                                <MaturityDate
                                    maturityDateUnix={marketInfo.maturityDate}
                                    timeRemainingUnix={marketInfo.timeRemaining}
                                    showFullCounter={true}
                                />
                            </Container.SubContainer.Value>
                        </Container.SubContainer>
                        <Container.SubContainer>
                            <Container.SubContainer.Header>
                                {t('options.home.market-card.strike-price')}
                            </Container.SubContainer.Header>
                            <Container.SubContainer.Value>
                                {formatCurrencyWithSign(USD_SIGN, marketInfo.strikePrice, 2)}
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
                                {formatCurrencyWithSign(USD_SIGN, marketInfo.currentPrice, 2)}
                            </Container.SubContainer.Value>
                        </Container.SubContainer>
                        <Container.SubContainer>
                            <Container.SubContainer.Header>
                                {t('options.market.overview.price-difference')}
                            </Container.SubContainer.Header>
                            <Container.SubContainer.Value color={priceDifference > 0 ? UI_COLORS.GREEN : UI_COLORS.RED}>
                                {priceDifference ? `${priceDifference.toFixed(2)}%` : 'N/A'}
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
                                {optBalances?.long > 0 && `${formatCurrency(optBalances?.long)}`}
                                {optBalances?.long > 0 && (
                                    <Container.Icon className="v2-icon v2-icon--up" color={UI_COLORS.GREEN} />
                                )}
                                {optBalances?.long > 0 && optBalances?.short > 0 && ' / '}
                                {optBalances?.short > 0 && `${formatCurrency(optBalances?.short)}`}
                                {optBalances?.short > 0 && (
                                    <Container.Icon className="v2-icon v2-icon--down" color={UI_COLORS.RED} />
                                )}
                                {optBalances?.long == 0 && optBalances?.short == 0 && 'N/A'}
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
                                </Container.SubContainer.Header>
                                <Container.SubContainer.Value>
                                    <Container.SubContainer.Value.Liquidity>
                                        {ammData ? ammData.maxUp?.toFixed(1) : '0'}
                                    </Container.SubContainer.Value.Liquidity>
                                    {' / '}
                                    <Container.SubContainer.Value.Liquidity shortLiqFlag={true}>
                                        {ammData ? ammData.maxDown?.toFixed(1) : '0'}
                                    </Container.SubContainer.Value.Liquidity>
                                </Container.SubContainer.Value>
                            </Container.SubContainer>
                            <Container.SubContainer>
                                <Container.SubContainer.Header>
                                    {t('options.market.overview.amm-price')}
                                </Container.SubContainer.Header>
                                <Container.SubContainer.Value>
                                    <Container.SubContainer.Value.Liquidity>
                                        {ammData ? formatCurrencyWithSign(USD_SIGN, ammData.priceUp, 3) : '0'}
                                    </Container.SubContainer.Value.Liquidity>
                                    {' / '}
                                    <Container.SubContainer.Value.Liquidity shortLiqFlag={true}>
                                        {ammData ? formatCurrencyWithSign(USD_SIGN, ammData.priceDown, 3) : '0'}
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
                                            marketInfo.result == 'long' ? 'v2-icon--up' : 'v2-icon--down'
                                        }`}
                                        color={marketInfo.result == 'long' ? UI_COLORS.GREEN : UI_COLORS.RED}
                                    />
                                </Container.SubContainer.Value>
                            </Container.SubContainer>
                            <Container.SubContainer hidden={true}>
                                <Container.SubContainer.Header>{'Hidden'}</Container.SubContainer.Header>
                                <Container.SubContainer.Value>{'Hidden'}</Container.SubContainer.Value>
                            </Container.SubContainer>
                        </Container.ColumnContainer>
                    )}
                    <Container.ColumnContainer minWidth="180px" alignItems={'flex-end'} priceChart={true}>
                        <Container.ChartContainer>
                            <PriceChart currencyKey={marketInfo.currencyKey} footerFontSize={'10px'} />
                        </Container.ChartContainer>
                        <Container.SubContainer>
                            <Button
                                onClickHandler={() => dispatch(setSimilarMarketVisibility(!similarMarketsVisibility))}
                                margin={'10px 0 0 0'}
                                padding={'5px 20px'}
                            >
                                {similarMarketsVisibility
                                    ? t('options.market.overview.close-similar-markets')
                                    : t('options.market.overview.similar-markets')}
                            </Button>
                        </Container.SubContainer>
                    </Container.ColumnContainer>
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
    positionCurrentValue:
        | undefined
        | {
              longPositionValue: number | null;
              shortPositionValue: number | null;
          };
};

const PositionPrice: React.FC<PositionPriceProps> = ({ marketInfo, optBalances, positionCurrentValue }) => {
    if (marketInfo?.phase == 'maturity' && marketInfo?.result) {
        return <>{`${formatCurrencyWithSign(USD_SIGN, optBalances[marketInfo?.result])}`}</>;
    }

    return (
        <>
            {optBalances.long > 0 &&
                positionCurrentValue?.longPositionValue &&
                `${formatCurrencyWithSign(USD_SIGN, positionCurrentValue?.longPositionValue)}`}
            {optBalances.long > 0 && optBalances.short > 0 && ' / '}
            {optBalances.short > 0 &&
                positionCurrentValue?.shortPositionValue &&
                `${formatCurrencyWithSign(USD_SIGN, positionCurrentValue?.shortPositionValue)}`}
            {!positionCurrentValue?.shortPositionValue && !positionCurrentValue?.longPositionValue && 'N/A'}
        </>
    );
};

export default RowCard;
