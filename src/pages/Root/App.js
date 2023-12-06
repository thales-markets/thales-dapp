import React, { Suspense, lazy, useEffect } from 'react';
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
import { isNetworkSupported } from 'utils/network';
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
import { getSupportedNetworksByRoute } from 'utils/network';
import Loader from 'components/Loader';
import { BiconomySmartAccountV2, DEFAULT_ENTRYPOINT_ADDRESS } from '@biconomy/account';
import { Bundler } from '@biconomy/bundler';
import { DEFAULT_ECDSA_OWNERSHIP_MODULE, ECDSAOwnershipValidationModule } from '@biconomy/modules';
import { ethers } from 'ethers';
import { ParticleNetwork } from '@particle-network/auth';
import { ParticleProvider } from '@particle-network/provider';
import { BiconomyPaymaster } from '@biconomy/paymaster';
import biconomyConnector from 'utils/biconomyWallet';
// import multipleCollateral from 'utils/contracts/multipleCollateralContract';

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

const particle = new ParticleNetwork({
    projectId: '2b8c8b75-cc7a-4111-923f-0043b9fa908b',
    clientKey: 'cS3khABdBgfK4m8CzYcL1xcgVM6cuflmNY6dFxdY',
    appId: 'aab773d8-c4e9-43ae-aa57-0d898f3dbf46',
    chainName: 'optimism', //optional: current chain name, default Ethereum.
    chainId: 10, //optional: current chain id, default 1.
    wallet: {
        //optional: by default, the wallet entry is displayed in the bottom right corner of the webpage.
        displayWalletEntry: true, //show wallet entry when connect particle.
        uiMode: 'dark', //optional: light or dark, if not set, the default is the same as web auth.
        supportChains: [
            { id: 10, name: 'optimism' },
            { id: 42161, name: 'arbitrum' },
            { id: 137, name: 'polygon' },
            { id: 420, name: 'optimism' },
            { id: 84531, name: 'base' },
        ], // optional: web wallet support chains.
        customStyle: {}, //optional: custom wallet style
    },
});

const App = () => {
    const dispatch = useDispatch();
    const walletAddress = useSelector((state) => getWalletAddress(state));
    const networkId = useSelector((state) => getNetworkId(state));
    const switchedToNetworkId = useSelector((state) => getSwitchToNetworkId(state));

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
            let web3Provider = null;
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

            if (particle.auth.isLogin()) {
                const particleProvider = new ParticleProvider(particle.auth);
                const chainId = (await provider.getNetwork()).chainId;
                const bundler = new Bundler({
                    // get from biconomy dashboard https://dashboard.biconomy.io/
                    bundlerUrl: `https://bundler.biconomy.io/api/v2/${chainId}/${process.env.REACT_APP_BICONOMY_BUNDLE_KEY}`,
                    chainId: (await provider.getNetwork()).chainId, // or any supported chain of your choice
                    entryPointAddress: DEFAULT_ENTRYPOINT_ADDRESS,
                });

                const paymaster = new BiconomyPaymaster({
                    paymasterUrl: `https://paymaster.biconomy.io/api/v1/${chainId}/${
                        process.env['REACT_APP_PAYMASTER_KEY_' + chainId]
                    }`,
                });

                web3Provider = new ethers.providers.Web3Provider(particleProvider, 'any');

                const module = await ECDSAOwnershipValidationModule.create({
                    signer: web3Provider.getSigner(),
                    moduleAddress: DEFAULT_ECDSA_OWNERSHIP_MODULE,
                });

                const account = await BiconomySmartAccountV2.create({
                    chainId,
                    bundler,
                    provider,
                    paymaster,
                    entryPointAddress: DEFAULT_ENTRYPOINT_ADDRESS,
                    defaultValidationModule: module,
                    activeValidationModule: module,
                });

                const swAddress = await account.getAccountAddress();
                biconomyConnector.setWallet(account);
                dispatch(updateWallet({ walletAddress: swAddress, isAA: true }));
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
                    signer: isLedgerLive
                        ? ledgerProvider.getSigner()
                        : particle.auth.isLogin()
                        ? web3Provider.getSigner()
                        : signer,
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
                <Router history={history}>
                    <Switch>
                        {getSupportedNetworksByRoute(ROUTES.Options.CreateMarket).includes(networkId) && (
                            <Route exact path={ROUTES.Options.CreateMarket}>
                                <Suspense fallback={<Loader />}>
                                    <DappLayout>
                                        <CreateMarket />
                                    </DappLayout>
                                </Suspense>
                            </Route>
                        )}

                        {getSupportedNetworksByRoute(ROUTES.Governance.Home).includes(networkId) && (
                            <Route
                                exact
                                path={[ROUTES.Governance.Home, ROUTES.Governance.Space, ROUTES.Governance.Proposal]}
                                render={(routeProps) => (
                                    <Suspense fallback={<Loader />}>
                                        <DappLayout>
                                            <GovernancePage {...routeProps} />
                                        </DappLayout>
                                    </Suspense>
                                )}
                            />
                        )}

                        {getSupportedNetworksByRoute(ROUTES.Options.Game).includes(networkId) && (
                            <Route exact path={ROUTES.Options.Game}>
                                <Suspense fallback={<Loader />}>
                                    <DappLayout>
                                        <TaleOfThales />
                                    </DappLayout>
                                </Suspense>
                            </Route>
                        )}

                        {getSupportedNetworksByRoute(ROUTES.Options.Profile).includes(networkId) && (
                            <Route exact path={ROUTES.Options.Profile}>
                                <Suspense fallback={<Loader />}>
                                    <DappLayout>
                                        <Profile />
                                    </DappLayout>
                                </Suspense>
                            </Route>
                        )}

                        {getSupportedNetworksByRoute(ROUTES.Options.Token).includes(networkId) && (
                            <Route exact path={ROUTES.Options.Token}>
                                <Suspense fallback={<Loader />}>
                                    <DappLayout>
                                        <TokenPage />
                                    </DappLayout>
                                </Suspense>
                            </Route>
                        )}

                        {getSupportedNetworksByRoute(ROUTES.Options.Referral).includes(networkId) && (
                            <Route exact path={ROUTES.Options.Referral}>
                                <Suspense fallback={<Loader />}>
                                    <DappLayout>
                                        <Referral />
                                    </DappLayout>
                                </Suspense>
                            </Route>
                        )}

                        {getSupportedNetworksByRoute(ROUTES.Options.Vaults).includes(networkId) && (
                            <Route exact path={ROUTES.Options.Vaults}>
                                <Suspense fallback={<Loader />}>
                                    <DappLayout>
                                        <Vaults />
                                    </DappLayout>
                                </Suspense>
                            </Route>
                        )}

                        {getSupportedNetworksByRoute(ROUTES.Options.Vault).includes(networkId) && (
                            <Route
                                exact
                                path={ROUTES.Options.Vault}
                                render={(routeProps) => (
                                    <Suspense fallback={<Loader />}>
                                        <DappLayout>
                                            <Vault {...routeProps} />
                                        </DappLayout>
                                    </Suspense>
                                )}
                            />
                        )}

                        {getSupportedNetworksByRoute(ROUTES.Options.LiquidityPool).includes(networkId) && (
                            <Route exact path={ROUTES.Options.LiquidityPool}>
                                <Suspense fallback={<Loader />}>
                                    <DappLayout>
                                        <LiquidityPool />
                                    </DappLayout>
                                </Suspense>
                            </Route>
                        )}

                        {getSupportedNetworksByRoute(ROUTES.Options.Home).includes(networkId) && (
                            <Route
                                exact
                                path={ROUTES.Options.MarketMatch}
                                render={(routeProps) => (
                                    <Suspense fallback={<Loader />}>
                                        <DappLayout>
                                            <AMMTrading {...routeProps} />
                                        </DappLayout>
                                    </Suspense>
                                )}
                            />
                        )}

                        {getSupportedNetworksByRoute(ROUTES.Options.RangeMarkets).includes(networkId) && (
                            <Route
                                exact
                                path={ROUTES.Options.RangeMarketMatch}
                                render={(routeProps) => (
                                    <Suspense fallback={<Loader />}>
                                        <DappLayout>
                                            <AMMTrading {...routeProps} />
                                        </DappLayout>
                                    </Suspense>
                                )}
                            />
                        )}

                        <Route
                            exact
                            path={ROUTES.Options.Home}
                            render={(routeProps) => (
                                <Suspense fallback={<Loader />}>
                                    <DappLayout>
                                        <Markets {...routeProps} />
                                    </DappLayout>
                                </Suspense>
                            )}
                        />

                        {getSupportedNetworksByRoute(ROUTES.Options.SpeedMarkets).includes(networkId) && (
                            <Route exact path={ROUTES.Options.SpeedMarkets}>
                                <Suspense fallback={<Loader />}>
                                    <DappLayout>
                                        <SpeedMarkets />
                                    </DappLayout>
                                </Suspense>
                            </Route>
                        )}
                        {getSupportedNetworksByRoute(ROUTES.Options.SpeedMarketsOverview).includes(networkId) && (
                            <Route exact path={ROUTES.Options.SpeedMarketsOverview}>
                                <Suspense fallback={<Loader />}>
                                    <DappLayout>
                                        <SpeedMarketsOverview />
                                    </DappLayout>
                                </Suspense>
                            </Route>
                        )}

                        <Route
                            exact
                            path={ROUTES.Options.RangeMarkets}
                            render={(routeProps) => (
                                <Suspense fallback={<Loader />}>
                                    <DappLayout>
                                        <Markets {...routeProps} />
                                    </DappLayout>
                                </Suspense>
                            )}
                        ></Route>

                        <Route exact path={ROUTES.Options.Wizard}>
                            <Suspense fallback={<Loader />}>
                                <DappLayout>
                                    <Wizard />
                                </DappLayout>
                            </Suspense>
                        </Route>

                        <Route exact path={ROUTES.Home}>
                            <Suspense fallback={<Loader />}>
                                <MainLayout>
                                    <Home />
                                </MainLayout>
                            </Suspense>
                        </Route>

                        <Route exact path={ROUTES.Article.Token}>
                            <Suspense fallback={<Loader />}>
                                <MainLayout>
                                    <Token />
                                </MainLayout>
                            </Suspense>
                        </Route>
                        <Route exact path={ROUTES.Article.Governance}>
                            <Suspense fallback={<Loader />}>
                                <MainLayout>
                                    <Governance />
                                </MainLayout>
                            </Suspense>
                        </Route>
                        <Route exact path={ROUTES.Article.Whitepaper}>
                            <Suspense fallback={<Loader />}>
                                <MainLayout>
                                    <Whitepaper />
                                </MainLayout>
                            </Suspense>
                        </Route>

                        <Route>
                            <Redirect to={ROUTES.Options.Home} />
                            <Suspense fallback={<Loader />}>
                                <DappLayout>
                                    <Markets />
                                </DappLayout>
                            </Suspense>
                        </Route>
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
