import React from 'react';
import { useSelector } from 'react-redux';
import { getIsAppReady } from 'redux/modules/app';
import { RootState } from 'redux/rootReducer';
import { Container, Loader } from 'semantic-ui-react';
import Header from '../Header';

type MainLayoutProps = {
    children: React.ReactNode;
};

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
    return (
        <Container>
            <Header />
            {isAppReady ? children : <Loader active />}
        </Container>
    );
};

export default MainLayout;
