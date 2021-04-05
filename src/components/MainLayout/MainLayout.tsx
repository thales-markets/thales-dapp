import React from 'react';
import { useSelector } from 'react-redux';
import { getIsAppReady } from 'redux/modules/app';
import { RootState } from 'redux/rootReducer';
import { Loader } from 'semantic-ui-react';
import styled from 'styled-components';

type MainLayoutProps = {
    children: React.ReactNode;
};

const Container = styled.div`
    margin: auto;
`;

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
    return <Container>{isAppReady ? children : <Loader active />}</Container>;
};

export default MainLayout;
