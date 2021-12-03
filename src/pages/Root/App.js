import { Snackbar } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import { loadProvider } from '@synthetixio/providers';
import Loader from 'components/Loader';
import { initOnboard } from 'config/onboard';
import { LOCAL_STORAGE_KEYS } from 'constants/storage';
import useLocalStorage from 'hooks/useLocalStorage';
import EarnPage from 'pages/Options/Earn/Earn.tsx';
import LeaderboardPage from 'pages/Options/Home/Leaderboard';
import QuickTradingPage from 'pages/Options/QuickTrading';
import QuickTradingCompetitionPage from 'pages/Options/QuickTradingCompetition';
import ThalesRoyal from 'pages/Options/Royal/ThalesRoyal';
import React, { lazy, Suspense, useEffect, useState } from 'react';
import { QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect, Route, Router, Switch } from 'react-router-dom';
import { getIsAppReady, setAppReady } from 'redux/modules/app';
import { getNetworkId, updateNetworkSettings, updateWallet } from 'redux/modules/wallet';
import { getEthereumNetwork, getIsOVM, isNetworkSupported, SUPPORTED_NETWORKS } from 'utils/network';
import onboardConnector from 'utils/onboardConnector';
import queryConnector from 'utils/queryConnector';
import { history } from 'utils/routes';
import snxJSConnector from 'utils/snxJSConnector';
import MainLayout from '../../components/MainLayout';
import ROUTES from '../../constants/routes';
import GovernancePage from 'pages/Governance';

const OptionsCreateMarket = lazy(() => import('../Options/CreateMarket'));
const Home = lazy(() => import('../Home'));
const OptionsHome = lazy(() => import('../Options/Home'));
const OptionsMarket = lazy(() => import('../Options/Market'));
const App = () => {
    const dispatch = useDispatch();
    const isAppReady = useSelector((state) => getIsAppReady(state));
    const [selectedWallet, setSelectedWallet] = useLocalStorage(LOCAL_STORAGE_KEYS.SELECTED_WALLET, '');
    const networkId = useSelector((state) => getNetworkId(state));
    const isL2 = getIsOVM(networkId);

    const [snackbarDetails, setSnackbarDetails] = useState({ message: '', isOpen: false });

    queryConnector.setQueryClient();

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
        if (isAppReady && networkId && isNetworkSupported(networkId)) {
            const onboard = initOnboard(networkId, {
                address: (walletAddress) => {
                    dispatch(updateWallet({ walletAddress: walletAddress }));
                },
                network: (networkId) => {
                    if (networkId && isNetworkSupported(networkId)) {
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

                        dispatch(
                            updateNetworkSettings({
                                networkId: networkId,
                                networkName: SUPPORTED_NETWORKS[networkId]?.toLowerCase(),
                            })
                        );
                    } else {
                        dispatch(
                            updateNetworkSettings({
                                networkId: networkId,
                                networkName: SUPPORTED_NETWORKS[networkId]?.toLowerCase(),
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

                            dispatch(
                                updateNetworkSettings({
                                    networkId,
                                    networkName: SUPPORTED_NETWORKS[networkId]?.toLowerCase(),
                                })
                            );
                            setSelectedWallet(wallet.name);
                        }

                        dispatch(
                            updateNetworkSettings({
                                networkId,
                                networkName: SUPPORTED_NETWORKS[networkId]?.toLowerCase(),
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
            onboardConnector.onboard.walletSelect(selectedWallet);
        }
    }, [isAppReady, onboardConnector.onboard, selectedWallet]);

    const onSnackbarClosed = (e) => {
        if (e) {
            return;
        }
        setSnackbarDetails({ ...snackbarDetails, isOpen: false });
    };

    useEffect(() => {
        const handler = (e) => {
            setSnackbarDetails({ message: e.detail.text, isOpen: true });
        };
        document.addEventListener('market-notification', handler);
        return () => {
            document.removeEventListener('market-notification', handler);
        };
    }, []);

    return (
        <QueryClientProvider client={queryConnector.queryClient}>
            <Suspense fallback={<Loader />}>
                <Router history={history}>
                    <Switch>
                        <Route exact path={ROUTES.Options.Royal}>
                            <MainLayout>
                                <ThalesRoyal />
                            </MainLayout>
                        </Route>

                        {isL2 && (
                            <Route>
                                <Redirect to={ROUTES.Options.Home} />
                                <MainLayout>
                                    <OptionsHome />
                                </MainLayout>
                            </Route>
                        )}

                        <Route exact path={ROUTES.Options.CreateMarket}>
                            <MainLayout>
                                <OptionsCreateMarket />
                            </MainLayout>
                        </Route>

                        <Route exact path={ROUTES.Options.Leaderboard}>
                            <MainLayout>
                                <LeaderboardPage />
                            </MainLayout>
                        </Route>

                        <Route exact path={ROUTES.Options.QuickTrading}>
                            <MainLayout>
                                <QuickTradingPage />
                            </MainLayout>
                        </Route>

                        <Route exact path={ROUTES.Options.QuickTradingCompetition}>
                            <MainLayout>
                                <QuickTradingCompetitionPage />
                            </MainLayout>
                        </Route>
                        <Route
                            exact
                            path={[ROUTES.Governance.Home, ROUTES.Governance.Space, ROUTES.Governance.Proposal]}
                            render={(routeProps) => (
                                <MainLayout>
                                    <GovernancePage {...routeProps} />
                                </MainLayout>
                            )}
                        />
                        <Route exact path={ROUTES.Options.Token}>
                            <MainLayout>
                                <EarnPage />
                            </MainLayout>
                        </Route>

                        <Route
                            exact
                            path={ROUTES.Options.MarketMatch}
                            render={(routeProps) => (
                                <MainLayout>
                                    <OptionsMarket {...routeProps} />
                                </MainLayout>
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
                        <Route>
                            <Redirect to={ROUTES.Options.Home} />
                            <MainLayout>
                                <OptionsHome />
                            </MainLayout>
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
                    <Alert elevation={6} variant="filled" severity="success">
                        {snackbarDetails.message}
                    </Alert>
                </Snackbar>
            </Suspense>
        </QueryClientProvider>
    );
};

export default App;
