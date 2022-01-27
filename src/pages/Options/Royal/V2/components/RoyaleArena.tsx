import React, { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import addSeconds from 'date-fns/addSeconds';
import format from 'date-fns/format';
import differenceInSeconds from 'date-fns/differenceInSeconds';
import useInterval from '../../../../../hooks/useInterval';
import snxJSConnector from '../../../../../utils/snxJSConnector';
import { dispatchMarketNotification } from '../../../../../utils/options';
import { RoyaleTooltip } from '../../../Market/components';
import { FlexDiv, FlexDivCentered, Wrapper } from '../../../../../theme/common';
import { ReactComponent as InfoIcon } from '../../../../../assets/images/info.svg';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../../redux/rootReducer';
import { getNetworkId, getWalletAddress } from '../../../../../redux/modules/wallet';
import useRoundsQuery from '../../Queries/useRoundsQuery';
import { BigNumber } from 'ethers';
import winnerCard from '../../../../../assets/images/royale/winner-card.svg';
import winnerCardS2 from '../../../../../assets/images/royale/winner-card-s2.svg';
import useRoyaleArenaContractQuery, { RoyaleArenaData } from './queries/useRoyaleArenaContractQuery';
import { getIsAppReady } from '../../../../../redux/modules/app';
import { getIsOVM } from '../../../../../utils/network';
import usePlayerPositionsQuery from './queries/usePlayerPositionsQuery';

type RoyaleArenaProps = {
    latestSeason: number;
    selectedSeason: number;
    showBattle: boolean;
};

const renderRounds = (
    royaleData: RoyaleArenaData,
    timeLeftForPositioning: Date | null,
    timeLeftInRound: Date | null,
    selectedSeason: number
) => {
    const { t } = useTranslation();
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state));
    const { roundInASeason, rounds, token, targetPrice, isPlayerAlive } = royaleData;
    const cards = [];
    const networkId = useSelector((state: RootState) => getNetworkId(state));

    const roundsQuery = useRoundsQuery(selectedSeason, networkId, { enabled: networkId !== undefined });

    const roundsGraphInfo = roundsQuery.isSuccess ? roundsQuery.data : [];

    const positionsQuery = usePlayerPositionsQuery(0, networkId, walletAddress ?? '', {
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
            default:
                return winnerCardS2;
        }
    };

    const isWinner = isPlayerAlive && royaleData.seasonFinished;

    for (let index = 1; index <= rounds; index++) {
        index === roundInASeason
            ? cards.push(
                  <CurrentRound id={`round${index}`} key={index}>
                      <LongButton
                          selected={roundsInformation[index - 1]?.position === 2}
                          onClick={vote(2)}
                          disabled={!timeLeftForPositioning || !isPlayerAlive}
                          notSelected={roundsInformation[index - 1]?.position === 1}
                      >
                          △
                      </LongButton>
                      <div>
                          <CurrentRoundTitle>{t('options.royale.battle.round')}</CurrentRoundTitle>
                          <CurrentRoundText>{index}</CurrentRoundText>
                      </div>
                      <div style={{ marginTop: '10px' }}>
                          <CurrentRoundTitle>{`${t('options.royale.battle.will-be', { token })}`}</CurrentRoundTitle>
                          <CurrentRoundText>{`$${Number(targetPrice).toFixed(2)}`}</CurrentRoundText>
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
                          selected={roundsInformation[index - 1]?.position === 1}
                          onClick={vote(1)}
                          disabled={!timeLeftForPositioning || !isPlayerAlive}
                          notSelected={roundsInformation[index - 1]?.position === 2}
                      >
                          <Circle
                              selected={roundsInformation[index - 1]?.position === 1}
                              disabled={!timeLeftForPositioning || !isPlayerAlive}
                          />
                      </ShortButton>
                  </CurrentRound>
              )
            : index < roundInASeason
            ? cards.push(
                  <PrevRound id={`round${index}`} key={index}>
                      <LongButton selected={roundsInformation[index - 1]?.position === 2} disabled={true}>
                          △
                      </LongButton>
                      <div>
                          <RoundTitle>{t('options.royale.battle.round')}</RoundTitle>
                          <RoundText style={{ textDecoration: 'line-through' }}>{index}</RoundText>
                      </div>
                      <div style={{ textDecoration: 'line-through' }}>
                          <CurrentRoundTitle>{`${token} ${t('options.royale.battle.will-be')}`}</CurrentRoundTitle>
                          <CurrentRoundText>{`$${Number(roundsInformation[index - 1]?.strikePrice).toFixed(
                              2
                          )}`}</CurrentRoundText>
                      </div>
                      <RoundHistoryInfo>
                          <FlexDiv>
                              <PrevRoundTitle>{`${token} ${t('options.royale.battle.was')}`}</PrevRoundTitle>
                              <PrevRoundText>{`$${Number(roundsInformation[index - 1]?.finalPrice).toFixed(
                                  2
                              )}`}</PrevRoundText>
                          </FlexDiv>
                          <FlexDiv>
                              <PrevRoundTitle>{`${t('options.royale.battle.eliminated')}`}</PrevRoundTitle>
                              <PrevRoundText>{`${roundsInformation[index - 1]?.eliminatedPerRoundPerSeason || 0}/${
                                  roundsInformation[index - 1]?.totalPlayersPerRoundPerSeason || 0
                              } ${t('options.royale.battle.players')}`}</PrevRoundText>
                          </FlexDiv>
                      </RoundHistoryInfo>
                      <ShortButton selected={roundsInformation[index - 1]?.position === 1} disabled={true}>
                          <Circle
                              selected={roundsInformation[index - 1]?.position === 1}
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

export const getTimeLeft = (startTime: Date, roundLengthInSeconds: number) => {
    const beginningOfTime = new Date(0);
    beginningOfTime.setHours(0);
    const roundEndTime = addSeconds(startTime, roundLengthInSeconds);
    const timeDifferenceInSeconds = differenceInSeconds(roundEndTime, new Date());
    if (timeDifferenceInSeconds <= 0) {
        return null;
    }
    beginningOfTime.setSeconds(beginningOfTime.getSeconds() + timeDifferenceInSeconds);
    return beginningOfTime;
};

export const RoyaleArena: React.FC<RoyaleArenaProps> = ({ showBattle, selectedSeason, latestSeason }) => {
    const { t } = useTranslation();
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state));
    const isL2 = getIsOVM(networkId);

    const memoizedSelectedSeason = useMemo(() => selectedSeason || latestSeason, [latestSeason, selectedSeason]);

    const royaleDataQuery = useRoyaleArenaContractQuery(memoizedSelectedSeason, walletAddress ?? '', {
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
                            renderRounds(royaleData, timeLeftForPositioning, timeLeftInRound, memoizedSelectedSeason)
                        ) : (
                            <></>
                        )}
                    </ScrollWrapper>
                </CardWrapper>
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
                        onClick={claimReward}
                    >
                        Claim reward
                    </Button>
                ) : (
                    <Button style={{ zIndex: 1000 }} disabled={!canCloseRound} onClick={closeRound}>
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
    background: ${(props) => (props.notSelected ? '#b9c7c2' : '#59cda3')};
    border: 5px solid #e5e5e5;
    box-sizing: border-box;
    box-shadow: inset 0 4px 30px #137b9b;
    color: white;
    font-size: 55px;
    cursor: pointer;
    line-height: 55px;
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
    border: ${(props) => (props.selected ? '4px solid #e5e5e5' : '5px solid #e5e5e5')};
    box-sizing: border-box;
    color: white;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    z-index: 100;
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
    border: ${(props) => (props.selected ? '4px solid #e5e5e5' : '4px solid #e5e5e5')};
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
