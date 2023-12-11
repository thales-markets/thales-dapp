import axios from 'axios';
import Loader from 'components/Loader';
import { generalConfig } from 'config/general';
import queryString from 'query-string';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { getIsAppReady } from 'redux/modules/app';
import { RootState } from 'redux/rootReducer';
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
        if (queryParams?.referrerId) {
            const fetchIdAddress = async () => {
                const response = await axios.get(
                    `${generalConfig.API_URL}/get-refferer-id-address/${encodeURIComponent(queryParams.referrerId)}`
                );
                if (response.data) {
                    setReferralWallet(response.data);
                }
            };
            fetchIdAddress();
        }
    }, [queryParams?.referralId, queryParams.referrerId]);

    return <>{isAppReady ? children : <Loader />}</>;
};

export default MainLayout;
