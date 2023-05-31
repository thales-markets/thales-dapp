import { ToastPosition, TypeOptions } from 'react-toastify';
import darkTheme from 'theme/themes/dark';
import { ThemeInterface } from 'types/ui';

export enum Theme {
    DARK,
}

export const ThemeMap: Record<Theme, ThemeInterface> = {
    [Theme.DARK]: darkTheme,
};

export enum UI_COLORS {
    RED = '#DE496D',
    GREEN = '#03DAC5',
    YELLOW = '#F7B91A',
    IN_COLOR = '#B0FFE7',
    OUT_COLOR = '#BF7EFF',
}

export const TooltipStyles = {
    error: {
        backgroundColor: '#FDB7B7',
        color: '#F30101',
        fontSize: '12px',
        lineHeight: '24px',
    },
};

const toastBasicProperties = {
    position: 'top-right' as ToastPosition,
    autoClose: 7000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    progress: undefined,
};

export const getSuccessToastOptions = (message: string) => {
    return {
        ...toastBasicProperties,
        render: message,
        isLoading: false,
        type: 'success' as TypeOptions,
    };
};

export const getErrorToastOptions = (message: string) => {
    return {
        ...toastBasicProperties,
        render: message,
        isLoading: false,
        type: 'error' as TypeOptions,
    };
};

export const getWarningToastOptions = (message: string) => {
    return {
        ...toastBasicProperties,
        render: message,
        isLoading: false,
        type: 'warning' as TypeOptions,
    };
};

export const getInfoToastOptions = (message: string) => {
    return {
        ...toastBasicProperties,
        render: message,
        isLoading: false,
        type: 'info' as TypeOptions,
    };
};

export const REFERRAL_COOKIE_LIFETIME = 648000;

export enum ScreenSizeBreakpoint {
    SMALL = 767,
}
