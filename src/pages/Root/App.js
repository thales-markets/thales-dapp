import React, { useCallback, useEffect } from 'react';
import { HashRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import ROUTES from '../../constants/routes';
import MainLayout from '../../components/MainLayout';
import Home from '../Home';
import Options from '../Options';
import { QueryClient, QueryClientProvider } from 'react-query';
import { getEthereumNetwork } from 'utils/network';
import snxJSConnector from 'utils/snxJSConnector';
import { useDispatch, useSelector } from 'react-redux';
import { getExchangeData } from 'dataFetcher';
import WalletPopup from 'components/WalletPopup';
import { getIsWalletConnected, updateNetworkSettings } from 'redux/modules/wallet/walletDetails';
import FullScreenMainLayout from 'components/FullScreenMainLayout';
import { ReactQueryDevtools } from 'react-query/devtools';
import { fetchAppStatusRequest, setAppReady } from 'redux/modules/app';
import { setNetworkGasInfo } from 'redux/modules/transaction';
import CreateMarket from 'pages/Options/CreateMarket';

const REFRESH_INTERVAL = 2 * 60 * 1000;

const queryClient = new QueryClient();

const App = () => {
    const dispatch = useDispatch();
    const isWalletConnected = useSelector((state) => getIsWalletConnected(state));

    // TODO - move this logic into synths slice?
    const fetchAndSetExchangeData = useCallback(async () => {
        const { networkPrices } = await getExchangeData();
        dispatch(setNetworkGasInfo(networkPrices));
    }, []);

    useEffect(() => {
        const init = async () => {
            const { networkId, name } = await getEthereumNetwork();
            if (!snxJSConnector.initialized) {
                snxJSConnector.setContractSettings({ networkId });
            }
            dispatch(updateNetworkSettings({ networkId, networkName: name.toLowerCase() }));

            dispatch(setAppReady());
            fetchAndSetExchangeData();
            dispatch(fetchAppStatusRequest());
        };

        init();

        // TODO: stop fetching data when system is suspended
        const interval = setInterval(() => {
            fetchAndSetExchangeData();
            dispatch(fetchAppStatusRequest());
        }, REFRESH_INTERVAL);

        return () => {
            clearInterval(interval);
        };
    }, [fetchAndSetExchangeData]);

    return (
        <QueryClientProvider client={queryClient}>
            <Router>
                <WalletPopup />
                <Switch>
                    <Route
                        exact
                        path={ROUTES.Options.CreateMarket}
                        render={() =>
                            isWalletConnected ? (
                                <FullScreenMainLayout>
                                    <CreateMarket />
                                </FullScreenMainLayout>
                            ) : (
                                <Redirect to={ROUTES.Options.Home} />
                            )
                        }
                    />
                    <Route
                        exact
                        path={ROUTES.Options.MarketMatch}
                        render={(routeProps) => (
                            <FullScreenMainLayout>
                                <Options.Market {...routeProps} />
                            </FullScreenMainLayout>
                        )}
                    />
                    <Route exact path={ROUTES.Options.Home}>
                        <MainLayout>
                            <Options.Home />
                        </MainLayout>
                    </Route>
                    <Route exact path={ROUTES.Home}>
                        <MainLayout>
                            <Home />
                        </MainLayout>
                    </Route>
                </Switch>
            </Router>
            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
    );
};

export default App;
