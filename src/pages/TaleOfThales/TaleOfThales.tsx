import React, { useEffect } from 'react';
import Unity, { UnityContext } from 'react-unity-webgl';
import styled from 'styled-components';
import fullScreenImage from 'assets/images/full_screen_icon.png';
import { FlexDivColumn } from 'theme/common';
import { useSelector } from 'react-redux';
import { RootState } from 'redux/rootReducer';
import { getWalletAddress } from 'redux/modules/wallet';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

const unityContext = new UnityContext({
    loaderUrl: '/miletus-game/build.loader.js',
    dataUrl: '/miletus-game/build.data.unityweb',
    frameworkUrl: '/miletus-game/build.framework.js.unityweb',
    codeUrl: '/miletus-game/build.wasm.unityweb',
});

const TaleOfThales: React.FC = () => {
    const { t } = useTranslation();
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state));

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
        <Container className="game" style={{ zIndex: 10 }}>
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

export default TaleOfThales;
