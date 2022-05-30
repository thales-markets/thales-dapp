import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { getIsAppReady } from 'redux/modules/app';
import { RootState } from 'redux/rootReducer';
import Loader from 'components/Loader';
import { useLocation } from 'react-router-dom';
import queryString from 'query-string';
import { setReferralWallet } from 'utils/referral';

type MainLayoutProps = {
    children: React.ReactNode;
};

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
    const rawParams = useLocation();
    const queryParams = queryString.parse(rawParams?.search);

    useEffect(() => {
        if (queryParams?.referralId) {
            setReferralWallet(queryParams?.referralId);
        }
    }, []);
    return <>{isAppReady ? children : <Loader />}</>;
};

export default MainLayout;
