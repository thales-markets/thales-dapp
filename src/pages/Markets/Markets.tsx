import React, { useMemo } from 'react';

import MarketsTable from './components/MarketsTable';

import HotMarkets from './components/HotMarkets';

import { RootState } from 'redux/rootReducer';
import { useSelector } from 'react-redux';
import { getNetworkId } from 'redux/modules/wallet';
import { getIsAppReady } from 'redux/modules/app';

import useBinaryOptionsMarketsQuery from 'queries/options/useBinaryOptionsMarketsQuery';
import { fetchAllMarketOrders } from 'queries/options/fetchAllMarketOrders';
import useExchangeRatesMarketDataQuery from 'queries/rates/useExchangeRatesMarketDataQuery';

import { sortOptionsMarkets } from 'utils/options';
import { PHASE } from 'constants/options';
import Loader from 'components/Loader';
import { POLYGON_ID, SUPPORTED_MAINNET_NETWORK_IDS_MAP } from '../../constants/network';
import { CONVERT_TO_6_DECIMALS } from '../../constants/token';
import InfoBanner from '../../components/InfoBanner';
import styled from 'styled-components';
import { FlexDiv } from '../../theme/common';
import { Trans } from 'react-i18next';

// const MAX_HOT_MARKETS = 6;

const Markets: React.FC = () => {
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
            const markets = openOrdersMap
                ? marketsQuery.data.map((m) => {
                      const apiData = (openOrdersMap as any).get(m.address.toLowerCase());

                      return {
                          ...m,
                          openOrders: apiData?.ordersCount ?? 0,
                          availableLongs: apiData?.availableLongs ?? 0,
                          availableShorts: apiData?.availableShorts ?? 0,
                          longPrice:
                              +(networkId === POLYGON_ID
                                  ? apiData?.longPrice * CONVERT_TO_6_DECIMALS
                                  : apiData?.longPrice) ?? 0,
                          shortPrice:
                              +(networkId === POLYGON_ID
                                  ? apiData?.shortPrice * CONVERT_TO_6_DECIMALS
                                  : apiData?.shortPrice) ?? 0,
                          ammLiquidity: Number(apiData?.availableLongs ?? 0) + Number(apiData?.availableShorts ?? 0),
                      };
                  })
                : marketsQuery.data;
            return sortOptionsMarkets(markets);
        }
        return [];
    }, [marketsQuery, openOrdersMap]);

    const exchangeRatesMarketDataQuery = useExchangeRatesMarketDataQuery(networkId, optionsMarkets, {
        enabled: isAppReady && optionsMarkets.length > 0,
        refetchInterval: false,
    });

    const exchangeRates = exchangeRatesMarketDataQuery.isSuccess ? exchangeRatesMarketDataQuery.data ?? null : null;

    const hotMarkets = useMemo(
        () =>
            optionsMarkets
                .filter((market) => market.phaseNum === PHASE.trading && !market.customMarket)
                .sort((a, b) => a.timeRemaining - b.timeRemaining),
        [optionsMarkets]
    );

    return (
        <>
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
            <HotMarkets optionsMarkets={hotMarkets} />
            <MarketsTable optionsMarkets={optionsMarkets} exchangeRates={exchangeRates} />
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
    }
    a {
        display: contents;
        font-weight: bold;
        cursor: pointer;
        color: #ffffff;
    }
`;

export default Markets;
