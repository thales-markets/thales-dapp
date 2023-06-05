import { Theme } from 'enums/ui';
import { ToastPosition, TypeOptions } from 'react-toastify';
import darkTheme from 'styles/themes/dark';
import { ThemeInterface } from 'types/ui';

export const ThemeMap: Record<Theme, ThemeInterface> = {
    [Theme.DARK]: darkTheme,
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
