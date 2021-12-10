import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import styled from 'styled-components';

const SimpleLoader: React.FC = () => {
    return <StyledLoader />;
};

const StyledLoader = styled(CircularProgress)`
    position: absolute;
    left: calc(50% - 22px);
    top: calc(50% - 22px);
`;

export default SimpleLoader;
