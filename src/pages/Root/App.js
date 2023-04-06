import { Snackbar } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import Loader from 'components/Loader';
import React, { lazy, Suspense, useEffect, useState } from 'react';
import { QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect, Route, Router, Switch } from 'react-router-dom';
import { setAppReady } from 'redux/modules/app';
import {
    getNetworkId,
    getWalletAddress,
    updateNetworkSettings,
    updateWallet,
    getIsWalletConnected,
} from 'redux/modules/wallet';
import { defaultNetwork, getIsPolygon, isNetworkSupported, hasEthereumInjected } from 'utils/network';
import queryConnector from 'utils/queryConnector';
import { history } from 'utils/routes';
import ROUTES from 'constants/routes';
import Cookies from 'universal-cookie';
import { ethers } from 'ethers';
import { useMatomo } from '@datapunt/matomo-tracker-react';
import { IFrameEthereumProvider } from '@ledgerhq/iframe-provider';
import { isLedgerDappBrowserProvider } from 'utils/ledger';
import { useAccount, useProvider, useSigner, useClient, useDisconnect } from 'wagmi';
import snxJSConnector from 'utils/snxJSConnector';

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

const Vaults = lazy(() => import(/* webpackChunkName: "Vaults" */ '../Vaults'));
const Vault = lazy(() => import(/* webpackChunkName: "Vault" */ '../Vault'));

const TokenPage = lazy(() => import(/* webpackChunkName: "Token" */ '../Token/Token'));
const TaleOfThales = lazy(() => import(/* webpackChunkName: "TaleOfThales" */ '../TaleOfThales/TaleOfThales'));
const Profile = lazy(() => import(/* webpackChunkName: "Profile" */ '../Profile/Profile'));
const ThalesRoyal = lazy(() => import(/* webpackChunkName: "ThalesRoyal" */ '../Royale/ThalesRoyal'));

const Referral = lazy(() => import(/* webpackChunkName: "Referral" */ '../Referral'));
const OPRewards = lazy(() => import(/* webpackChunkName: "OPRewards" */ '../OPRewards'));

const App = () => {
    const dispatch = useDispatch();
    const walletAddress = useSelector((state) => getWalletAddress(state));
    const isWalletConnected = useSelector((state) => getIsWalletConnected(state));
    const networkId = useSelector((state) => getNetworkId(state));

    const isPolygon = getIsPolygon(networkId);
    const [snackbarDetails, setSnackbarDetails] = useState({ message: '', isOpen: false, type: 'success' });
    const isLedgerLive = isLedgerDappBrowserProvider();

    const provider = useProvider(!hasEthereumInjected() && { chainId: networkId }); // for incognito mode set chainId from dApp
    const { address } = useAccount();
    const { data: signer } = useSigner();
    const client = useClient();
    const { disconnect } = useDisconnect();

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
        const init = async () => {
            let providerNetworkId = address && (await provider.getNetwork()).chainId;
            let mmChainId = undefined;

            if (!providerNetworkId) {
                // can't use wagmi when wallet is not connected
                if (hasEthereumInjected()) {
                    mmChainId = parseInt(await window.ethereum.request({ method: 'eth_chainId' }), 16);
                    if (isNetworkSupported(mmChainId)) {
                        providerNetworkId = mmChainId;
                    } else {
                        providerNetworkId = defaultNetwork.networkId;
                        disconnect();
                    }
                } else {
                    // without MM, for incognito mode
                    providerNetworkId = networkId;
                }
            }
            try {
                // when switching network will throw Error: underlying network changed and then ignore network update
                signer && signer.provider && (await signer.provider.getNetwork()).chainId;

                // TODO: do we still need this with Wagmi ledger
                let ledgerProvider = null;
                if (isLedgerLive) {
                    ledgerProvider = new IFrameEthereumProvider();
                }

                // can't use wagmi provider when wallet exists in browser but locked, then use MM network if supported
                const selectedProvider = isLedgerLive
                    ? ledgerProvider
                    : !address && hasEthereumInjected() && isNetworkSupported(mmChainId)
                    ? new ethers.providers.Web3Provider(window.ethereum, 'any')
                    : provider;

                snxJSConnector.setContractSettings({
                    networkId: providerNetworkId,
                    provider: selectedProvider,
                    signer,
                });

                dispatch(updateNetworkSettings({ networkId: providerNetworkId }));
                dispatch(setAppReady());
            } catch (e) {
                if (!e.toString().includes('Error: underlying network changed')) {
                    dispatch(setAppReady());
                    console.log(e);
                }
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
    }, [dispatch, provider, signer, networkId, disconnect, address]);

    useEffect(() => {
        dispatch(updateWallet({ walletAddress: address }));
    }, [address, dispatch]);

    useEffect(() => {
        const autoConnect = async () => {
            // TD-1083: There is a known issue with MetaMask extension, where a "disconnect" event is emitted
            // when you switch from MetaMask's default networks to custom networks.
            await client.autoConnect();
        };

        if (window.ethereum) {
            window.ethereum.on('chainChanged', (chainIdHex) => {
                const chainId = parseInt(chainIdHex, 16);
                if (!address) {
                    // when wallet exists in browser but locked and changing network from MM update networkId manually
                    const supportedNetworkId = isNetworkSupported(chainId) ? chainId : defaultNetwork.networkId;
                    dispatch(updateNetworkSettings({ networkId: supportedNetworkId }));
                }
                if (isNetworkSupported(chainId)) {
                    if (window.ethereum.isMetaMask && !isWalletConnected) {
                        autoConnect();
                    }
                } else {
                    disconnect();
                }
            });
        }
    }, [client, isWalletConnected, dispatch, disconnect, provider, signer, address]);

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
                        <Route exact path={ROUTES.Options.Profile}>
                            <DappLayout>
                                <Profile />
                            </DappLayout>
                        </Route>
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
                            <Route exact path={ROUTES.Options.Vaults}>
                                <DappLayout>
                                    <Vaults />
                                </DappLayout>
                            </Route>
                        )}

                        {!isPolygon && (
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

export default App;
