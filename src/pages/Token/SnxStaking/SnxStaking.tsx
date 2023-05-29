import React from 'react';
import styled from 'styled-components';
import ClaimMigratedRewards from './ClaimMigratedRewards';
import RetroRewards from './RetroRewards';
import YourTransactions from './Transactions';
import { ScreenSizeBreakpoint } from 'constants/ui';

const SnxStaking: React.FC = () => {
    return (
        <Container>
            <ClaimMigratedRewards />
            <RetroRewards />
            <YourTransactions gridColumns={10} />
        </Container>
    );
};

const Container = styled.div`
    position: relative;
    display: grid;
    grid-template-columns: repeat(10, 1fr);
    grid-template-rows: auto min-content;
    grid-gap: 20px;
    padding: 20px;
    background: ${(props) => props.theme.background.primary};
    z-index: 0;
    width: 100%;
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}) {
        background: transparent;
        border: none;
        padding: 1px;
    }
`;

export default SnxStaking;
