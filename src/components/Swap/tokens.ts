import { currencyKeyToNameMap } from 'constants/currency';
import { Network } from 'enums/network';
import { getIsOVM } from 'utils/network';

export enum TokenSymbol {
    SUSD = 'sUSD',
    DAI = 'DAI',
    ETH = 'ETH',
    USDC = 'USDC',
    USDCe = 'USDCe',
    USDT = 'USDT',
    MATIC = 'MATIC',
    BUSD = 'BUSD',
    BNB = 'BNB',
}

const ETH_sUSD = {
    address: '0x57ab1ec28d129707052df4df418d58a2d46d5f51',
    decimals: 18,
    logoURI: 'https://tokens.1inch.io/0x57ab1ec28d129707052df4df418d58a2d46d5f51.png',
    name: 'Synth sUSD',
    symbol: TokenSymbol.SUSD,
    synth: true,
};

const ETH_Dai = {
    symbol: TokenSymbol.DAI,
    name: 'Dai Stablecoin',
    decimals: 18,
    address: '0x6b175474e89094c44da98b954eedeac495271d0f',
    logoURI: 'https://tokens.1inch.io/0x6b175474e89094c44da98b954eedeac495271d0f.png',
};

export const ETH_Eth = {
    address: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
    decimals: 18,
    logoURI: 'https://tokens.1inch.io/0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee.png',
    name: 'Ethereum',
    symbol: TokenSymbol.ETH,
};

const ETH_USDC = {
    symbol: TokenSymbol.USDC,
    name: 'USD Coin',
    address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
    decimals: 6,
    logoURI: 'https://tokens.1inch.io/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.png',
};

const ETH_USDT = {
    address: '0xdac17f958d2ee523a2206206994597c13d831ec7',
    decimals: 6,
    logoURI: 'https://tokens.1inch.io/0xdac17f958d2ee523a2206206994597c13d831ec7.png',
    name: 'Tether USD',
    symbol: TokenSymbol.USDT,
};

const OP_sUSD = {
    address: '0x8c6f28f2f1a3c87f0f938b96d27520d9751ec8d9',
    decimals: 18,
    logoURI: 'https://tokens.1inch.io/0x57ab1ec28d129707052df4df418d58a2d46d5f51.png',
    name: 'Synth sUSD',
    symbol: TokenSymbol.SUSD,
    synth: true,
};

const OP_Dai = {
    symbol: TokenSymbol.DAI,
    name: 'Dai Stablecoin',
    decimals: 18,
    address: '0xda10009cbd5d07dd0cecc66161fc93d7c9000da1',
    logoURI: 'https://tokens.1inch.io/0x6b175474e89094c44da98b954eedeac495271d0f.png',
};

export const OP_Eth = {
    address: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
    decimals: 18,
    logoURI: 'https://tokens.1inch.io/0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee.png',
    name: 'Ethereum',
    symbol: TokenSymbol.ETH,
};

const OP_USDC = {
    symbol: TokenSymbol.USDC,
    name: 'USD Coin',
    address: '0x7f5c764cbc14f9669b88837ca1490cca17c31607',
    decimals: 6,
    logoURI: 'https://tokens.1inch.io/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.png',
};

const OP_USDT = {
    address: '0x94b008aa00579c1307b0ef2c499ad98a8ce58e58',
    decimals: 6,
    logoURI: 'https://tokens.1inch.io/0xdac17f958d2ee523a2206206994597c13d831ec7.png',
    name: 'Tether USD',
    symbol: TokenSymbol.USDT,
};

export const POLYGON_USDCe = {
    symbol: TokenSymbol.USDCe,
    name: 'USD Coin (PoS)',
    address: '0x2791bca1f2de4661ed88a30c99a7a9449aa84174',
    decimals: 6,
    logoURI: 'https://tokens.1inch.io/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.png',
};

export const POLYGON_USDT = {
    symbol: TokenSymbol.USDT,
    name: 'Tether USD',
    address: '0xc2132d05d31c914a87c6611c10748aeb04b58e8f',
    decimals: 6,
    logoURI: 'https://tokens.1inch.io/0xdac17f958d2ee523a2206206994597c13d831ec7.png',
};

export const POLYGON_MATIC = {
    symbol: TokenSymbol.MATIC,
    name: 'Matic',
    address: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
    decimals: 18,
    logoURI: 'https://tokens.1inch.io/0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0.png',
};

export const POLYGON_DAI = {
    symbol: TokenSymbol.DAI,
    name: 'Dai Stablecoin',
    decimals: 18,
    address: '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063',
    logoURI: 'https://tokens.1inch.io/0x6b175474e89094c44da98b954eedeac495271d0f.png',
};

export const ARB_ETH = {
    symbol: TokenSymbol.ETH,
    name: currencyKeyToNameMap.ETH,
    address: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
    decimals: 18,
    logoURI: 'https://tokens.1inch.io/0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee.png',
};

const ARB_USDCe = {
    symbol: TokenSymbol.USDCe,
    name: currencyKeyToNameMap.USDCe,
    address: '0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8',
    decimals: 6,
    logoURI: 'https://tokens.1inch.io/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.png',
};

export const mapTokenByNetwork = (tokenSymbol: TokenSymbol, isL2: boolean, isPolygon: boolean) => {
    let mappedToken;

    switch (tokenSymbol) {
        case TokenSymbol.SUSD:
            mappedToken = isL2 ? OP_sUSD : isPolygon ? POLYGON_USDCe : ETH_sUSD;
            break;
        case TokenSymbol.DAI:
            mappedToken = isL2 ? OP_Dai : isPolygon ? POLYGON_DAI : ETH_Dai;
            break;
        case TokenSymbol.USDC:
            mappedToken = isL2 ? OP_USDC : isPolygon ? POLYGON_USDCe : ETH_USDC;
            break;
        case TokenSymbol.USDT:
            mappedToken = isL2 ? OP_USDT : isPolygon ? POLYGON_USDT : ETH_USDT;
            break;
        default:
            mappedToken = isL2 ? OP_sUSD : isPolygon ? POLYGON_USDCe : ETH_sUSD;
            break;
    }

    return mappedToken;
};

export const getTokenForSwap = (networkId: Network, initialToToken: any) => {
    const isPolygon = networkId === Network.PolygonMainnet;
    const isOP = getIsOVM(networkId);
    const isArbitrum = networkId === Network.Arbitrum;

    const toToken = mapTokenByNetwork(TokenSymbol[initialToToken as keyof typeof TokenSymbol], isOP, isPolygon);

    if (isArbitrum) {
        return {
            preloadTokens: [ARB_USDCe],
            fromToken: ARB_ETH,
            toToken: ARB_USDCe,
        };
    }

    if (isPolygon) {
        return {
            preloadTokens: [POLYGON_USDCe],
            fromToken: POLYGON_MATIC,
            toToken,
        };
    }

    if (isOP) {
        return {
            preloadTokens: [OP_sUSD, OP_Dai, OP_USDC, OP_USDT],
            fromToken: OP_Eth,
            toToken,
        };
    }

    return {
        preloadTokens: [ETH_sUSD, ETH_Dai, ETH_USDC, ETH_USDT],
        fromToken: ETH_Eth,
        toToken,
    };
};

export const getFromTokenSwap = (networkId: Network) => {
    const isPolygon = networkId === Network.PolygonMainnet;
    const isOP = getIsOVM(networkId);
    const isArbitrum = networkId === Network.Arbitrum;

    if (isArbitrum) return ARB_ETH;
    if (isPolygon) return POLYGON_MATIC;
    if (isOP) return OP_Eth;
    return ETH_Eth;
};
