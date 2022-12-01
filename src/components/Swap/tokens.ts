import { CRYPTO_CURRENCY_MAP, currencyKeyToNameMap } from 'constants/currency';
import { getIsArbitrum, getIsBSC, getIsOVM, getIsPolygon, NetworkId } from 'utils/network';

export enum TokenSymbol {
    SUSD = 'sUSD',
    DAI = 'DAI',
    ETH = 'ETH',
    USDC = 'USDC',
    USDT = 'USDT',
    MATIC = 'MATIC',
    BUSD = 'BUSD',
    BNB = 'BNB',
}

export const ETH_sUSD = {
    address: '0x57ab1ec28d129707052df4df418d58a2d46d5f51',
    decimals: 18,
    logoURI: 'https://tokens.1inch.io/0x57ab1ec28d129707052df4df418d58a2d46d5f51.png',
    name: 'Synth sUSD',
    symbol: TokenSymbol.SUSD,
    synth: true,
};

export const ETH_Dai = {
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

export const ETH_USDC = {
    symbol: TokenSymbol.USDC,
    name: 'USD Coin',
    address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
    decimals: 6,
    logoURI: 'https://tokens.1inch.io/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.png',
};

export const ETH_USDT = {
    address: '0xdac17f958d2ee523a2206206994597c13d831ec7',
    decimals: 6,
    logoURI: 'https://tokens.1inch.io/0xdac17f958d2ee523a2206206994597c13d831ec7.png',
    name: 'Tether USD',
    symbol: TokenSymbol.USDT,
};

export const OP_sUSD = {
    address: '0x8c6f28f2f1a3c87f0f938b96d27520d9751ec8d9',
    decimals: 18,
    logoURI: 'https://tokens.1inch.io/0x57ab1ec28d129707052df4df418d58a2d46d5f51.png',
    name: 'Synth sUSD',
    symbol: TokenSymbol.SUSD,
    synth: true,
};

export const OP_Dai = {
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

export const OP_USDC = {
    symbol: TokenSymbol.USDC,
    name: 'USD Coin',
    address: '0x7f5c764cbc14f9669b88837ca1490cca17c31607',
    decimals: 6,
    logoURI: 'https://tokens.1inch.io/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.png',
};

export const OP_USDT = {
    address: '0x94b008aa00579c1307b0ef2c499ad98a8ce58e58',
    decimals: 6,
    logoURI: 'https://tokens.1inch.io/0xdac17f958d2ee523a2206206994597c13d831ec7.png',
    name: 'Tether USD',
    symbol: TokenSymbol.USDT,
};

export const OP_KOVAN_SUSD = {
    address: '0xaA5068dC2B3AADE533d3e52C6eeaadC6a8154c57',
    decimals: 6,
    logoURI: 'https://tokens.1inch.io/0x57ab1ec28d129707052df4df418d58a2d46d5f51.png',
    name: 'Synth sUSD',
    symbol: TokenSymbol.SUSD,
    synth: true,
};

export const POLYGON_USDC = {
    symbol: TokenSymbol.USDC,
    name: 'USD Coin',
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

export const POLYGON_ETH = {
    symbol: TokenSymbol.ETH,
    name: 'Ethereum',
    address: '0x7ceb23fd6bc0add59e62ac25578270cff1b9f619',
    decimals: 18,
    logoURI: 'https://tokens.1inch.io/0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee.png',
};

export const POLYGON_DAI = {
    symbol: TokenSymbol.DAI,
    name: 'Dai Stablecoin',
    decimals: 18,
    address: '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063',
    logoURI: 'https://tokens.1inch.io/0x6b175474e89094c44da98b954eedeac495271d0f.png',
};

export const POLYGON_MUMBAI_USDC = {
    symbol: TokenSymbol.USDC,
    name: 'USD Coin',
    address: '0xe11A86849d99F524cAC3E7A0Ec1241828e332C62',
    decimals: 18,
    logoURI: 'https://tokens.1inch.io/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.png',
};

export const BSC_BNB = {
    symbol: TokenSymbol.BNB,
    name: currencyKeyToNameMap.BNB,
    address: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
    decimals: 18,
    logoURI: 'https://tokens.1inch.io/0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c_1.png',
};

export const BSC_BUSD = {
    symbol: TokenSymbol.BUSD,
    name: CRYPTO_CURRENCY_MAP.BUSD,
    address: '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56',
    decimals: 18,
    logoURI: 'https://tokens.1inch.io/0x4fabb145d64652a948d72533023f6e7a623c7c53.png',
};

export const ARB_ETH = {
    symbol: TokenSymbol.ETH,
    name: currencyKeyToNameMap.ETH,
    address: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
    decimals: 18,
    logoURI: 'https://tokens.1inch.io/0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee.png',
};

export const ARB_USDC = {
    symbol: TokenSymbol.USDC,
    name: currencyKeyToNameMap.USDC,
    address: '0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8',
    decimals: 6,
    logoURI: 'https://tokens.1inch.io/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.png',
};

export const mapTokenByNetwork = (tokenSymbol: TokenSymbol, isL2: boolean, isPolygon: boolean) => {
    let mappedToken;

    switch (tokenSymbol) {
        case TokenSymbol.SUSD:
            mappedToken = isL2 ? OP_sUSD : isPolygon ? POLYGON_USDC : ETH_sUSD;
            break;
        case TokenSymbol.DAI:
            mappedToken = isL2 ? OP_Dai : isPolygon ? POLYGON_DAI : ETH_Dai;
            break;
        case TokenSymbol.USDC:
            mappedToken = isL2 ? OP_USDC : isPolygon ? POLYGON_USDC : ETH_USDC;
            break;
        case TokenSymbol.USDT:
            mappedToken = isL2 ? OP_USDT : isPolygon ? POLYGON_USDT : ETH_USDT;
            break;
        default:
            mappedToken = isL2 ? OP_sUSD : isPolygon ? POLYGON_USDC : ETH_sUSD;
            break;
    }

    return mappedToken;
};

export const getTokenForSwap = (networkId: NetworkId, initialToToken: any) => {
    const isPolygon = getIsPolygon(networkId);
    const isBSC = getIsBSC(networkId);
    const isOP = getIsOVM(networkId);
    const isArbitrum = getIsArbitrum(networkId);

    const toToken = mapTokenByNetwork(TokenSymbol[initialToToken as keyof typeof TokenSymbol], isOP, isPolygon);

    if (isBSC) {
        return {
            preloadTokens: [BSC_BUSD],
            fromToken: BSC_BNB,
            toToken: BSC_BUSD,
        };
    }

    if (isArbitrum) {
        return {
            preloadTokens: [ARB_USDC],
            fromToken: ARB_ETH,
            toToken: ARB_USDC,
        };
    }

    if (isPolygon) {
        return {
            preloadTokens: [POLYGON_USDC],
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

export const getFromTokenSwap = (networkId: NetworkId) => {
    const isPolygon = getIsPolygon(networkId);
    const isBSC = getIsBSC(networkId);
    const isOP = getIsOVM(networkId);
    const isArbitrum = getIsArbitrum(networkId);

    if (isArbitrum) return ARB_ETH;
    if (isPolygon) return POLYGON_MATIC;
    if (isBSC) return BSC_BNB;
    if (isOP) return OP_Eth;
    return ETH_Eth;
};
