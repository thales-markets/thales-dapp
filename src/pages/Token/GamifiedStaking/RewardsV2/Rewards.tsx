import React from 'react';
import { useSelector } from 'react-redux';
import { getIsMobile } from 'redux/modules/ui';
import { RootState } from 'redux/rootReducer';
import RewardsV2 from './RewardsV2';
import MobileRewardsView from './components/MobileRewardsView/MobileRewardsView';

const Rewards: React.FC = () => {
    const isMobile = useSelector((state: RootState) => getIsMobile(state));
    return (
        <>
            {!isMobile && <RewardsV2 />}
            {isMobile && <MobileRewardsView />}
        </>
    );
};

export default Rewards;