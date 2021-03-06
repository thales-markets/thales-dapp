import React, { useCallback, useEffect, useState } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import ROUTES from '../../constants/routes';
import MainLayout from '../../components/MainLayout';
import Home from '../Home';
import Options from '../Options';
import { QueryClient, QueryClientProvider } from 'react-query';
import { getEthereumNetwork } from 'utils/network';
import snxJSConnector from 'utils/snxJSConnector';
import { setAvailableSynths, updateFrozenSynths } from 'redux/modules/synths';
import { fetchRatesRequest } from 'redux/modules/rates';
import { useDispatch } from 'react-redux';
import { getExchangeData } from 'dataFetcher';
const queryClient = new QueryClient();

const REFRESH_INTERVAL = 2 * 60 * 1000;

const App = () => {
    const [intervalId, setIntervalId] = useState(undefined);
    const dispatch = useDispatch();
    const fetchAndSetExchangeData = useCallback(async () => {
        const { frozenSynths } = await getExchangeData();
        //setNetworkGasInfo(networkPrices);
        dispatch(updateFrozenSynths({ frozenSynths }));
    }, []);
    useEffect(() => {
        const init = async () => {
            const { networkId } = await getEthereumNetwork();
            if (!snxJSConnector.initialized) {
                snxJSConnector.setContractSettings({ networkId });
            }

            //updateNetworkSettings({ networkId, networkName: name.toLowerCase() });

            const synths = snxJSConnector.snxJS.contractSettings.synths.filter((synth) => synth.asset);

            dispatch(setAvailableSynths({ synths }));
            //setAppReady();

            fetchAndSetExchangeData();
            //fetchAppStatusRequest();
            dispatch(fetchRatesRequest());
            // TODO: stop fetching data when system is suspended
            clearInterval(intervalId);
            const _intervalId = setInterval(() => {
                fetchAndSetExchangeData();
                //fetchWalletBalancesRequest();
                dispatch(fetchRatesRequest());
                //fetchAppStatusRequest();
            }, REFRESH_INTERVAL);
            setIntervalId(_intervalId);
        };

        init();

        return () => {
            clearInterval(intervalId);
        };
    }, [fetchAndSetExchangeData /*, fetchWalletBalancesRequest*/]);

    return (
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                <Switch>
                    <Route path={ROUTES.Options.Home}>
                        <MainLayout>
                            <Options />
                        </MainLayout>
                    </Route>
                    <Route path={ROUTES.Home}>
                        <MainLayout>
                            <Home />
                        </MainLayout>
                    </Route>
                </Switch>
            </BrowserRouter>
        </QueryClientProvider>
    );
};

export default App;
