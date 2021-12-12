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

    return isNetworkSupported(networkId) ? (
        <Background style={{ minHeight: '100vh' }}>
            <Wrapper>
                <FlexDivColumn className="game" style={{ zIndex: 10 }}>
                    <MarketHeader route={ROUTES.Options.Game} />
                    <GameWrapper>
                        <Unity
                            unityContext={unityContext}
                            style={{
                                height: '600px',
                                width: '600px',
                            }}
                        />
                    </GameWrapper>
                </FlexDivColumn>
            </Wrapper>
        </Background>
    ) : (
        <Loader />
    );
};

const GameWrapper = styled.div``;

export default Game;
