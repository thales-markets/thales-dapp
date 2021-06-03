import { setupThreeJS } from 'pages/Home/Three';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { getIsAppReady } from 'redux/modules/app';
import { RootState } from 'redux/rootReducer';
import { Loader } from 'semantic-ui-react';

type MainLayoutProps = {
    children: React.ReactNode;
};

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
    useEffect(() => {
        setupThreeJS();
    }, []);
    return <>{isAppReady ? children : <Loader active />}</>;
};

export default MainLayout;
