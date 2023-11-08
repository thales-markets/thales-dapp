import { LOCAL_STORAGE_KEYS } from 'constants/storage';
import { Theme } from 'enums/ui';
import { localStore } from 'thales-utils';

export const getDefaultTheme = (): Theme => {
    const lsTheme = localStore.get(LOCAL_STORAGE_KEYS.UI_THEME);
    return lsTheme !== undefined
        ? Object.values(Theme).includes(lsTheme as number)
            ? (lsTheme as Theme)
            : Theme.DARK
        : Theme.DARK;
};
