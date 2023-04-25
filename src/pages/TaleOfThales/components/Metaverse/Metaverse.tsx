import React, { useEffect } from 'react';
import Unity, { UnityContext } from 'react-unity-webgl';
import fullScreenImage from 'assets/images/full_screen_icon.png';
import { useSelector } from 'react-redux';
import { RootState } from 'redux/rootReducer';
import { getNetworkId, getWalletAddress } from 'redux/modules/wallet';
import { useTranslation } from 'react-i18next';
import Container from '../../styled-components/GameContainer';
import { getIsAppReady } from 'redux/modules/app';
import useStakingThalesQuery from 'queries/staking/useStakingThalesQuery';
import useNFTBalancesQuery from 'queries/taleOfThales/useNFTBalancesQuery';
import { useConnectModal } from '@rainbow-me/rainbowkit';

const unityContext = new UnityContext({
    loaderUrl: '/miletus-metaverse/build.loader.js',
    dataUrl: '/miletus-metaverse/build.data.unityweb',
    frameworkUrl: '/miletus-metaverse/build.framework.js.unityweb',
    codeUrl: '/miletus-metaverse/build.wasm.unityweb',
});

const Metaverse: React.FC = () => {
    const { t } = useTranslation();
    const { openConnectModal } = useConnectModal();
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state)) || '';
    const networkId = useSelector((state: RootState) => getNetworkId(state));

    const stakingThalesQuery = useStakingThalesQuery(walletAddress, networkId, {
        enabled: isAppReady && !!walletAddress,
    });

    const thalesStaked = stakingThalesQuery.isSuccess ? stakingThalesQuery.data.thalesStaked : 0;

    const NFTBalancesQuery = useNFTBalancesQuery(walletAddress || '', networkId, {
        enabled: isAppReady && !!walletAddress,
    });
    const NFTBalancesMap = NFTBalancesQuery.isSuccess ? NFTBalancesQuery.data : {};

    const handleOnClickFullscreen = () => {
        unityContext.setFullscreen(true);
    };

    useEffect(() => {
        if (walletAddress) {
            unityContext.send(
                'JSListener',
                'sendWalletInfoToGame',
                JSON.stringify({
                    walletAddress,
                    thalesStaked,
                    listOwnedNFTs: Object.keys(NFTBalancesMap).map((itemId) => Number(itemId) - 1),
                })
            );
        }
    }, [walletAddress, thalesStaked, NFTBalancesMap]);

    unityContext.on('connectGameToWallet', () => {
        if (walletAddress) {
            unityContext.send(
                'JSListener',
                'sendWalletInfoToGame',
                JSON.stringify({
                    walletAddress,
                    thalesStaked,
                    listOwnedNFTs: Object.keys(NFTBalancesMap).map((itemId) => Number(itemId) - 1),
                })
            );
        } else {
            openConnectModal?.();
        }
    });

    unityContext.on('openThalesMarkets', () => {
        window.open('https://thalesmarket.io/markets?mtm_campaign=tot');
    });

    unityContext.on('openOvertimeMarkets', () => {
        window.open('https://overtimemarkets.xyz/?mtm_campaign=tot#/markets');
    });

    unityContext.on('showTweet', () => {
        window.open('https://twitter.com/thalesmarket/status/1640387655367114764');
    });

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
