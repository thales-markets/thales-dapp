import React, { useEffect } from 'react';
import styled from 'styled-components';
import coin from 'assets/images/only_coin.gif';
import { CircularProgress } from '@material-ui/core';
import { Image } from 'theme/common';
import { history } from 'utils/routes';

const Loader: React.FC = () => {
    useEffect(() => {
        return () => {
            history.location.state = '';
        };
    });
    return (
        <Wrapper>
            {history.location.state === 'show' ? (
                <Image style={{ width: 100, height: 100 }} src={coin}></Image>
            ) : (
                <CircularProgress />
            )}
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
