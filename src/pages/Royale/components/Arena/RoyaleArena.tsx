import React, { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import addSeconds from 'date-fns/addSeconds';
import format from 'date-fns/format';
import differenceInSeconds from 'date-fns/differenceInSeconds';
import { ReactComponent as InfoIcon } from 'assets/images/info.svg';
import { useSelector } from 'react-redux';
import { BigNumber } from 'ethers';
import winnerCard from 'assets/images/royale/winner-card.svg';
import winnerCardS2 from 'assets/images/royale/winner-card-s2.svg';
import winnerCardS3 from 'assets/images/royale/winner-card-s3.svg';
import winnerCardS4 from 'assets/images/royale/winner-card-s4.svg';
import winnerCardS5 from 'assets/images/royale/winner-card-s5.svg';
import useRoyaleArenaContractQuery, { RoyaleArenaData } from './queries/useRoyaleArenaContractQuery';
import usePlayerPositionsQuery from './queries/usePlayerPositionsQuery';
import { Positions } from '../../Queries/usePositionsQuery';
import { FooterData } from '../../Queries/useRoyaleFooterQuery';
import { RootState } from 'redux/rootReducer';
import { getIsAppReady } from 'redux/modules/app';
import { getIsWalletConnected, getNetworkId, getWalletAddress } from 'redux/modules/wallet';
import snxJSConnector from 'utils/snxJSConnector';
import { dispatchMarketNotification } from 'utils/options';
import { FlexDiv, FlexDivCentered, Wrapper } from 'theme/common';
import { RoyaleTooltip } from 'pages/Options/Market/components';
import { getIsOVM } from 'utils/network';
import useInterval from 'hooks/useInterval';
import useSynthsBalancesQuery from 'queries/walletBalances/useSynthsBalancesQuery';
import useRoundsQuery from './queries/useRoundsQuery';
import useRoyalePasportQuery from 'pages/Royale/Queries/usePassportQuery';

type RoyaleArenaProps = {
    assetPrice: string;
    positions: Positions;
    royaleFooterData: FooterData | undefined;
    latestSeason: number;
    selectedSeason: number;
    showBattle: boolean;
};

const renderRounds = (
    royaleData: RoyaleArenaData,
    timeLeftForPositioning: Date | null,
    timeLeftInRound: Date | null,
    selectedSeason: number,
    latestSeason: number
) => {
    const { t } = useTranslation();
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state));
    const { roundInASeason, rounds, token, targetPrice, isPlayerAlive, position } = royaleData;
    const cards = [];
    const networkId = useSelector((state: RootState) => getNetworkId(state));

    const roundsQuery = useRoundsQuery(selectedSeason, networkId, { enabled: networkId !== undefined });

    const roundsGraphInfo = roundsQuery.isSuccess ? roundsQuery.data : [];

    const positionsQuery = usePlayerPositionsQuery(selectedSeason, networkId, walletAddress ?? '', {
        enabled: networkId !== undefined && isAppReady,
    });
    const positions = positionsQuery.isSuccess ? positionsQuery.data : [];

    const roundsInformation = useMemo(
        () =>
            roundsGraphInfo.map((r) => {
                return { ...r, position: positions.find((p) => p.round === r.round)?.position || 0 };
            }),
        [positions, roundsGraphInfo]
    );

    const vote = (option: number) => async () => {
        if (option === roundsInformation[roundInASeason - 1]?.position) {
            return;
        }
        const { thalesRoyaleContract } = snxJSConnector;
        if (thalesRoyaleContract) {
            const RoyalContract = thalesRoyaleContract.connect((snxJSConnector as any).signer);

            const tx = await RoyalContract.takeAPosition(BigNumber.from(option));

            const txResult = await tx.wait();

            if (txResult && txResult.events) {
                dispatchMarketNotification('Successfully submitted');
            }
        }
    };

    const getSeasonWinnerCard = (season: number) => {
        switch (season) {
            case 1:
                return winnerCard;
            case 2:
                return winnerCardS2;
            case 3:
                return winnerCardS3;
            case 4:
                return winnerCardS4;
            case 5:
                return winnerCardS5;
            default:
                return winnerCardS5;
        }
    };

    const isWinner = isPlayerAlive && royaleData.seasonFinished;

    for (let index = 1; index <= rounds; index++) {
        const selectedPosition =
            index === roundInASeason && selectedSeason === latestSeason
                ? position
                : roundsInformation[index - 1]?.position;
        index === roundInASeason
            ? cards.push(
                  <CurrentRound id={`round${index}`} key={index}>
                      <LongButton
                          selected={selectedPosition === 2}
                          onClick={vote(2)}
                          disabled={!timeLeftForPositioning || !isPlayerAlive}
                          notSelected={selectedPosition === 1}
                      >
                          △
                      </LongButton>
                      <div>
                          <CurrentRoundTitle>{t('options.royale.battle.round')}</CurrentRoundTitle>
                          <CurrentRoundText>{index}</CurrentRoundText>
                      </div>
                      <div style={{ marginTop: '10px' }}>
                          <CurrentRoundTitle>{`${t('options.royale.battle.will-be', { token })}`}</CurrentRoundTitle>
                          <CurrentRoundText>
                              {token !== 'ETH'
                                  ? `$${Number(targetPrice).toFixed(4)}`
                                  : `$${Number(targetPrice).toFixed(2)}`}
                          </CurrentRoundText>
                      </div>
                      <div style={{ marginBottom: '10px' }}>
                          <CurrentRoundTitle>{t('options.royale.battle.in')}</CurrentRoundTitle>
                          <CurrentRoundText>
                              {timeLeftInRound ? format(timeLeftInRound, 'HH:mm:ss') : t('options.royale.battle.ended')}
                          </CurrentRoundText>
                      </div>
                      <div>
                          <CurrentRoundTitle>{t('options.royale.battle.time-left-for-positioning')}</CurrentRoundTitle>
                          <CurrentRoundText>
                              {timeLeftForPositioning
                                  ? format(timeLeftForPositioning, 'HH:mm:ss')
                                  : t('options.royale.battle.ended')}
                          </CurrentRoundText>
                      </div>
                      <ShortButton
                          selected={selectedPosition === 1}
                          onClick={vote(1)}
                          disabled={!timeLeftForPositioning || !isPlayerAlive}
                          notSelected={selectedPosition === 2}
                      >
                          <Circle
                              selected={selectedPosition === 1}
                              disabled={!timeLeftForPositioning || !isPlayerAlive}
                          />
                      </ShortButton>
                  </CurrentRound>
              )
            : index < roundInASeason
            ? cards.push(
                  <PrevRound id={`round${index}`} key={index}>
                      <LongButton selected={selectedPosition === 2} disabled={true}>
                          △
                      </LongButton>
                      <div>
                          <RoundTitle>{t('options.royale.battle.round')}</RoundTitle>
                          <RoundText style={{ textDecoration: 'line-through' }}>{index}</RoundText>
                      </div>
                      <div style={{ textDecoration: 'line-through' }}>
                          <CurrentRoundTitle>{`${t('options.royale.battle.will-be', { token })}`}</CurrentRoundTitle>
                          <CurrentRoundText>
                              {token !== 'ETH'
                                  ? `$${Number(roundsInformation[index - 1]?.strikePrice).toFixed(4)}`
                                  : `$${Number(roundsInformation[index - 1]?.strikePrice).toFixed(2)}`}
                          </CurrentRoundText>
                      </div>
                      <RoundHistoryInfo>
                          <FlexDiv>
                              <PrevRoundTitle>{`${token} ${t('options.royale.battle.was')}`}</PrevRoundTitle>
                              <PrevRoundText>
                                  {token !== 'ETH'
                                      ? `$${Number(roundsInformation[index - 1]?.finalPrice).toFixed(4)}`
                                      : `$${Number(roundsInformation[index - 1]?.finalPrice).toFixed(2)}`}
                              </PrevRoundText>
                          </FlexDiv>
                          <FlexDiv>
                              <PrevRoundTitle>{`${t('options.royale.battle.eliminated')}`}</PrevRoundTitle>
                              <PrevRoundText>{`${roundsInformation[index - 1]?.eliminatedPerRoundPerSeason || 0}/${
                                  roundsInformation[index - 1]?.totalPlayersPerRoundPerSeason || 0
                              } ${t('options.royale.battle.players')}`}</PrevRoundText>
                          </FlexDiv>
                      </RoundHistoryInfo>
                      <ShortButton selected={selectedPosition === 1} disabled={true}>
                          <Circle
                              selected={selectedPosition === 1}
                              disabled={!timeLeftForPositioning || !isPlayerAlive}
                          />
                      </ShortButton>
                  </PrevRound>
              )
            : cards.push(
                  <NextRound id={`round${index}`} key={index}>
                      <RoundTitle>{t('options.royale.battle.round')}</RoundTitle>
                      <RoundText>{index}</RoundText>
                  </NextRound>
              );
    }
    if (isWinner) {
        cards.push(
            <WinnerCard id={`round${rounds + 1}`} key={'winner'}>
                <img style={{ height: '100%' }} src={getSeasonWinnerCard(selectedSeason)} />
            </WinnerCard>
        );
    }
    return cards;
};

export const getTimeLeft = (startTime: Date, roundLengthInSeconds: number, betweenSeasons?: boolean) => {
    const beginningOfTime = new Date(0);
    beginningOfTime.setHours(0);
    const oneDayInSeconds = 86400;
    const roundEndTime = addSeconds(startTime, roundLengthInSeconds);
    const timeDifferenceInSeconds = differenceInSeconds(roundEndTime, new Date());
    if (timeDifferenceInSeconds <= 0) {
        return null;
    }

    if (betweenSeasons) {
        timeDifferenceInSeconds > oneDayInSeconds
            ? beginningOfTime.setSeconds(beginningOfTime.getSeconds() + timeDifferenceInSeconds - oneDayInSeconds)
            : beginningOfTime.setSeconds(beginningOfTime.getSeconds() + timeDifferenceInSeconds);
        return beginningOfTime;
    }

    beginningOfTime.setSeconds(beginningOfTime.getSeconds() + timeDifferenceInSeconds);

    return beginningOfTime;
};

const RoyaleArena: React.FC<RoyaleArenaProps> = ({
    showBattle,
    selectedSeason,
    latestSeason,
    assetPrice,
    positions,
    royaleFooterData,
}) => {
    const { t } = useTranslation();
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const isWalletConnected = useSelector((state: RootState) => getIsWalletConnected(state));
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state));
    const isL2 = getIsOVM(networkId);

    const synthsWalletBalancesQuery = useSynthsBalancesQuery(walletAddress ?? '', networkId, {
        enabled: isAppReady && isWalletConnected,
    });

    const memoizedSelectedSeason = useMemo(() => selectedSeason || latestSeason, [latestSeason, selectedSeason]);

    const royalePassportQuery = useRoyalePasportQuery(walletAddress ?? '', networkId, selectedSeason, {
        enabled: isL2 && isWalletConnected,
    });
    const royalePassports = royalePassportQuery.isSuccess ? royalePassportQuery.data : [];
    const passportID = royalePassports.length > 0 ? '' + parseInt('' + royalePassports[0].id, 16) : '';

    const royaleDataQuery = useRoyaleArenaContractQuery(selectedSeason, passportID, {
        enabled: isAppReady && isL2,
    });

    const royaleData = useMemo(() => {
        if (royaleDataQuery.isSuccess) {
            return royaleDataQuery.data;
        } else {
            return {
                roundInASeasonStartTime: new Date(),
                roundInASeasonEndTime: new Date(),
                roundChoosingLength: 300,
                roundInASeason: 0,
                canCloseRound: false,
                isPlayerAlive: false,
                seasonFinished: false,
                rewardCollectedPerSeason: false,
                rounds: 6,
                token: '',
                targetPrice: '',
                position: 0,
            };
        }
    }, [royaleDataQuery.isSuccess, royaleDataQuery.data]);

    const {
        roundInASeasonStartTime,
        roundInASeasonEndTime,
        roundChoosingLength,
        roundInASeason,
        canCloseRound,
    } = royaleData;

    const [currentScrollRound, setCurrentScrollRound] = useState<number>(0);
    const [timeLeftForPositioning, setTimeLeftForPositioning] = useState<Date | null>(
        getTimeLeft(roundInASeasonStartTime, roundChoosingLength)
    );
    const [timeLeftInRound, setTimeLeftInRound] = useState<Date | null>(
        getTimeLeft(
            roundInASeasonStartTime,
            (roundInASeasonEndTime.getTime() - roundInASeasonStartTime.getTime()) / 1000
        )
    );
    const isWinner = useMemo(() => royaleData.isPlayerAlive && royaleData.seasonFinished, [royaleData]);

    useInterval(async () => {
        setTimeLeftForPositioning(getTimeLeft(roundInASeasonStartTime, roundChoosingLength));
        setTimeLeftInRound(
            getTimeLeft(
                roundInASeasonStartTime,
                (roundInASeasonEndTime.getTime() - roundInASeasonStartTime.getTime()) / 1000
            )
        );
    }, 1000);

    const closeRound = async () => {
        const { thalesRoyaleContract } = snxJSConnector;
        if (thalesRoyaleContract) {
            const RoyalContract = thalesRoyaleContract.connect((snxJSConnector as any).signer);

            const tx = await RoyalContract.closeRound();

            const txResult = await tx.wait();

            if (txResult && txResult.events) {
                dispatchMarketNotification('Round closed');
            }
        }
    };

    const claimReward = async () => {
        const { thalesRoyaleContract } = snxJSConnector;
        if (thalesRoyaleContract) {
            const RoyalContract = thalesRoyaleContract.connect((snxJSConnector as any).signer);

            const tx = await RoyalContract.claimRewardForSeason(memoizedSelectedSeason);

            const txResult = await tx.wait();

            if (txResult && txResult.events) {
                dispatchMarketNotification('Reward claimed');
            }
        }
    };

    useEffect(() => {
        if (!currentScrollRound) {
            setCurrentScrollRound(roundInASeason);
            return;
        }
        const currentRoundElement = document.getElementById(`round${currentScrollRound}`);
        if (currentRoundElement) {
            currentRoundElement.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' });
        }
    }, [roundInASeason, currentScrollRound]);

    useEffect(() => {
        const roundToJumpTo = isWinner ? 7 : roundInASeason;
        const currentRoundElement = document.getElementById(`round${roundToJumpTo}`);
        if (currentRoundElement) {
            currentRoundElement.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' });
            setCurrentScrollRound(roundToJumpTo);
        }
    }, [roundInASeason, showBattle, isWinner]);

    return (
        <>
            <StyledWrapper className="battle">
                <ArrowLeft
                    onMouseDown={() => setCurrentScrollRound(Math.max(currentScrollRound - 1, 1))}
                    className="icon icon--left"
                />
                <CardWrapper>
                    <ScrollWrapper id="battle-royale-wrapper">
                        {royaleData ? (
                            renderRounds(
                                royaleData,
                                timeLeftForPositioning,
                                timeLeftInRound,
                                memoizedSelectedSeason,
                                latestSeason
                            )
                        ) : (
                            <></>
                        )}
                    </ScrollWrapper>
                </CardWrapper>
                <InfoSection>
                    <div>
                        <span>{t('options.royale.footer.up')}</span>
                        <span>{`${positions?.up} ${t('options.royale.footer.vs')}  ${positions?.down}`}</span>
                        <span>{t('options.royale.footer.down')}</span>
                    </div>
                    <div>
                        <span>
                            {t('options.royale.footer.current')} {royaleFooterData?.seasonAsset}{' '}
                            {t('options.royale.footer.price')}:
                        </span>
                        <span>
                            $
                            {royaleFooterData?.seasonAsset !== 'ETH'
                                ? Number(assetPrice).toFixed(4)
                                : Number(assetPrice).toFixed(2)}
                        </span>
                    </div>
                    <div>
                        <span>{t('options.royale.footer.reward-per-player')}:</span>
                        <span>{royaleFooterData?.reward.toFixed(2)} sUSD</span>
                    </div>
                    <div>
                        <span>{t('options.royale.footer.players-alive')}:</span>
                        <span>{royaleFooterData?.playersAlive}</span>
                    </div>
                </InfoSection>
                <ArrowRight
                    onMouseDown={() =>
                        setCurrentScrollRound(Math.min(currentScrollRound + 1, royaleData.rounds + (isWinner ? 1 : 0)))
                    }
                    className="icon icon--right"
                />
                {isWinner ? (
                    <Button
                        style={{ zIndex: 1000 }}
                        disabled={royaleData.rewardCollectedPerSeason}
                        onClick={() => {
                            claimReward().finally(() => synthsWalletBalancesQuery.refetch());
                        }}
                    >
                        {t('options.royale.battle.claim-reward', { reward: royaleFooterData?.reward.toFixed(2) })}
                    </Button>
                ) : (
                    <Button
                        style={{ zIndex: 1000, marginBottom: '1em' }}
                        disabled={!canCloseRound}
                        onClick={closeRound}
                    >
                        <RoyaleTooltip title={t('options.royale.battle.optimism-timestamp-message')}>
                            <StyledInfoIcon />
                        </RoyaleTooltip>
                        {t('options.royale.battle.close-round')}
                    </Button>
                )}
            </StyledWrapper>
        </>
    );
};

export default RoyaleArena;

const StyledWrapper = styled(Wrapper)`
    min-height: 100%;
    justify-content: center;
    position: relative;
    @media (max-width: 1024px) {
        padding: 0 !important;
    }
`;

const ArrowLeft = styled.i`
    position: absolute;
    left: calc(90px - 2%);
    top: calc(50% - 36px);
    transform: translateY(-50%);
    cursor: pointer;
    font-size: 50px;
    z-index: 2;
    @media (max-width: 1024px) {
        left: -10px;
        font-size: 1.5em;
    }
`;

const ArrowRight = styled.i`
    position: absolute;
    right: -2%;
    top: calc(50% - 36px);
    transform: translateY(-50%);
    cursor: pointer;
    font-size: 50px;
    z-index: 2;
    @media (max-width: 1024px) {
        right: -10px;
        font-size: 1.5em;
    }
`;

const ScrollWrapper = styled.div`
    display: flex;
    align-items: center;
    overflow: auto;
    height: 100%;
    margin-bottom: -40px;
    padding: 0 440px;
    @media (max-width: 1024px) {
        padding-left: 20px;
        padding-right: 20px;
    }
`;

const CardWrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: flex-start;
    width: 100%;
    overflow: hidden;
    height: 680px;
`;

const Card = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-width: 320px;
    height: 504px;
    border: 4.36032px solid var(--color);
    box-sizing: border-box;
    border-radius: 4.36032px;
    margin: 15px;
    padding: 55px 0;
    position: relative;
    @media (max-width: 360px) {
        min-width: 300px;
    }
    @media (max-width: 340px) {
        min-width: 280px;
    }
    @media (max-width: 280px) {
        min-width: 250px;
    }
`;

const CurrentRound = styled(Card)`
    background: var(--color-background);
    box-shadow: 0px 0px 80.4482px rgba(161, 225, 180, 0.8);
    color: var(--color);
    justify-content: space-evenly;
`;

const PrevRound = styled(Card)`
    filter: drop-shadow(0px 0px 80.4482px rgba(161, 225, 180, 0.8));
    opacity: 0.25;
    color: var(--color);
    justify-content: space-evenly;
`;

const WinnerCard = styled(Card)`
    padding: 0;
    border: none;
    filter: drop-shadow(0px 4px 35.6889px rgba(161, 224, 180, 0.6));
`;

const NextRound = styled(Card)`
    background: var(--color);
    border: 4.36032px solid var(--color);
    box-sizing: border-box;
    box-shadow: 0px 0px 80.4482px rgba(161, 225, 180, 0.8);
    border-radius: 4.36032px;
    opacity: 0.15;
    color: #04045a;
`;

const RoundText = styled.p`
    font-family: basis33 !important;
    font-weight: 400;
    font-size: 90px;
    line-height: 70px;
    text-align: center;
`;

const RoundTitle = styled.p`
    font-family: SansationLight !important;
    font-style: normal;
    font-weight: 300;
    font-size: 35.7616px;
    line-height: 40px;
    text-align: center;
    text-shadow: 0px 0px 53.6424px rgba(161, 224, 180, 0.5);
`;

const CurrentRoundText = styled.p`
    font-family: basis33 !important;
    font-weight: normal;
    font-size: 53.4351px;
    line-height: 64px;
    text-align: center;
`;

const CurrentRoundTitle = styled.p`
    font-family: SansationLight !important;
    font-style: normal;
    font-weight: 300;
    font-size: 20px;
    line-height: 22px;
    text-align: center;
    text-shadow: 0px 0px 53.6424px rgba(161, 224, 180, 0.5);
`;

const PrevRoundText = styled.p`
    font-family: basis33 !important;
    font-size: 25px;
    line-height: 25px;
    text-align: center;
    @media (max-width: 340px) {
        font-size: 23px;
        line-height: 23px;
    }
`;

const PrevRoundTitle = styled.p`
    font-family: SansationLight !important;
    font-style: normal;
    font-weight: 300;
    font-size: 20px;
    line-height: 22px;
    text-align: center;
    text-shadow: 0px 0px 53.6424px rgba(161, 224, 180, 0.5);
    font-family: Sansation Light;
    font-style: normal;
    margin-right: 5px;
`;

const LongButton = styled.button<{ selected?: boolean; notSelected?: boolean }>`
    position: absolute;
    top: 0;
    left: 50%;
    transform: ${(props) => (props.selected ? 'translate(-50%, -50%) scale(1.3)' : 'translate(-50%, -50%)')};
    transition: all 0.2s ease-in-out;
    width: 90px;
    height: 90px;
    border-radius: 50px;
    background: ${(props) => (props.notSelected ? '#b9c7c2' : '#59CDA3')};
    border: 5px solid ${(props) => (props.selected ? '#1A6658' : '#e5e5e5')};
    box-sizing: border-box;
    box-shadow: inset 0 4px 30px #137b9b;
    color: ${(props) => (props.selected ? '#1A6658' : '#e5e5e5')};
    font-size: 55px;
    cursor: pointer;
    line-height: 55px;
    filter: ${(props) => (props.selected ? 'drop-shadow(0px 0px 10px #54C7A2)' : '')};
    &:disabled {
        background: #b9c7c2;
        cursor: not-allowed;
    }
`;

const ShortButton = styled.button<{ selected?: boolean; notSelected?: boolean }>`
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: ${(props) => (props.selected ? 'translate(-50%, 50%) scale(1.3)' : 'translate(-50%, 50%)')};
    transition: all 0.2s ease-in-out;
    width: 90px;
    height: 90px;
    border-radius: 50px;
    background: ${(props) => (props.notSelected ? '#977980' : '#8e1d38')};
    border: ${(props) => (props.selected ? '5px solid #CA7070' : '5px solid #e5e5e5')};
    box-sizing: border-box;
    color: ${(props) => (props.selected ? '#1A6658' : '#e5e5e5')};
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    z-index: 100;
    filter: ${(props) => (props.selected ? 'drop-shadow(0px 0px 10px #CA7070)' : '')};
    &:disabled {
        background: #977980;
        cursor: not-allowed;
    }
`;

const Circle = styled.div<{ disabled?: boolean; selected?: boolean }>`
    width: 40px;
    height: 40px;
    border-radius: 50px;
    background: transparent;
    box-sizing: border-box;
    border: ${(props) => (props.selected ? '3px solid #CA7070' : '3px solid #e5e5e5')};
`;

const Button = styled.button`
    position: relative;
    align-items: center;
    cursor: pointer;
    display: flex;
    font-family: SansationLight !important;
    font-style: normal;
    font-weight: bold;
    font-size: 20px;
    line-height: 22px;
    background: var(--color);
    border: 1px solid var(--color);
    box-sizing: border-box;
    box-shadow: 0px 0px 30px rgba(161, 224, 180, 0.5);
    border-radius: 20px;
    padding: 6px 15px 6px 20px;
    color: var(--color-wrapper);
    &:disabled {
        opacity: 0.4;
        cursor: not-allowed;
    }
    margin-top: 10px;
`;

const RoundHistoryInfo = styled(FlexDivCentered)`
    flex-direction: column;
    > * {
        &:first-child {
            padding-bottom: 7px;
        }
    }
`;

const StyledInfoIcon = styled(InfoIcon)`
    position: absolute;
    width: 15px;
    height: 15px;
    top: -25px;
    left: 50%;
    transform: translateX(-50%);
    path {
        fill: var(--color);
    }
    opacity: 1;
    cursor: auto;
    @media (max-width: 1024px) {
        display: none;
    }
`;

const InfoSection = styled.div`
    color: var(--color);
    font-style: normal;
    font-weight: 300;
    font-size: 20px;
    line-height: 30px;
    padding-bottom: 1em;
    z-index: 1000;
    right: 30px;
    bottom: 30px;
    > * {
        &:first-child {
            justify-content: center;
        }
        margin-bottom: 0.1em;
        display: flex;
        justify-content: space-between;
        > * {
            font-family: SansationLight !important;
            &:nth-child(2),
            &:first-child {
                padding-right: 7px;
            }
            &:nth-child(2) {
                font-weight: bold;
                font-family: basis33 !important;
                font-size: 28px;
            }
            &:nth-child(4) {
                padding-left: 7px;
            }
        }
    }
    @media (min-width: 1025px) {
        display: none;
    }
`;
