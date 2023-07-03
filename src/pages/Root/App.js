import Loader from 'components/Loader';
import React, { lazy, Suspense, useEffect } from 'react';
import { QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect, Route, Router, Switch } from 'react-router-dom';
import { setAppReady } from 'redux/modules/app';
import { setIsMobile } from 'redux/modules/ui';
import {
    getNetworkId,
    getSwitchToNetworkId,
    getWalletAddress,
    updateNetworkSettings,
    switchToNetworkId,
    updateWallet,
} from 'redux/modules/wallet';
import { isMobile } from 'utils/device';
import { getIsBSC, getIsMainnet, getIsPolygon, isNetworkSupported } from 'utils/network';
import { SUPPORTED_NETWORKS_NAMES } from 'constants/network';
import queryConnector from 'utils/queryConnector';
import { history } from 'utils/routes';
import ROUTES from 'constants/routes';
import { useMatomo } from '@datapunt/matomo-tracker-react';
import { IFrameEthereumProvider } from '@ledgerhq/iframe-provider';
import { isLedgerDappBrowserProvider } from 'utils/ledger';
import { useAccount, useProvider, useSigner, useDisconnect, useNetwork } from 'wagmi';
import snxJSConnector from 'utils/snxJSConnector';
import { createGlobalStyle } from 'styled-components';
import ThemeProvider from 'layouts/Theme';
import { getDefaultTheme } from 'utils/style';

const DappLayout = lazy(() => import(/* webpackChunkName: "DappLayout" */ 'layouts/DappLayout'));
const MainLayout = lazy(() => import(/* webpackChunkName: "MainLayout" */ 'components/MainLayout'));

const CreateMarket = lazy(() => import(/* webpackChunkName: "CreateMarket" */ '../CreateMarket'));
const Home = lazy(() => import(/* webpackChunkName: "Home" */ '../LandingPage'));
const Governance = lazy(() => import(/* webpackChunkName: "Governance" */ '../LandingPage/articles/Governance'));
const Whitepaper = lazy(() => import(/* webpackChunkName: "Whitepaper" */ '../LandingPage/articles/Whitepaper'));
const Token = lazy(() => import(/* webpackChunkName: "Token" */ '../LandingPage/articles/Token'));

const GovernancePage = lazy(() => import(/* webpackChunkName: "Governance" */ '../Governance'));

const Markets = lazy(() => import(/* webpackChunkName: "Markets" */ '../Trade'));
const AMMTrading = lazy(() => import(/* webpackChunkName: "AMMTrading" */ '../AMMTrading'));
const Wizard = lazy(() => import(/* webpackChunkName: "Wizard" */ '../Wizard'));

const Vaults = lazy(() => import(/* webpackChunkName: "Vaults" */ '../Vaults'));
const Vault = lazy(() => import(/* webpackChunkName: "Vault" */ '../Vault'));

const TokenPage = lazy(() => import(/* webpackChunkName: "Token" */ '../Token'));
const TaleOfThales = lazy(() => import(/* webpackChunkName: "TaleOfThales" */ '../TaleOfThales'));
const Profile = lazy(() => import(/* webpackChunkName: "Profile" */ '../Profile'));

const Referral = lazy(() => import(/* webpackChunkName: "Referral" */ '../Referral'));
const LiquidityPool = lazy(() => import(/* webpackChunkName: "LiquidityPool" */ '../LiquidityPool'));

const App = () => {
    const dispatch = useDispatch();
    const walletAddress = useSelector((state) => getWalletAddress(state));
    const networkId = useSelector((state) => getNetworkId(state));
    const switchedToNetworkId = useSelector((state) => getSwitchToNetworkId(state));

    const isMainnet = getIsMainnet(networkId);
    const isPolygon = getIsPolygon(networkId);
    const isBSC = getIsBSC(networkId);

    const isLedgerLive = isLedgerDappBrowserProvider();

    const { address } = useAccount();
    const provider = useProvider(!address && { chainId: switchedToNetworkId }); // when wallet not connected force chain
    const { data: signer } = useSigner();
    const { disconnect } = useDisconnect();
    const { chain } = useNetwork();

    const { trackPageView } = useMatomo();

    queryConnector.setQueryClient();

    useEffect(() => {
        const theme = getDefaultTheme();

        trackPageView({
            customDimensions: [
                {
                    id: 3,
                    value: theme,
                },
                {
                    id: 4,
                    value: walletAddress ? true : false,
                },
            ],
        });
    }, [walletAddress, trackPageView]);

    useEffect(() => {
        const init = async () => {
            let ledgerProvider = null;
            if (isLedgerLive) {
                ledgerProvider = new IFrameEthereumProvider();
                const accounts = await ledgerProvider.enable();
                const account = accounts[0];
                dispatch(updateWallet({ walletAddress: account }));
                ledgerProvider.on('accountsChanged', (accounts) => {
                    if (accounts.length > 0) {
                        dispatch(updateWallet({ walletAddress: accounts[0] }));
                    }
                });
            }

            try {
                const chainIdFromProvider = (await provider.getNetwork()).chainId;
                const providerNetworkId = isLedgerLive
                    ? ledgerProvider
                    : !!address
                    ? chainIdFromProvider
                    : switchedToNetworkId;

                snxJSConnector.setContractSettings({
                    networkId: providerNetworkId,
                    provider,
                    signer: isLedgerLive ? ledgerProvider.getSigner() : signer,
                });

                dispatch(
                    updateNetworkSettings({
                        networkId: providerNetworkId,
                        networkName: SUPPORTED_NETWORKS_NAMES[providerNetworkId]?.toLowerCase(),
                    })
                );
                dispatch(setAppReady());
            } catch (e) {
                if (!e.toString().includes('Error: underlying network changed')) {
                    dispatch(setAppReady());
                    console.log(e);
                }
            }
        };
        init();
    }, [dispatch, provider, signer, switchedToNetworkId, address, isLedgerLive]);

    useEffect(() => {
        dispatch(updateWallet({ walletAddress: address }));
    }, [address, dispatch]);

    useEffect(() => {
        if (window.ethereum) {
            window.ethereum.on('chainChanged', (chainIdParam) => {
                const chainId = Number.isInteger(chainIdParam) ? chainIdParam : parseInt(chainIdParam, 16);

                if (!address && isNetworkSupported(chainId)) {
                    // when wallet disconnected reflect network change from browser wallet to dApp
                    dispatch(switchToNetworkId({ networkId: chainId }));
                }
            });
        }
    }, [dispatch, address]);

    useEffect(() => {
        if (chain?.unsupported) {
            disconnect();
        }
    }, [disconnect, chain]);

    useEffect(() => {
        const handlePageResized = () => {
            dispatch(setIsMobile(isMobile()));
        };

        if (typeof window !== 'undefined') {
            window.addEventListener('resize', handlePageResized);
            window.addEventListener('orientationchange', handlePageResized);
            window.addEventListener('load', handlePageResized);
            window.addEventListener('reload', handlePageResized);
        }

        return () => {
            if (typeof window !== 'undefined') {
                window.removeEventListener('resize', handlePageResized);
                window.removeEventListener('orientationchange', handlePageResized);
                window.removeEventListener('load', handlePageResized);
                window.removeEventListener('reload', handlePageResized);
            }
        };
    }, [dispatch]);

    return (
        <ThemeProvider>
            <QueryClientProvider client={queryConnector.queryClient}>
                <Suspense fallback={<Loader />}>
                    <Router history={history}>
                        <Switch>
                            {!isMainnet && (
                                <Route exact path={ROUTES.Options.CreateMarket}>
                                    <DappLayout>
                                        <CreateMarket />
                                    </DappLayout>
                                </Route>
                            )}

                            {!isMainnet && (
                                <Route
                                    exact
                                    path={[ROUTES.Governance.Home, ROUTES.Governance.Space, ROUTES.Governance.Proposal]}
                                    render={(routeProps) => (
                                        <DappLayout>
                                            <GovernancePage {...routeProps} />
                                        </DappLayout>
                                    )}
                                />
                            )}

                            {!isMainnet && (
                                <Route exact path={ROUTES.Options.Game}>
                                    <DappLayout>
                                        <TaleOfThales />
                                    </DappLayout>
                                </Route>
                            )}

                            {!isMainnet && (
                                <Route exact path={ROUTES.Options.Profile}>
                                    <DappLayout>
                                        <Profile />
                                    </DappLayout>
                                </Route>
                            )}

                            {!isPolygon && !isBSC && (
                                <Route exact path={ROUTES.Options.Token}>
                                    <DappLayout>
                                        <TokenPage />
                                    </DappLayout>
                                </Route>
                            )}

                            {!isMainnet && (
                                <Route exact path={ROUTES.Options.Referral}>
                                    <DappLayout>
                                        <Referral />
                                    </DappLayout>
                                </Route>
                            )}

                            {!isPolygon && !isMainnet && (
                                <Route exact path={ROUTES.Options.Vaults}>
                                    <DappLayout>
                                        <Vaults />
                                    </DappLayout>
                                </Route>
                            )}

                            {!isPolygon && !isMainnet && (
                                <Route
                                    exact
                                    path={ROUTES.Options.Vault}
                                    render={(routeProps) => (
                                        <DappLayout>
                                            <Vault {...routeProps} />
                                        </DappLayout>
                                    )}
                                />
                            )}

                            {!isPolygon && !isMainnet && (
                                <Route exact path={ROUTES.Options.LiquidityPool}>
                                    <DappLayout>
                                        <LiquidityPool />
                                    </DappLayout>
                                </Route>
                            )}

                            {!isMainnet && (
                                <Route
                                    exact
                                    path={ROUTES.Options.MarketMatch}
                                    render={(routeProps) => (
                                        <DappLayout>
                                            <AMMTrading {...routeProps} />
                                        </DappLayout>
                                    )}
                                />
                            )}

                            {!isMainnet && (
                                <Route
                                    exact
                                    path={ROUTES.Options.RangeMarketMatch}
                                    render={(routeProps) => (
                                        <DappLayout>
                                            <AMMTrading {...routeProps} />
                                        </DappLayout>
                                    )}
                                />
                            )}

                            <Route exact path={ROUTES.Options.Home}>
                                <DappLayout>
                                    <Markets />
                                </DappLayout>
                            </Route>

                            <Route
                                exact
                                path={ROUTES.Options.RangeMarkets}
                                render={(routeProps) => (
                                    <DappLayout>
                                        <Markets {...routeProps} />
                                    </DappLayout>
                                )}
                            ></Route>

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
                </Suspense>
            </QueryClientProvider>
            <GlobalStyle />
        </ThemeProvider>
    );
};

const GlobalStyle = createGlobalStyle`
    * {
        font-family: ${(props) => props.theme.fontFamily.primary};
        font-style: normal !important;
    }
    *::-webkit-scrollbar-track {
        background: ${(props) => props.theme.background.secondary};
    }
    *::-webkit-scrollbar-thumb {
        background: ${(props) => props.theme.background.tertiary};
    }
    body {
        background: ${(props) => props.theme.landingPage.background.primary};
    }
    body #root {
        background: ${(props) => props.theme.background.primary};
    }
`;

export default App;
