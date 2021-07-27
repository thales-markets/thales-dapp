import React from 'react';
import Iframe from 'react-iframe';

const BasketballResultsResults: React.FC = () => {
    return (
        <Iframe
            url="http://www.fiba.basketball/fibacarousel/index.html?event=9562&amp;lng=en"
            width="100%"
            height="100%"
            id="basketball-results"
            position="relative"
            scrolling="no"
            frameBorder={0}
        />
    );
};

export default BasketballResultsResults;
