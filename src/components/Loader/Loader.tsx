import React, { useEffect } from 'react';
import styled from 'styled-components';
import coin from 'assets/images/only_coin.gif';
import { CircularProgress } from '@material-ui/core';
import { Image, Text } from 'theme/common';
import { history } from 'utils/routes';
import { useSelector } from 'react-redux';
import { getNetworkId } from 'redux/modules/wallet';
import { RootState } from 'redux/rootReducer';
import { isNetworkSupported } from 'utils/network';

const Loader: React.FC = () => {
    const networkId = useSelector((state: RootState) => getNetworkId(state));

    useEffect(() => {
        return () => {
            history.location.state = '';
        };
    });
    return (
        <Wrapper>
            {isNetworkSupported(networkId) ? (
                history.location.state === 'show' ? (
                    <Image style={{ width: 100, height: 100 }} src={coin}></Image>
                ) : (
                    <CircularProgress />
                )
            ) : (
                <Text className="pale-grey bold text-xl">Please switch to Mainnet!!!</Text>
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
