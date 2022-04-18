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
    trackerUrl: '/js', // optional, default value: `${urlBase}matomo.php`
    srcUrl: '/js', //
    configurations: {
        // optional, default value: {}
        // any valid matomo configuration, all below are optional
        disableCookies: true,
        setSecureCookie: true,
        setRequestMethod: 'POST',
    },
    disabled: false, // optional, false by default. Makes all tracking calls no-ops if set to true.
    heartBeat: {
        // optional, enabled by default
        active: true, // optional, default value: true
        seconds: 10, // optional, default value: `15
    },
    linkTracking: true, // optional, default value: true
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
