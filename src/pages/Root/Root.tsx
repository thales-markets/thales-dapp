import { MatomoProvider, createInstance } from '@datapunt/matomo-tracker-react';
import { RainbowKitProvider, connectorsForWallets, darkTheme } from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/dist/index.css';
import {
    braveWallet,
    coinbaseWallet,
    imTokenWallet,
    injectedWallet,
    ledgerWallet,
    metaMaskWallet,
    rabbyWallet,
    rainbowWallet,
    trustWallet,
    walletConnectWallet,
} from '@rainbow-me/rainbowkit/wallets';
import WalletDisclaimer from 'components/WalletDisclaimer';
import { ThemeMap } from 'constants/ui';
import dotenv from 'dotenv';
import { Network } from 'enums/network';
import { merge } from 'lodash';
import React from 'react';
import { Provider } from 'react-redux';
import { Store } from 'redux';
import { getDefaultTheme } from 'utils/style';
import { WagmiConfig, configureChains, createClient } from 'wagmi';
import { arbitrum, mainnet, optimism, optimismGoerli, polygon } from 'wagmi/chains';
import { infuraProvider } from 'wagmi/providers/infura';
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';
import { publicProvider } from 'wagmi/providers/public';
import App from './App';
import { base } from 'constants/network';
import { PLAUSIBLE } from 'constants/analytics';
import { ParticleAuthModule } from '@biconomy/particle-auth';
import { particleWallet } from '@particle-network/rainbowkit-ext';
dotenv.config();

type RpcProvider = {
    ankr: string;
    chainnode: string;
    blast: string;
};

const CHAIN_TO_RPC_PROVIDER_NETWORK_NAME: Record<number, RpcProvider> = {
    [Network.Mainnet]: {
        ankr: '',
        chainnode: 'mainnet',
        blast: 'eth-mainnet',
    },
    [Network.OptimismMainnet]: {
        ankr: 'optimism',
        chainnode: 'optimism-mainnet',
        blast: 'optimism-mainnet',
    },
    [Network.PolygonMainnet]: {
        ankr: '',
        chainnode: 'polygon-mainnet',
        blast: 'polygon-mainnet',
    },
    [Network.OptimismGoerli]: { ankr: 'optimism_testnet', chainnode: 'optimism-goerli', blast: 'optimism-goerli' },
    [Network.Arbitrum]: { ankr: 'arbitrum', chainnode: 'arbitrum-one', blast: 'arbitrum-one' },
    [Network.Base]: { ankr: 'base', chainnode: '', blast: '' },
};

const STALL_TIMEOUT = 2000;

const { chains, provider } = configureChains(
    [optimism, optimismGoerli, mainnet, polygon, arbitrum, base],
    [
        jsonRpcProvider({
            rpc: (chain) => ({
                http:
                    chain.id === Network.Base
                        ? // Use Ankr as primary RPC provider on Base as Chainnode isn't available
                          `https://rpc.ankr.com/base/${process.env.REACT_APP_ANKR_PROJECT_ID}`
                        : !CHAIN_TO_RPC_PROVIDER_NETWORK_NAME[chain.id]?.chainnode
                        ? chain.rpcUrls.default.http[0]
                        : `https://${CHAIN_TO_RPC_PROVIDER_NETWORK_NAME[chain.id].chainnode}.chainnodes.org/${
                              process.env.REACT_APP_CHAINNODE_PROJECT_ID
                          }`,
            }),
            stallTimeout: STALL_TIMEOUT,
            priority: 1,
        }),
        infuraProvider({
            apiKey: process.env.REACT_APP_INFURA_PROJECT_ID || '',
            stallTimeout: STALL_TIMEOUT,
            priority: process.env.REACT_APP_PRIMARY_PROVIDER_ID === 'INFURA' ? 0 : 2,
        }),
        publicProvider({ stallTimeout: STALL_TIMEOUT, priority: 5 }),
    ]
);

const particleWallets = [
    particleWallet({ chains, authType: 'google' }),
    particleWallet({ chains, authType: 'facebook' }),
    particleWallet({ chains, authType: 'apple' }),
    particleWallet({ chains }),
];

new ParticleAuthModule.ParticleNetwork({
    projectId: '2b8c8b75-cc7a-4111-923f-0043b9fa908b',
    clientKey: 'cS3khABdBgfK4m8CzYcL1xcgVM6cuflmNY6dFxdY',
    appId: 'aab773d8-c4e9-43ae-aa57-0d898f3dbf46',
    chainName: 'optimism', //optional: current chain name, default Ethereum.
    chainId: 10, //optional: current chain id, default 1.
    wallet: {
        //optional: by default, the wallet entry is displayed in the bottom right corner of the webpage.
        displayWalletEntry: true, //show wallet entry when connect particle.
        defaultWalletEntryPosition: ParticleAuthModule.WalletEntryPosition.TR, //wallet entry position: ;
        uiMode: 'dark', //optional: light or dark, if not set, the default is the same as web auth.
        supportChains: [
            { id: 10, name: 'optimism' },
            { id: 42161, name: 'arbitrum' },
            { id: 137, name: 'polygon' },
            { id: 420, name: 'optimism' },
            { id: 84531, name: 'base' },
        ], // optional: web wallet support chains.
        customStyle: {}, //optional: custom wallet style
    },
});

const projectId = process.env.REACT_APP_WALLET_CONNECT_PROJECT_ID || '';
const connectors = connectorsForWallets([
    {
        groupName: 'Recommended',
        wallets: [
            ...particleWallets,
            metaMaskWallet({ projectId, chains }),
            walletConnectWallet({ projectId, chains }), // ensure all WalletConnect-based wallets are supported
            rabbyWallet({ chains }),
            braveWallet({ chains }),
            ledgerWallet({ projectId, chains }),
            trustWallet({ projectId, chains }),
            injectedWallet({ chains }), //  ensure all injected wallets are supported
            coinbaseWallet({ appName: 'Thales', chains }),
            rainbowWallet({ projectId, chains }),
            imTokenWallet({ projectId, chains }),
        ],
    },
]);

const wagmiClient = createClient({
    autoConnect: true,
    connectors,
    provider,
});

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

const theme = getDefaultTheme();
const customTheme = merge(darkTheme(), { colors: { modalBackground: ThemeMap[theme].background.primary } });

const Root: React.FC<RootProps> = ({ store }) => {
    PLAUSIBLE.enableAutoPageviews();
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
