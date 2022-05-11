import { Snackbar } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import { loadProvider } from '@synthetixio/providers';
import Loader from 'components/Loader';
import { initOnboard } from 'config/onboard';
import { LOCAL_STORAGE_KEYS } from 'constants/storage';
import useLocalStorage from 'hooks/useLocalStorage';
import TokenPage from 'pages/Token/Token.tsx';
import TaleOfThales from 'pages/TaleOfThales/TaleOfThales.tsx';
import Profile from 'pages/Profile/Profile.tsx';
import QuickTradingPage from 'pages/Options/QuickTrading';
import ThalesRoyal from 'pages/Royale/ThalesRoyal';
import React, { lazy, Suspense, useEffect, useState } from 'react';
import { QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect, Route, Router, Switch } from 'react-router-dom';
import { getIsAppReady, setAppReady } from 'redux/modules/app';
import { getNetworkId, updateNetworkSettings, updateWallet } from 'redux/modules/wallet';
import { setTheme } from 'redux/modules/ui';
import {
    getEthereumNetwork,
    getIsOVM,
    getIsPolygon,
    isNetworkSupported,
    SUPPORTED_NETWORKS_NAMES,
} from 'utils/network';
import onboardConnector from 'utils/onboardConnector';
import queryConnector from 'utils/queryConnector';
import { history } from 'utils/routes';
import snxJSConnector from 'utils/snxJSConnector';
import MainLayout from '../../components/MainLayout';
import ROUTES from '../../constants/routes';
import GovernancePage from 'pages/Governance';
import Leaderboard from 'pages/Leaderboard';
// import TradeHistory from 'pages/Options/TradeHistory';
import Cookies from 'universal-cookie';
import Token from '../LandingPage/articles/Token';
import Governance from '../LandingPage/articles/Governance';
import Whitepaper from '../LandingPage/articles/Whitepaper';
import DappLayout from 'layouts/DappLayout';
import { useMatomo } from '@datapunt/matomo-tracker-react';

const OptionsCreateMarket = lazy(() => import('../Options/CreateMarket'));
const Home = lazy(() => import('../LandingPage/Home'));
const Markets = lazy(() => import('../Markets'));
const RangeMarkets = lazy(() => import('../RangeMarkets'));
const AMMTrading = lazy(() => import('../AMMTrading'));
// const OptionsMarket = lazy(() => import('../Options/Market'));
const App = () => {
    const dispatch = useDispatch();
    const isAppReady = useSelector((state) => getIsAppReady(state));
    const [selectedWallet, setSelectedWallet] = useLocalStorage(LOCAL_STORAGE_KEYS.SELECTED_WALLET, '');
    const networkId = useSelector((state) => getNetworkId(state));
    // const isL2 = getIsOVM(networkId);
    const isPolygon = getIsPolygon(networkId);
    const { trackPageView } = useMatomo();

    const [snackbarDetails, setSnackbarDetails] = useState({ message: '', isOpen: false, type: 'success' });

    queryConnector.setQueryClient();

    const cookies = new Cookies();

    useEffect(() => {
        const init = async () => {
            const { networkId, name } = await getEthereumNetwork();
            try {
                dispatch(updateNetworkSettings({ networkId, networkName: name?.toLowerCase() }));
                if (!snxJSConnector.initialized) {
                    const provider = loadProvider({
                        networkId,
                        infuraId: process.env.REACT_APP_INFURA_PROJECT_ID,
                        provider: window.ethereum,
                    });

                    const useOvm = getIsOVM(networkId);

                    snxJSConnector.setContractSettings({ networkId, provider, useOvm });
                }
                dispatch(setAppReady());
            } catch (e) {
                dispatch(setAppReady());
                console.log(e);
            }
        };

        init();
    }, []);

    useEffect(() => {
        // Init value of theme selected from the cookie
        if (isAppReady) {
            dispatch(setTheme(Number(cookies.get('home-theme')) == 0 ? 0 : 1));
        }

        if (isAppReady && networkId && isNetworkSupported(networkId)) {
            const onboard = initOnboard(networkId, {
                address: (walletAddress) => {
                    dispatch(updateWallet({ walletAddress: walletAddress }));
                },
                network: (networkId) => {
                    if (networkId) {
                        if (isNetworkSupported(networkId)) {
                            if (onboardConnector.onboard.getState().wallet.provider) {
                                const provider = loadProvider({
                                    provider: onboardConnector.onboard.getState().wallet.provider,
                                });
                                const signer = provider.getSigner();
                                const useOvm = getIsOVM(networkId);

                                snxJSConnector.setContractSettings({
                                    networkId,
                                    provider,
                                    signer,
                                    useOvm,
                                });
                            } else {
                                const useOvm = getIsOVM(networkId);
                                snxJSConnector.setContractSettings({ networkId, useOvm });
                            }

                            onboardConnector.onboard.config({ networkId });
                        }
                        dispatch(
                            updateNetworkSettings({
                                networkId: networkId,
                                networkName: SUPPORTED_NETWORKS_NAMES[networkId]?.toLowerCase(),
                            })
                        );
                    }
                },
                wallet: async (wallet) => {
                    if (wallet.provider) {
                        const provider = loadProvider({
                            provider: wallet.provider,
                        });
                        const signer = provider.getSigner();
                        const network = await provider.getNetwork();
                        const networkId = network.chainId;
                        const useOvm = getIsOVM(networkId);
                        if (networkId && isNetworkSupported(networkId)) {
                            snxJSConnector.setContractSettings({
                                networkId,
                                provider,
                                signer,
                                useOvm,
                            });
                            setSelectedWallet(wallet.name);
                        }
                        dispatch(
                            updateNetworkSettings({
                                networkId,
                                networkName: SUPPORTED_NETWORKS_NAMES[networkId]?.toLowerCase(),
                            })
                        );
                    } else {
                        setSelectedWallet(null);
                    }
                },
            });

            onboardConnector.setOnBoard(onboard);
        }
    }, [isAppReady]);

    // load previously saved wallet
    useEffect(() => {
        if (onboardConnector.onboard && selectedWallet) {
            // backward compatible for old wallet selection logic;
            const sWallet = selectedWallet === 'MetaMask' ? 'Browser Wallet' : selectedWallet;
            onboardConnector.onboard.walletSelect(sWallet);
        }
    }, [isAppReady, onboardConnector.onboard, selectedWallet]);

    const onSnackbarClosed = (e) => {
        if (e) {
            return;
        }
        setSnackbarDetails({ ...snackbarDetails, type: 'success', isOpen: false });
    };

    useEffect(() => {
        const handler = (e) => {
            setSnackbarDetails({ message: e.detail.text, type: e.detail.type || 'success', isOpen: true });
        };
        document.addEventListener('market-notification', handler);
        return () => {
            document.removeEventListener('market-notification', handler);
        };
    }, []);

    useEffect(() => {
        trackPageView();
    }, []);

    return (
        <QueryClientProvider client={queryConnector.queryClient}>
            <Suspense fallback={<Loader />}>
                <Router history={history}>
                    <Switch>
                        {!isPolygon && (
                            <Route exact path={ROUTES.Options.Royal}>
                                <MainLayout>
                                    <ThalesRoyal />
                                </MainLayout>
                            </Route>
                        )}

                        <Route exact path={ROUTES.Options.CreateMarket}>
                            <DappLayout>
                                <OptionsCreateMarket />
                            </DappLayout>
                        </Route>

                        <Route exact path={ROUTES.Options.QuickTrading}>
                            <MainLayout>
                                <QuickTradingPage />
                            </MainLayout>
                        </Route>

                        <Route
                            exact
                            path={[ROUTES.Governance.Home, ROUTES.Governance.Space, ROUTES.Governance.Proposal]}
                            render={(routeProps) => (
                                <DappLayout>
                                    <GovernancePage {...routeProps} />
                                </DappLayout>
                            )}
                        />
                        <Route exact path={ROUTES.Options.Game}>
                            <DappLayout>
                                <TaleOfThales />
                            </DappLayout>
                        </Route>
                        {selectedWallet && (
                            <Route exact path={ROUTES.Options.Profile}>
                                <DappLayout>
                                    <Profile />
                                </DappLayout>
                            </Route>
                        )}
                        {!isPolygon && (
                            <Route exact path={ROUTES.Options.Token}>
                                <DappLayout>
                                    <TokenPage />
                                </DappLayout>
                            </Route>
                        )}

                        {isPolygon && (
                            <Route exact path={ROUTES.Options.Leaderboard}>
                                <DappLayout>
                                    <Leaderboard />
                                </DappLayout>
                            </Route>
                        )}

                        <Route
                            exact
                            path={ROUTES.Options.MarketMatch}
                            render={(routeProps) => (
                                <DappLayout>
                                    <AMMTrading {...routeProps} />
                                </DappLayout>
                            )}
                        />

                        <Route
                            exact
                            path={ROUTES.Options.RangeMarketMatch}
                            render={(routeProps) => (
                                <DappLayout>
                                    <AMMTrading {...routeProps} />
                                </DappLayout>
                            )}
                        />

                        <Route exact path={ROUTES.Options.Home}>
                            <DappLayout>
                                <Markets />
                            </DappLayout>
                        </Route>

                        <Route exact path={ROUTES.Options.RangeMarkets}>
                            <DappLayout>
                                <RangeMarkets />
                            </DappLayout>
                        </Route>

                        <Route exact path={ROUTES.Home}>
                            <MainLayout>
                                <Home />
                            </MainLayout>
                        </Route>

                        <Route exact path={ROUTES.Article.Token}>
                            <MainLayout>
                                <Token />
                            </MainLayout>
                        </Route>
                        <Route exact path={ROUTES.Article.Governance}>
                            <MainLayout>
                                <Governance />
                            </MainLayout>
                        </Route>
                        <Route exact path={ROUTES.Article.Whitepaper}>
                            <MainLayout>
                                <Whitepaper />
                            </MainLayout>
                        </Route>
                        <Route>
                            <Redirect to={ROUTES.Options.Home} />
                            <DappLayout>
                                <Markets />
                            </DappLayout>
                        </Route>
                    </Switch>
                </Router>
                <ReactQueryDevtools initialIsOpen={false} />
                <Snackbar
                    open={snackbarDetails.isOpen}
                    onClose={onSnackbarClosed}
                    anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'center',
                    }}
                    autoHideDuration={5000}
                >
                    <Alert elevation={6} variant="filled" severity={snackbarDetails.type || 'success'}>
                        {snackbarDetails.message}
                    </Alert>
                </Snackbar>
            </Suspense>
        </QueryClientProvider>
    );
};

export default App;
