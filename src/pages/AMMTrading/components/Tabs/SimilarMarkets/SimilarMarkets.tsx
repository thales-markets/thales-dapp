import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from 'redux/rootReducer';
import { useTranslation } from 'react-i18next';

import useBinaryOptionsMarketsQuery from 'queries/options/useBinaryOptionsMarketsQuery';
import { fetchAllMarketOrders } from 'queries/options/fetchAllMarketOrders';
import { useMarketContext } from 'pages/AMMTrading/contexts/MarketContext';
// import useExchangeRatesMarketDataQuery from 'queries/rates/useExchangeRatesMarketDataQuery';
import useExchangeRatesQuery from 'queries/rates/useExchangeRatesQuery';

import { SimilarMarketsContainer } from './styled-components/SimilarMarkets';

import { getNetworkId } from 'redux/modules/wallet';
import { sortOptionsMarkets } from 'utils/options';
import { buildOptionsMarketLink, buildRangeMarketLink } from 'utils/routes';
import SPAAnchor from 'components/SPAAnchor';
import { getIsAppReady } from 'redux/modules/app';
import Loader from 'components/Loader';
import { NoDataContainer, NoDataText } from 'theme/common';
import { MarketType, RangedMarket } from 'types/options';
import { useRangedMarketContext } from 'pages/AMMTrading/contexts/RangedMarketContext';
import { MARKET_TYPE } from 'constants/options';
import { useRangedMarketsLiquidity } from 'queries/options/rangedMarkets/useRangedMarketsLiquidity';
import useRangedMarketsQuery from 'queries/options/rangedMarkets/useRangedMarketsQuery';
import { CONVERT_TO_6_DECIMALS } from 'constants/token';
import { POLYGON_ID } from 'constants/network';
import RangeMarketCard from 'components/RangeMarketCard';
import MarketCard from 'components/MarketCard';

const SimilarMarkets: React.FC<{ marketType?: MarketType }> = ({ marketType }) => {
    const marketInfo = marketType !== MARKET_TYPE[1] ? useMarketContext() : useRangedMarketContext();
    const { t } = useTranslation();
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));

    const marketsQuery = useBinaryOptionsMarketsQuery(networkId, {
        enabled: isAppReady && marketType !== MARKET_TYPE[1],
    });

    const rangedMarketsQuery = useRangedMarketsQuery(networkId, {
        enabled: isAppReady && marketType == MARKET_TYPE[1],
    });

    const openOrdersQuery = fetchAllMarketOrders(networkId, {
        enabled: isAppReady && marketType !== MARKET_TYPE[1],
    });

    const rangedMarketsLiquidityQuery = useRangedMarketsLiquidity(networkId, {
        enabled: isAppReady && marketType == MARKET_TYPE[1],
    });

    const rangedMarketsLiquidity = useMemo(() => {
        if (rangedMarketsLiquidityQuery?.isSuccess && rangedMarketsLiquidityQuery?.data) {
            return rangedMarketsLiquidityQuery?.data;
        }
    }, [rangedMarketsLiquidityQuery.isLoading]);

    const openOrdersMap = useMemo(() => {
        if (openOrdersQuery.isSuccess) {
            return openOrdersQuery.data;
        }
    }, [openOrdersQuery.isLoading]);

    const isLoading =
        openOrdersQuery.isLoading ||
        rangedMarketsLiquidityQuery.isLoading ||
        marketsQuery.isLoading ||
        rangedMarketsQuery.isLoading;

    const optionsMarkets = useMemo(() => {
        if (marketsQuery.isSuccess && Array.isArray(marketsQuery.data)) {
            let markets = openOrdersMap
                ? marketsQuery.data.map((m) => ({
                      ...m,
                      openOrders: (openOrdersMap as any).get(m.address.toLowerCase())?.ordersCount ?? '0',
                      availableLongs: (openOrdersMap as any).get(m.address.toLowerCase())?.availableLongs ?? '0',
                      availableShorts: (openOrdersMap as any).get(m.address.toLowerCase())?.availableShorts ?? '0',
                      longPrice: (openOrdersMap as any).get(m.address.toLowerCase())?.longPrice ?? '0',
                      shortPrice: (openOrdersMap as any).get(m.address.toLowerCase())?.shortPrice ?? '0',
                  }))
                : marketsQuery.data;

            markets = markets.filter((market) => market.currencyKey == marketInfo?.currencyKey);
            markets = markets.filter((market) => market.availableLongs > 0 || market.availableShorts > 0);
            markets = markets.filter((market) => market.maturityDate == marketInfo.maturityDate);
            markets = markets.filter((market) => market.address !== marketInfo.address);
            markets = sortOptionsMarkets(markets);
            return markets;
        }
        return [];
    }, [marketsQuery.isLoading]);

    const rangedMarkets: RangedMarket[] | [] = useMemo(() => {
        if (rangedMarketsQuery.isSuccess && Array.isArray(rangedMarketsQuery.data)) {
            let markets = rangedMarketsLiquidity
                ? rangedMarketsQuery.data.map((m) => {
                      const apiData = (rangedMarketsLiquidity as any).get(m.address.toLowerCase());

                      return {
                          ...m,
                          availableIn: apiData?.availableIn ?? '0',
                          availableOut: apiData?.availableOut ?? 0,
                          inPrice:
                              +(networkId === POLYGON_ID
                                  ? apiData?.inPrice * CONVERT_TO_6_DECIMALS
                                  : apiData?.inPrice) ?? 0,
                          outPrice:
                              +(networkId === POLYGON_ID
                                  ? apiData?.outPrice * CONVERT_TO_6_DECIMALS
                                  : apiData?.outPrice) ?? 0,
                          ammLiquidity: Number(apiData?.availableIn ?? 0) + Number(apiData?.availableOut ?? 0),
                          range: m.leftPrice.toFixed(2) + ' - ' + m.rightPrice.toFixed(2),
                      };
                  })
                : rangedMarketsQuery.data;

            markets = markets.filter((market: any) => market?.currencyKey == marketInfo?.currencyKey);
            markets = markets.filter((market: any) => market?.availableIn > 0 || market.availableOut > 0);
            markets = markets.filter((market: any) => market?.maturityDate == marketInfo.maturityDate);
            markets = markets.filter((market: any) => market?.address !== marketInfo.address);
            markets = sortOptionsMarkets(markets as any) as any;
            return markets;
        }
        return [];
    }, [rangedMarketsQuery.isLoading]);

    const exchangeRatesMarketDataQuery = useExchangeRatesQuery({
        enabled: isAppReady && (optionsMarkets.length > 0 || rangedMarkets?.length > 0),
        refetchInterval: false,
    });
    const exchangeRates = exchangeRatesMarketDataQuery.isSuccess ? exchangeRatesMarketDataQuery.data ?? null : null;

    const showPositionalMarkets = optionsMarkets?.length > 0 && marketType !== MARKET_TYPE[1];
    const showRangedMarkets = rangedMarkets?.length > 0 && marketType == MARKET_TYPE[1];

    return (
        <>
            {!isLoading ? (
                <SimilarMarketsContainer>
                    {showPositionalMarkets &&
                        optionsMarkets.map((optionMarket, index) => {
                            return (
                                <SPAAnchor key={index} href={buildOptionsMarketLink(optionMarket.address)}>
                                    <MarketCard
                                        optionMarket={optionMarket}
                                        exchangeRates={exchangeRates}
                                        marketCardStyle={{
                                            maxWidth: '49%',
                                            wrapperMargin: '0px 0px 10px 0px',
                                        }}
                                    />
                                </SPAAnchor>
                            );
                        })}
                    {showRangedMarkets &&
                        rangedMarkets.map((rangeMarket, index) => {
                            return (
                                <SPAAnchor key={index} href={buildRangeMarketLink(rangeMarket.address)}>
                                    <RangeMarketCard
                                        data={rangeMarket as any}
                                        exchangeRates={exchangeRates}
                                        marketCardStyle={{
                                            maxWidth: '49%',
                                            wrapperMargin: '0px 0px 10px 0px',
                                        }}
                                    />
                                </SPAAnchor>
                            );
                        })}
                    {!showPositionalMarkets && !showRangedMarkets && (
                        <NoDataContainer>
                            <NoDataText>{t('options.market.overview.no-similar-markets')}</NoDataText>
                        </NoDataContainer>
                    )}
                </SimilarMarketsContainer>
            ) : (
                <Loader />
            )}
        </>
    );
};

export default SimilarMarkets;
