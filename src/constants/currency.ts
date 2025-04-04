import keyBy from 'lodash/keyBy';

import { ReactComponent as APEIcon } from 'assets/currencies/crypto/APE.svg';
import { ReactComponent as ARBIcon } from 'assets/currencies/crypto/ARB.svg';
import { ReactComponent as BCHIcon } from 'assets/currencies/crypto/BCH.svg';
import { ReactComponent as BUSDIcon } from 'assets/currencies/crypto/BUSD.svg';
import { ReactComponent as CAKEIcon } from 'assets/currencies/crypto/CAKE.svg';
import { ReactComponent as CVXIcon } from 'assets/currencies/crypto/CVX.svg';
import { ReactComponent as DAIIcon } from 'assets/currencies/crypto/DAI.svg';
import { ReactComponent as DPXIcon } from 'assets/currencies/crypto/DOPEX.svg';
import { ReactComponent as DYDXIcon } from 'assets/currencies/crypto/DYDX.svg';
import { ReactComponent as ETCIcon } from 'assets/currencies/crypto/ETC.svg';
import { ReactComponent as GMXIcon } from 'assets/currencies/crypto/GMX.svg';
import { ReactComponent as KNCIcon } from 'assets/currencies/crypto/KNC.svg';
import { ReactComponent as LOOKSIcon } from 'assets/currencies/crypto/LOOKS.svg';
import { ReactComponent as LUNAIcon } from 'assets/currencies/crypto/LUNA.svg';
import { ReactComponent as LYRAIcon } from 'assets/currencies/crypto/LYRA.svg';
import { ReactComponent as MAGICIcon } from 'assets/currencies/crypto/MAGIC.svg';
import { ReactComponent as MATICIcon } from 'assets/currencies/crypto/MATIC.svg';
import { ReactComponent as OHMIcon } from 'assets/currencies/crypto/OHM.svg';
import { ReactComponent as OPIcon } from 'assets/currencies/crypto/OP.svg';
import { ReactComponent as PERPIcon } from 'assets/currencies/crypto/PERP.svg';
import { ReactComponent as SNXIcon } from 'assets/currencies/crypto/SNX.svg';
import { ReactComponent as USDCIcon } from 'assets/currencies/crypto/USDC.svg';
import { ReactComponent as USDTIcon } from 'assets/currencies/crypto/USDT.svg';
import { ReactComponent as sUSDIcon } from 'assets/currencies/crypto/sUSD.svg';
import { ReactComponent as s1INCHIcon } from 'assets/synths/s1INCH.svg';
import { ReactComponent as sAAPLIcon } from 'assets/synths/sAAPL.svg';
import { ReactComponent as sAAVEIcon } from 'assets/synths/sAAVE.svg';
import { ReactComponent as sADAIcon } from 'assets/synths/sADA.svg';
import { ReactComponent as sAMZNIcon } from 'assets/synths/sAMZN.svg';
import { ReactComponent as sAUDIcon } from 'assets/synths/sAUD.svg';
import { ReactComponent as sBNBIcon } from 'assets/synths/sBNB.svg';
import { ReactComponent as sBTCIcon } from 'assets/synths/sBTC.svg';
import { ReactComponent as sCEXIcon } from 'assets/synths/sCEX.svg';
import { ReactComponent as sCHFIcon } from 'assets/synths/sCHF.svg';
import { ReactComponent as sCOMPIcon } from 'assets/synths/sCOMP.svg';
import { ReactComponent as sCRVIcon } from 'assets/synths/sCRV.svg';
import { ReactComponent as sDASHIcon } from 'assets/synths/sDASH.svg';
import { ReactComponent as sDEFIIcon } from 'assets/synths/sDEFI.svg';
import { ReactComponent as sDOTIcon } from 'assets/synths/sDOT.svg';
import { ReactComponent as sEOSIcon } from 'assets/synths/sEOS.svg';
import { ReactComponent as sETCIcon } from 'assets/synths/sETC.svg';
import { ReactComponent as sETHIcon } from 'assets/synths/sETH.svg';
import { ReactComponent as sEURIcon } from 'assets/synths/sEUR.svg';
import { ReactComponent as sFBIcon } from 'assets/synths/sFB.svg';
import { ReactComponent as sFTSEIcon } from 'assets/synths/sFTSE.svg';
import { ReactComponent as sGBPIcon } from 'assets/synths/sGBP.svg';
import { ReactComponent as sGOOGIcon } from 'assets/synths/sGOOG.svg';
import { ReactComponent as sJPYIcon } from 'assets/synths/sJPY.svg';
import { ReactComponent as sKRWIcon } from 'assets/synths/sKRW.svg';
import { ReactComponent as sLINKIcon } from 'assets/synths/sLINK.svg';
import { ReactComponent as sLTCIcon } from 'assets/synths/sLTC.svg';
import { ReactComponent as sNFLXIcon } from 'assets/synths/sNFLX.svg';
import { ReactComponent as sNIKKEIIcon } from 'assets/synths/sNIKKEI.svg';
import { ReactComponent as sOILIcon } from 'assets/synths/sOIL.svg';
import { ReactComponent as sRENIcon } from 'assets/synths/sREN.svg';
import { ReactComponent as sRUNEIcon } from 'assets/synths/sRUNE.svg';
import { ReactComponent as sSOLIcon } from 'assets/synths/sSOL.svg';
import { ReactComponent as sTRXIcon } from 'assets/synths/sTRX.svg';
import { ReactComponent as sTSLAIcon } from 'assets/synths/sTSLA.svg';
import { ReactComponent as sUNIIcon } from 'assets/synths/sUNI.svg';
import { ReactComponent as XAGIcon, ReactComponent as sXAGIcon } from 'assets/synths/sXAG.svg';
import { ReactComponent as XAUIcon, ReactComponent as sXAUIcon } from 'assets/synths/sXAU.svg';
import { ReactComponent as sXMRIcon } from 'assets/synths/sXMR.svg';
import { ReactComponent as sXRPIcon } from 'assets/synths/sXRP.svg';
import { ReactComponent as sXTZIcon } from 'assets/synths/sXTZ.svg';
import { ReactComponent as sYFIIcon } from 'assets/synths/sYFI.svg';
import { Network } from 'enums/network';
import { Coins } from 'thales-utils';
import { SupportedNetwork } from 'types/network';

const SYNTHS = [
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

// Order is important, used for sorting
export const CRYPTO_CURRENCY = [
    'BTC',
    'ETH',
    'SNX',
    'ARB',
    'OP',
    'GMX',
    'LINK',
    'MAGIC',
    'DPX',
    'MATIC',
    'KNC',
    'COMP',
    'REN',
    'LEND',
    'XRP',
    'BCH',
    'LTC',
    'EOS',
    'BNB',
    'XTZ',
    'XMR',
    'ADA',
    'TRX',
    'DASH',
    'ETC',
    'BAT',
    'DAI',
    'PHP',
    'REP',
    'USDCe',
    'USDbC',
    'USDC',
    'USDT',
    'VELO',
    'ZRX',
    'THALES',
    'SOL',
    'UNI',
    'CRV',
    'AAVE',
    'LYRA',
    'LUNA',
    'PERP',
    'APE',
    'CVX',
    'OHM',
    'LOOKS',
    'DYDX',
    'ETC',
    'BUSD',
    'CAKE',
    'PEPE',
    'WLD',
    'WETH',
    'TIA',
    'BONK',
    'AERO',
];
export const CRYPTO_CURRENCY_MAP = keyBy(CRYPTO_CURRENCY);

export const STABLE_COINS = [
    SYNTHS_MAP.sUSD,
    CRYPTO_CURRENCY_MAP.DAI,
    CRYPTO_CURRENCY_MAP.USDCe,
    CRYPTO_CURRENCY_MAP.USDbC,
    CRYPTO_CURRENCY_MAP.USDC,
    CRYPTO_CURRENCY_MAP.USDT,
    CRYPTO_CURRENCY_MAP.BUSD,
];

export const COMMODITY = ['XAU', 'XAG'];
export const COMMODITY_MAP = keyBy(COMMODITY);

const FIAT_CURRENCY = ['USD'];
const FIAT_CURRENCY_MAP = keyBy(FIAT_CURRENCY);
const FIAT_CURRENCY_SIGN = {
    [FIAT_CURRENCY_MAP.USD]: '$',
};
export const USD_SIGN = FIAT_CURRENCY_SIGN[FIAT_CURRENCY_MAP.USD];

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
    [CRYPTO_CURRENCY_MAP.USDCe]: USDCIcon,
    [CRYPTO_CURRENCY_MAP.USDbC]: USDCIcon,
    [CRYPTO_CURRENCY_MAP.USDT]: USDTIcon,
    [CRYPTO_CURRENCY_MAP.OP]: OPIcon,
    [CRYPTO_CURRENCY_MAP.ARB]: ARBIcon,
    [CRYPTO_CURRENCY_MAP.LOOKS]: LOOKSIcon,
    [CRYPTO_CURRENCY_MAP.DYDX]: DYDXIcon,
    [CRYPTO_CURRENCY_MAP.ETC]: ETCIcon,
    [CRYPTO_CURRENCY_MAP.BUSD]: BUSDIcon,
    [CRYPTO_CURRENCY_MAP.MAGIC]: MAGICIcon,
    [CRYPTO_CURRENCY_MAP.DPX]: DPXIcon,
    [CRYPTO_CURRENCY_MAP.GMX]: GMXIcon,
    [CRYPTO_CURRENCY_MAP.CAKE]: CAKEIcon,
    [COMMODITY_MAP.XAU]: XAUIcon,
    [COMMODITY_MAP.XAG]: XAGIcon,
};

export const currencyKeyToNameMap = {
    [SYNTHS_MAP.sBTC]: 'Bitcoin',
    [SYNTHS_MAP.sETH]: 'Ethereum',
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
    [CRYPTO_CURRENCY_MAP.USDCe]: 'Bridged USDC',
    [CRYPTO_CURRENCY_MAP.USDbC]: 'USD Base Coin',
    [CRYPTO_CURRENCY_MAP.USDC]: 'USD Coin',
    [CRYPTO_CURRENCY_MAP.USDT]: 'Tether',
    [CRYPTO_CURRENCY_MAP.VELO]: 'Velo',
    [CRYPTO_CURRENCY_MAP.ZRX]: '0x',
    [CRYPTO_CURRENCY_MAP.LYRA]: 'Lyra',
    [CRYPTO_CURRENCY_MAP.LUNA]: 'Luna',
    [SYNTHS_MAP.sSOL]: 'Solana',
    [CRYPTO_CURRENCY_MAP.PERP]: 'Perpetual Protocol',
    [CRYPTO_CURRENCY_MAP.APE]: 'Apecoin',
    [CRYPTO_CURRENCY_MAP.ARB]: 'Arbitrum',
    [CRYPTO_CURRENCY_MAP.CVX]: 'Convex Finance',
    [CRYPTO_CURRENCY_MAP.OHM]: 'Olympus',
    [CRYPTO_CURRENCY_MAP.OP]: 'Optimism',
    [CRYPTO_CURRENCY_MAP.LOOKS]: 'LooksRare',
    [CRYPTO_CURRENCY_MAP.DYDX]: 'dYdX',
    [CRYPTO_CURRENCY_MAP.ETC]: 'Ethereum Classic',
    [CRYPTO_CURRENCY_MAP.BNB]: 'Binance Coin',
    [CRYPTO_CURRENCY_MAP.MAGIC]: 'Magic',
    [CRYPTO_CURRENCY_MAP.DPX]: 'Dopex',
    [CRYPTO_CURRENCY_MAP.GMX]: 'GMX',
    [CRYPTO_CURRENCY_MAP.CAKE]: 'PancakeSwap',
    [CRYPTO_CURRENCY_MAP.PEPE]: 'PEPE',
    [CRYPTO_CURRENCY_MAP.WLD]: 'Worldcoin',
    [CRYPTO_CURRENCY_MAP.TIA]: 'TIA',
    [CRYPTO_CURRENCY_MAP.BONK]: 'BONK',
    [COMMODITY_MAP.XAU]: 'Gold',
    [COMMODITY_MAP.XAG]: 'Silver',
    [CRYPTO_CURRENCY_MAP.AERO]: 'Aerodrome',
};

export const COLLATERALS: Record<SupportedNetwork, Coins[]> = {
    [Network.Mainnet]: [SYNTHS_MAP.sUSD as Coins],
    [Network.OptimismMainnet]: [CRYPTO_CURRENCY_MAP.USDC as Coins],
    [Network.OptimismSepolia]: [
        SYNTHS_MAP.sUSD as Coins,
        CRYPTO_CURRENCY_MAP.DAI as Coins,
        CRYPTO_CURRENCY_MAP.USDC as Coins,
        CRYPTO_CURRENCY_MAP.USDT as Coins,
    ],
    [Network.PolygonMainnet]: [CRYPTO_CURRENCY_MAP.USDCe as Coins],
    [Network.Base]: [CRYPTO_CURRENCY_MAP.USDbC as Coins],
    [Network.Arbitrum]: [CRYPTO_CURRENCY_MAP.USDCe as Coins],
};

export const DEPRECATED_COLLATERALS: Record<SupportedNetwork, Coins[]> = {
    [Network.Mainnet]: [SYNTHS_MAP.sUSD as Coins],
    [Network.OptimismMainnet]: [
        SYNTHS_MAP.sUSD as Coins,
        CRYPTO_CURRENCY_MAP.DAI as Coins,
        CRYPTO_CURRENCY_MAP.USDCe as Coins,
        CRYPTO_CURRENCY_MAP.USDT as Coins,
    ],
    [Network.OptimismSepolia]: [
        SYNTHS_MAP.sUSD as Coins,
        CRYPTO_CURRENCY_MAP.DAI as Coins,
        CRYPTO_CURRENCY_MAP.USDC as Coins,
        CRYPTO_CURRENCY_MAP.USDT as Coins,
    ],
    [Network.PolygonMainnet]: [CRYPTO_CURRENCY_MAP.USDCe as Coins],
    [Network.Base]: [CRYPTO_CURRENCY_MAP.USDbC as Coins],
    [Network.Arbitrum]: [CRYPTO_CURRENCY_MAP.USDCe as Coins],
};
