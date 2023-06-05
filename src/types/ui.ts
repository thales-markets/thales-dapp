import theme from 'theme/themes/dark';

export type ThemeInterface = typeof theme;

declare module 'styled-components' {
    interface DefaultTheme extends ThemeInterface {}
}
