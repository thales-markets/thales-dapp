import React, { lazy, Suspense, useEffect, useMemo } from 'react';

import { RootState } from 'redux/rootReducer';
import { useDispatch, useSelector } from 'react-redux';
import { getIsWalletConnected, getNetworkId, updateNetworkSettings } from 'redux/modules/wallet';
import { getIsAppReady } from 'redux/modules/app';

import useBinaryOptionsMarketsQuery from 'queries/options/useBinaryOptionsMarketsQuery';
import { fetchAllMarketOrders } from 'queries/options/fetchAllMarketOrders';
import useExchangeRatesMarketDataQuery from 'queries/rates/useExchangeRatesMarketDataQuery';

import { sortOptionsMarkets } from 'utils/options';
import Loader from 'components/Loader';
import { SUPPORTED_MAINNET_NETWORK_IDS_MAP } from 'constants/network';
import InfoBanner from 'components/InfoBanner';
import styled from 'styled-components';
import { FlexDiv } from 'theme/common';
import { Trans } from 'react-i18next';
import { getIsOVM, NetworkId, SUPPORTED_NETWORKS_NAMES } from 'utils/network';
import OpRewardsBanner from 'components/OpRewardsBanner';
import Footer from 'components/Footer';

const HotMarkets = lazy(() => import(/* webpackChunkName: "HotMarkets" */ './components/HotMarkets'));
const MarketsTable = lazy(() => import(/* webpackChunkName: "MarketsTable" */ './components/MarketsTable'));

// const MAX_HOT_MARKETS = 6;
const INFORMATION_BANNER_ACTIVE = false;

const Markets: React.FC = () => {
    const isWalletConnected = useSelector((state: RootState) => getIsWalletConnected(state));
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));

    const showOPBanner = getIsOVM(networkId);

    const dispatch = useDispatch();

    useEffect(() => {
        if (!isWalletConnected && window.ethereum) {
            (window.ethereum as any).on('chainChanged', (chainId: any) => {
                const networkIdInt = Number(chainId) as NetworkId;

                dispatch(
                    updateNetworkSettings({
                        networkId: networkIdInt,
                        networkName: SUPPORTED_NETWORKS_NAMES[networkIdInt]?.toLowerCase(),
                    })
                );
            });
        }
    }, []);

    const marketsQuery = useBinaryOptionsMarketsQuery(networkId);
    const openOrdersQuery = fetchAllMarketOrders(networkId);

    const optionsMarkets = useMemo(() => {
        if (marketsQuery.isSuccess && Array.isArray(marketsQuery.data) && openOrdersQuery.isSuccess) {
            const markets = openOrdersQuery.data
                ? marketsQuery.data.map((m) => {
                      const apiData = (openOrdersQuery.data as any).get(m.address.toLowerCase());
                      return {
                          ...m,
                          openOrders: apiData?.ordersCount ?? 0,
                          availableLongs: apiData?.availableLongs ?? 0,
                          availableShorts: apiData?.availableShorts ?? 0,
                          longPrice: apiData?.longPrice ?? 0,
                          shortPrice: apiData?.shortPrice ?? 0,
                          ammLiquidity: Number(apiData?.availableLongs ?? 0) + Number(apiData?.availableShorts ?? 0),
                      };
                  })
                : marketsQuery.data;
            return sortOptionsMarkets(markets);
        }
        return [];
    }, [marketsQuery, openOrdersQuery]);
    const exchangeRatesMarketDataQuery = useExchangeRatesMarketDataQuery(networkId, optionsMarkets, {
        enabled: isAppReady && optionsMarkets.length > 0,
        refetchInterval: false,
    });

    const exchangeRates = exchangeRatesMarketDataQuery.isSuccess ? exchangeRatesMarketDataQuery.data ?? null : null;

    return (
        <>
            {showOPBanner && <OpRewardsBanner width={90} />}
            {INFORMATION_BANNER_ACTIVE && (
                <BannerContainer>
                    <InfoBanner>
                        <Trans
                            i18nKey="options.home.polygon-trading-competition-1"
                            components={{
                                bold: (
                                    <strong
                                        onClick={SUPPORTED_MAINNET_NETWORK_IDS_MAP[137].changeNetwork.bind(
                                            this,
                                            137,
                                            undefined
                                        )}
                                    />
                                ),
                            }}
                        />
                        ,
                        <Trans
                            i18nKey="options.home.polygon-trading-competition-2"
                            components={{
                                bold: (
                                    <a
                                        href="https://docs.thalesmarket.io/competitions-and-events/thales-polygon-trading-competition"
                                        rel="noreferrer"
                                        target="_blank"
                                    />
                                ),
                            }}
                        />
                    </InfoBanner>
                </BannerContainer>
            )}
            <Suspense fallback={<></>}>
                <HotMarkets optionsMarkets={optionsMarkets} />
            </Suspense>
            <Suspense fallback={<></>}>
                <MarketsTable optionsMarkets={optionsMarkets} exchangeRates={exchangeRates} />
            </Suspense>
            <Footer />

            {networkId === 1 && <Loader hideMainnet={true} />}
        </>
    );
};

const BannerContainer = styled(FlexDiv)`
    width: 90% !important;
    padding-bottom: 50px;
    strong {
        font-weight: bold;
        cursor: pointer;
        margin-left: 0.2em;
        color: var(--input-border-color);
    }
    a {
        display: contents;
        font-weight: bold;
        cursor: pointer;
        color: var(--input-border-color);
    }
`;

export default Markets;
