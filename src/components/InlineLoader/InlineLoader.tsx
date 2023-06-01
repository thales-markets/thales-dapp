import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import styled from 'styled-components';
import { FlexDivCentered } from 'theme/common';

type InlineLoaderProps = {
    thickness?: number;
    size?: number;
};

const InlineLoader: React.FC<InlineLoaderProps> = ({ thickness, size }) => {
    return (
        <LoaderContainer>
            <CircularProgress thickness={thickness || 7} size={size || 15} disableShrink color="inherit" />
        </LoaderContainer>
    );
};

const LoaderContainer = styled(FlexDivCentered)`
    color: ${(props) => props.theme.background.tertiary};
    margin-bottom: 2px;
`;

export default InlineLoader;
