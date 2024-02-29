import { useMatomo } from '@datapunt/matomo-tracker-react';
import axios from 'axios';
import Loader from 'components/Loader';
import { generalConfig } from 'config/general';
import queryString from 'query-string';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { getIsAppReady } from 'redux/modules/app';
import { getNetworkId } from 'redux/modules/wallet';
import { RootState } from 'types/ui';
import { getReferralWallet, setReferralWallet } from 'utils/referral';

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
        if (queryParams?.referrerId) {
            const fetchIdAddress = async () => {
                const response = await axios.get(
                    // passing an encoded string to encodeURIComponent causes an error in some cases
                    // reffererId is already encoded so we have to decode it
                    `${generalConfig.API_URL}/get-refferer-id-address/${encodeURIComponent(
                        decodeURIComponent(queryParams.referrerId)
                    )}`
                );
                if (response.data) {
                    setReferralWallet(response.data);
                }
            };
            fetchIdAddress();
        }
    }, [queryParams?.referralId, queryParams.referrerId]);

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
    }, [rawParams, networkId, trackPageView]);

    return <>{isAppReady ? children : <Loader />}</>;
};

export default MainLayout;
