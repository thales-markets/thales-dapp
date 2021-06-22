import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import styled from 'styled-components';

const Loader: React.FC = () => {
    return <StyledLoader />;
};

const StyledLoader = styled(CircularProgress)`
    position: absolute;
    left: 50%;
    top: 50%;
`;

export default Loader;
