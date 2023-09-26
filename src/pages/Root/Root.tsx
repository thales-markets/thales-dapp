import dotenv from 'dotenv';
import React from 'react';
import { Provider } from 'react-redux';
import { Store } from 'redux';
import App from './App';
import { PLAUSIBLE } from 'constants/analytics';
dotenv.config();

interface RootProps {
    store: Store;
}

const Root: React.FC<RootProps> = ({ store }) => {
    PLAUSIBLE.enableAutoPageviews();
    return (
        <Provider store={store}>
            <App />
        </Provider>
    );
};

export default Root;
