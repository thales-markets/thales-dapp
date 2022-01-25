import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { getIsAppReady } from 'redux/modules/app';
import { getNetworkId } from 'redux/modules/wallet';
import { RootState } from 'redux/rootReducer';
import styled from 'styled-components';
import { getIsOVM } from 'utils/network';
import { Intro } from './IntroInfo';
import useLatestSeasonQuery from './queries/useLatestSeasonQuery';
import { ScoreboardV2 } from './Scoreboard';
import { UserCard } from './UserCard';

export const ScoreboardPage: React.FC = () => {
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
    const isL2 = getIsOVM(networkId);
    const latestSeasonQuery = useLatestSeasonQuery({
        enabled: isAppReady && isL2,
    });

    const latestSeason = latestSeasonQuery.isSuccess ? latestSeasonQuery.data : 0;

    const [selectedSeason, setSelectedSeason] = useState<number>(0);

    return (
        <Wrapper className="scoreboard">
            <div />
            <div style={{ maxWidth: '100%', padding: '5px' }}>
                <Intro />
                <UserCard selectedSeason={selectedSeason === 0 ? latestSeason : selectedSeason} />
                <ScoreboardV2
                    selectedSeason={selectedSeason === 0 ? latestSeason : selectedSeason}
                    setSelectedSeason={setSelectedSeason}
                />
            </div>
            <div />
        </Wrapper>
    );
};

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    width: 570px;
    z-index: 1;
    text-align: center;
    @media (max-width: 1024px) {
        width: 100%;
        padding-bottom: 60px;
    }
`;
