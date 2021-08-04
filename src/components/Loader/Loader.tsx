import React, { useEffect } from 'react';
import styled from 'styled-components';
import coin from 'assets/images/only_coin.gif';
import angry from 'assets/images/angry_thales.gif';
import { CircularProgress } from '@material-ui/core';
import { Button, Image, Text } from 'theme/common';
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
            {history.location.pathname === '/' ? (
                <CircularProgress />
            ) : isNetworkSupported(networkId) ? (
                history.location.state === 'show' ? (
                    <Image style={{ width: 100, height: 100 }} src={coin}></Image>
                ) : (
                    <CircularProgress />
                )
            ) : (
                <WrongNetworkWrapper>
                    <Image style={{ width: 200, height: 200, margin: 'auto' }} src={angry}></Image>
                    <Text className="pale-grey text-l ls25">Oops! You are on wrong network!</Text>

                    <Text style={{ marginTop: 45 }} className="pale-grey text-s lh32 ls35">
                        You have selected wrong network in your wallet. Please switch to Ethereum network from wallet to
                        continue.
                    </Text>
                    <Button
                        style={{ alignSelf: 'flex-end', margin: '80px 0' }}
                        className="primary"
                        onClick={switchNetwork}
                    >
                        Switch to Mainnet
                    </Button>
                </WrongNetworkWrapper>
            )}
        </Wrapper>
    );
};

const switchNetwork = async () => {
    if (typeof window.ethereum !== 'undefined') {
        try {
            await (window.ethereum as any).request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: '0x1' }],
            });
            location.reload();
        } catch (switchError) {
            console.log(switchError);
        }
    }
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

const WrongNetworkWrapper = styled.div`
    background: #04045a;
    border-radius: 23px;
    display: flex;
    flex-direction: column;
    max-width: 550px;
    padding: 40px;
`;

export default Loader;
