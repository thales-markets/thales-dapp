import keyBy from 'lodash/keyBy';

// Crypto
import { ReactComponent as BTCIcon } from 'assets/currencies/crypto/BTC.svg';
import { ReactComponent as ETHIcon } from 'assets/currencies/crypto/ETH.svg';
import { ReactComponent as XRPIcon } from 'assets/currencies/crypto/XRP.svg';
import { ReactComponent as BCHIcon } from 'assets/currencies/crypto/BCH.svg';
import { ReactComponent as LTCIcon } from 'assets/currencies/crypto/LTC.svg';
import { ReactComponent as EOSIcon } from 'assets/currencies/crypto/EOS.svg';
import { ReactComponent as BNBIcon } from 'assets/currencies/crypto/BNB.svg';
import { ReactComponent as XTZIcon } from 'assets/currencies/crypto/XTZ.svg';
import { ReactComponent as XMRIcon } from 'assets/currencies/crypto/XMR.svg';
import { ReactComponent as ADAIcon } from 'assets/currencies/crypto/ADA.svg';
import { ReactComponent as LINKIcon } from 'assets/currencies/crypto/LINK.svg';
import { ReactComponent as TRXIcon } from 'assets/currencies/crypto/TRX.svg';
import { ReactComponent as DASHIcon } from 'assets/currencies/crypto/DASH.svg';
import { ReactComponent as ETCIcon } from 'assets/currencies/crypto/ETC.svg';
import { ReactComponent as SNXIcon } from 'assets/currencies/crypto/SNX.svg';
import { ReactComponent as COMPIcon } from 'assets/currencies/crypto/COMP.svg';
import { ReactComponent as RENIcon } from 'assets/currencies/crypto/REN.svg';
import { ReactComponent as LENDIcon } from 'assets/currencies/crypto/LEND.svg';
import { ReactComponent as KNCIcon } from 'assets/currencies/crypto/KNC.svg';
// Commodity
import { ReactComponent as GOLDIcon } from 'assets/currencies/commodity/GOLD.svg';
import { ReactComponent as SILVERIcon } from 'assets/currencies/commodity/SILVER.svg';
// Equities
import { ReactComponent as FTSEIcon } from 'assets/currencies/equities/FTSE.svg';
import { ReactComponent as NIKKEIIcon } from 'assets/currencies/equities/NIKKEI.svg';
// Fiat
import { ReactComponent as AUDIcon } from 'assets/currencies/fiat/AUD.svg';
// import { ReactComponent as CADIcon } from 'assets/currencies/fiat/CAD.svg';
import { ReactComponent as CHFIcon } from 'assets/currencies/fiat/CHF.svg';
import { ReactComponent as EURIcon } from 'assets/currencies/fiat/EUR.svg';
import { ReactComponent as GBPIcon } from 'assets/currencies/fiat/GBP.svg';
import { ReactComponent as JPYIcon } from 'assets/currencies/fiat/JPY.svg';
// import { ReactComponent as KRWIcon } from 'assets/currencies/fiat/KRW.svg';
import { ReactComponent as USDIcon } from 'assets/currencies/fiat/USD.svg';
// Indices
import { ReactComponent as CEXIcon } from 'assets/currencies/indices/CEX.svg';
import { ReactComponent as DEFIIcon } from 'assets/currencies/indices/DEFI.svg';

export type CurrencyKey = string;
export type CurrencyKeys = string[];

// TODO: standardize this
export type Category = 'crypto' | 'forex' | 'equities' | 'index' | 'commodity' | 'inverse';

export const CATEGORY: Category[] = ['crypto', 'forex', 'equities', 'index', 'commodity', 'inverse'];
export const CATEGORY_MAP = keyBy(CATEGORY);

export const SYNTHS = [
    'sBTC',
    'sETH',
    'sXRP',
    'sBCH',
    'sLTC',
    'sEOS',
    'sBNB',
    'sXTZ',
    'sXMR',
    'sADA',
    'sLINK',
    'sTRX',
    'sDASH',
    'sETC',
    'iBTC',
    'iETH',
    'iXRP',
    'iBCH',
    'iLTC',
    'iEOS',
    'iBNB',
    'iXTZ',
    'iXMR',
    'iADA',
    'iLINK',
    'iTRX',
    'iDASH',
    'iETC',
    'sFTSE',
    'sNIKKEI',
    'sXAU',
    'sXAG',
    'sOIL',
    'iOIL',
    'sBZ',
    'sEUR',
    'sJPY',
    'sUSD',
    'sAUD',
    'sGBP',
    'sCHF',
    'sCEX',
    'sDEFI',
    'iCEX',
    'iDEFI',
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
];

export const CRYPTO_CURRENCY_MAP = keyBy(CRYPTO_CURRENCY);

export const FIAT_CURRENCY = ['USD', 'AUD'];
export const FIAT_CURRENCY_MAP = keyBy(FIAT_CURRENCY);

export const FIAT_CURRENCY_SIGN = {
    [FIAT_CURRENCY_MAP.USD]: '$',
};

export const USD_SIGN = FIAT_CURRENCY_SIGN[FIAT_CURRENCY_MAP.USD];

// lower rank -> higher MC
export const CRYPTO_SYNTHS_BY_MC = {
    [SYNTHS_MAP.sBTC]: 1,
    [SYNTHS_MAP.sETH]: 2,
    [SYNTHS_MAP.sXRP]: 3,
    [SYNTHS_MAP.sBCH]: 4,
    [SYNTHS_MAP.sLTC]: 5,
    [SYNTHS_MAP.sEOS]: 6,
    [SYNTHS_MAP.sBNB]: 7,
    [SYNTHS_MAP.sXTZ]: 8,
    [SYNTHS_MAP.sXMR]: 9,
    [SYNTHS_MAP.sADA]: 10,
    [SYNTHS_MAP.sLINK]: 11,
    [SYNTHS_MAP.sTRX]: 12,
    [SYNTHS_MAP.sDASH]: 13,
    [SYNTHS_MAP.sETC]: 14,
    [SYNTHS_MAP.iBTC]: 15,
    [SYNTHS_MAP.iETH]: 16,
    [SYNTHS_MAP.iXRP]: 17,
    [SYNTHS_MAP.iBCH]: 18,
    [SYNTHS_MAP.iLTC]: 19,
    [SYNTHS_MAP.iEOS]: 20,
    [SYNTHS_MAP.iBNB]: 21,
    [SYNTHS_MAP.iXTZ]: 22,
    [SYNTHS_MAP.iXMR]: 23,
    [SYNTHS_MAP.iADA]: 24,
    [SYNTHS_MAP.iLINK]: 25,
    [SYNTHS_MAP.iTRX]: 26,
    [SYNTHS_MAP.iDASH]: 27,
    [SYNTHS_MAP.iETC]: 28,
};

export const currencyKeyToAssetIconMap = {
    [CRYPTO_CURRENCY_MAP.SNX]: SNXIcon,
    [CRYPTO_CURRENCY_MAP.KNC]: KNCIcon,
    [CRYPTO_CURRENCY_MAP.LEND]: LENDIcon,
    [CRYPTO_CURRENCY_MAP.REN]: RENIcon,
    [CRYPTO_CURRENCY_MAP.COMP]: COMPIcon,

    [SYNTHS_MAP.sBTC]: BTCIcon,
    [SYNTHS_MAP.sETH]: ETHIcon,
    [SYNTHS_MAP.sXRP]: XRPIcon,
    [SYNTHS_MAP.sBCH]: BCHIcon,
    [SYNTHS_MAP.sLTC]: LTCIcon,
    [SYNTHS_MAP.sEOS]: EOSIcon,
    [SYNTHS_MAP.sBNB]: BNBIcon,
    [SYNTHS_MAP.sXTZ]: XTZIcon,
    [SYNTHS_MAP.sXMR]: XMRIcon,
    [SYNTHS_MAP.sADA]: ADAIcon,
    [SYNTHS_MAP.sLINK]: LINKIcon,
    [SYNTHS_MAP.sTRX]: TRXIcon,
    [SYNTHS_MAP.sDASH]: DASHIcon,
    [SYNTHS_MAP.sETC]: ETCIcon,
    [SYNTHS_MAP.iBTC]: BTCIcon,
    [SYNTHS_MAP.iETH]: ETHIcon,
    [SYNTHS_MAP.iXRP]: XRPIcon,
    [SYNTHS_MAP.iBCH]: BCHIcon,
    [SYNTHS_MAP.iLTC]: LTCIcon,
    [SYNTHS_MAP.iEOS]: EOSIcon,
    [SYNTHS_MAP.iBNB]: BNBIcon,
    [SYNTHS_MAP.iXTZ]: XTZIcon,
    [SYNTHS_MAP.iXMR]: XMRIcon,
    [SYNTHS_MAP.iADA]: ADAIcon,
    [SYNTHS_MAP.iLINK]: LINKIcon,
    [SYNTHS_MAP.iTRX]: TRXIcon,
    [SYNTHS_MAP.iDASH]: DASHIcon,
    [SYNTHS_MAP.iETC]: ETCIcon,
    [SYNTHS_MAP.sEUR]: EURIcon,
    [SYNTHS_MAP.sJPY]: JPYIcon,
    [SYNTHS_MAP.sUSD]: USDIcon,
    [SYNTHS_MAP.sAUD]: AUDIcon,
    [SYNTHS_MAP.sGBP]: GBPIcon,
    [SYNTHS_MAP.sCHF]: CHFIcon,
    [SYNTHS_MAP.sXAU]: GOLDIcon,
    [SYNTHS_MAP.sXAG]: SILVERIcon,
    // [SYNTHS_MAP.sOIL]: OILIcon,
    [SYNTHS_MAP.sCEX]: CEXIcon,
    [SYNTHS_MAP.sDEFI]: DEFIIcon,
    [SYNTHS_MAP.iCEX]: CEXIcon,
    [SYNTHS_MAP.iDEFI]: DEFIIcon,
    [SYNTHS_MAP.sFTSE]: FTSEIcon,
    [SYNTHS_MAP.sNIKKEI]: NIKKEIIcon,
};

export const sUSD_EXCHANGE_RATE = 1;
export const SYNTH_DECIMALS = 18;

export const FIAT_SYNTHS = [
    SYNTHS_MAP.sEUR,
    // SYNTHS_MAP.sJPY,
    SYNTHS_MAP.sUSD,
    SYNTHS_MAP.sAUD,
    // SYNTHS_MAP.sGBP,
    // SYNTHS_MAP.sCHF,
];

export const synthWeight = {
    BTC: 1,
    ETH: 2,
    XRP: 3,
    LTC: 4,
    BNB: 5,
    XTZ: 6,
    TRX: 7,
    LINK: 8,
};
