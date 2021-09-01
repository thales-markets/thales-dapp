import React from 'react';
import oddsImage from 'assets/images/us-open-odds.png';
import { FlexDivCentered } from 'theme/common';
// import ScriptTag from 'react-script-tag';

const USOpenResults: React.FC = () => {
    return (
        <FlexDivCentered>
            <img src={oddsImage} />{' '}
        </FlexDivCentered>
    );
};

export default USOpenResults;
