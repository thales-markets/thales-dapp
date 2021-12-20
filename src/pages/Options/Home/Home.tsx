import React, { useEffect, useMemo, useState } from 'react';
import { sortOptionsMarkets } from '../../../utils/options';
import useBinaryOptionsMarketsQuery from 'queries/options/useBinaryOptionsMarketsQuery';
import snxJSConnector from 'utils/snxJSConnector';
import HotMarkets from './HotMarkets';
import MarketCreation from './MarketCreation/MarketCreation';
import ExploreMarkets from './ExploreMarkets';
import Loader from 'components/Loader';
import { getNetworkId, getWalletAddress } from 'redux/modules/wallet';
import { RootState } from 'redux/rootReducer';
import { useSelector } from 'react-redux';
import { Background, Wrapper } from 'theme/common';
import MarketHeader from './MarketHeader';
import { PHASE } from 'constants/options';
import ROUTES from 'constants/routes';
import useExchangeRatesMarketDataQuery from '../../../queries/rates/useExchangeRatesMarketDataQuery';
import { getIsAppReady } from '../../../redux/modules/app';
import { useLocation } from 'react-router-dom';
import { fetchAllMarketOrders } from 'queries/options/fetchAllMarketOrders';
import { getIsOVM } from 'utils/network';
import { RedirectDialog } from '../Royal/components/RedirectDialog/RedirectDialog';
import WalletNotConnectedDialog from '../Royal/components/WalletNotConnectedDialog/WalletNotConnectedDialog';

const MAX_HOT_MARKETS = 9;

export const Home: React.FC = () => {
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state));
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const location = useLocation();
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
    const marketsQuery = useBinaryOptionsMarketsQuery(networkId);
    const openOrdersQuery = fetchAllMarketOrders(networkId);
    const { synthsMap } = snxJSConnector;
    const openOrdersMap = useMemo(() => {
        if (openOrdersQuery.isSuccess) {
            return openOrdersQuery.data;
        }
    }, [openOrdersQuery]);
    const optionsMarkets = useMemo(() => {
        if (marketsQuery.isSuccess && Array.isArray(marketsQuery.data)) {
            const markets = openOrdersMap
                ? marketsQuery.data.map((m) => ({
                      ...m,
                      openOrders: (openOrdersMap as any).get(m.address.toLowerCase())?.ordersCount ?? '0',
                  }))
                : marketsQuery.data;
            return sortOptionsMarkets(markets, synthsMap);
        }
        return [];
    }, [marketsQuery, synthsMap, openOrdersMap]);
    const isL2 = getIsOVM(networkId);
    const [openRedirectDialog, setOpenRedirectDialog] = useState(false);
    const [openWalletNotConnectedDialog, setOpenWalletNotConnectedDialog] = useState(false);

    const exchangeRatesMarketDataQuery = useExchangeRatesMarketDataQuery(networkId, optionsMarkets, {
        enabled: isAppReady && optionsMarkets.length > 0,
    });
    const exchangeRates = exchangeRatesMarketDataQuery.isSuccess ? exchangeRatesMarketDataQuery.data ?? null : null;

    const hotMarkets = useMemo(
        () =>
            optionsMarkets
                .filter((market) => market.phaseNum === PHASE.trading && !market.customMarket)
                .sort((a, b) => a.timeRemaining - b.timeRemaining)
                .slice(0, MAX_HOT_MARKETS),
        [optionsMarkets]
    );

    useEffect(() => {
        if (location.search === '?anchor=overview') {
            document.getElementById('explore-markets')?.scrollIntoView({ behavior: 'smooth' });
        } else if (location.search === '?userFilter2=custom') {
            document.getElementById('explore-markets')?.scrollIntoView({ behavior: 'smooth' });
        } else if (location.search === '?userFilter2=competition') {
            document.getElementById('explore-markets')?.scrollIntoView({ behavior: 'smooth' });
        } else {
        }
    }, [location]);

    useEffect(() => {
        if (!walletAddress && isL2) {
            setOpenWalletNotConnectedDialog(true);
        } else {
            setOpenWalletNotConnectedDialog(false);
            if (isL2 && location.pathname !== ROUTES.Options.Royal) {
                setOpenRedirectDialog(true);
            }
        }
    }, [location, walletAddress]);

    return (
        <>
            {marketsQuery.isSuccess ? (
                <Background style={{ minHeight: '100vh' }}>
                    <Wrapper>
                        <MarketHeader
                            route={
                                location.search === '?anchor=overview'
                                    ? ROUTES.Options.Overview
                                    : location.search === '?userFilter2=custom'
                                    ? ROUTES.Options.CustomMarkets
                                    : location.search === '?userFilter2=competition'
                                    ? ROUTES.Options.CompetitionMarkets
                                    : ROUTES.Options.Overview
                            }
                        />

                        {hotMarkets.length && <HotMarkets optionsMarkets={hotMarkets} exchangeRates={exchangeRates} />}

                        <MarketCreation />

                        <ExploreMarkets optionsMarkets={optionsMarkets} exchangeRates={exchangeRates} />
                        <RedirectDialog open={openRedirectDialog} setOpen={setOpenRedirectDialog}></RedirectDialog>
                        <WalletNotConnectedDialog
                            open={openWalletNotConnectedDialog}
                            setOpen={setOpenWalletNotConnectedDialog}
                        ></WalletNotConnectedDialog>
                    </Wrapper>
                </Background>
            ) : (
                <Loader />
            )}
        </>
    );
};

export default Home;
