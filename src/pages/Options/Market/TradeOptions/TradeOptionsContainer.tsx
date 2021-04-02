import React, { useEffect, useState } from 'react';
import { Loader } from 'semantic-ui-react';
import { ContractWrappers } from '@0x/contract-wrappers';
import { useSelector } from 'react-redux';
import { RootState } from 'redux/rootReducer';
import { getIsWalletConnected, getNetworkId } from 'redux/modules/wallet';
import TradeOptions from './TradeOptions';
import { ContractWrappers0xProvider } from '../contexts/ContractWrappers0xContext';
import { Web3ProviderEngine, RPCSubprovider } from '@0x/subproviders';
import { providerUtils } from '@0x/utils';
import { getInfuraRpcURL } from 'utils/network';
import snxJSConnector from 'utils/snxJSConnector';

const TradeOptionsContainer: React.FC = () => {
    const [contractWrappers0x, setContractWrappers0x] = useState<ContractWrappers>();
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const isWalletConnected = useSelector((state: RootState) => getIsWalletConnected(state));

    useEffect(() => {
        if (isWalletConnected) {
            setContractWrappers0x(
                new ContractWrappers((snxJSConnector.provider as any).provider, {
                    chainId: networkId,
                })
            );
        } else {
            const providerEngine = new Web3ProviderEngine();
            providerEngine.addProvider(new RPCSubprovider(getInfuraRpcURL(networkId)));
            providerUtils.startProviderEngine(providerEngine);
            setContractWrappers0x(
                new ContractWrappers(providerEngine, {
                    chainId: networkId,
                })
            );
        }
    }, [networkId, isWalletConnected]);

    return contractWrappers0x ? (
        <ContractWrappers0xProvider contractWrappers0x={contractWrappers0x}>
            <TradeOptions />
        </ContractWrappers0xProvider>
    ) : (
        <Loader active />
    );
};

export default TradeOptionsContainer;
