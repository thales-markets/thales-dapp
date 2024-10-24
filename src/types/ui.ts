import { Network } from 'enums/network';
import theme from 'styles/themes/dark';
import { SupportedNetwork } from './network';

export type AppSliceState = {
    isReady: boolean;
};

export type WalletSliceState = {
    walletAddress: string | null;
    networkId: SupportedNetwork;
    switchToNetworkId: Network; // used to trigger manually network switch in App.js
    selectedCollateralIndex: number;
};

export type UISliceState = {
    isMobile: boolean;
    showTour: boolean;
    isDeprecatedCurrency: boolean;
};

export type MarketWidgetsSliceState = {
    isBuy: boolean;
};

export type RootState = {
    app: AppSliceState;
    wallet: WalletSliceState;
    ui: UISliceState;
    marketWidgets: MarketWidgetsSliceState;
};

export type ThemeInterface = typeof theme;

declare module 'styled-components' {
    interface DefaultTheme extends ThemeInterface {}
}
