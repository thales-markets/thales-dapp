import React from 'react';
import styled from 'styled-components';
import { ThalesRoyalData } from '../../getThalesRoyalData';

type BattleRoyaleProps = {
    royaleData: ThalesRoyalData;
};

const BattleRoyale: React.FC<BattleRoyaleProps> = ({ royaleData }) => {
    return (
        <>
            <CardWrapper>{royaleData ? renderRounds(royaleData.rounds, royaleData.round) : <></>}</CardWrapper>
        </>
    );
};

const CardWrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: flex-start;
    width: 100%;
    overflow: hidden;
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
`;

const CurrentRound = styled(Card)`
    background: linear-gradient(180.36deg, #04045a -25.81%, #030344 52.02%, #000000 153.83%);
    box-shadow: 0px 0px 80.4482px rgba(161, 225, 180, 0.8);
    color: #64d9fe;
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

const renderRounds = (rounds: number, _current: number) => {
    const cards = [];
    for (let index = 1; index <= rounds; index++) {
        index === 2
            ? cards.push(
                  <CurrentRound key={index}>
                      <RoundTitle>Round</RoundTitle>
                      <RoundText>{index}</RoundText>
                  </CurrentRound>
              )
            : index < 2
            ? cards.push(
                  <PrevRound key={index}>
                      <RoundTitle>Round</RoundTitle>
                      <RoundText style={{ textDecoration: 'line-through' }}>{index}</RoundText>
                  </PrevRound>
              )
            : cards.push(
                  <NextRound key={index}>
                      <RoundTitle>Round</RoundTitle>
                      <RoundText>{index}</RoundText>
                  </NextRound>
              );
    }
    return cards;
};

export default BattleRoyale;
