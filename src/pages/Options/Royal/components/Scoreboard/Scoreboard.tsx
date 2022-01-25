import React, { useState } from 'react';

import styled from 'styled-components';

import { Intro } from '../../V2/components/IntroInfo';
import { UserCard } from '../../V2/components/UserCard';
import { ScoreboardV2 } from '../../V2/components/Scoreboard';

type ScoreboardProps = {
    selectedSeason: any;
    setSelectedSeason: any;
};

const Scoreboard: React.FC<ScoreboardProps> = ({ selectedSeason, setSelectedSeason }) => {
    const [showDropdown, setShowDropdown] = useState(false);
    const [showSelectDropdown, setShowSelectDropdown] = useState(false);

    return (
        <Wrapper
            onClick={() => {
                if (showDropdown) setShowDropdown(false);
                if (showSelectDropdown) setShowSelectDropdown(false);
            }}
            className="scoreboard"
        >
            <div />
            <div style={{ maxWidth: '100%', padding: '5px' }}>
                <Intro />
                <UserCard selectedSeason={selectedSeason} />
                <ScoreboardV2 selectedSeason={selectedSeason} setSelectedSeason={setSelectedSeason} />
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

export default Scoreboard;
