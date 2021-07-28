import React from 'react';
import Iframe from 'react-iframe';

const MedalsCountResults: React.FC = () => {
    return (
        <Iframe
            url="https://graphics.reuters.com/OLYMPICS-2020/MEDALTALLY/rlgpdynkjvo/media-embed.html"
            width="100%"
            height="100%"
            id="medals-count-results"
            position="relative"
        />
    );
};

export default MedalsCountResults;
