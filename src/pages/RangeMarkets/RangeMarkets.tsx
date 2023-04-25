import React, { lazy, Suspense, useMemo } from 'react';
import { RootState } from 'redux/rootReducer';
import { useSelector } from 'react-redux';
import { getNetworkId } from 'redux/modules/wallet';
import { getIsAppReady } from 'redux/modules/app';
import useExchangeRatesMarketDataQuery from 'queries/rates/useExchangeRatesMarketDataQuery';
import { sortOptionsMarkets } from 'utils/options';
import Loader from 'components/Loader';
import { USD_SIGN } from 'constants/currency';
import { getIsOVM } from 'utils/network';
import { formatCurrencyWithSignInRange } from 'utils/formatters/number';
import useRangedMarketsQuery from 'queries/options/rangedMarkets/useRangedMarketsQuery';
import { useRangedMarketsLiquidity } from 'queries/options/rangedMarkets/useRangedMarketsLiquidity';
import { RangedMarketUI } from 'types/options';
import OpRewardsBanner from 'components/OpRewardsBanner';
import Footer from 'components/Footer';
import ElectionsBanner from 'components/ElectionsBanner';

const HotMarketsRanged = lazy(
    () => import(/* webpackChunkName: "HotMarketsRanged" */ './components/HotMarketsRanged/HotMarketsRanged')
);
const RangeMarketsTable = lazy(
    () => import(/* webpackChunkName: "RangeMarketsTable" */ './components/RangeMarketsTable')
);

const RangeMarkets: React.FC = () => {
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));

    const showOPBanner = getIsOVM(networkId);

    const marketsQuery = useRangedMarketsQuery(networkId);

    const rangeLiquidityQuery = useRangedMarketsLiquidity(networkId);

    const optionsMarkets: RangedMarketUI[] = useMemo(() => {
        if (marketsQuery.isSuccess && Array.isArray(marketsQuery.data) && rangeLiquidityQuery.isSuccess) {
            const markets = rangeLiquidityQuery.data
                ? marketsQuery.data.map((m) => {
                      const apiData = rangeLiquidityQuery?.data?.get(m.address.toLowerCase());

                      return {
                          ...m,
                          asset: m.currencyKey,
                          availableIn: apiData?.availableIn ?? 0,
                          availableOut: apiData?.availableOut ?? 0,
                          inPrice: apiData?.inPrice ?? 0,
                          outPrice: apiData?.outPrice ?? 0,
                          ammLiquidity: (apiData?.availableIn ?? 0) + (apiData?.availableOut ?? 0),
                          range: formatCurrencyWithSignInRange(USD_SIGN, m.leftPrice, m.rightPrice, 2),
                      };
                  })
                : marketsQuery.data;
            return sortOptionsMarkets(markets as any) as any;
        }
        return [];
    }, [marketsQuery, rangeLiquidityQuery]);

    const exchangeRatesMarketDataQuery = useExchangeRatesMarketDataQuery(networkId, optionsMarkets as any, {
        enabled: isAppReady && optionsMarkets.length > 0,
        refetchInterval: false,
    });

    const exchangeRates = exchangeRatesMarketDataQuery.isSuccess ? exchangeRatesMarketDataQuery.data ?? null : null;

    return (
        <>
            {/* <BannerContainer>
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
            </BannerContainer> */}
            {showOPBanner && <OpRewardsBanner width={90} />}
            <ElectionsBanner width={90} />
            <Suspense fallback={<></>}>
                <HotMarketsRanged optionsMarkets={optionsMarkets} exchangeRates={exchangeRates} />
            </Suspense>
            <Suspense fallback={<></>}>
                <RangeMarketsTable optionsMarkets={optionsMarkets as any} exchangeRates={exchangeRates} />
            </Suspense>
            <Footer />

            {networkId === 1 && <Loader hideMainnet={true} />}
        </>
    );
};

// const BannerContainer = styled(FlexDiv)`
//     width: 90% !important;
//     padding-bottom: 50px;
//     strong {
//         font-weight: bold;
//         cursor: pointer;
//         margin-left: 0.2em;
//         color: var(--input-border-color);
//     }
//     a {
//         display: contents;
//         font-weight: bold;
//         cursor: pointer;
//         color: var(--input-border-color);
//     }
// `;

export default RangeMarkets;
