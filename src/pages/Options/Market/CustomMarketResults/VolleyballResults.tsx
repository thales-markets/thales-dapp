import React from 'react';
import oddsImage from 'assets/images/men-volleyball-odds.png';
import { FlexDivCentered } from 'theme/common';

const VolleyballResults: React.FC = () => {
    return (
        <FlexDivCentered>
            <img src={oddsImage} />{' '}
        </FlexDivCentered>
    );
};

export default VolleyballResults;
