import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { getIsAppReady } from 'redux/modules/app';
import { RootState } from 'redux/rootReducer';
import Loader from 'components/Loader';
import Cookies from 'universal-cookie';
import { useLocation } from 'react-router-dom';
import queryString from 'query-string';
import Web3 from 'web3';
import { REFERRAL_COOKIE_LIFETIME } from 'constants/ui';

type MainLayoutProps = {
    children: React.ReactNode;
};

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
    const cookies = new Cookies();
    const rawParams = useLocation();
    const queryParams = queryString.parse(rawParams?.search);

    useEffect(() => {
        if (queryParams?.referralId) {
            if (Web3.utils.isAddress(queryParams?.referralId?.toLowerCase())) {
                cookies.set('referralId', queryParams?.referralId, {
                    path: '/',
                    maxAge: REFERRAL_COOKIE_LIFETIME,
                });
            }
        }
    }, []);
    return <>{isAppReady ? children : <Loader />}</>;
};

export default MainLayout;
