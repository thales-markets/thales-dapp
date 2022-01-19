import React, { useState } from 'react';
import styled from 'styled-components';
import { isNetworkSupported } from '../../../utils/network';
import { Background, FlexDivColumn, Wrapper } from '../../../theme/common';
import MarketHeader from '../Home/MarketHeader';
import ROUTES from '../../../constants/routes';
import Loader from '../../../components/Loader';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/rootReducer';
import { getNetworkId } from '../../../redux/modules/wallet';
import { ReactComponent as TaleOfThalesLogo } from 'assets/images/tale-of-thales-logo.svg';
import useInterval from '../../../hooks/useInterval';
import intervalToDuration from 'date-fns/intervalToDuration';
import { useTranslation } from 'react-i18next';

const getTimeLeft = () => {
    const durationToEnd = intervalToDuration({ start: Date.now(), end: new Date('Jan 24 2022 13:00:00 UTC') });
    return {
        days: ('0' + durationToEnd?.days).slice(-2),
        hours: ('0' + durationToEnd?.hours).slice(-2),
        minutes: ('0' + durationToEnd?.minutes).slice(-2),
        seconds: ('0' + durationToEnd?.seconds).slice(-2),
    };
};

const Game: React.FC = () => {
    const { t } = useTranslation();
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const [timeLeft, setTimeLeft] = useState<{ days: string; hours: string; minutes: string; seconds: string }>(
        getTimeLeft()
    );

    useInterval(() => {
        setTimeLeft(getTimeLeft());
    }, 1000);

    return isNetworkSupported(networkId) ? (
        <Background
            style={{ minHeight: '100vh', background: 'radial-gradient(50% 50% at 50% 50%, #080960 0%, #02023E 100%)' }}
        >
            <Wrapper>
                <Container className="game" style={{ zIndex: 10 }}>
                    <MarketHeader route={ROUTES.Options.Game} />
                    <CenterGame>
                        <a
                            style={{ display: 'contents' }}
                            target="_blank"
                            rel="noreferrer"
                            href="https://thalesmarket.medium.com/tale-of-thales-launch-is-getting-close-and-it-comes-with-rewards-5fc26abc6c9e"
                        >
                            <TaleOfThalesLogo style={{ maxWidth: '100%' }} />
                        </a>
                        <TimerWrapper>
                            <a
                                style={{ display: 'contents' }}
                                target="_blank"
                                rel="noreferrer"
                                href="https://thalesmarket.medium.com/tale-of-thales-launch-is-getting-close-and-it-comes-with-rewards-5fc26abc6c9e"
                            >
                                <EasterEgg>{t('game.easter-egg-hunt-begins-in')}</EasterEgg>
                            </a>
                            <Countdown>
                                <span>
                                    {timeLeft.days}
                                    <CountdownLabel>{t('game.days')}</CountdownLabel>
                                </span>
                                <span>:</span>
                                <span>
                                    {timeLeft.hours}
                                    <CountdownLabel>{t('game.hours')}</CountdownLabel>
                                </span>
                                <span>:</span>
                                <span>
                                    {timeLeft.minutes}
                                    <CountdownLabel>{t('game.minutes')}</CountdownLabel>
                                </span>
                                <span>:</span>
                                <span>
                                    {timeLeft.seconds}
                                    <CountdownLabel>{t('game.seconds')}</CountdownLabel>
                                </span>
                            </Countdown>
                        </TimerWrapper>
                    </CenterGame>
                </Container>
            </Wrapper>
        </Background>
    ) : (
        <Loader />
    );
};

const TimerWrapper = styled.div`
    display: flex;
    flex-direction: column;
    text-shadow: 0px 0px 60px #f7f7f7;
    margin-top: -10px;
`;

const EasterEgg = styled.span`
    font-style: normal;
    font-weight: normal;
    font-size: 30px;
    text-align: center;
    text-transform: uppercase;
    color: #ffffff;
    font-family: 'RobotoLight' !important;
    @media (max-width: 767px) {
        font-size: 20px;
    }
`;

const Countdown = styled.span`
    display: flex;
    justify-content: center;
    > span {
        position: relative;
        font-style: normal;
        font-weight: normal;
        font-size: 75px;
        text-align: center;
        text-transform: uppercase;
        color: #ffffff;
        font-family: 'RobotoThin' !important;
        @media (max-width: 767px) {
            font-size: 50px;
        }
    }
`;

const CountdownLabel = styled.span`
    position: absolute;
    font-size: 15px;
    font-family: 'RobotoThin' !important;
    bottom: -20px;
    left: 0;
    right: 0;
    @media (max-width: 767px) {
        font-size: 12px;
    }
`;

const CenterGame = styled.div`
    display: flex;
    flex: 1;
    align-items: center;
    flex-direction: column;
    justify-content: center;
`;

const Container = styled(FlexDivColumn)`
    z-index: 10;
    width: 100%;
`;

export default Game;
