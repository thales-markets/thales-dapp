import onboard from 'bnc-onboard';
import { Subscriptions } from 'bnc-onboard/dist/src/interfaces';
import { NetworkId } from 'utils/network';

export const initOnboard = (networkId: NetworkId, subscriptions: Subscriptions) => {
    return onboard({
        hideBranding: true,
        networkId,
        subscriptions,
        darkMode: true,
        walletSelect: {
            wallets: [{ walletName: 'metamask', preferred: true }],
        },
        walletCheck: [{ checkName: 'accounts' }, { checkName: 'connect' }],
    });
};
