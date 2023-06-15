import { LOCAL_STORAGE_KEYS } from 'constants/storage';
import { REFERRAL_COOKIE_LIFETIME } from 'constants/ui';
import { isAddress } from 'ethers/lib/utils';
import Cookies from 'universal-cookie';

const cookies = new Cookies();

export const setReferralWallet = (referralWallet: string) => {
    if (!isAddress(referralWallet)) {
        return null;
    }

    cookies.set('referralId', referralWallet, {
        path: '/',
        maxAge: REFERRAL_COOKIE_LIFETIME,
    });

    localStorage.setItem(LOCAL_STORAGE_KEYS.REFERRAL_WALLET, referralWallet);
};

export const getReferralWallet = () => {
    const referralWalletFromCookie = cookies.get('referralId');
    const referralWalletFromLocalStorage = localStorage.getItem(LOCAL_STORAGE_KEYS.REFERRAL_WALLET);

    if (!referralWalletFromCookie && !referralWalletFromLocalStorage) {
        return null;
    }

    const referralWallet = referralWalletFromCookie || referralWalletFromLocalStorage;

    if (!isAddress(referralWallet)) {
        return null;
    }

    return referralWallet;
};
