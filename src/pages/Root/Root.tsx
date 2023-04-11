import { MatomoProvider, createInstance } from '@datapunt/matomo-tracker-react';
import { RainbowKitProvider, connectorsForWallets, darkTheme } from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/dist/index.css';
import WalletDisclaimer from 'components/WalletDisclaimer';
import dotenv from 'dotenv';
import { merge } from 'lodash';
import React from 'react';
import { Provider } from 'react-redux';
import { Store } from 'redux';
import {
    injectedWallet,
    rainbowWallet,
    metaMaskWallet,
    coinbaseWallet,
    walletConnectWallet,
    braveWallet,
    ledgerWallet,
    imTokenWallet,
    trustWallet,
} from '@rainbow-me/rainbowkit/wallets';
import { configureChains, createClient, WagmiConfig } from 'wagmi';
import { optimism, optimismGoerli, arbitrum, mainnet, polygon, bsc } from 'wagmi/chains';
import { infuraProvider } from 'wagmi/providers/infura';
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';
import { publicProvider } from 'wagmi/providers/public';
import App from './App';
dotenv.config();

type RpcProvider = {
    ankr: string;
    chainnode: string;
    blast: string;
};

const CHAIN_TO_RPC_PROVIDER_NETWORK_NAME: Record<number, RpcProvider> = {
    1: {
        ankr: '',
        chainnode: 'mainnet',
        blast: 'eth-mainnet',
    },
    10: {
        ankr: 'optimism',
        chainnode: 'optimism-mainnet',
        blast: 'optimism-mainnet',
    },
    56: {
        ankr: '',
        chainnode: '',
        blast: 'bsc-mainnet',
    },
    137: {
        ankr: '',
        chainnode: 'polygon-mainnet',
        blast: 'polygon-mainnet',
    },
    420: { ankr: 'optimism_testnet', chainnode: 'optimism-goerli', blast: 'optimism-goerli' },
    42161: { ankr: 'arbitrum', chainnode: 'arbitrum-one', blast: 'arbitrum-one' },
};

const { chains, provider } = configureChains(
    [mainnet, optimism, optimismGoerli, polygon, arbitrum, bsc],
    [
        jsonRpcProvider({
            rpc: (chain) => ({
                http: !CHAIN_TO_RPC_PROVIDER_NETWORK_NAME[chain.id].chainnode
                    ? chain.rpcUrls.default.http[0]
                    : `https://${CHAIN_TO_RPC_PROVIDER_NETWORK_NAME[chain.id].chainnode}.chainnodes.org/${
                          process.env.REACT_APP_CHAINNODE_PROJECT_ID
                      }`,
            }),
            stallTimeout: 2000,
        }),
        infuraProvider({ apiKey: process.env.REACT_APP_INFURA_PROJECT_ID || '', stallTimeout: 2000 }),
        publicProvider(),
    ]
);

const connectors = connectorsForWallets([
    {
        groupName: 'Recommended',
        wallets: [
            injectedWallet({ chains }), //  ensure all injected wallets are supported
            metaMaskWallet({ chains }),
            ledgerWallet({ chains }),
            walletConnectWallet({ chains }), // ensure all WalletConnect-based wallets are supported
            coinbaseWallet({ appName: 'Overtime', chains }),
            trustWallet({ chains }),
            imTokenWallet({ chains }),
            rainbowWallet({ chains }),
            braveWallet({ chains }),
        ],
    },
]);

const wagmiClient = createClient({
    autoConnect: true,
    connectors,
    provider,
});

const customTheme = merge(darkTheme(), { colors: { modalBackground: '#0e1069' } });

const instance = createInstance({
    urlBase: 'https://data.thalesmarket.io',
    siteId: process.env.REACT_APP_SITE_ID ? Number(process.env.REACT_APP_SITE_ID) : 1,
    trackerUrl: 'https://data.thalesmarket.io/p.php', // optional, default value: `${urlBase}matomo.php`
    srcUrl: 'https://data.thalesmarket.io/p.js', //
    configurations: {
        // optional, default value: {}
        // any valid matomo configuration, all below are optional
        disableCookies: true,
        setSecureCookie: true,
        setRequestMethod: 'POST',
    },
    disabled: false, // optional, false by default. Makes all tracking calls no-ops if set to true.
    heartBeat: {
        // optional, enabled by default
        active: true, // optional, default value: true
        seconds: 10, // optional, default value: `15
    },
    linkTracking: true, // optional, default value: true
});

interface RootProps {
    store: Store;
}

const Root: React.FC<RootProps> = ({ store }) => {
    return (
        <Provider store={store}>
            <MatomoProvider value={instance}>
                <WagmiConfig client={wagmiClient}>
                    <RainbowKitProvider
                        chains={chains}
                        theme={customTheme}
                        appInfo={{
                            appName: 'Overtime',
                            disclaimer: WalletDisclaimer,
                        }}
                    >
                        <App />
                    </RainbowKitProvider>
                </WagmiConfig>
            </MatomoProvider>
        </Provider>
    );
};

export default Root;
