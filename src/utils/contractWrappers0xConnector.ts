import { ContractWrappers } from '@0x/contract-wrappers';
import { RPCSubprovider } from '@0x/subproviders';
import { providerUtils } from '@0x/utils';
import Web3ProviderEngine from 'web3-provider-engine';
import { getInfuraRpcURL, NetworkId } from './network';
import snxJSConnector from './snxJSConnector';

type ContractWrappers0xConnector = {
    contractWrappers0x: ContractWrappers;
    setContractWrappers0x: (isWalletConnected: boolean, networkId: NetworkId) => void;
};

// @ts-ignore
const contractWrappers0xConnector: ContractWrappers0xConnector = {
    setContractWrappers0x: function (isWalletConnected: boolean, networkId: NetworkId) {
        if (isWalletConnected) {
            this.contractWrappers0x = new ContractWrappers((snxJSConnector.provider as any).provider, {
                chainId: networkId,
            });
        } else {
            const providerEngine = new Web3ProviderEngine();
            providerEngine.addProvider(new RPCSubprovider(getInfuraRpcURL(networkId)));
            providerUtils.startProviderEngine(providerEngine);
            this.contractWrappers0x = new ContractWrappers(providerEngine, {
                chainId: networkId,
            });
        }
    },
};

export default contractWrappers0xConnector;
