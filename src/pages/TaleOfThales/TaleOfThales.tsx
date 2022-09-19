import React, { useEffect } from 'react';
import Unity, { UnityContext } from 'react-unity-webgl';
import fullScreenImage from 'assets/images/full_screen_icon.png';
import { useSelector } from 'react-redux';
import { RootState } from 'redux/rootReducer';
import { getWalletAddress } from 'redux/modules/wallet';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import Container from './styled-components/GameContainer';
import { generalConfig } from 'config/general';

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
                await axios.post(`${generalConfig.API_URL}/game-started`, {
                    walletAddress,
                });
            } else {
                await axios.post(`${generalConfig.API_URL}/game-started`);
            }
        });
    }, [walletAddress]);

    useEffect(() => {
        unityContext.removeEventListener('EndGame');
        unityContext.on('EndGame', async () => {
            if (walletAddress) {
                await axios.post(`${generalConfig.API_URL}/game-ended`, {
                    walletAddress,
                });
            } else {
                await axios.post(`${generalConfig.API_URL}/game-ended`);
            }
        });
    }, [walletAddress]);

    return (
        <Container className="game" style={{ zIndex: 10 }}>
            {!walletAddress && <Container.Msg>{t('game.connect-wallet-warning')}</Container.Msg>}
            <Container.Center>
                <Container.Wrapper>
                    <Unity
                        unityContext={unityContext}
                        style={{
                            height: 'auto',
                            width: '100%',
                        }}
                    />
                    <Container.Btn onClick={handleOnClickFullscreen} src={fullScreenImage} />
                </Container.Wrapper>
            </Container.Center>
        </Container>
    );
};

export default TaleOfThales;
