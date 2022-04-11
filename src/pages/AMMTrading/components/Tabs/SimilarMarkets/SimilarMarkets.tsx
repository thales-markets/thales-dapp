import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from 'redux/rootReducer';
import { useTranslation } from 'react-i18next';

import useBinaryOptionsMarketsQuery from 'queries/options/useBinaryOptionsMarketsQuery';
import { fetchAllMarketOrders } from 'queries/options/fetchAllMarketOrders';
import { useMarketContext } from 'pages/AMMTrading/contexts/MarketContext';
import useExchangeRatesMarketDataQuery from 'queries/rates/useExchangeRatesMarketDataQuery';

import { SimilarMarketsContainer } from './styled-components/SimilarMarkets';

import { getNetworkId } from 'redux/modules/wallet';
import { sortOptionsMarkets } from 'utils/options';
import { buildOptionsMarketLink } from 'utils/routes';
import MarketCard from 'pages/Markets/components/MarketsCard';
import SPAAnchor from 'components/SPAAnchor';
import { getIsAppReady } from 'redux/modules/app';
import Loader from 'components/Loader';
import { NoDataContainer, NoDataText } from 'theme/common';

const SimilarMarkets: React.FC = () => {
    const marketInfo = useMarketContext();
    const { t } = useTranslation();
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
    const marketsQuery = useBinaryOptionsMarketsQuery(networkId);
    const openOrdersQuery = fetchAllMarketOrders(networkId);

    const openOrdersMap = useMemo(() => {
        if (openOrdersQuery.isSuccess) {
            return openOrdersQuery.data;
        }
    }, [openOrdersQuery]);

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
    }, [marketsQuery]);

    const exchangeRatesMarketDataQuery = useExchangeRatesMarketDataQuery(networkId, optionsMarkets, {
        enabled: isAppReady && optionsMarkets.length > 0,
        refetchInterval: false,
    });
    const exchangeRates = exchangeRatesMarketDataQuery.isSuccess ? exchangeRatesMarketDataQuery.data ?? null : null;

    return (
        <>
            {!openOrdersQuery.isLoading ? (
                <SimilarMarketsContainer>
                    {optionsMarkets?.length > 0 &&
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
                    {!optionsMarkets?.length && (
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
