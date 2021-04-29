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
import { ReactComponent as KNCIcon } from 'assets/currencies/crypto/KNC.svg';
// Commodity
import { ReactComponent as GOLDIcon } from 'assets/currencies/commodity/GOLD.svg';
import { ReactComponent as SILVERIcon } from 'assets/currencies/commodity/SILVER.svg';
// Equities
import { ReactComponent as FTSEIcon } from 'assets/currencies/equities/FTSE.svg';
import { ReactComponent as NIKKEIIcon } from 'assets/currencies/equities/NIKKEI.svg';
// Fiat
import { ReactComponent as AUDIcon } from 'assets/currencies/fiat/AUD.svg';
import { ReactComponent as CHFIcon } from 'assets/currencies/fiat/CHF.svg';
import { ReactComponent as EURIcon } from 'assets/currencies/fiat/EUR.svg';
import { ReactComponent as GBPIcon } from 'assets/currencies/fiat/GBP.svg';
import { ReactComponent as JPYIcon } from 'assets/currencies/fiat/JPY.svg';
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

export const FIAT_CURRENCY = ['USD'];
export const FIAT_CURRENCY_MAP = keyBy(FIAT_CURRENCY);
export const FIAT_CURRENCY_SIGN = {
    [FIAT_CURRENCY_MAP.USD]: '$',
};
export const USD_SIGN = FIAT_CURRENCY_SIGN[FIAT_CURRENCY_MAP.USD];

export const currencyKeyToAssetIconMap = {
    [CRYPTO_CURRENCY_MAP.SNX]: SNXIcon,
    [CRYPTO_CURRENCY_MAP.KNC]: KNCIcon,
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
    [SYNTHS_MAP.sEUR]: EURIcon,
    [SYNTHS_MAP.sJPY]: JPYIcon,
    [SYNTHS_MAP.sUSD]: USDIcon,
    [SYNTHS_MAP.sAUD]: AUDIcon,
    [SYNTHS_MAP.sGBP]: GBPIcon,
    [SYNTHS_MAP.sCHF]: CHFIcon,
    [SYNTHS_MAP.sXAU]: GOLDIcon,
    [SYNTHS_MAP.sXAG]: SILVERIcon,
    [SYNTHS_MAP.sCEX]: CEXIcon,
    [SYNTHS_MAP.sDEFI]: DEFIIcon,
    [SYNTHS_MAP.sFTSE]: FTSEIcon,
    [SYNTHS_MAP.sNIKKEI]: NIKKEIIcon,
};

export const sUSD_EXCHANGE_RATE = 1;
export const SYNTH_DECIMALS = 18;
