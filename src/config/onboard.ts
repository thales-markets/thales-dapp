import onboard from 'bnc-onboard';
import { Subscriptions } from 'bnc-onboard/dist/src/interfaces';
import { getInfuraRpcURL, NetworkId } from 'utils/network';

export const initOnboard = (networkId: NetworkId, subscriptions: Subscriptions) => {
    const infuraRpc = getInfuraRpcURL(networkId);

    return onboard({
        hideBranding: true,
        networkId,
        subscriptions,
        darkMode: true,
        walletSelect: {
            wallets: [
                { walletName: 'metamask', preferred: true },
                {
                    walletName: 'ledger',
                    rpcUrl: infuraRpc,
                    preferred: true,
                },
                {
                    walletName: 'lattice',
                    appName: 'Thales',
                    rpcUrl: infuraRpc,
                    preferred: true,
                },
                {
                    walletName: 'trezor',
                    appUrl: 'https://thales.markets',
                    email: 'info@thales.markets',
                    rpcUrl: infuraRpc,
                    preferred: true,
                },
                {
                    walletName: 'walletConnect',
                    rpc: { [networkId]: infuraRpc },
                    preferred: true,
                },
                { walletName: 'coinbase', preferred: true },
                {
                    walletName: 'portis',
                    apiKey: process.env.REACT_APP_PORTIS_APP_ID,
                    preferred: true,
                },
                { walletName: 'trust', rpcUrl: infuraRpc, preferred: true },
                { walletName: 'walletLink', rpcUrl: infuraRpc, preferred: true },
                { walletName: 'torus', preferred: true },
                { walletName: 'status' },
                { walletName: 'authereum', preferred: true },
                { walletName: 'imToken' },
            ],
        },
        walletCheck: [{ checkName: 'derivationPath' }, { checkName: 'accounts' }, { checkName: 'connect' }],
    });
};
