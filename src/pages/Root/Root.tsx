import React from 'react';
import { Provider } from 'react-redux';
import { Store } from 'redux';

import dotenv from 'dotenv';

dotenv.config();

import App from './App';
import MaintenancePage from 'pages/MaintenancePage';

interface RootProps {
    store: Store;
}

const Root: React.FC<RootProps> = ({ store }) => {
    return process.env.REACT_APP_MAINTENANCE_MODE ? (
        <MaintenancePage />
    ) : (
        <Provider store={store}>
            <App />
        </Provider>
    );
};

export default Root;
