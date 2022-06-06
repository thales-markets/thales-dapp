import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { getIsAppReady } from 'redux/modules/app';
import { RootState } from 'redux/rootReducer';
import Loader from 'components/Loader';
import { useLocation } from 'react-router-dom';
import queryString from 'query-string';
import { getReferralWallet, setReferralWallet } from 'utils/referral';
import { useMatomo } from '@datapunt/matomo-tracker-react';
import { getNetworkId } from 'redux/modules/wallet';

type MainLayoutProps = {
    children: React.ReactNode;
};

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
    const networkId = useSelector((state: RootState) => getNetworkId(state));

    const rawParams = useLocation();
    const queryParams = queryString.parse(rawParams?.search);
    const { trackPageView } = useMatomo();

    useEffect(() => {
        if (queryParams?.referralId) {
            setReferralWallet(queryParams?.referralId);
        }
    }, []);

    useEffect(() => {
        const referralWallet = getReferralWallet();

        trackPageView({
            customDimensions: [
                {
                    id: 1,
                    value: networkId ? networkId?.toString() : '',
                },
                {
                    id: 2,
                    value: referralWallet ? referralWallet : '',
                },
            ],
        });
    }, [rawParams, networkId]);

    return <>{isAppReady ? children : <Loader />}</>;
};

export default MainLayout;
