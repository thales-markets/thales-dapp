import theme from 'styles/themes/dark';

export type ThemeInterface = typeof theme;

export type Page =
    | 'Home'
    | 'Markets'
    | 'SpeedMarkets'
    | 'Vaults'
    | 'Wizard'
    | 'Referral'
    | 'Governance'
    | 'TaleOfThales'
    | 'Profile'
    | 'Token'
    | 'LiquidityPool';

declare module 'styled-components' {
    interface DefaultTheme extends ThemeInterface {}
}
