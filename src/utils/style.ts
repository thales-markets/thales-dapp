import { LOCAL_STORAGE_KEYS } from 'constants/storage';
import { Theme } from 'enums/ui';
import { kebabCase } from 'lodash';
import { CSSProperties } from 'styled-components';
import localStore from './localStore';

export const getDefaultTheme = (): Theme => {
    const lsTheme = localStore.get(LOCAL_STORAGE_KEYS.UI_THEME);
    return lsTheme !== undefined
        ? Object.values(Theme).includes(lsTheme as number)
            ? (lsTheme as Theme)
            : Theme.DARK
        : Theme.DARK;
};

// Converts: paddingLeft: '5px' => padding-left: 5px;
export const convertCssToStyledProperties = (style: CSSProperties) =>
    Object.keys(style).reduce((accumulator, key) => {
        // transform the key from camelCase to kebab-case
        const cssKey = kebabCase(key);
        const styleValue = style[key as keyof typeof style];
        // remove ' in value
        const cssValue = typeof styleValue === 'string' ? styleValue.replace("'", '') : styleValue;

        return `${accumulator}${cssKey}: ${cssValue};`;
    }, '');

export const hexToRGB = (hex: string, alpha?: number) => {
    const r = parseInt(hex.slice(1, 3), 16),
        g = parseInt(hex.slice(3, 5), 16),
        b = parseInt(hex.slice(5, 7), 16);

    if (alpha) {
        return 'rgba(' + r + ', ' + g + ', ' + b + ', ' + alpha + ')';
    } else {
        return 'rgb(' + r + ', ' + g + ', ' + b + ')';
    }
};
