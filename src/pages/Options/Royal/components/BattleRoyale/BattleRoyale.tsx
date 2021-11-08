import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import format from 'date-fns/format';
import addSeconds from 'date-fns/addSeconds';
import differenceInSeconds from 'date-fns/differenceInSeconds';
import { ThalesRoyalData } from '../../getThalesRoyalData';
import useInterval from '../../../../../hooks/useInterval';
import { Button } from '../../../../../theme/common';
import { BigNumber, ethers } from 'ethers';
import thalesRoyal from '../../../../../utils/contracts/thalesRoyalContract';
import { dispatchMarketNotification } from '../../../../../utils/options';

type BattleRoyaleProps = {
    royaleData: ThalesRoyalData;
    setFetchNewData: (id: number) => void;
};

const getTimeLeft = (startTime: Date, roundLengthInSeconds: number) => {
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
    setFetchNewData: (id: number) => void,
    timeLeftForPositioning: Date | null,
    timeLeftInRound: Date | null
) => {
    const { t } = useTranslation();
    const { round, rounds, token, targetPrice, roundsInformation, isPlayerAlive } = royaleData;
    const cards = [];

    useEffect(() => {
        const wrapper = document.getElementById('battle-royale-wrapper');
        if (wrapper && round > 2) {
            wrapper.scrollLeft = (round - 2) * 367;
        }
    }, [round]);

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
            setFetchNewData(Date.now());
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
                      <div>
                          <CurrentRoundTitle>{`${t('options.royale.battle.will-be', { token })}`}</CurrentRoundTitle>
                          <CurrentRoundText>{`${targetPrice}$`}</CurrentRoundText>
                      </div>
                      <div>
                          <CurrentRoundTitle>{t('options.royale.battle.time-left-for-positioning')}</CurrentRoundTitle>
                          <CurrentRoundText>
                              {timeLeftForPositioning ? format(timeLeftForPositioning, 'HH:mm:ss') : 'Ended'}
                          </CurrentRoundText>
                      </div>
                      <div>
                          <CurrentRoundTitle>{t('options.royale.battle.time-left-in-round')}</CurrentRoundTitle>
                          <CurrentRoundText>
                              {timeLeftInRound ? format(timeLeftInRound, 'HH:mm:ss') : 'Ended'}
                          </CurrentRoundText>
                      </div>
                      <ShortButton
                          selected={roundsInformation[index - 1].positionInRound === 1}
                          onClick={vote(1)}
                          disabled={!timeLeftForPositioning || !isPlayerAlive}
                      >
                          <Circle disabled={!timeLeftForPositioning || !isPlayerAlive} />
                      </ShortButton>
                  </CurrentRound>
              )
            : index < round
            ? cards.push(
                  <PrevRound key={index}>
                      <LongButton selected={roundsInformation[index - 1].positionInRound === 2} disabled={true}>
                          △
                      </LongButton>
                      <RoundTitle>{t('options.royale.battle.round')}</RoundTitle>
                      <RoundText style={{ textDecoration: 'line-through' }}>{index}</RoundText>
                      <div>
                          <CurrentRoundTitle>{`${token} ${t('options.royale.battle.will-be')}`}</CurrentRoundTitle>
                          <CurrentRoundText>{`${roundsInformation[index - 1].targetPriceInRound}$`}</CurrentRoundText>
                      </div>
                      <ShortButton selected={roundsInformation[index - 1].positionInRound === 1} disabled={true}>
                          <Circle disabled={!timeLeftForPositioning || !isPlayerAlive} />
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

const BattleRoyale: React.FC<BattleRoyaleProps> = ({ royaleData, setFetchNewData }) => {
    const { t } = useTranslation();
    const { roundStartTime, roundEndTime, roundChoosingLength } = royaleData;

    const [timeLeftForPositioning, setTimeLeftForPositioning] = useState<Date | null>(
        getTimeLeft(roundStartTime, roundChoosingLength)
    );
    const [timeLeftInRound, setTimeLeftInRound] = useState<Date | null>(
        getTimeLeft(roundStartTime, (roundEndTime.getTime() - roundStartTime.getTime()) / 1000)
    );
    const [closeRoundButtonDisabled, setCloseRoundButtonDisabled] = useState<boolean>(
        new Date().getTime() < roundEndTime.getTime()
    );

    useInterval(async () => {
        setTimeLeftForPositioning(getTimeLeft(roundStartTime, roundChoosingLength));
        setTimeLeftInRound(getTimeLeft(roundStartTime, (roundEndTime.getTime() - roundStartTime.getTime()) / 1000));
        setCloseRoundButtonDisabled(new Date().getTime() < roundEndTime.getTime());
    }, 1000);

    const closeRound = async () => {
        const provider = new ethers.providers.Web3Provider((window as any).ethereum);
        const signer = provider.getSigner();
        const RoyalContract = new ethers.Contract(thalesRoyal.address, thalesRoyal.abi, signer);

        const tx = await RoyalContract.closeRound();

        const txResult = await tx.wait();

        if (txResult && txResult.events) {
            dispatchMarketNotification('Round closed');
            setFetchNewData(Date.now());
        }
    };

    return (
        <>
            <CardWrapper id="battle-royale-wrapper">
                {royaleData ? (
                    renderRounds(royaleData, setFetchNewData, timeLeftForPositioning, timeLeftInRound)
                ) : (
                    <></>
                )}
            </CardWrapper>
            <Button
                style={{ zIndex: 1000 }}
                disabled={closeRoundButtonDisabled}
                className="primary"
                onClick={closeRound}
            >
                {t('options.royale.battle.close-round')}
            </Button>
        </>
    );
};

const CardWrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: flex-start;
    width: 100%;
    overflow: hidden;
    padding: 75px 0 75px 90px;
`;

const Card = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-width: 339px;
    height: 504px;
    border: 4.36032px solid #64d9fe;
    box-sizing: border-box;
    border-radius: 4.36032px;
    margin: 15px;
    padding: 50px 0;
    position: relative;
`;

const CurrentRound = styled(Card)`
    background: linear-gradient(180.36deg, #04045a -25.81%, #030344 52.02%, #000000 153.83%);
    box-shadow: 0px 0px 80.4482px rgba(161, 225, 180, 0.8);
    color: #64d9fe;
    justify-content: space-evenly;
`;

const PrevRound = styled(Card)`
    filter: drop-shadow(0px 0px 80.4482px rgba(161, 225, 180, 0.8));
    opacity: 0.15;
    color: #64d9fe;
`;

const NextRound = styled(Card)`
    background: #64d9fe;
    border: 4.36032px solid #64d9fe;
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
    line-height: 90px;
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
    border: 4px solid #e5e5e5;
    box-sizing: border-box;
    color: ${(props) => (props.selected ? '#e5e5e5' : 'white')};
`;

export default BattleRoyale;
