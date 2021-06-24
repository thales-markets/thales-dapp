import React from 'react';
import { Provider } from 'react-redux';
import { Store } from 'redux';
import dotenv from 'dotenv';
dotenv.config();
import App from './App';

interface RootProps {
    store: Store;
}

const Root: React.FC<RootProps> = ({ store }) => {
    return (
        <Provider store={store}>
            <App />
        </Provider>
    );
};

export default Root;
