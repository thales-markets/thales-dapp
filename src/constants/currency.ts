import keyBy from 'lodash/keyBy';

import { ReactComponent as sBTCIcon } from 'assets/synths/sBTC.svg';
import { ReactComponent as sETHIcon } from 'assets/synths/sETH.svg';
import { ReactComponent as sEURIcon } from 'assets/synths/sEUR.svg';
import { ReactComponent as sDEFIIcon } from 'assets/synths/sDEFI.svg';
import { ReactComponent as sAAPLIcon } from 'assets/synths/sAAPL.svg';
import { ReactComponent as sFBIcon } from 'assets/synths/sFB.svg';
import { ReactComponent as sGOOGIcon } from 'assets/synths/sGOOG.svg';
import { ReactComponent as sNFLXIcon } from 'assets/synths/sNFLX.svg';
import { ReactComponent as sLINKIcon } from 'assets/synths/sLINK.svg';
import { ReactComponent as sAAVEIcon } from 'assets/synths/sAAVE.svg';
import { ReactComponent as sUNIIcon } from 'assets/synths/sUNI.svg';
import { ReactComponent as sAUDIcon } from 'assets/synths/sAUD.svg';
import { ReactComponent as sGBPIcon } from 'assets/synths/sGBP.svg';
import { ReactComponent as sCHFIcon } from 'assets/synths/sCHF.svg';
import { ReactComponent as sKRWIcon } from 'assets/synths/sKRW.svg';
import { ReactComponent as sXAUIcon } from 'assets/synths/sXAU.svg';
import { ReactComponent as sOILIcon } from 'assets/synths/sOIL.svg';
import { ReactComponent as sBNBIcon } from 'assets/synths/sBNB.svg';
import { ReactComponent as sTRXIcon } from 'assets/synths/sTRX.svg';
import { ReactComponent as sXTZIcon } from 'assets/synths/sXTZ.svg';
import { ReactComponent as sXRPIcon } from 'assets/synths/sXRP.svg';
import { ReactComponent as sLTCIcon } from 'assets/synths/sLTC.svg';
import { ReactComponent as sEOSIcon } from 'assets/synths/sEOS.svg';
import { ReactComponent as sETCIcon } from 'assets/synths/sETC.svg';
import { ReactComponent as sDASHIcon } from 'assets/synths/sDASH.svg';
import { ReactComponent as sXMRIcon } from 'assets/synths/sXMR.svg';
import { ReactComponent as sADAIcon } from 'assets/synths/sADA.svg';
import { ReactComponent as sYFIIcon } from 'assets/synths/sYFI.svg';
import { ReactComponent as sDOTIcon } from 'assets/synths/sDOT.svg';
import { ReactComponent as sRENIcon } from 'assets/synths/sREN.svg';
import { ReactComponent as sCOMPIcon } from 'assets/synths/sCOMP.svg';
import { ReactComponent as s1INCHIcon } from 'assets/synths/s1INCH.svg';
import { ReactComponent as sRUNEIcon } from 'assets/synths/sRUNE.svg';
import { ReactComponent as sNIKKEIIcon } from 'assets/synths/sNIKKEI.svg';
import { ReactComponent as sTSLAIcon } from 'assets/synths/sTSLA.svg';
import { ReactComponent as sCRVIcon } from 'assets/synths/sCRV.svg';
import { ReactComponent as sAMZNIcon } from 'assets/synths/sAMZN.svg';
import { ReactComponent as sCEXIcon } from 'assets/synths/sCEX.svg';
import { ReactComponent as sXAGIcon } from 'assets/synths/sXAG.svg';
import { ReactComponent as sJPYIcon } from 'assets/synths/sJPY.svg';
import { ReactComponent as sUSDIcon } from 'assets/currencies/crypto/sUSD.svg';
import { ReactComponent as sFTSEIcon } from 'assets/synths/sFTSE.svg';
import { ReactComponent as BCHIcon } from 'assets/currencies/crypto/BCH.svg';
import { ReactComponent as SNXIcon } from 'assets/currencies/crypto/SNX.svg';
import { ReactComponent as KNCIcon } from 'assets/currencies/crypto/KNC.svg';
import { ReactComponent as sSOLIcon } from 'assets/synths/sSOL.svg';
import { ReactComponent as LYRAIcon } from 'assets/currencies/crypto/LYRA.svg';
import { ReactComponent as LUNAIcon } from 'assets/currencies/crypto/LUNA.svg';
import { ReactComponent as MATICIcon } from 'assets/currencies/crypto/MATIC.svg';
import { ReactComponent as PERPIcon } from 'assets/currencies/crypto/PERP.svg';
import { ReactComponent as APEIcon } from 'assets/currencies/crypto/APE.svg';
import { ReactComponent as CVXIcon } from 'assets/currencies/crypto/CVX.svg';
import { ReactComponent as OHMIcon } from 'assets/currencies/crypto/OHM.svg';
import { ReactComponent as OPIcon } from 'assets/currencies/crypto/OP.svg';
import { ReactComponent as DAIIcon } from 'assets/currencies/crypto/DAI.svg';
import { ReactComponent as USDCIcon } from 'assets/currencies/crypto/USDC.svg';
import { ReactComponent as USDTIcon } from 'assets/currencies/crypto/USDT.svg';

export type CurrencyKey = string;
export type CurrencyKeys = string[];

// TODO: standardize this
export type Category = 'crypto' | 'forex' | 'equities' | 'index' | 'commodity' | 'inverse';

export const CATEGORY: Category[] = ['crypto', 'forex', 'equities', 'index', 'commodity', 'inverse'];
export const CATEGORY_MAP = keyBy(CATEGORY);

export const SYNTHS = [
    'sBTC',
    'sBCH',
    'sETH',
    'sEUR',
    'sDEFI',
    'sAAPL',
    'sFB',
    'sGOOG',
    'sNFLX',
    'sLINK',
    'sAAVE',
    'sUNI',
    'sAUD',
    'sGBP',
    'sCHF',
    'sKRW',
    'sXAU',
    'sOIL',
    'sBNB',
    'sTRX',
    'sXTZ',
    'sXRP',
    'sLTC',
    'sEOS',
    'sETC',
    'sDASH',
    'sXMR',
    'sADA',
    'sYFI',
    'sDOT',
    'sREN',
    'sCOMP',
    's1INCH',
    'sRUNE',
    'sFTSE',
    'sNIKKEI',
    'sTSLA',
    'sCRV',
    'sAMZN',
    'sCEX',
    'sXAG',
    'sJPY',
    'sUSD',
    'sLONG',
    'sSHORT',
    'sSOL',
];
export const SYNTHS_MAP = keyBy(SYNTHS);

export const CRYPTO_CURRENCY = [
    'KNC',
    'COMP',
    'REN',
    'LEND',
    'SNX',
    'BTC',
    'ETH',
    'XRP',
    'BCH',
    'LTC',
    'EOS',
    'BNB',
    'XTZ',
    'XMR',
    'ADA',
    'LINK',
    'TRX',
    'DASH',
    'ETC',
    'BAT',
    'DAI',
    'PHP',
    'REP',
    'USDC',
    'USDT',
    'DAI',
    'VELO',
    'ZRX',
    'THALES',
    'SOL',
    'UNI',
    'CRV',
    'AAVE',
    'MATIC',
    'LYRA',
    'LUNA',
    'PERP',
    'APE',
    'CVX',
    'OHM',
    'OP',
];
export const CRYPTO_CURRENCY_MAP = keyBy(CRYPTO_CURRENCY);

export const FIAT_CURRENCY = ['USD'];
export const FIAT_CURRENCY_MAP = keyBy(FIAT_CURRENCY);
export const FIAT_CURRENCY_SIGN = {
    [FIAT_CURRENCY_MAP.USD]: '$',
};
export const USD_SIGN = FIAT_CURRENCY_SIGN[FIAT_CURRENCY_MAP.USD];

export const OPTIONS_CURRENCY = ['UP', 'DOWN'];
export const OPTIONS_CURRENCY_MAP = {
    long: 'UP',
    short: 'DOWN',
    in: 'IN',
    out: 'OUT',
};

export const CURRENCY_TO_OPTION = new Map([
    [SYNTHS_MAP.sLONG, 'UP'],
    [SYNTHS_MAP.sSHORT, 'DOWN'],
]);

export const LEGACY_THALES_CURRENCY = 'LEGACY THALES';
export const THALES_CURRENCY = 'THALES';
export const OP_THALES_CURRENCY = 'OpTHALES';
export const LP_TOKEN = 'LP Token';

export const currencyKeyToAssetIconMap = {
    [SYNTHS_MAP.sBTC]: sBTCIcon,
    [SYNTHS_MAP.sETH]: sETHIcon,
    [SYNTHS_MAP.sEUR]: sEURIcon,
    [SYNTHS_MAP.sDEFI]: sDEFIIcon,
    [SYNTHS_MAP.sAAPL]: sAAPLIcon,
    [SYNTHS_MAP.sFB]: sFBIcon,
    [SYNTHS_MAP.sGOOG]: sGOOGIcon,
    [SYNTHS_MAP.sNFLX]: sNFLXIcon,
    [SYNTHS_MAP.sLINK]: sLINKIcon,
    [SYNTHS_MAP.sAAVE]: sAAVEIcon,
    [SYNTHS_MAP.sUNI]: sUNIIcon,
    [SYNTHS_MAP.sAUD]: sAUDIcon,
    [SYNTHS_MAP.sGBP]: sGBPIcon,
    [SYNTHS_MAP.sCHF]: sCHFIcon,
    [SYNTHS_MAP.sKRW]: sKRWIcon,
    [SYNTHS_MAP.sXAU]: sXAUIcon,
    [SYNTHS_MAP.sOIL]: sOILIcon,
    [SYNTHS_MAP.sBNB]: sBNBIcon,
    [SYNTHS_MAP.sTRX]: sTRXIcon,
    [SYNTHS_MAP.sXTZ]: sXTZIcon,
    [SYNTHS_MAP.sXRP]: sXRPIcon,
    [SYNTHS_MAP.sLTC]: sLTCIcon,
    [SYNTHS_MAP.sEOS]: sEOSIcon,
    [SYNTHS_MAP.sETC]: sETCIcon,
    [SYNTHS_MAP.sDASH]: sDASHIcon,
    [SYNTHS_MAP.sXMR]: sXMRIcon,
    [SYNTHS_MAP.sADA]: sADAIcon,
    [SYNTHS_MAP.sYFI]: sYFIIcon,
    [SYNTHS_MAP.sDOT]: sDOTIcon,
    [SYNTHS_MAP.sCOMP]: sCOMPIcon,
    [SYNTHS_MAP.s1INCH]: s1INCHIcon,
    [SYNTHS_MAP.sRUNE]: sRUNEIcon,
    [SYNTHS_MAP.sNIKKEI]: sNIKKEIIcon,
    [SYNTHS_MAP.sTSLA]: sTSLAIcon,
    [SYNTHS_MAP.sCRV]: sCRVIcon,
    [SYNTHS_MAP.sAMZN]: sAMZNIcon,
    [SYNTHS_MAP.sCEX]: sCEXIcon,
    [SYNTHS_MAP.sXAG]: sXAGIcon,
    [SYNTHS_MAP.sJPY]: sJPYIcon,
    [SYNTHS_MAP.sUSD]: sUSDIcon,
    [SYNTHS_MAP.sFTSE]: sFTSEIcon,
    [SYNTHS_MAP.sREN]: sRENIcon,
    [SYNTHS_MAP.sBCH]: BCHIcon,
    [CRYPTO_CURRENCY_MAP.SNX]: SNXIcon,
    [CRYPTO_CURRENCY_MAP.KNC]: KNCIcon,
    [CRYPTO_CURRENCY_MAP.LEND]: sAAVEIcon,
    [SYNTHS_MAP.sSOL]: sSOLIcon,
    [CRYPTO_CURRENCY_MAP.LYRA]: LYRAIcon,
    [CRYPTO_CURRENCY_MAP.LUNA]: LUNAIcon,
    [CRYPTO_CURRENCY_MAP.MATIC]: MATICIcon,
    [CRYPTO_CURRENCY_MAP.PERP]: PERPIcon,
    [CRYPTO_CURRENCY_MAP.APE]: APEIcon,
    [CRYPTO_CURRENCY_MAP.CVX]: CVXIcon,
    [CRYPTO_CURRENCY_MAP.OHM]: OHMIcon,
    [CRYPTO_CURRENCY_MAP.DAI]: DAIIcon,
    [CRYPTO_CURRENCY_MAP.USDC]: USDCIcon,
    [CRYPTO_CURRENCY_MAP.USDT]: USDTIcon,
    [CRYPTO_CURRENCY_MAP.OP]: OPIcon,
};

export const currencyKeyToNameMap = {
    [SYNTHS_MAP.sBTC]: 'Bitcoin',
    [SYNTHS_MAP.sETH]: 'Ether',
    [SYNTHS_MAP.sEUR]: 'Euros',
    [SYNTHS_MAP.sDEFI]: 'DeFi Index',
    [SYNTHS_MAP.sAAPL]: 'Apple',
    [SYNTHS_MAP.sFB]: 'Facebook',
    [SYNTHS_MAP.sGOOG]: 'Google',
    [SYNTHS_MAP.sNFLX]: 'Netflix',
    [SYNTHS_MAP.sLINK]: 'Chainlink',
    [SYNTHS_MAP.sAAVE]: 'Aave',
    [SYNTHS_MAP.sUNI]: 'Uniswap',
    [SYNTHS_MAP.sAUD]: 'Australian Dollars',
    [SYNTHS_MAP.sGBP]: 'Pound Sterling',
    [SYNTHS_MAP.sCHF]: 'Swiss Franc',
    [SYNTHS_MAP.sKRW]: 'South Korean Won',
    [SYNTHS_MAP.sXAU]: 'Gold Ounce',
    [SYNTHS_MAP.sOIL]: 'Perpetual Oil Futures',
    [SYNTHS_MAP.sBNB]: 'Binance Coin',
    [SYNTHS_MAP.sTRX]: 'TRON',
    [SYNTHS_MAP.sXTZ]: 'Tezos',
    [SYNTHS_MAP.sXRP]: 'Ripple',
    [SYNTHS_MAP.sLTC]: 'Litecoin',
    [SYNTHS_MAP.sEOS]: 'EOS',
    [SYNTHS_MAP.sETC]: 'Ethereum Classic',
    [SYNTHS_MAP.sDASH]: 'Dash',
    [SYNTHS_MAP.sXMR]: 'Monero',
    [SYNTHS_MAP.sADA]: 'Cardano',
    [SYNTHS_MAP.sYFI]: 'yearn.finance',
    [SYNTHS_MAP.sDOT]: 'Polkadot',
    [SYNTHS_MAP.sCOMP]: 'Compound',
    [SYNTHS_MAP.s1INCH]: '1inch',
    [SYNTHS_MAP.sRUNE]: 'THORChain',
    [SYNTHS_MAP.sNIKKEI]: 'Nikkei 225 Index',
    [SYNTHS_MAP.sTSLA]: 'Tesla',
    [SYNTHS_MAP.sCRV]: 'Curve',
    [SYNTHS_MAP.sAMZN]: 'Amazon',
    [SYNTHS_MAP.sCEX]: 'Centralised Exchange Index',
    [SYNTHS_MAP.sXAG]: 'Silver Ounce',
    [SYNTHS_MAP.sJPY]: 'Japanese Yen',
    [SYNTHS_MAP.sUSD]: 'US Dollars',
    [SYNTHS_MAP.sFTSE]: 'FTSE 100 Index',
    [SYNTHS_MAP.sREN]: 'Ren',
    [SYNTHS_MAP.sBCH]: 'Bitcoin Cash',
    [CRYPTO_CURRENCY_MAP.SNX]: 'Synthetix',
    [CRYPTO_CURRENCY_MAP.KNC]: 'Kyber Network',
    [CRYPTO_CURRENCY_MAP.LEND]: 'LEND',
    [CRYPTO_CURRENCY_MAP.BAT]: 'Basic Attention Token',
    [CRYPTO_CURRENCY_MAP.DAI]: 'Dai',
    [CRYPTO_CURRENCY_MAP.PHP]: 'Philippine Peso',
    [CRYPTO_CURRENCY_MAP.REP]: 'Augur',
    [CRYPTO_CURRENCY_MAP.USDC]: 'USD Coin',
    [CRYPTO_CURRENCY_MAP.USDT]: 'Tether',
    [CRYPTO_CURRENCY_MAP.VELO]: 'Velo',
    [CRYPTO_CURRENCY_MAP.ZRX]: '0x',
    [CRYPTO_CURRENCY_MAP.LYRA]: 'Lyra',
    [CRYPTO_CURRENCY_MAP.LUNA]: 'Luna',
    [SYNTHS_MAP.sSOL]: 'Solana',
    [CRYPTO_CURRENCY_MAP.PERP]: 'Perpetual Protocol',
    [CRYPTO_CURRENCY_MAP.APE]: 'Apecoin',
    [CRYPTO_CURRENCY_MAP.CVX]: 'Convex Finance',
    [CRYPTO_CURRENCY_MAP.OHM]: 'Olympus',
    [CRYPTO_CURRENCY_MAP.OHM]: 'Optimism',
};

export const currencyKeyToCoinGeckoIndexMap = {
    [CRYPTO_CURRENCY_MAP.KNC]: 'kyber-network-crystal',
    [CRYPTO_CURRENCY_MAP.COMP]: 'compound-coin',
    [CRYPTO_CURRENCY_MAP.REN]: 'republic-protocol',
    [CRYPTO_CURRENCY_MAP.LEND]: 'ethlend',
    [CRYPTO_CURRENCY_MAP.SNX]: 'havven',
    [CRYPTO_CURRENCY_MAP.BTC]: 'bitcoin',
    [CRYPTO_CURRENCY_MAP.ETH]: 'ethereum',
    [CRYPTO_CURRENCY_MAP.XRP]: 'ripple',
    [CRYPTO_CURRENCY_MAP.BCH]: 'binance-peg-bitcoin-cash',
    [CRYPTO_CURRENCY_MAP.LTC]: 'binance-peg-litecoin',
    [CRYPTO_CURRENCY_MAP.EOS]: 'eos',
    [CRYPTO_CURRENCY_MAP.BNB]: 'oec-binance-coin',
    [CRYPTO_CURRENCY_MAP.XTZ]: 'tezos',
    [CRYPTO_CURRENCY_MAP.XMR]: 'monero',
    [CRYPTO_CURRENCY_MAP.ADA]: 'binance-peg-cardano',
    [CRYPTO_CURRENCY_MAP.LINK]: 'chainlink',
    [CRYPTO_CURRENCY_MAP.TRX]: 'tron',
    [CRYPTO_CURRENCY_MAP.DASH]: 'dash',
    [CRYPTO_CURRENCY_MAP.ETC]: 'ethereum-classic',
    [CRYPTO_CURRENCY_MAP.BAT]: 'basic-attention-token',
    [CRYPTO_CURRENCY_MAP.DAI]: 'dai',
    [CRYPTO_CURRENCY_MAP.REP]: 'augur',
    [CRYPTO_CURRENCY_MAP.USDC]: 'usd-coin',
    [CRYPTO_CURRENCY_MAP.USDT]: 'tether',
    [CRYPTO_CURRENCY_MAP.VELO]: 'velo',
    [CRYPTO_CURRENCY_MAP.ZRX]: '0x',
    [CRYPTO_CURRENCY_MAP.THALES]: 'thales',
    [CRYPTO_CURRENCY_MAP.SOL]: 'solana',
    [CRYPTO_CURRENCY_MAP.CRV]: 'curve-dao-token',
    [CRYPTO_CURRENCY_MAP.UNI]: 'uniswap',
    [CRYPTO_CURRENCY_MAP.AAVE]: 'aave',
    [CRYPTO_CURRENCY_MAP.LYRA]: 'lyra-finance',
    [CRYPTO_CURRENCY_MAP.LUNA]: 'terra-luna',
    [SYNTHS_MAP.sBTC]: 'bitcoin',
    [SYNTHS_MAP.sETH]: 'ethereum',
    [SYNTHS_MAP.sCOMP]: 'compound-coin',
    [SYNTHS_MAP.sXRP]: 'ripple',
    [SYNTHS_MAP.sBCH]: 'binance-peg-bitcoin-cash',
    [SYNTHS_MAP.sXRP]: 'binance-peg-litecoin',
    [SYNTHS_MAP.sEOS]: 'eos',
    [SYNTHS_MAP.sBNB]: 'oec-binance-coin',
    [SYNTHS_MAP.sXTZ]: 'tezos',
    [SYNTHS_MAP.sXMR]: 'monero',
    [SYNTHS_MAP.sADA]: 'binance-peg-cardano',
    [SYNTHS_MAP.sLINK]: 'chainlink',
    [SYNTHS_MAP.sTRX]: 'tron',
    [SYNTHS_MAP.sDASH]: 'dash',
    [SYNTHS_MAP.sETC]: 'ethereum-classic',
    [SYNTHS_MAP.sBAT]: 'basic-attention-token',
    [SYNTHS_MAP.sDAI]: 'dai',
    [SYNTHS_MAP.sREP]: 'augur',
    [SYNTHS_MAP.sUSDC]: 'usd-coin',
    [SYNTHS_MAP.sUSDT]: 'tether',
    [SYNTHS_MAP.sVELO]: 'velo',
    [SYNTHS_MAP.sZRX]: '0x',
    [SYNTHS_MAP.sTHALES]: 'thales',
    [SYNTHS_MAP.sSOL]: 'solana',
    [SYNTHS_MAP.sCRV]: 'curve-dao-token',
    [SYNTHS_MAP.sUNI]: 'uniswap',
    [SYNTHS_MAP.sAAVE]: 'aave',
    [SYNTHS_MAP.sDOT]: 'polkadot',
    [SYNTHS_MAP.sRUNE]: 'thorchain',
    [SYNTHS_MAP.sYFI]: 'yearn-finance',
    [CRYPTO_CURRENCY_MAP.MATIC]: 'matic-network',
    [CRYPTO_CURRENCY_MAP.PERP]: 'perpetual-protocol',
    [CRYPTO_CURRENCY_MAP.APE]: 'apecoin',
    [CRYPTO_CURRENCY_MAP.CVX]: 'convex-finance',
    [CRYPTO_CURRENCY_MAP.OHM]: 'Olympus',
    [CRYPTO_CURRENCY_MAP.OP]: 'optimism',
};

export const currencyKeyToDataFeedSourceMap = {
    [CRYPTO_CURRENCY_MAP.KNC]: {
        source: 'CHAINLINK',
        link: '',
    },
    [CRYPTO_CURRENCY_MAP.COMP]: {
        source: 'CHAINLINK',
        link: '',
    },
    [CRYPTO_CURRENCY_MAP.REN]: {
        source: 'CHAINLINK',
        link: '',
    },
    [CRYPTO_CURRENCY_MAP.LEND]: {
        source: 'CHAINLINK',
        link: '',
    },
    [CRYPTO_CURRENCY_MAP.SNX]: {
        source: 'CHAINLINK',
        link: '',
    },
    [CRYPTO_CURRENCY_MAP.BTC]: {
        source: 'CHAINLINK',
        link: '',
    },
    [CRYPTO_CURRENCY_MAP.ETH]: {
        source: 'CHAINLINK',
        link: '',
    },
    [CRYPTO_CURRENCY_MAP.XRP]: {
        source: 'CHAINLINK',
        link: '',
    },
    [CRYPTO_CURRENCY_MAP.BCH]: {
        source: 'CHAINLINK',
        link: '',
    },
    [CRYPTO_CURRENCY_MAP.LTC]: {
        source: 'CHAINLINK',
        link: '',
    },
    [CRYPTO_CURRENCY_MAP.EOS]: {
        source: 'CHAINLINK',
        link: '',
    },
    [CRYPTO_CURRENCY_MAP.BNB]: {
        source: 'CHAINLINK',
        link: '',
    },
    [CRYPTO_CURRENCY_MAP.XTZ]: {
        source: 'CHAINLINK',
        link: '',
    },
    [CRYPTO_CURRENCY_MAP.XMR]: {
        source: 'CHAINLINK',
        link: '',
    },
    [CRYPTO_CURRENCY_MAP.ADA]: {
        source: 'CHAINLINK',
        link: '',
    },
    [CRYPTO_CURRENCY_MAP.LINK]: {
        source: 'CHAINLINK',
        link: '',
    },
    [CRYPTO_CURRENCY_MAP.TRX]: {
        source: 'CHAINLINK',
        link: '',
    },
    [CRYPTO_CURRENCY_MAP.DASH]: {
        source: 'CHAINLINK',
        link: '',
    },
    [CRYPTO_CURRENCY_MAP.ETC]: {
        source: 'CHAINLINK',
        link: '',
    },
    [CRYPTO_CURRENCY_MAP.BAT]: {
        source: 'CHAINLINK',
        link: '',
    },
    [CRYPTO_CURRENCY_MAP.DAI]: {
        source: 'CHAINLINK',
        link: '',
    },
    [CRYPTO_CURRENCY_MAP.REP]: {
        source: 'CHAINLINK',
        link: '',
    },
    [CRYPTO_CURRENCY_MAP.USDC]: {
        source: 'CHAINLINK',
        link: '',
    },
    [CRYPTO_CURRENCY_MAP.USDT]: {
        source: 'CHAINLINK',
        link: '',
    },
    [CRYPTO_CURRENCY_MAP.VELO]: {
        source: 'CHAINLINK',
        link: '',
    },
    [CRYPTO_CURRENCY_MAP.ZRX]: {
        source: 'CHAINLINK',
        link: '',
    },
    [CRYPTO_CURRENCY_MAP.THALES]: {
        source: 'CHAINLINK',
        link: '',
    },
    [CRYPTO_CURRENCY_MAP.SOL]: {
        source: 'CHAINLINK',
        link: '',
    },
    [CRYPTO_CURRENCY_MAP.CRV]: {
        source: 'CHAINLINK',
        link: '',
    },
    [CRYPTO_CURRENCY_MAP.UNI]: {
        source: 'CHAINLINK',
        link: '',
    },
    [CRYPTO_CURRENCY_MAP.AAVE]: {
        source: 'CHAINLINK',
        link: '',
    },
    [CRYPTO_CURRENCY_MAP.LYRA]: {
        source: 'TWAP',
        link: 'https://optimistic.etherscan.io/address/0xF334F6104A179207DdaCfb41FA3567FEea8595C2',
    },
    [CRYPTO_CURRENCY_MAP.LUNA]: {
        source: 'CHAINLINK',
        link: '',
    },
    [CRYPTO_CURRENCY_MAP.MATIC]: {
        source: 'CHAINLINK',
        link: '',
    },
    [CRYPTO_CURRENCY_MAP.APE]: {
        source: 'CHAINLINK',
        link: '',
    },
    [CRYPTO_CURRENCY_MAP.CVX]: {
        source: 'CHAINLINK',
        link: '',
    },
    [CRYPTO_CURRENCY_MAP.OHM]: {
        source: 'CHAINLINK',
        link: '',
    },
    [CRYPTO_CURRENCY_MAP.PERP]: {
        source: 'TWAP',
        link: 'https://optimistic.etherscan.io/address/0x535541f1aa08416e69dc4d610131099fa2ae7222',
    },
    [CRYPTO_CURRENCY_MAP.OP]: {
        source: 'TWAP',
        link: 'https://optimistic.etherscan.io/address/0x68f5c0a2de713a54991e01858fd27a3832401849',
    },
};

export const sUSD_EXCHANGE_RATE = 1;
export const SYNTH_DECIMALS = 18;
