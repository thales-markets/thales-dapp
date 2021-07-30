import React, { useEffect, lazy, Suspense, useState } from 'react';
import { Router, Switch, Route } from 'react-router-dom';
import ROUTES from '../../constants/routes';
import MainLayout from '../../components/MainLayout';
import { QueryClientProvider } from 'react-query';
import { getEthereumNetwork, isNetworkSupported, SUPPORTED_NETWORKS } from 'utils/network';
import snxJSConnector from 'utils/snxJSConnector';
import { useDispatch, useSelector } from 'react-redux';
import { updateNetworkSettings, updateWallet, getNetworkId } from 'redux/modules/wallet';
import { ReactQueryDevtools } from 'react-query/devtools';
import { getIsAppReady, setAppReady } from 'redux/modules/app';
import queryConnector from 'utils/queryConnector';
import Loader from 'components/Loader';
import { initOnboard } from 'config/onboard';
import { ethers } from 'ethers';
import useLocalStorage from 'hooks/useLocalStorage';
import { LOCAL_STORAGE_KEYS } from 'constants/storage';
import onboardConnector from 'utils/onboardConnector';
import { history } from 'utils/routes';
import { Snackbar } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';

const OptionsCreateMarket = lazy(() => import('../Options/CreateMarket'));
const Home = lazy(() => import('../Home'));
const OptionsHome = lazy(() => import('../Options/Home'));
const OptionsMarket = lazy(() => import('../Options/Market'));

const App = () => {
    const dispatch = useDispatch();
    const isAppReady = useSelector((state) => getIsAppReady(state));
    const [selectedWallet, setSelectedWallet] = useLocalStorage(LOCAL_STORAGE_KEYS.SELECTED_WALLET, '');
    const networkId = useSelector((state) => getNetworkId(state));

    const [snackbarDetails, setSnackbarDetails] = useState({ message: '', isOpen: false });

    queryConnector.setQueryClient();

    useEffect(() => {
        const init = async () => {
            const { networkId, name } = await getEthereumNetwork();
            try {
                dispatch(updateNetworkSettings({ networkId, networkName: name?.toLowerCase() }));
                if (!snxJSConnector.initialized) {
                    const provider = new ethers.providers.InfuraProvider(
                        networkId,
                        process.env.REACT_APP_INFURA_PROJECT_ID
                    );
                    snxJSConnector.setContractSettings({ networkId, provider });
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
                    if (networkId) {
                        if (onboardConnector.onboard.getState().wallet.provider) {
                            const provider = new ethers.providers.Web3Provider(
                                onboardConnector.onboard.getState().wallet.provider
                            );
                            const signer = provider.getSigner();

                            snxJSConnector.setContractSettings({
                                networkId,
                                provider,
                                signer,
                            });
                        } else {
                            snxJSConnector.setContractSettings({ networkId });
                        }

                        onboardConnector.onboard.config({ networkId });

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
                        const provider = new ethers.providers.Web3Provider(wallet.provider);
                        const signer = provider.getSigner();
                        const network = await provider.getNetwork();
                        const networkId = network.chainId;

                        snxJSConnector.setContractSettings({
                            networkId,
                            provider,
                            signer,
                        });
                        dispatch(
                            updateNetworkSettings({
                                networkId,
                                networkName: SUPPORTED_NETWORKS[networkId]?.toLowerCase(),
                            })
                        );
                        setSelectedWallet(wallet.name);
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
                        <Route exact path={ROUTES.Options.CreateMarket}>
                            <MainLayout>
                                <OptionsCreateMarket />
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
