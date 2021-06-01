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
import { ReactComponent as sUSDIcon } from 'assets/synths/sUSD.svg';
import { ReactComponent as sFTSEIcon } from 'assets/synths/sFTSE.svg';

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

export const currencyKeyToSynthIconMap = {
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
    ['REN']: sRENIcon,
    ['LEND']: sAAVEIcon,
};

export const sUSD_EXCHANGE_RATE = 1;
export const SYNTH_DECIMALS = 18;
