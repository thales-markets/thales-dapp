import React, { useEffect } from 'react';
import Unity, { UnityContext } from 'react-unity-webgl';
import fullScreenImage from 'assets/images/full_screen_icon.png';
import { useSelector } from 'react-redux';
import { RootState } from 'redux/rootReducer';
import { getNetworkId, getWalletAddress } from 'redux/modules/wallet';
import { useTranslation } from 'react-i18next';
import Container from '../../styled-components/GameContainer';
import onboardConnector from 'utils/onboardConnector';
import { getIsAppReady } from 'redux/modules/app';
import useStakingThalesQuery from 'queries/staking/useStakingThalesQuery';

const unityContext = new UnityContext({
    loaderUrl: '/miletus-metaverse/build.loader.js',
    dataUrl: '/miletus-metaverse/build.data.unityweb',
    frameworkUrl: '/miletus-metaverse/build.framework.js.unityweb',
    codeUrl: '/miletus-metaverse/build.wasm.unityweb',
});

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

type MetaverseProperties = {
    closeMetaverse: number;
    setCloseMetaverse: (tab: number) => void;
    setActiveTab: (tab: number) => void;
};

const Metaverse: React.FC<MetaverseProperties> = ({ closeMetaverse, setCloseMetaverse, setActiveTab }) => {
    const { t } = useTranslation();
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state)) || '';
    const networkId = useSelector((state: RootState) => getNetworkId(state));

    const stakingThalesQuery = useStakingThalesQuery(walletAddress, networkId, {
        enabled: isAppReady && !!walletAddress,
    });

    const thalesStaked = stakingThalesQuery.isSuccess ? stakingThalesQuery.data.thalesStaked : 0;
    const handleOnClickFullscreen = () => {
        unityContext.setFullscreen(true);
    };

    useEffect(() => {
        if (walletAddress) {
            unityContext.send(
                'JSListener',
                'sendWalletInfoToGame',
                JSON.stringify({ walletAddress, thalesStaked, listOwnedNFTs: [3, 7, 8, 17, 18] })
            );
        }
    }, [walletAddress, thalesStaked]);

    unityContext.on('connectGameToWallet', () => {
        if (walletAddress) {
            unityContext.send(
                'JSListener',
                'sendWalletInfoToGame',
                JSON.stringify({ walletAddress, thalesStaked, listOwnedNFTs: [3, 7, 8, 17, 18] })
            );
        } else {
            onboardConnector.connectWallet();
        }
    });

    unityContext.on('openThalesMarkets', () => {
        window.open('https://thalesmarket.io/markets');
    });

    unityContext.on('openOvertimeMarkets', () => {
        window.open('https://overtimemarkets.xyz/#/markets');
    });

    unityContext.on('readyToUnload', async () => {
        await unityContext.quitUnityInstance();
        setActiveTab(closeMetaverse);
        setCloseMetaverse(0);
    });

    useEffect(() => {
        if (closeMetaverse) {
            unityContext.send('JSListener', 'onClose');
        }
    }, [closeMetaverse]);

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

export default Metaverse;
