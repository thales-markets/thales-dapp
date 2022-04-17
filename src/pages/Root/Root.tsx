import React from 'react';
import { Provider } from 'react-redux';
import { Store } from 'redux';
import dotenv from 'dotenv';
dotenv.config();
import App from './App';
import { MatomoProvider, createInstance } from '@datapunt/matomo-tracker-react';

const instance = createInstance({
    urlBase: 'https://matomo.thalesmarket.io',
    siteId: 2,
    trackerUrl: 'https://matomo.thalesmarket.io/matomo.php', // optional, default value: `${urlBase}matomo.php`
    srcUrl: 'https://matomo.thalesmarket.io/matomo.js', // optional, default value: `${urlBase}matomo.js`
});

interface RootProps {
    store: Store;
}

const Root: React.FC<RootProps> = ({ store }) => {
    return (
        <Provider store={store}>
            <MatomoProvider value={instance}>
                <App />
            </MatomoProvider>
        </Provider>
    );
};

export default Root;
