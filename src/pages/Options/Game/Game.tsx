import React from 'react';
import Unity, { UnityContext } from 'react-unity-webgl';
import styled from 'styled-components';
import { isNetworkSupported } from '../../../utils/network';
import { Background, FlexDivColumn, Wrapper } from '../../../theme/common';
import MarketHeader from '../Home/MarketHeader';
import ROUTES from '../../../constants/routes';
import Loader from '../../../components/Loader';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/rootReducer';
import { getNetworkId } from '../../../redux/modules/wallet';

const Game: React.FC = () => {
    const networkId = useSelector((state: RootState) => getNetworkId(state));

    const unityContext = new UnityContext({
        loaderUrl: '/miletus-game/build.loader.js',
        dataUrl: '/miletus-game/build.data',
        frameworkUrl: '/miletus-game/build.framework.js',
        codeUrl: '/miletus-game/build.wasm',
    });

    const handleOnClickFullscreen = () => {
        unityContext.setFullscreen(true);
    };

    return isNetworkSupported(networkId) ? (
        <Background style={{ minHeight: '100vh' }}>
            <Wrapper>
                <Container className="game" style={{ zIndex: 10 }}>
                    <MarketHeader route={ROUTES.Options.Game} />
                    <GameWrapper>
                        <Unity
                            unityContext={unityContext}
                            style={{
                                height: 'auto',
                                width: '100%',
                            }}
                        />
                        <FullScreenButton onClick={handleOnClickFullscreen}>⛶</FullScreenButton>
                    </GameWrapper>
                </Container>
            </Wrapper>
        </Background>
    ) : (
        <Loader />
    );
};

const FullScreenButton = styled.span`
    position: absolute;
    bottom: 20px;
    right: 20px;
    font-size: 5em;
    cursor: pointer;
    color: white;
`;

const GameWrapper = styled.div`
    position: relative;
    display: flex;
    flex: 1;
    justify-content: center;
`;

const Container = styled(FlexDivColumn)`
    z-index: 10;
    width: 100%;
`;

export default Game;
