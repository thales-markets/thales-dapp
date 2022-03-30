import React from 'react';
import styled from 'styled-components';
import { Positions } from '../../Queries/usePositionsQuery';
import { FooterData } from '../../Queries/useRoyaleFooterQuery';
import Intro from './components/IntroInfo';
import ScoreboardV2 from './components/Scoreboard';
import UserCard from './components/UserCard';

type Properties = {
    assetPrice: string;
    positions: Positions;
    royaleFooterData: FooterData | undefined;
    selectedSeason: number;
    setSelectedSeason: (season: number) => void;
    latestSeason: number;
};

export const ScoreboardPage: React.FC<Properties> = ({
    assetPrice,
    positions,
    royaleFooterData,
    latestSeason,
    setSelectedSeason,
    selectedSeason,
}) => {
    return (
        <Wrapper className="scoreboard">
            <div />
            <div style={{ maxWidth: '100%', padding: '5px' }}>
                <Intro />
                <UserCard
                    assetPrice={assetPrice}
                    positions={positions}
                    royaleFooterData={royaleFooterData}
                    selectedSeason={selectedSeason === 0 ? latestSeason : selectedSeason}
                />
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
    z-index: 1000;
    text-align: center;
    @media (max-width: 1024px) {
        width: 100%;
        padding-bottom: 60px;
    }
`;

export default ScoreboardPage;
