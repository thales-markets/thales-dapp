import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import styled from 'styled-components';

const SimpleLoader: React.FC = () => {
    return (
        <LoaderContainer>
            <CircularProgress thickness={7} size={16} disableShrink color="inherit" />
        </LoaderContainer>
    );
};

const LoaderContainer = styled.div`
    color: #f6f6fe;
`;

export default SimpleLoader;
