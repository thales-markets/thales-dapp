import React from 'react';
import styled from 'styled-components';

import RowCard from './components/RowCard';
import TabContainer from './components/TabContainer';

const AMMTrading: React.FC = () => {
    return (
        <>
            <RowCard />
            <MainContainer>
                <TabContainer />
            </MainContainer>
        </>
    );
};

const MainContainer = styled.div`
    margin-top: 17px;
    width: 100%;
    display: flex;
    flex-direction: row;
`;

export default AMMTrading;
