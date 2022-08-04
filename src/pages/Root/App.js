import { Snackbar } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import Loader from 'components/Loader';
import { initOnboard } from 'config/onboard';
import { LOCAL_STORAGE_KEYS } from 'constants/storage';
import useLocalStorage from 'hooks/useLocalStorage';
import React, { lazy, Suspense, useEffect, useState } from 'react';
import { QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect, Route, Router, Switch } from 'react-router-dom';
import { getIsAppReady, setAppReady } from 'redux/modules/app';
import { getNetworkId, getWalletAddress, updateNetworkSettings, updateWallet } from 'redux/modules/wallet';
import { setTheme } from 'redux/modules/ui';
import { defaultNetwork, getIsOVM, getIsPolygon, isNetworkSupported, SUPPORTED_NETWORKS_NAMES } from 'utils/network';
import onboardConnector from 'utils/onboardConnector';
import queryConnector from 'utils/queryConnector';
import { history } from 'utils/routes';
import ROUTES from 'constants/routes';
import Cookies from 'universal-cookie';
import { ethers } from 'ethers';
import { useMatomo } from '@datapunt/matomo-tracker-react';

const DappLayout = lazy(() => import(/* webpackChunkName: "DappLayout" */ 'layouts/DappLayout'));
const MainLayout = lazy(() => import(/* webpackChunkName: "MainLayout" */ 'components/MainLayout'));

const CreateMarket = lazy(() => import(/* webpackChunkName: "CreateMarket" */ '../CreateMarket'));
const Home = lazy(() => import(/* webpackChunkName: "Home" */ '../LandingPage/Home'));
const Governance = lazy(() => import(/* webpackChunkName: "Governance" */ '../LandingPage/articles/Governance'));
const Whitepaper = lazy(() => import(/* webpackChunkName: "Whitepaper" */ '../LandingPage/articles/Whitepaper'));
const Token = lazy(() => import(/* webpackChunkName: "Token" */ '../LandingPage/articles/Token'));

const GovernancePage = lazy(() => import(/* webpackChunkName: "Governance" */ '../Governance'));
const Leaderboard = lazy(() => import(/* webpackChunkName: "Leaderboard" */ '../Leaderboard'));

const Markets = lazy(() => import(/* webpackChunkName: "Markets" */ '../Markets'));
const RangeMarkets = lazy(() => import(/* webpackChunkName: "RangeMarkets" */ '../RangeMarkets'));
const AMMTrading = lazy(() => import(/* webpackChunkName: "AMMTrading" */ '../AMMTrading'));
const Wizard = lazy(() => import(/* webpackChunkName: "Wizard" */ '../Wizard'));

const TokenPage = lazy(() => import(/* webpackChunkName: "Token" */ '../Token/Token'));
const TaleOfThales = lazy(() => import(/* webpackChunkName: "TaleOfThales" */ '../TaleOfThales/TaleOfThales'));
const Profile = lazy(() => import(/* webpackChunkName: "Profile" */ '../Profile/Profile'));
const ThalesRoyal = lazy(() => import(/* webpackChunkName: "ThalesRoyal" */ '../Royale/ThalesRoyal'));

const Referral = lazy(() => import(/* webpackChunkName: "Referral" */ '../Referral'));
const OPRewards = lazy(() => import(/* webpackChunkName: "OPRewards" */ '../OPRewards'));

const App = () => {
    const dispatch = useDispatch();
    const isAppReady = useSelector((state) => getIsAppReady(state));
    const walletAddress = useSelector((state) => getWalletAddress(state));
    const [selectedWallet, setSelectedWallet] = useLocalStorage(LOCAL_STORAGE_KEYS.SELECTED_WALLET, '');
    const networkId = useSelector((state) => getNetworkId(state));
    // const isL2 = getIsOVM(networkId);
    const isPolygon = getIsPolygon(networkId);
    const [snxJSConnector, setSnxJSConnector] = useState();
    const [snackbarDetails, setSnackbarDetails] = useState({ message: '', isOpen: false, type: 'success' });

    const { trackPageView } = useMatomo();

    queryConnector.setQueryClient();

    useEffect(() => {
        trackPageView({
            customDimensions: [
                {
                    id: 3,
                    value: Number(cookies.get('home-theme')) == 0 ? 0 : 1,
                },
                {
                    id: 4,
                    value: walletAddress ? true : false,
                },
            ],
        });
    }, [walletAddress]);

    const cookies = new Cookies();

    useEffect(() => {
        const provider = loadProvider({
            infuraId: process.env.REACT_APP_INFURA_PROJECT_ID,
            provider: window.ethereum,
            networkId,
        });

        const init = async () => {
            try {
                const providerNetworkId = (await provider.getNetwork()).chainId;
                const name = SUPPORTED_NETWORKS_NAMES[providerNetworkId];

                dispatch(updateNetworkSettings({ networkId: providerNetworkId, networkName: name?.toLowerCase() }));

                const useOvm = getIsOVM(providerNetworkId);
                if (!snxJSConnector) {
                    import(/* webpackChunkName: "snxJSConnector" */ 'utils/snxJSConnector').then((snx) => {
                        snx.default.setContractSettings({ networkId: providerNetworkId, provider, useOvm });
                        setSnxJSConnector(snx.default);
                        dispatch(setAppReady());
                    });
                } else {
                    snxJSConnector.setContractSettings({ ...snxJSConnector, networkId: providerNetworkId, provider });
                }
            } catch (e) {
                dispatch(setAppReady());
                console.log(e);
            }
        };
        init();

        const handler = (e) => {
            setSnackbarDetails({ message: e.detail.text, type: e.detail.type || 'success', isOpen: true });
        };
        document.addEventListener('market-notification', handler);
        return () => {
            document.removeEventListener('market-notification', handler);
        };
    }, [networkId]);

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
                                <CreateMarket />
                            </DappLayout>
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

                        <Route exact path={ROUTES.Options.Referral}>
                            <DappLayout>
                                <Referral />
                            </DappLayout>
                        </Route>

                        {!isPolygon && (
                            <Route exact path={ROUTES.Options.OPRewards}>
                                <DappLayout>
                                    <OPRewards />
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

                        <Route exact path={ROUTES.Options.Wizard}>
                            <DappLayout>
                                <Wizard />
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

const loadProvider = ({ infuraId, provider, networkId }) => {
    if (!provider && !infuraId) throw new Error('No web3 provider');
    if (provider) return new ethers.providers.Web3Provider(provider, 'any');
    if (infuraId)
        return new ethers.providers.InfuraProvider(networkId ? networkId : defaultNetwork.networkId, infuraId);
};

export default App;
