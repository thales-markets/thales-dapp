import React, { useEffect, lazy, Suspense } from 'react';
import { HashRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import ROUTES from '../../constants/routes';
import MainLayout from '../../components/MainLayout';
import { QueryClientProvider } from 'react-query';
import { getEthereumNetwork, SUPPORTED_WALLETS_MAP } from 'utils/network';
import snxJSConnector from 'utils/snxJSConnector';
import { useDispatch, useSelector } from 'react-redux';
import WalletPopup from 'components/WalletPopup';
import { getIsWalletConnected, updateNetworkSettings, updateWallet, getWalletInfo } from 'redux/modules/wallet';
import FullScreenMainLayout from 'components/FullScreenMainLayout';
import { ReactQueryDevtools } from 'react-query/devtools';
import { setAppReady } from 'redux/modules/app';
import { mountMetamaskAccountChangeEvent, mountMetamaskNetworkChange } from 'utils/walletEvents';
import queryConnector from 'utils/queryConnector';
import { Loader } from 'semantic-ui-react';

const OptionsCreateMarket = lazy(() => import('../Options/CreateMarket'));
const Home = lazy(() => import('../Home'));
const OptionsHome = lazy(() => import('../Options/Home'));
const OptionsMarket = lazy(() => import('../Options/Market'));

const { METAMASK } = SUPPORTED_WALLETS_MAP;

const App = () => {
    const dispatch = useDispatch();
    const isWalletConnected = useSelector((state) => getIsWalletConnected(state));
    const walletInfo = useSelector((state) => getWalletInfo(state));
    queryConnector.setQueryClient();

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
                        dispatch(updateWallet({ walletAddress }))
                    );
                    mountMetamaskNetworkChange();
                }
            }

            dispatch(setAppReady());
        };

        init();
    }, []);

    return (
        <QueryClientProvider client={queryConnector.queryClient}>
            <Suspense fallback={<Loader active />}>
                <Router>
                    <WalletPopup />
                    <Switch>
                        <Route
                            exact
                            path={ROUTES.Options.CreateMarket}
                            render={() =>
                                isWalletConnected ? (
                                    <FullScreenMainLayout>
                                        <OptionsCreateMarket />
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
                                    <OptionsMarket {...routeProps} />
                                </FullScreenMainLayout>
                            )}
                        />
                        <Route exact path={ROUTES.Options.Home}>
                            <MainLayout>
                                <OptionsHome />
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
            </Suspense>
        </QueryClientProvider>
    );
};

export default App;
