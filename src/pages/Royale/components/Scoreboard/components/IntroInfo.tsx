import styled from 'styled-components';
import circle from 'assets/images/royale/circle.svg';
import triangle from 'assets/images/royale/triangle.svg';
import format from 'date-fns/format';
import useInterval from 'hooks/useInterval';
import TimeRemaining from 'components/TimeRemaining';
import { Trans, useTranslation } from 'react-i18next';
import React, { useEffect, useState } from 'react';
import { DEFAULT_LANGUAGE, SupportedLanguages } from 'i18n/config';
import i18n from 'i18n';
import { Text } from 'theme/common';
import useLatestRoyaleSeasonInfo from '../queries/useLastRoyaleSeasonInfo';
import { useSelector } from 'react-redux';
import { getIsWalletConnected, getNetworkId } from 'redux/modules/wallet';
import { getIsOVM, getIsPolygon } from 'utils/network';
import { RootState } from 'redux/rootReducer';
import { getIsAppReady } from 'redux/modules/app';
import { getTimeLeft } from '../../Arena/RoyaleArena';
import snxJSConnector from 'utils/snxJSConnector';
import { dispatchMarketNotification } from 'utils/options';
import { addSeconds, differenceInSeconds } from 'date-fns';

const Intro: React.FC = () => {
    const { t } = useTranslation();
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
    const isL2 = getIsOVM(networkId);
    const isPolygon = getIsPolygon(networkId);
    const isWalletConnected = useSelector((state: RootState) => getIsWalletConnected(state));

    const queryForIntro = useLatestRoyaleSeasonInfo({ enabled: (isL2 || isPolygon) && isAppReady });
    const data = queryForIntro.isSuccess ? queryForIntro.data : undefined;

    const [timeLeftForPositioning, setTimeLeftForPositioning] = useState<Date | null>(
        data ? getTimeLeft(data.roundInASeasonStartTime, data.roundChoosingLength) : null
    );
    const selectedLanguage = (Object.values(SupportedLanguages) as string[]).includes(i18n.language)
        ? i18n.language
        : DEFAULT_LANGUAGE;

    const [timeLeftInRound, setTimeLeftInRound] = useState<Date | null>(
        data
            ? getTimeLeft(
                  data.roundInASeasonStartTime,
                  (data.roundInASeasonEndTime.getTime() - data.roundInASeasonStartTime.getTime()) / 1000
              )
            : null
    );

    const [timeLeftUntilNewSeason, setTimeLeftUntilNewSeason] = useState<Date | null>(
        data ? getTimeLeft(data.roundInASeasonStartTime, data.pauseBetweenSeasonsTime) : null
    );

    const [counter, setCounter] = useState(0);

    useInterval(async () => {
        setCounter(counter + 1);
    }, 1000);

    useInterval(async () => {
        if (!data) return;
        setTimeLeftForPositioning(getTimeLeft(data.roundInASeasonStartTime, data.roundChoosingLength));
        setTimeLeftUntilNewSeason(getTimeLeft(data.royaleSeasonCreationTime, data.pauseBetweenSeasonsTime, true));
        setTimeLeftInRound(
            getTimeLeft(
                data.roundInASeasonStartTime,
                (data.roundInASeasonEndTime.getTime() - data.roundInASeasonStartTime.getTime()) / 1000
            )
        );
    }, 1000);

    useEffect(() => {
        if (
            timeLeftInRound &&
            timeLeftInRound.getHours() === 0 &&
            timeLeftInRound.getMinutes() === 0 &&
            timeLeftInRound.getSeconds() === 1
        ) {
            document.title = 'Thales: Binary options trading powered by Synthetix.';
        } else {
            const round = data?.roundInASeason;
            timeLeftForPositioning && timeLeftForPositioning?.getHours() === 0
                ? (document.title =
                      format(timeLeftForPositioning, 'mm:ss') +
                      t('options.royale.scoreboard.round-positioning') +
                      t('options.royale.scoreboard.thales-suffix'))
                : timeLeftInRound && timeLeftInRound.getHours() === 0
                ? (document.title =
                      format(timeLeftInRound, 'mm:ss') +
                      t('options.royale.scoreboard.round-ending', { round }) +
                      t('options.royale.scoreboard.thales-suffix'))
                : 'Thales: Binary options trading powered by Synthetix.';
        }
    }, [timeLeftInRound, timeLeftForPositioning]);

    const lessThanADayBeforeSeason = () => {
        if (!data) return false;
        const oneDayInSeconds = 86400;
        const roundEndTime = addSeconds(data.royaleSeasonCreationTime, data.pauseBetweenSeasonsTime);
        const timeDifferenceInSeconds = differenceInSeconds(roundEndTime, new Date());

        return timeDifferenceInSeconds < oneDayInSeconds;
    };

    const getTitle = () => {
        if (!data) return;
        if (data.seasonFinished || (!data.seasonStarted && !data.canStartNewSeason)) {
            if (timeLeftUntilNewSeason) {
                return (
                    <>
                        <Title>{t('options.royale.scoreboard.season-ready-in')}</Title>
                        <SubTitle lineHeight={selectedLanguage === SupportedLanguages.CHINESE ? 84 : 56}>
                            {timeLeftUntilNewSeason
                                ? lessThanADayBeforeSeason()
                                    ? format(timeLeftUntilNewSeason, '00:HH:mm:ss')
                                    : format(timeLeftUntilNewSeason, 'dd:HH:mm:ss')
                                : t('options.royale.battle.ended')}
                        </SubTitle>
                    </>
                );
            } else {
                return (
                    <>
                        <Title>{t('options.royale.scoreboard.starts')}</Title>
                        <Button
                            onClick={startRoyaleSeason}
                            disabled={!data.canStartNewSeason || !isWalletConnected}
                            className={!data.canStartNewSeason || !isWalletConnected ? 'disabled' : ''}
                            style={{
                                margin: '30px auto',
                                fontSize: 30,
                                lineHeight: '30px',
                            }}
                        >
                            <Title style={{ color: 'var(--color-wrapper)' }}>
                                {t('options.royale.scoreboard.start-season')}
                            </Title>
                        </Button>
                    </>
                );
            }
        } else if (!data.seasonStarted && data.canStartNewSeason) {
            return (
                <>
                    <Title>{t('options.royale.scoreboard.starts')}</Title>
                    <Button
                        onClick={startRoyaleSeason}
                        disabled={!data.canStartNewSeason || !isWalletConnected}
                        className={!data.canStartNewSeason || !isWalletConnected ? 'disabled' : ''}
                        style={{
                            margin: '30px auto',
                            fontSize: 30,
                            lineHeight: '30px',
                        }}
                    >
                        <Title style={{ color: 'var(--color-wrapper)' }}>
                            {t('options.royale.scoreboard.start-season')}
                        </Title>
                    </Button>
                </>
            );
        } else if (data.seasonStarted) {
            if (data.roundInASeason === 0) {
                {
                    return data.signUpPeriod < new Date() ? (
                        <>
                            <Title>{t('options.royale.scoreboard.starts')}</Title>
                            <Button
                                onClick={startRoyale}
                                disabled={!data.canStartRoyale || !isWalletConnected}
                                className={!data.canStartRoyale || !isWalletConnected ? 'disabled' : ''}
                                style={{
                                    margin: '30px auto',
                                    fontSize: 30,
                                    lineHeight: '30px',
                                }}
                            >
                                <Title style={{ color: 'var(--color-wrapper)' }}>
                                    {t('options.royale.scoreboard.start-royale')}
                                </Title>
                            </Button>
                        </>
                    ) : (
                        <>
                            <Title>{t('options.royale.scoreboard.starts')}</Title>
                            <SubTitle lineHeight={selectedLanguage === SupportedLanguages.CHINESE ? 84 : 56}>
                                <TimeRemaining end={data.signUpPeriod} showFullCounter />
                            </SubTitle>
                        </>
                    );
                }
            } else if (data.roundInASeason === data.rounds) {
                return (
                    <>
                        <Title>{t('options.royale.scoreboard.ends')}</Title>
                        <SubTitle lineHeight={selectedLanguage === SupportedLanguages.CHINESE ? 84 : 56}>
                            <TimeRemaining end={data.roundInASeasonEndTime} showFullCounter />
                        </SubTitle>
                    </>
                );
            } else {
                return timeLeftForPositioning ? (
                    <>
                        <Title>
                            {t('options.royale.scoreboard.position-period')} {data.roundInASeason}:
                        </Title>
                        <SubTitle lineHeight={selectedLanguage === SupportedLanguages.CHINESE ? 84 : 56}>
                            {timeLeftForPositioning
                                ? format(timeLeftForPositioning, 'HH:mm:ss')
                                : t('options.royale.battle.ended')}
                        </SubTitle>
                    </>
                ) : (
                    <>
                        <Title>{t('options.royale.scoreboard.round-period', { round: data.roundInASeason })}:</Title>
                        <SubTitle lineHeight={selectedLanguage === SupportedLanguages.CHINESE ? 84 : 56}>
                            {timeLeftInRound ? format(timeLeftInRound, 'HH:mm:ss') : t('options.royale.battle.ended')}
                        </SubTitle>
                    </>
                );
            }
        }
    };

    return (
        <>
            {getTitle()}
            <Question lineHeight={selectedLanguage === SupportedLanguages.CHINESE ? 40 : 30}>
                {t('options.royale.scoreboard.question')}{' '}
            </Question>
            <InfoText style={{ margin: '14px 0px' }}>
                <Trans i18nKey="options.royale.scoreboard.info2" components={{ bold: <strong /> }} />
            </InfoText>
            <InfoText>
                <Trans
                    i18nKey="options.royale.scoreboard.info3"
                    components={{
                        bold: <strong />,
                        circle: <img src={circle} width="20" height="20" />,
                        triangle: <img src={triangle} width="20" height="20" />,
                    }}
                />
            </InfoText>
            <InfoText style={{ margin: '14px 0px' }}>{t('options.royale.scoreboard.info4')}</InfoText>{' '}
            <InfoText>
                <Trans
                    i18nKey="options.royale.scoreboard.info5"
                    components={{
                        bold: <strong />,
                    }}
                />
            </InfoText>
            <InfoText style={{ margin: '14px 0px' }}>
                <Trans
                    i18nKey="options.royale.scoreboard.info6"
                    components={{
                        bold: <strong />,
                    }}
                />
                <Link
                    href="https://thalesmarket.medium.com/thales-royale-seasons-are-going-live-on-optimism-5459217ec0fd"
                    target="_blank"
                    rel="noreferrer"
                >
                    {t('options.royale.scoreboard.blog')}
                </Link>
            </InfoText>
            <InfoText style={{ marginTop: '8px', textAlign: 'center' }}>
                <Trans
                    i18nKey="options.royale.scoreboard.info7"
                    components={{
                        italic: <i />,
                    }}
                />
            </InfoText>
        </>
    );
};

const startRoyale = async () => {
    const { thalesRoyaleContract } = snxJSConnector;
    if (thalesRoyaleContract) {
        const RoyalContract = thalesRoyaleContract.connect((snxJSConnector as any).signer);
        try {
            const tx = await RoyalContract.startRoyaleInASeason();
            await tx.wait();
            dispatchMarketNotification('Royale Started');
        } catch (e) {
            console.log(e);
        }
    }
};

const startRoyaleSeason = async () => {
    const { thalesRoyaleContract } = snxJSConnector;
    if (thalesRoyaleContract) {
        const RoyalContract = thalesRoyaleContract.connect((snxJSConnector as any).signer);
        try {
            const tx = await RoyalContract.startNewSeason();
            await tx.wait();
            dispatchMarketNotification('Season Started');
        } catch (e) {
            console.log(e);
        }
    }
};

const Button = styled.button`
    align-items: center;
    cursor: pointer;
    display: flex;
    font-family: Sansation !important;
    font-style: normal;
    font-weight: bold;
    font-size: 20px;
    line-height: 22px;
    background: var(--color);
    border: 1px solid var(--color);
    box-sizing: border-box;
    box-shadow: 0px 0px 30px var(--color);
    border-radius: 20px;
    padding: 6px 15px 6px 20px;
    color: var(--color-wrapper);
    margin: auto;
    &.disabled {
        opacity: 0.7;
        cursor: not-allowed;
    }
`;
const Title = styled(Text)`
    align-self: center;
    font-family: SansationLight !important;
    font-style: normal;
    font-weight: 300;
    font-size: 24px;
    line-height: 18px;
    text-align: center;
    letter-spacing: -0.4px;
    color: var(--color);
    padding-bottom: 5px;
    padding-top: 5px;
`;

const SubTitle = styled(Text)<{ lineHeight: number }>`
    margin-top: 4px;
    margin-bottom: 14px;
    align-self: center;
    font-family: basis33 !important;
    font-style: normal;
    font-weight: 400;
    font-size: 80px;
    line-height: ${(props) => props.lineHeight}px;
    text-align: center;
    letter-spacing: -0.4px;
    color: var(--color);
    span {
        font-family: basis33 !important;
        font-style: normal;
        font-weight: 400;
        font-size: 80px;
        line-height: ${(props) => props.lineHeight}px;
        text-align: justify;
        letter-spacing: -0.4px;
        color: var(--color);
    }
`;

const Question = styled(Text)<{ lineHeight: number }>`
    font-family: basis33 !important;
    font-style: normal;
    font-weight: 400;
    font-size: 38.455px;
    line-height: ${(props) => props.lineHeight}px;
    text-align: justify;
    letter-spacing: -0.4px;
    color: var(--color);
`;

const InfoText = styled(Text)`
    font-weight: 400;
    font-family: SansationLight !important;
    text-overflow: ellipsis;
    &,
    strong {
        font-style: normal;
        font-size: 20px;
        line-height: 24px;
        text-align: justify;
        letter-spacing: -0.4px;
        color: var(--color);
    }
    strong {
        font-weight: bold;
        font-family: SansationBold !important;
    }
    i {
        font-style: italic;
    }
    img {
        vertical-align: bottom;
    }
`;

const Link = styled.a`
    font-family: SansationBold !important;
    font-style: normal;
    font-weight: bold;
    font-size: 20px;
    line-height: 20px;
    margin-left: 4px;
    text-align: justify;
    letter-spacing: -0.4px;
    color: var(--color);
    &:hover {
        font-weight: bold;
        text-decoration: underline;
    }
`;

export default Intro;
