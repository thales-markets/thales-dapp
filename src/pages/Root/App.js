import React, { useEffect, lazy, Suspense, useState } from 'react';
import { HashRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import ROUTES from '../../constants/routes';
import MainLayout from '../../components/MainLayout';
import { QueryClientProvider } from 'react-query';
import { getEthereumNetwork, SUPPORTED_NETWORKS, SUPPORTED_WALLETS_MAP } from 'utils/network';
import snxJSConnector from 'utils/snxJSConnector';
import { useDispatch, useSelector } from 'react-redux';
import WalletPopup from 'components/WalletPopup';
import {
    getIsWalletConnected,
    updateNetworkSettings,
    updateWallet,
    getWalletInfo,
    getNetworkId,
} from 'redux/modules/wallet';
import FullScreenMainLayout from 'components/FullScreenMainLayout';
import { ReactQueryDevtools } from 'react-query/devtools';
import { getIsAppReady, setAppReady } from 'redux/modules/app';
// import { mountMetamaskAccountChangeEvent, mountMetamaskNetworkChange } from 'utils/walletEvents';
import queryConnector from 'utils/queryConnector';
import { Button, Loader } from 'semantic-ui-react';
import { initNotify, initOnboard } from 'containers/Connector/config';
import { ethers } from 'ethers';
import useLocalStorage from 'hooks/useLocalStorage';
import { LOCAL_STORAGE_KEYS } from 'constants/storage';

const OptionsCreateMarket = lazy(() => import('../Options/CreateMarket'));
const Home = lazy(() => import('../Home'));
const OptionsHome = lazy(() => import('../Options/Home'));
const OptionsMarket = lazy(() => import('../Options/Market'));

const { METAMASK } = SUPPORTED_WALLETS_MAP;

const App = () => {
    const dispatch = useDispatch();
    const isWalletConnected = useSelector((state) => getIsWalletConnected(state));
    const walletInfo = useSelector((state) => getWalletInfo(state));
    const [onboard, setOnboard] = useState(null);
    const [notify, setNotify] = useState(null);
    const isAppReady = useSelector((state) => getIsAppReady(state));
    const [selectedWallet, setSelectedWallet] = useLocalStorage(LOCAL_STORAGE_KEYS.SELECTED_WALLET, '');
    const networkId = useSelector((state) => getNetworkId(state));

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
                    // mountMetamaskAccountChangeEvent(networkId, (walletAddress) =>
                    //     dispatch(updateWallet({ walletAddress }))
                    // );
                    // mountMetamaskNetworkChange();
                }
            }

            dispatch(setAppReady());
        };

        init();
    }, []);

    useEffect(() => {
        if (isAppReady && networkId) {
            const onboard = initOnboard(networkId, {
                address: (walletAddress) => {
                    dispatch(updateWallet({ walletAddress }));
                },
                network: (networkId) => {
                    const provider = new ethers.providers.Web3Provider(onboard.getState().wallet.provider);
                    const signer = provider.getSigner();

                    snxJSConnector.setContractSettings({
                        networkId: networkId,
                        provider,
                        signer: signer,
                    });
                    onboard.config({ networkId });
                    notify.config({ networkId });

                    dispatch(
                        updateNetworkSettings({
                            networkId: networkId,
                            networkName: SUPPORTED_NETWORKS[networkId].toLowerCase(),
                        })
                    );
                },
                wallet: async (wallet) => {
                    if (wallet.provider) {
                        const provider = new ethers.providers.Web3Provider(wallet.provider);
                        const signer = provider.getSigner();
                        const network = await provider.getNetwork();
                        const networkId = network.chainId;

                        snxJSConnector.setContractSettings({
                            networkId: networkId,
                            provider,
                            signer: signer,
                        });
                        dispatch(updateNetworkSettings({ networkId, networkName: network.name.toLowerCase() }));
                        setSelectedWallet(wallet.name);
                    } else {
                        // TODO: setting provider to null might cause issues, perhaps use a default provider?
                        // setProvider(null);
                        setSelectedWallet(null);
                    }
                },
            });
            const notify = initNotify(networkId, {});

            setOnboard(onboard);
            setNotify(notify);
        }
    }, [isAppReady]);

    // load previously saved wallet
    useEffect(() => {
        if (onboard && selectedWallet) {
            onboard.walletSelect(selectedWallet);
        }
    }, [onboard, selectedWallet]);

    const connectWallet = async () => {
        try {
            if (onboard) {
                onboard.walletReset();
                const success = await onboard.walletSelect();
                if (success) {
                    await onboard.walletCheck();
                }
            }
        } catch (e) {
            console.log(e);
        }
    };

    return (
        <QueryClientProvider client={queryConnector.queryClient}>
            <Suspense fallback={<Loader active />}>
                <Router>
                    <Button onClick={connectWallet}>Connect Wallet</Button>
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
