import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import styled from 'styled-components';
import { FlexDivCentered } from 'theme/common';

const SimpleLoader: React.FC = () => {
    return (
        <LoaderContainer>
            <CircularProgress thickness={6} size={12} disableShrink color="inherit" />
        </LoaderContainer>
    );
};

const LoaderContainer = styled(FlexDivCentered)`
    color: #748bc6;
`;

export default SimpleLoader;
