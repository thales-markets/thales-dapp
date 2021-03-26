import onboard from 'bnc-onboard';
import notify, { InitOptions } from 'bnc-notify';
import { Subscriptions } from 'bnc-onboard/dist/src/interfaces';
import { NetworkId } from 'utils/network';

export const initOnboard = (networkId: NetworkId, subscriptions: Subscriptions) => {
    return onboard({
        dappId: 'adfa2c18-d691-4265-9d5b-1ddfb8ddab64',
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
        dappId: '12e8d075-c9f5-4736-af94-36af2fc957aa',
        networkId: networkId,
        desktopPosition: 'topRight',
        ...options,
    });
};
