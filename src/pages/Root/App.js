import React, { useEffect } from 'react';
import { HashRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import ROUTES from '../../constants/routes';
import MainLayout from '../../components/MainLayout';
import Home from '../Home';
import Options from '../Options';
import { QueryClient, QueryClientProvider } from 'react-query';
import { getEthereumNetwork, SUPPORTED_WALLETS_MAP } from 'utils/network';
import snxJSConnector from 'utils/snxJSConnector';
import { useDispatch, useSelector } from 'react-redux';
import WalletPopup from 'components/WalletPopup';
import { getIsWalletConnected, updateNetworkSettings, updateWalletReducer, getWalletInfo } from 'redux/modules/wallet';
import FullScreenMainLayout from 'components/FullScreenMainLayout';
import { ReactQueryDevtools } from 'react-query/devtools';
import { fetchAppStatusRequest, setAppReady } from 'redux/modules/app';
import CreateMarket from 'pages/Options/CreateMarket';
import { mountMetamaskAccountChangeEvent, mountMetamaskNetworkChange } from 'utils/walletEvents';

const REFRESH_INTERVAL = 2 * 60 * 1000;
const { METAMASK } = SUPPORTED_WALLETS_MAP;

const queryClient = new QueryClient();

const App = () => {
    const dispatch = useDispatch();
    const isWalletConnected = useSelector((state) => getIsWalletConnected(state));
    const walletInfo = useSelector((state) => getWalletInfo(state));

    useEffect(() => {
        const init = async () => {
            const { networkId, name } = await getEthereumNetwork();
            if (!snxJSConnector.initialized) {
                snxJSConnector.setContractSettings({ networkId });
            }
            dispatch(updateNetworkSettings({ networkId, networkName: name.toLowerCase() }));

            // on page refresh, events are lost, we need to mount again
            if (isWalletConnected) {
                if (walletInfo.walletType === METAMASK) {
                    const signer = new snxJSConnector.signers[METAMASK]({});
                    snxJSConnector.setContractSettings({
                        networkId: networkId,
                        signer,
                    });
                    mountMetamaskAccountChangeEvent(networkId, (walletAddress) =>
                        dispatch(updateWalletReducer({ walletAddress }))
                    );
                    mountMetamaskNetworkChange();
                }
            }

            dispatch(setAppReady());
            dispatch(fetchAppStatusRequest());
        };

        init();

        // TODO: stop fetching data when system is suspended
        const interval = setInterval(() => {
            dispatch(fetchAppStatusRequest());
        }, REFRESH_INTERVAL);

        return () => {
            clearInterval(interval);
        };
    }, []);

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
