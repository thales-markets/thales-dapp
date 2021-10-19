import { IZeroExContract } from '@0x/contract-wrappers';
import { RPCSubprovider } from '@0x/subproviders';
import { providerUtils } from '@0x/utils';
import Web3ProviderEngine from 'web3-provider-engine';
import { getInfuraRpcURL, getIsOVM, NetworkId } from './network';
import snxJSConnector from './snxJSConnector';
import { getContractAddressesForChainOrThrow } from '@0x/contract-addresses';

type ContractWrappers0xConnector = {
    exchangeProxy: IZeroExContract;
    setExchangeProxy: (isWalletConnected: boolean, networkId: NetworkId) => void;
};

// @ts-ignore
const contractWrappers0xConnector: ContractWrappers0xConnector = {
    setExchangeProxy: function (isWalletConnected: boolean, networkId: NetworkId) {
        if (getIsOVM(networkId)) return;
        const contractAddresses0x = getContractAddressesForChainOrThrow(networkId);
        if (isWalletConnected) {
            this.exchangeProxy = new IZeroExContract(
                contractAddresses0x.exchangeProxy,
                (snxJSConnector.provider as any).provider
            );
        } else {
            const providerEngine = new Web3ProviderEngine();
            providerEngine.addProvider(new RPCSubprovider(getInfuraRpcURL(networkId)));
            providerUtils.startProviderEngine(providerEngine);
            this.exchangeProxy = new IZeroExContract(contractAddresses0x.exchangeProxy, providerEngine);
        }
    },
};

export default contractWrappers0xConnector;
