import { IZeroExContract } from '@0x/contract-wrappers';
import { RPCSubprovider } from '@0x/subproviders';
import { providerUtils } from '@0x/utils';
import Web3ProviderEngine from 'web3-provider-engine';
import { getInfuraRpcURL, NetworkId } from './network';
import snxJSConnector from './snxJSConnector';
import { get0xExchangeProxyAddress } from './0x';

type ContractWrappers0xConnector = {
    exchangeProxy: IZeroExContract;
    setExchangeProxy: (isWalletConnected: boolean, networkId: NetworkId) => void;
};

// @ts-ignore
const contractWrappers0xConnector: ContractWrappers0xConnector = {
    setExchangeProxy: function (isWalletConnected: boolean, networkId: NetworkId) {
        const exchangeProxyAddress = get0xExchangeProxyAddress(networkId);
        if (exchangeProxyAddress === '') return;
        if (isWalletConnected) {
            this.exchangeProxy = new IZeroExContract(exchangeProxyAddress, (snxJSConnector.provider as any).provider);
        } else {
            const providerEngine = new Web3ProviderEngine();
            providerEngine.addProvider(new RPCSubprovider(getInfuraRpcURL(networkId)));
            providerUtils.startProviderEngine(providerEngine);
            this.exchangeProxy = new IZeroExContract(exchangeProxyAddress, providerEngine);
        }
    },
};

export default contractWrappers0xConnector;
