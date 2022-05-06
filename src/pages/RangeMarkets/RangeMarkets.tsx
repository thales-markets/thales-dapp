import React, { useEffect, useMemo } from 'react';

import MarketsTable from '../Markets/components/MarketsTable';

import HotMarkets from '../Markets/components/HotMarkets';

import { RootState } from 'redux/rootReducer';
import { useDispatch, useSelector } from 'react-redux';
import { getIsWalletConnected, getNetworkId, updateNetworkSettings } from 'redux/modules/wallet';
import { getIsAppReady } from 'redux/modules/app';

import useExchangeRatesMarketDataQuery from 'queries/rates/useExchangeRatesMarketDataQuery';

import { sortOptionsMarkets } from 'utils/options';
import { PHASE } from 'constants/options';
import Loader from 'components/Loader';
import { POLYGON_ID, SUPPORTED_MAINNET_NETWORK_IDS_MAP } from 'constants/network';
import { CONVERT_TO_6_DECIMALS } from 'constants/token';
import InfoBanner from 'components/InfoBanner';
import styled from 'styled-components';
import { FlexDiv } from 'theme/common';
import { Trans } from 'react-i18next';
import { NetworkId, SUPPORTED_NETWORKS_NAMES } from 'utils/network';
import useRangedMarketsQuery from 'queries/options/rangedMarkets/useRangedMarketsQuery';
import { useRangedMarketsLiquidity } from 'queries/options/rangedMarkets/useRangedMarketsLiquidity';

// const MAX_HOT_MARKETS = 6;

const RangeMarkets: React.FC = () => {
    const isWalletConnected = useSelector((state: RootState) => getIsWalletConnected(state));
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
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

    const marketsQuery = useRangedMarketsQuery(networkId);

    const rangeLiquidity = useRangedMarketsLiquidity(networkId);
    console.log(rangeLiquidity);

    const openOrdersMap = useMemo(() => {
        if (rangeLiquidity.isSuccess) {
            return rangeLiquidity.data;
        }
    }, [rangeLiquidity]);

    const optionsMarkets = useMemo(() => {
        if (marketsQuery.isSuccess && Array.isArray(marketsQuery.data)) {
            const markets = openOrdersMap
                ? marketsQuery.data.map((m) => {
                      const apiData = (openOrdersMap as any).get(m.address.toLowerCase());

                      return {
                          ...m,
                          availableLongs: apiData?.availableIn ?? 0,
                          availableShorts: apiData?.availableOut ?? 0,
                          longPrice:
                              +(networkId === POLYGON_ID
                                  ? apiData?.inPrice * CONVERT_TO_6_DECIMALS
                                  : apiData?.inPrice) ?? 0,
                          shortPrice:
                              +(networkId === POLYGON_ID
                                  ? apiData?.outPrice * CONVERT_TO_6_DECIMALS
                                  : apiData?.outPrice) ?? 0,
                          ammLiquidity: Number(apiData?.availableIn ?? 0) + Number(apiData?.availableOut ?? 0),
                      };
                  })
                : marketsQuery.data;
            return sortOptionsMarkets(markets);
        }
        return [];
    }, [marketsQuery, openOrdersMap]);

    const exchangeRatesMarketDataQuery = useExchangeRatesMarketDataQuery(networkId, optionsMarkets as any, {
        enabled: isAppReady && optionsMarkets.length > 0,
        refetchInterval: false,
    });

    const exchangeRates = exchangeRatesMarketDataQuery.isSuccess ? exchangeRatesMarketDataQuery.data ?? null : null;

    const hotMarkets = useMemo(
        () =>
            optionsMarkets
                .filter((market) => market.phaseNum === PHASE.trading)
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
            <HotMarkets optionsMarkets={hotMarkets as any} />
            <MarketsTable optionsMarkets={optionsMarkets as any} exchangeRates={exchangeRates} />
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

export default RangeMarkets;
