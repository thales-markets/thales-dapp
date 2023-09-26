import React, { Suspense, lazy, useEffect } from 'react';
import { QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect, Route, Router, Switch } from 'react-router-dom';
import { setIsMobile } from 'redux/modules/ui';
import { getNetworkId, getWalletAddress } from 'redux/modules/wallet';
import { isMobile } from 'utils/device';
import queryConnector from 'utils/queryConnector';
import { history } from 'utils/routes';
import ROUTES from 'constants/routes';
import { useMatomo } from '@datapunt/matomo-tracker-react';
import { createGlobalStyle } from 'styled-components';
import ThemeProvider from 'layouts/Theme';
import { getDefaultTheme } from 'utils/style';
import { getSupportedNetworksByRoute } from 'utils/network';
import Loader from 'components/Loader';
import DappProvider from 'pages/Root/Providers/DappProvider';

const DappLayout = lazy(() => import(/* webpackChunkName: "DappLayout" */ 'layouts/DappLayout'));
const MainLayout = lazy(() => import(/* webpackChunkName: "MainLayout" */ 'components/MainLayout'));

const CreateMarket = lazy(() => import(/* webpackChunkName: "CreateMarket" */ '../CreateMarket'));
const Home = lazy(() => import(/* webpackChunkName: "Home" */ '../LandingPage'));
const Governance = lazy(() => import(/* webpackChunkName: "Governance" */ '../LandingPage/articles/Governance'));
const Whitepaper = lazy(() => import(/* webpackChunkName: "Whitepaper" */ '../LandingPage/articles/Whitepaper'));
const Token = lazy(() => import(/* webpackChunkName: "Token" */ '../LandingPage/articles/Token'));

const GovernancePage = lazy(() => import(/* webpackChunkName: "Governance" */ '../Governance'));

const Markets = lazy(() => import(/* webpackChunkName: "Markets" */ '../Trade'));
const SpeedMarkets = lazy(() => import(/* webpackChunkName: "SpeedMarkets" */ '../SpeedMarkets'));
const SpeedMarketsOverview = lazy(() =>
    import(/* webpackChunkName: "SpeedMarketsOverview" */ '../SpeedMarketsOverview')
);
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
                <Router history={history}>
                    <Switch>
                        <Suspense fallback={<Loader />}>
                            <DappProvider>
                                {getSupportedNetworksByRoute(ROUTES.Options.CreateMarket).includes(networkId) && (
                                    <Route exact path={ROUTES.Options.CreateMarket}>
                                        <DappLayout>
                                            <CreateMarket />
                                        </DappLayout>
                                    </Route>
                                )}

                                {getSupportedNetworksByRoute(ROUTES.Governance.Home).includes(networkId) && (
                                    <Route
                                        exact
                                        path={[
                                            ROUTES.Governance.Home,
                                            ROUTES.Governance.Space,
                                            ROUTES.Governance.Proposal,
                                        ]}
                                        render={(routeProps) => (
                                            <DappLayout>
                                                <GovernancePage {...routeProps} />
                                            </DappLayout>
                                        )}
                                    />
                                )}

                                {getSupportedNetworksByRoute(ROUTES.Options.Game).includes(networkId) && (
                                    <Route exact path={ROUTES.Options.Game}>
                                        <DappLayout>
                                            <TaleOfThales />
                                        </DappLayout>
                                    </Route>
                                )}

                                {getSupportedNetworksByRoute(ROUTES.Options.Profile).includes(networkId) && (
                                    <Route exact path={ROUTES.Options.Profile}>
                                        <DappLayout>
                                            <Profile />
                                        </DappLayout>
                                    </Route>
                                )}

                                {getSupportedNetworksByRoute(ROUTES.Options.Token).includes(networkId) && (
                                    <Route exact path={ROUTES.Options.Token}>
                                        <DappLayout>
                                            <TokenPage />
                                        </DappLayout>
                                    </Route>
                                )}

                                {getSupportedNetworksByRoute(ROUTES.Options.Referral).includes(networkId) && (
                                    <Route exact path={ROUTES.Options.Referral}>
                                        <DappLayout>
                                            <Referral />
                                        </DappLayout>
                                    </Route>
                                )}

                                {getSupportedNetworksByRoute(ROUTES.Options.Vaults).includes(networkId) && (
                                    <Route exact path={ROUTES.Options.Vaults}>
                                        <DappLayout>
                                            <Vaults />
                                        </DappLayout>
                                    </Route>
                                )}

                                {getSupportedNetworksByRoute(ROUTES.Options.Vault).includes(networkId) && (
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

                                {getSupportedNetworksByRoute(ROUTES.Options.LiquidityPool).includes(networkId) && (
                                    <Route exact path={ROUTES.Options.LiquidityPool}>
                                        <DappLayout>
                                            <LiquidityPool />
                                        </DappLayout>
                                    </Route>
                                )}

                                {getSupportedNetworksByRoute(ROUTES.Options.Home).includes(networkId) && (
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

                                {getSupportedNetworksByRoute(ROUTES.Options.RangeMarkets).includes(networkId) && (
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

                                <Route
                                    exact
                                    path={ROUTES.Options.Home}
                                    render={(routeProps) => (
                                        <DappLayout>
                                            <Markets {...routeProps} />
                                        </DappLayout>
                                    )}
                                />

                                {getSupportedNetworksByRoute(ROUTES.Options.SpeedMarkets).includes(networkId) && (
                                    <Route
                                        exact
                                        path={ROUTES.Options.SpeedMarkets}
                                        render={(routeProps) => (
                                            <DappLayout>
                                                <SpeedMarkets {...routeProps} />
                                            </DappLayout>
                                        )}
                                    />
                                )}
                                {getSupportedNetworksByRoute(ROUTES.Options.SpeedMarkets).includes(networkId) && (
                                    <Route
                                        exact
                                        path={ROUTES.Options.SpeedMarketsOverview}
                                        render={(routeProps) => (
                                            <DappLayout>
                                                <SpeedMarketsOverview {...routeProps} />
                                            </DappLayout>
                                        )}
                                    />
                                )}

                                <Route
                                    exact
                                    path={ROUTES.Options.RangeMarkets}
                                    render={(routeProps) => (
                                        <DappLayout>
                                            <Markets {...routeProps} />
                                        </DappLayout>
                                    )}
                                ></Route>

                                {/* <Route>
                                    <Redirect to={ROUTES.Options.Home} />
                                    <DappLayout>
                                        <Markets />
                                    </DappLayout>
                                </Route> */}

                                <Route exact path={ROUTES.Options.Wizard}>
                                    <DappLayout>
                                        <Wizard />
                                    </DappLayout>
                                </Route>
                            </DappProvider>

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

                            {/* <DappProvider>
                                <Route>
                                    <Redirect to={ROUTES.Options.Home} />
                                    <DappLayout>
                                        <Markets />
                                    </DappLayout>
                                </Route>
                            </DappProvider> */}
                        </Suspense>
                    </Switch>
                </Router>
                <ReactQueryDevtools initialIsOpen={false} />
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
