import { MatomoProvider, createInstance } from '@datapunt/matomo-tracker-react';
import { RainbowKitProvider, connectorsForWallets, darkTheme, wallet } from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/dist/index.css';
import WalletDisclaimer from 'components/WalletDisclaimer';
import dotenv from 'dotenv';
import { merge } from 'lodash';
import React from 'react';
import { Provider } from 'react-redux';
import { Store } from 'redux';
import { Chain, WagmiConfig, chain, configureChains, createClient } from 'wagmi';
import { infuraProvider } from 'wagmi/providers/infura';
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';
import { publicProvider } from 'wagmi/providers/public';
import App from './App';
dotenv.config();

const bscChain: Chain = {
    id: 56,
    name: 'BNB Smart Chain',
    network: 'bsc',
    nativeCurrency: {
        decimals: 18,
        name: 'BNB',
        symbol: 'BNB',
    },
    rpcUrls: {
        default: 'https://rpc.ankr.com/bsc',
        public: 'https://rpc.ankr.com/bsc',
    },
    blockExplorers: {
        etherscan: { name: 'BscScan', url: 'https://bscscan.com' },
        default: { name: 'BscScan', url: 'https://bscscan.com' },
    },
};

type RpcProvider = {
    ankr: string;
    chainnode: string;
    blast: string;
};

const CHAIN_TO_RPC_PROVIDER_NETWORK_NAME: Record<number, RpcProvider> = {
    1: {
        ankr: '',
        chainnode: '',
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
        chainnode: '',
        blast: 'polygon-mainnet',
    },
    420: { ankr: 'optimism_testnet', chainnode: 'optimism-goerli', blast: '' },
    42161: { ankr: 'arbitrum', chainnode: 'arbitrum-one', blast: 'arbitrum-one' },
};

const { chains, provider } = configureChains(
    [chain.mainnet, chain.optimism, chain.optimismGoerli, chain.polygon, chain.arbitrum, bscChain],
    [
        jsonRpcProvider({
            rpc: (chain) => ({
                http: !CHAIN_TO_RPC_PROVIDER_NETWORK_NAME[chain.id].blast
                    ? chain.rpcUrls.default
                    : `https://${CHAIN_TO_RPC_PROVIDER_NETWORK_NAME[chain.id].blast}.blastapi.io/${
                          process.env.REACT_APP_BLAST_PROJECT_ID
                      }`,
            }),
            stallTimeout: 1500,
        }),
        infuraProvider({ apiKey: process.env.REACT_APP_INFURA_PROJECT_ID, stallTimeout: 1500 }),
        publicProvider(),
    ]
);

const connectors = connectorsForWallets([
    {
        groupName: 'Recommended',
        wallets: [
            wallet.injected({ chains }), //  ensure all injected wallets are supported
            wallet.metaMask({ chains }),
            wallet.ledger({ chains }),
            wallet.walletConnect({ chains }), // ensure all WalletConnect-based wallets are supported
            wallet.coinbase({ appName: 'Overtime', chains }),
            wallet.trust({ chains }),
            wallet.imToken({ chains }),
            wallet.rainbow({ chains }),
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
