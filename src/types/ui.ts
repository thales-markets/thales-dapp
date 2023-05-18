import theme from 'theme/themes/dark';

export type ThemeInterface = typeof theme;

declare module 'styled-components' {
    export interface DefaultTheme extends ThemeInterface {}
}
