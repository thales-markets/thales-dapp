import { Network } from 'enums/network';
import theme from 'styles/themes/dark';

export type AppSliceState = {
    isReady: boolean;
};

export type WalletSliceState = {
    walletAddress: string | null;
    networkId: Network;
    networkName: string;
    switchToNetworkId: Network; // used to trigger manually network switch in App.js
    selectedCollateralIndex: number;
};

export type UISliceState = {
    isMobile: boolean;
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
