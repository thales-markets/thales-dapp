import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import styled from 'styled-components';

const Loader: React.FC = () => {
    return (
        <Wrapper>
            <CircularProgress></CircularProgress>
        </Wrapper>
    );
};

const Wrapper = styled.div`
    position: fixed;
    height: 100%;
    width: 100%;
    background: #04045a;
    display: flex;
    align-items: center;
    justify-content: center;
`;

export default Loader;
