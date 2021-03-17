import { onMetamaskAccountChange, onMetamaskNetworkChange, SUPPORTED_WALLETS_MAP } from './network';
import snxJSConnector from './snxJSConnector';

const { METAMASK } = SUPPORTED_WALLETS_MAP;

export const mountMetamaskAccountChangeEvent = (networkId, updateWalletAddress) => {
    onMetamaskAccountChange(async (accounts) => {
        if (accounts && accounts.length > 0) {
            const signer = new snxJSConnector.signers[METAMASK]({});
            snxJSConnector.setContractSettings({
                networkId,
                signer,
            });
            updateWalletAddress(accounts[0]);
        }
    });
};

// TODO - doesn't work when wallet isn't connected
export const mountMetamaskNetworkChange = () => onMetamaskNetworkChange(() => window.location.reload());
