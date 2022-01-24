import React, { useEffect } from 'react';
import Unity, { UnityContext } from 'react-unity-webgl';
import styled from 'styled-components';
import fullScreenImage from 'assets/images/full_screen_icon.png';
import { Background, FlexDivColumn, Wrapper } from '../../../theme/common';
import MarketHeader from '../Home/MarketHeader';
import ROUTES from '../../../constants/routes';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/rootReducer';
import { getNetworkId, getWalletAddress } from '../../../redux/modules/wallet';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { isNetworkSupported } from '../../../utils/network';
import Loader from '../../../components/Loader';

const unityContext = new UnityContext({
    loaderUrl: '/miletus-game/build.loader.js',
    dataUrl: '/miletus-game/build.data.unityweb',
    frameworkUrl: '/miletus-game/build.framework.js.unityweb',
    codeUrl: '/miletus-game/build.wasm.unityweb',
});

const Game: React.FC = () => {
    const { t } = useTranslation();
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state));
    const networkId = useSelector((state: RootState) => getNetworkId(state));

    const handleOnClickFullscreen = () => {
        unityContext.setFullscreen(true);
    };

    useEffect(() => {
        unityContext.removeEventListener('StartGame');
        unityContext.on('StartGame', async () => {
            if (walletAddress) {
                await axios.post('https://api.thales.market/game-started', {
                    walletAddress,
                });
            } else {
                await axios.post('https://api.thales.market/game-started');
            }
        });
    }, [walletAddress]);

    useEffect(() => {
        unityContext.removeEventListener('EndGame');
        unityContext.on('EndGame', async () => {
            if (walletAddress) {
                await axios.post('https://api.thales.market/game-ended', {
                    walletAddress,
                });
            } else {
                await axios.post('https://api.thales.market/game-ended');
            }
        });
    }, [walletAddress]);

    return (
        <Background style={{ minHeight: '100vh' }}>
            <Wrapper>
                {!walletAddress || (networkId && isNetworkSupported(networkId)) ? (
                    <Container className="game" style={{ zIndex: 10 }}>
                        <MarketHeader route={ROUTES.Options.Game} />
                        {!walletAddress && <WalletMessage>{t('game.connect-wallet-warning')}</WalletMessage>}
                        <CenterGame>
                            <GameWrapper>
                                <Unity
                                    unityContext={unityContext}
                                    style={{
                                        height: 'auto',
                                        width: '100%',
                                    }}
                                />
                                <FullScreenButton onClick={handleOnClickFullscreen} src={fullScreenImage} />
                            </GameWrapper>
                        </CenterGame>
                    </Container>
                ) : (
                    <Loader />
                )}
            </Wrapper>
        </Background>
    );
};

const FullScreenButton = styled.img`
    position: absolute;
    bottom: 20px;
    right: 20px;
    cursor: pointer;
    height: 9%;
`;

const CenterGame = styled.div`
    display: flex;
    flex: 1;
    align-items: center;
`;

const GameWrapper = styled.div`
    position: relative;
    display: flex;
    flex: 1;
    justify-content: center;
    aspect-ratio: 16/9;
`;

const Container = styled(FlexDivColumn)`
    z-index: 10;
    width: 100%;
`;

const WalletMessage = styled.div`
    font-size: 14px;
    line-height: 16px;
    letter-spacing: 0.25px;
    color: #ffcc00;
    margin-top: 10px;
    text-align: center;
`;

export default Game;
