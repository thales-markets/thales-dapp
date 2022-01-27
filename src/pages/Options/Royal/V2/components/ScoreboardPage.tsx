import React from 'react';
import styled from 'styled-components';
import { Intro } from './IntroInfo';
import { ScoreboardV2 } from './Scoreboard';
import { UserCard } from './UserCard';

type Properties = {
    selectedSeason: number;
    setSelectedSeason: (season: number) => void;
    latestSeason: number;
};

export const ScoreboardPage: React.FC<Properties> = ({ latestSeason, setSelectedSeason, selectedSeason }) => {
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
