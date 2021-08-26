import React from 'react';
import OngoingAirdrop from './OngoingAirdrop';
import RetroAirdrop from './RetroAirdrop';
import RetroRewards from './RetroRewards';

const SnxStaking: React.FC = () => {
    return (
        <>
            <RetroAirdrop />
            <OngoingAirdrop />
            <RetroRewards />
        </>
    );
};

export default SnxStaking;
