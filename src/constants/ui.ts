import { Theme } from 'enums/ui';
import darkTheme from 'styles/themes/dark';
import { ThemeInterface } from 'types/ui';

export const ThemeMap: Record<Theme, ThemeInterface> = {
    [Theme.DARK]: darkTheme,
};

export const REFERRAL_COOKIE_LIFETIME = 648000;
