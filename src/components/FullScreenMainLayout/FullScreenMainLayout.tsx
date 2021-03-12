import React from 'react';
import { useSelector } from 'react-redux';
import { getIsAppReady } from 'redux/modules/app';
import { RootState } from 'redux/rootReducer';
import { Loader } from 'semantic-ui-react';
import Header from '../Header';

type FullScreenMainLayoutProps = {
    children: React.ReactNode;
};

export const FullScreenMainLayout: React.FC<FullScreenMainLayoutProps> = ({ children }) => {
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
    return (
        <>
            <Header />
            {isAppReady ? children : <Loader active />}
        </>
    );
};

export default FullScreenMainLayout;
