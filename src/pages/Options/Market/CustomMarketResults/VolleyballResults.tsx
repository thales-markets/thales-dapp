import React from 'react';
import oddsImage from 'assets/images/men-volleyball-odds.png';
import { FlexDivCentered } from 'theme/common';
// import ScriptTag from 'react-script-tag';

const VolleyballResults: React.FC = () => {
    // return <ScriptTag type="text/javascript" src="https://widget.enetscores.com/FWB28C8D00ACFBF0C7"></ScriptTag>;
    return (
        <FlexDivCentered>
            <img src={oddsImage} />{' '}
        </FlexDivCentered>
    );
};

export default VolleyballResults;
