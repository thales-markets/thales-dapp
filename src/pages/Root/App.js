import React, { Suspense, useEffect } from 'react';
import { QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { useDispatch, useSelector } from 'react-redux';
import { Route, Router, Switch } from 'react-router-dom';
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
import MetaData from 'components/MetaData';
import loadable from '@loadable/component';

const DappLayout = loadable(() => import(/* webpackChunkName: "DappLayout" */ 'layouts/DappLayout'));
const MainLayout = loadable(() => import(/* webpackChunkName: "MainLayout" */ 'components/MainLayout'));

const CreateMarket = loadable(() => import(/* webpackChunkName: "CreateMarket" */ '../CreateMarket'));
const Home = loadable(() => import(/* webpackChunkName: "Home" */ '../LandingPage'));
const Governance = loadable(() => import(/* webpackChunkName: "Governance" */ '../LandingPage/articles/Governance'));
const Whitepaper = loadable(() => import(/* webpackChunkName: "Whitepaper" */ '../LandingPage/articles/Whitepaper'));
const Token = loadable(() => import(/* webpackChunkName: "Token" */ '../LandingPage/articles/Token'));

const GovernancePage = loadable(() => import(/* webpackChunkName: "Governance" */ '../Governance'));

const Markets = loadable(() => import(/* webpackChunkName: "Markets" */ '../Trade'));
const SpeedMarkets = loadable(() => import(/* webpackChunkName: "SpeedMarkets" */ '../SpeedMarkets'));
const SpeedMarketsOverview = loadable(() =>
    import(/* webpackChunkName: "SpeedMarketsOverview" */ '../SpeedMarketsOverview')
);
const AMMTrading = loadable(() => import(/* webpackChunkName: "AMMTrading" */ '../AMMTrading'));
const Wizard = loadable(() => import(/* webpackChunkName: "Wizard" */ '../Wizard'));

const Vaults = loadable(() => import(/* webpackChunkName: "Vaults" */ '../Vaults'));
const Vault = loadable(() => import(/* webpackChunkName: "Vault" */ '../Vault'));

const TokenPage = loadable(() => import(/* webpackChunkName: "Token" */ '../Token'));

const TaleOfThales = loadable(() => import(/* webpackChunkName: "TaleOfThales" */ '../TaleOfThales'));
const Profile = loadable(() => import(/* webpackChunkName: "Profile" */ '../Profile'));

const Referral = loadable(() => import(/* webpackChunkName: "Referral" */ '../Referral'));
const LiquidityPool = loadable(() => import(/* webpackChunkName: "LiquidityPool" */ '../LiquidityPool'));

const DappProvider = loadable(() => import(/* webpackChunkName: "DappProvider" */ 'pages/Root/Providers/DappProvider'));

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
                                                <MetaData page={'Governance'} />
                                                <GovernancePage {...routeProps} />
                                            </DappLayout>
                                        )}
                                    />
                                )}

                                {getSupportedNetworksByRoute(ROUTES.Options.Game).includes(networkId) && (
                                    <Route exact path={ROUTES.Options.Game}>
                                        <DappLayout>
                                            <MetaData page={'TaleOfThales'} />
                                            <TaleOfThales />
                                        </DappLayout>
                                    </Route>
                                )}

                                {getSupportedNetworksByRoute(ROUTES.Options.Profile).includes(networkId) && (
                                    <Route exact path={ROUTES.Options.Profile}>
                                        <DappLayout>
                                            <MetaData page={'Profile'} />
                                            <Profile />
                                        </DappLayout>
                                    </Route>
                                )}

                                {getSupportedNetworksByRoute(ROUTES.Options.Token).includes(networkId) && (
                                    <Route exact path={ROUTES.Options.Token}>
                                        <DappLayout>
                                            <MetaData page={'Token'} />
                                            <TokenPage />
                                        </DappLayout>
                                    </Route>
                                )}

                                {getSupportedNetworksByRoute(ROUTES.Options.Referral).includes(networkId) && (
                                    <Route exact path={ROUTES.Options.Referral}>
                                        <DappLayout>
                                            <MetaData page={'Referral'} />
                                            <Referral />
                                        </DappLayout>
                                    </Route>
                                )}

                                {getSupportedNetworksByRoute(ROUTES.Options.Vaults).includes(networkId) && (
                                    <Route exact path={ROUTES.Options.Vaults}>
                                        <DappLayout>
                                            <MetaData page={'Vaults'} />
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
                                                <MetaData page={'Vaults'} />
                                                <Vault {...routeProps} />
                                            </DappLayout>
                                        )}
                                    />
                                )}

                                {getSupportedNetworksByRoute(ROUTES.Options.LiquidityPool).includes(networkId) && (
                                    <Route exact path={ROUTES.Options.LiquidityPool}>
                                        <DappLayout>
                                            <MetaData page={'LiquidityPool'} />
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
                                                <MetaData page={'Markets'} />
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
                                                <MetaData page={'Markets'} />
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
                                            <MetaData page={'Markets'} />
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
                                                <MetaData page={'SpeedMarkets'} />
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
                                                <MetaData page={'SpeedMarkets'} />
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
                                            <MetaData page={'Markets'} />
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
                                        <MetaData page={'Wizard'} />
                                        <Wizard />
                                    </DappLayout>
                                </Route>
                            </DappProvider>

                            <Route exact path={ROUTES.Home}>
                                <MainLayout>
                                    <MetaData page={'Home'} />
                                    <Home />
                                </MainLayout>
                            </Route>

                            <Route exact path={ROUTES.Article.Token}>
                                <MainLayout>
                                    <MetaData page={'Token'} />
                                    <Token />
                                </MainLayout>
                            </Route>
                            <Route exact path={ROUTES.Article.Governance}>
                                <MainLayout>
                                    <MetaData page={'Governance'} />
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
