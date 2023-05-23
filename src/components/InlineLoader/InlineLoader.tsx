import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import styled from 'styled-components';
import { FlexDivCentered } from 'theme/common';

const InlineLoader: React.FC = () => {
    return (
        <LoaderContainer>
            <CircularProgress thickness={7} size={15} disableShrink color="inherit" />
        </LoaderContainer>
    );
};

const LoaderContainer = styled(FlexDivCentered)`
    color: ${(props) => props.theme.background.tertiary};
    margin-bottom: 2px;
`;

export default InlineLoader;
