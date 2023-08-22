import { Network } from 'enums/network';
import { CRYPTO_CURRENCY_MAP } from './currency';
import { getCurrencyPriority } from 'utils/currency';

export const PRICE_SERVICE_ENDPOINTS = {
    testnet: 'https://xc-testnet.pyth.network',
    mainnet: 'https://xc-mainnet.pyth.network',
};

// You can find the ids of prices at https://pyth.network/developers/price-feed-ids#pyth-evm-mainnet
export const PRICE_ID = {
    testnet: {
        [CRYPTO_CURRENCY_MAP.ETH]: '0xca80ba6dc32e08d06f1aa886011eed1d77c77be9eb761cc10d72b7d0a2fd57a6', // ETH/USD price id in testnet
        [CRYPTO_CURRENCY_MAP.BTC]: '0xf9c0172ba10dfa4d19088d94f5bf61d3b54d5bd7483a322a982e1373ee8ea31b', // BTC/USD price id in testnet
    },
    mainnet: {
        [CRYPTO_CURRENCY_MAP.ETH]: '0xff61491a931112ddf1bd8147cd1b641375f79f5825126d665480874634fd0ace', // ETH/USD price id in mainnet
        [CRYPTO_CURRENCY_MAP.BTC]: '0xe62df6c8b4a85fe1a67db44dc12de5db330f7ac66b72dc658afedf0f4a415b43', // BTC/USD price id in mainnet
    },
};

export const CONNECTION_TIMEOUT_MS = 30000;

// You can find at https://github.com/pyth-network/pyth-crosschain/tree/main/target_chains/ethereum/contracts/networks
export const PYTH_CONTRACT_ADDRESS = {
    [Network.Mainnet]: '0x4305FB66699C3B2702D4d05CF36551390A4c69C6',
    [Network.OptimismMainnet]: '0xff1a0f4744e8582DF1aE09D5611b887B6a12925C',
    [Network.PolygonMainnet]: '0xff1a0f4744e8582DF1aE09D5611b887B6a12925C',
    [Network.OptimismGoerli]: '0xff1a0f4744e8582DF1aE09D5611b887B6a12925C',
    [Network.Arbitrum]: '0xff1a0f4744e8582DF1aE09D5611b887B6a12925C',
    [Network.Base]: '0x8250f4aF4B972684F7b336503E2D6dFeDeB1487a',
};

export const PYTH_CURRENCY_DECIMALS = 8;

export const SUPPORTED_ASSETS = [CRYPTO_CURRENCY_MAP.BTC, CRYPTO_CURRENCY_MAP.ETH].sort(
    (a, b) => getCurrencyPriority(a) - getCurrencyPriority(b)
);
