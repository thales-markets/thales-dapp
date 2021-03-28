import onboard from 'bnc-onboard';
import notify, { InitOptions } from 'bnc-notify';
import { Subscriptions } from 'bnc-onboard/dist/src/interfaces';
import { NetworkId } from 'utils/network';

export const initOnboard = (networkId: NetworkId, subscriptions: Subscriptions) => {
    return onboard({
        dappId: process.env.REACT_APP_BLOCKNATIVE_ONBOARD_API_KEY,
        hideBranding: true,
        networkId: networkId,
        subscriptions,
        darkMode: true,
        walletSelect: {
            wallets: [{ walletName: 'metamask', preferred: true }],
        },
        walletCheck: [{ checkName: 'accounts' }, { checkName: 'connect' }],
    });
};

export const initNotify = (networkId: NetworkId, options: InitOptions) => {
    return notify({
        darkMode: true,
        dappId: process.env.REACT_APP_BLOCKNATIVE_NOTIFY_API_KEY,
        networkId: networkId,
        desktopPosition: 'topRight',
        ...options,
    });
};
