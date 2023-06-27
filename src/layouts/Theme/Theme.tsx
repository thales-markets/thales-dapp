import React from 'react';
import { ThemeProvider } from 'styled-components';
import { ThemeMap } from 'constants/ui';
import { getDefaultTheme } from 'utils/style';
import { LOCAL_STORAGE_KEYS } from 'constants/storage';
import localStore from 'utils/localStore';

type ThemeProps = {
    children: React.ReactNode;
};

const Theme: React.FC<ThemeProps> = ({ children }) => {
    const theme = getDefaultTheme();
    localStore.set(LOCAL_STORAGE_KEYS.UI_THEME, theme);

    return <ThemeProvider theme={ThemeMap[theme]}>{children}</ThemeProvider>;
};

export default Theme;
