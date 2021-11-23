import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import format from 'date-fns/format';
import addSeconds from 'date-fns/addSeconds';
import differenceInSeconds from 'date-fns/differenceInSeconds';
import useInterval from '../../../../../hooks/useInterval';
import { BigNumber, ethers } from 'ethers';
import thalesRoyal from '../../../../../utils/contracts/thalesRoyalContract';
import { dispatchMarketNotification } from '../../../../../utils/options';
import { FlexDiv, FlexDivCentered, Wrapper } from '../../../../../theme/common';
import useRoundsQuery from '../../Queries/useRoundsQuery';
import { useSelector } from 'react-redux';
import { RootState } from 'redux/rootReducer';
import { getNetworkId } from 'redux/modules/wallet';
import { ThalesRoyalData } from '../../Queries/useThalesRoyaleData';

type BattleRoyaleProps = {
    royaleData: ThalesRoyalData;
    showBattle: boolean;
};

const getOnArrowClick = (scrollAmount: number) => () => {
    const wrapper = document.getElementById('battle-royale-wrapper');
    if (wrapper) {
        wrapper.scrollTo({
            top: 0,
            left: wrapper.scrollLeft + scrollAmount,
            behavior: 'smooth',
        });
    }
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

const renderRounds = (
    royaleData: ThalesRoyalData,
    timeLeftForPositioning: Date | null,
    timeLeftInRound: Date | null
) => {
    const { t } = useTranslation();
    const { round, rounds, token, targetPrice, roundsInformation, isPlayerAlive } = royaleData;
    const cards = [];
    const networkId = useSelector((state: RootState) => getNetworkId(state));

    const roundsQuery = useRoundsQuery(networkId, { enabled: networkId !== undefined });

    const roundsGraphInfo = roundsQuery.isSuccess ? roundsQuery.data : [];

    const vote = (option: number) => async () => {
        if (option === roundsInformation[round - 1].positionInRound) {
            return;
        }
        const provider = new ethers.providers.Web3Provider((window as any).ethereum);
        const signer = provider.getSigner();
        const RoyalContract = new ethers.Contract(thalesRoyal.address, thalesRoyal.abi, signer);

        const tx = await RoyalContract.takeAPosition(BigNumber.from(option));

        const txResult = await tx.wait();

        if (txResult && txResult.events) {
            dispatchMarketNotification('Successfully submitted');
        }
    };

    for (let index = 1; index <= rounds; index++) {
        index === round
            ? cards.push(
                  <CurrentRound key={index}>
                      <LongButton
                          selected={roundsInformation[index - 1].positionInRound === 2}
                          onClick={vote(2)}
                          disabled={!timeLeftForPositioning || !isPlayerAlive}
                      >
                          △
                      </LongButton>
                      <div>
                          <CurrentRoundTitle>{t('options.royale.battle.round')}</CurrentRoundTitle>
                          <CurrentRoundText>{index}</CurrentRoundText>
                      </div>
                      <div style={{ marginTop: '25px' }}>
                          <CurrentRoundTitle>{`${t('options.royale.battle.will-be', { token })}`}</CurrentRoundTitle>
                          <CurrentRoundText>{`${targetPrice}$`}</CurrentRoundText>
                      </div>
                      <div style={{ marginBottom: '25px' }}>
                          <CurrentRoundTitle>{t('options.royale.battle.in')}</CurrentRoundTitle>
                          <CurrentRoundText>
                              {timeLeftInRound ? format(timeLeftInRound, 'HH:mm:ss') : 'Ended'}
                          </CurrentRoundText>
                      </div>
                      <div>
                          <CurrentRoundTitle>{t('options.royale.battle.time-left-for-positioning')}</CurrentRoundTitle>
                          <CurrentRoundText>
                              {timeLeftForPositioning ? format(timeLeftForPositioning, 'HH:mm:ss') : 'Ended'}
                          </CurrentRoundText>
                      </div>
                      <ShortButton
                          selected={roundsInformation[index - 1].positionInRound === 1}
                          onClick={vote(1)}
                          disabled={!timeLeftForPositioning || !isPlayerAlive}
                      >
                          <Circle
                              selected={roundsInformation[index - 1].positionInRound === 1}
                              disabled={!timeLeftForPositioning || !isPlayerAlive}
                          />
                      </ShortButton>
                  </CurrentRound>
              )
            : index < round
            ? cards.push(
                  <PrevRound key={index}>
                      <LongButton selected={roundsInformation[index - 1].positionInRound === 2} disabled={true}>
                          △
                      </LongButton>
                      <div>
                          <RoundTitle>{t('options.royale.battle.round')}</RoundTitle>
                          <RoundText style={{ textDecoration: 'line-through' }}>{index}</RoundText>
                      </div>
                      <div style={{ textDecoration: 'line-through' }}>
                          <CurrentRoundTitle>{`${token} ${t('options.royale.battle.will-be')}`}</CurrentRoundTitle>
                          <CurrentRoundText>{`${roundsInformation[index - 1].targetPriceInRound}$`}</CurrentRoundText>
                      </div>
                      <RoundHistoryInfo>
                          <FlexDiv>
                              <PrevRoundTitle>{`${token} ${t('options.royale.battle.was')}`}</PrevRoundTitle>
                              <PrevRoundText>{`${roundsInformation[index - 1].finalPriceInRound}$`}</PrevRoundText>
                          </FlexDiv>
                          <FlexDiv>
                              <PrevRoundTitle>{`${t('options.royale.battle.eliminated')}`}</PrevRoundTitle>
                              <PrevRoundText>{`${roundsGraphInfo[index - 1]?.eliminatedPerRound || 0}/${
                                  roundsGraphInfo[index - 1]?.totalPlayersPerRound || 0
                              } ${t('options.royale.battle.players')}`}</PrevRoundText>
                          </FlexDiv>
                      </RoundHistoryInfo>
                      <ShortButton selected={roundsInformation[index - 1].positionInRound === 1} disabled={true}>
                          <Circle
                              selected={roundsInformation[index - 1].positionInRound === 1}
                              disabled={!timeLeftForPositioning || !isPlayerAlive}
                          />
                      </ShortButton>
                  </PrevRound>
              )
            : cards.push(
                  <NextRound key={index}>
                      <RoundTitle>{t('options.royale.battle.round')}</RoundTitle>
                      <RoundText>{index}</RoundText>
                  </NextRound>
              );
    }
    return cards;
};

const BattleRoyale: React.FC<BattleRoyaleProps> = ({ royaleData, showBattle }) => {
    const { t } = useTranslation();
    const { roundStartTime, roundEndTime, roundChoosingLength, round, canCloseRound } = royaleData;

    const [timeLeftForPositioning, setTimeLeftForPositioning] = useState<Date | null>(
        getTimeLeft(roundStartTime, roundChoosingLength)
    );
    const [timeLeftInRound, setTimeLeftInRound] = useState<Date | null>(
        getTimeLeft(roundStartTime, (roundEndTime.getTime() - roundStartTime.getTime()) / 1000)
    );

    useInterval(async () => {
        setTimeLeftForPositioning(getTimeLeft(roundStartTime, roundChoosingLength));
        setTimeLeftInRound(getTimeLeft(roundStartTime, (roundEndTime.getTime() - roundStartTime.getTime()) / 1000));
    }, 1000);

    const closeRound = async () => {
        const provider = new ethers.providers.Web3Provider((window as any).ethereum);
        const signer = provider.getSigner();
        const RoyalContract = new ethers.Contract(thalesRoyal.address, thalesRoyal.abi, signer);

        const tx = await RoyalContract.closeRound();

        const txResult = await tx.wait();

        if (txResult && txResult.events) {
            dispatchMarketNotification('Round closed');
        }
    };

    useEffect(() => {
        const wrapper = document.getElementById('battle-royale-wrapper');
        if (wrapper && round > 2) {
            wrapper.scrollTo({
                top: 0,
                left: (round - 2) * 362 - 45,
                behavior: 'smooth',
            });
        }
    }, [round, showBattle]);

    return (
        <Wrapper style={{ minHeight: '100%', justifyContent: 'center' }} className="battle">
            <ArrowLeft onMouseDown={getOnArrowClick(-680)} className="icon icon--left" />
            <CardWrapper>
                <ScrollWrapper id="battle-royale-wrapper">
                    {royaleData ? renderRounds(royaleData, timeLeftForPositioning, timeLeftInRound) : <></>}
                </ScrollWrapper>
            </CardWrapper>
            <ArrowRight onMouseDown={getOnArrowClick(680)} className="icon icon--right" />
            <Button style={{ zIndex: 1000 }} disabled={!canCloseRound} onClick={closeRound}>
                {t('options.royale.battle.close-round')}
            </Button>
        </Wrapper>
    );
};

const ArrowLeft = styled.i`
    position: absolute;
    left: 90px;
    top: 50%;
    transform: translateY(-50%);
    cursor: pointer;
    font-size: 50px;
`;

const ArrowRight = styled.i`
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    cursor: pointer;
    font-size: 50px;
`;

const ScrollWrapper = styled.div`
    display: flex;
    height: 680px;
    align-items: center;
    overflow: auto;
    height: 100%;
    margin-bottom: -40px;
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
    min-width: 339px;
    height: 504px;
    border: 4.36032px solid var(--color);
    box-sizing: border-box;
    border-radius: 4.36032px;
    margin: 15px;
    padding: 50px 0;
    position: relative;
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
    font-family: VT323 !important;
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
    font-family: VT323 !important;
    font-weight: normal;
    font-size: 53.4351px;
    line-height: 53px;
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
    font-family: VT323 !important;
    font-size: 34px;
    line-height: 22px;
    text-align: center;
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

const LongButton = styled.button<{ selected?: boolean }>`
    position: absolute;
    top: 0;
    left: 50%;
    transform: ${(props) => (props.selected ? 'translate(-50%, -50%) scale(1.3)' : 'translate(-50%, -50%)')};
    transition: all 0.2s ease-in-out;
    width: 90px;
    height: 90px;
    border-radius: 50px;
    background: #59cda3;
    border: ${(props) => (props.selected ? '5px solid #59cda3' : '5px solid #e5e5e5')};
    box-sizing: border-box;
    box-shadow: inset 0 4px 30px #137b9b;
    color: ${(props) => (props.selected ? '#59cda3' : 'white')};
    font-size: 55px;
    cursor: pointer;
    line-height: 55px;
    &:disabled {
        background: #b9c7c2;
        cursor: not-allowed;
    }
`;

const ShortButton = styled.button<{ selected?: boolean }>`
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: ${(props) => (props.selected ? 'translate(-50%, 50%) scale(1.3)' : 'translate(-50%, 50%)')};
    transition: all 0.2s ease-in-out;
    width: 90px;
    height: 90px;
    border-radius: 50px;
    background: #8e1d38;
    border: ${(props) => (props.selected ? '5px solid #c92d52' : '5px solid #e5e5e5')};
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
    border: ${(props) => (props.selected ? '4px solid #c92d52' : '4px solid #e5e5e5')};
`;

const Button = styled.button`
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
`;

const RoundHistoryInfo = styled(FlexDivCentered)`
    flex-direction: column;
    > * {
        &:first-child {
            padding-bottom: 7px;
        }
    }
`;

export default BattleRoyale;
