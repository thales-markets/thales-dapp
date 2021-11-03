import React from 'react';
import styled from 'styled-components';
import { ThalesRoyalData } from '../../getThalesRoyalData';
import { useTranslation } from 'react-i18next';

type BattleRoyaleProps = {
    royaleData: ThalesRoyalData;
};

const renderRounds = ({ rounds, token, targetPrice }: { rounds: number; token: string; targetPrice: string }) => {
    const { t } = useTranslation();
    const cards = [];
    for (let index = 1; index <= rounds; index++) {
        index === 2
            ? cards.push(
                  <CurrentRound key={index}>
                      <LongButton>△</LongButton>
                      <div>
                          <CurrentRoundTitle>{t('options.royale.battle.round')}</CurrentRoundTitle>
                          <CurrentRoundText>{index}</CurrentRoundText>
                      </div>
                      <div>
                          <CurrentRoundTitle>{`${token} ${t('options.royale.battle.will-be')}`}</CurrentRoundTitle>
                          <CurrentRoundText>{`${targetPrice}$`}</CurrentRoundText>
                          <CurrentRoundText>
                              <StyledMonkey>@</StyledMonkey>
                              {`11.11.21.`}
                          </CurrentRoundText>
                      </div>
                      <div>
                          <CurrentRoundTitle>{t('options.royale.battle.time-left')}</CurrentRoundTitle>
                          <CurrentRoundText>8:12:11</CurrentRoundText>
                      </div>
                      <ShortButton>
                          <Circle />
                      </ShortButton>
                  </CurrentRound>
              )
            : index < 2
            ? cards.push(
                  <PrevRound key={index}>
                      <RoundTitle>{t('options.royale.battle.round')}</RoundTitle>
                      <RoundText style={{ textDecoration: 'line-through' }}>{index}</RoundText>
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

const BattleRoyale: React.FC<BattleRoyaleProps> = ({ royaleData }) => {
    console.log(royaleData);
    return (
        <>
            <CardWrapper>{royaleData ? renderRounds(royaleData) : <></>}</CardWrapper>
        </>
    );
};

const CardWrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: flex-start;
    width: 100%;
    overflow: hidden;
    padding: 75px 0;
`;

const Card = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-evenly;
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
    justify-content: center;
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

const StyledMonkey = styled.span`
    font-family: SansationLight !important;
    font-style: normal;
    font-weight: 300;
    font-size: 25px;
    line-height: 22px;
    padding-right: 5px;
`;

const LongButton = styled.button`
    position: absolute;
    top: 0;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 90px;
    height: 90px;
    border-radius: 50px;
    background: #59cda3;
    border: 5px solid #e5e5e5;
    box-sizing: border-box;
    box-shadow: inset 0 4px 30px #137b9b;
    color: white;
    font-size: 55px;
    cursor: pointer;
`;

const ShortButton = styled.button`
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translate(-50%, 50%);
    width: 90px;
    height: 90px;
    border-radius: 50px;
    background: #8e1d38;
    border: 5px solid #e5e5e5;
    box-sizing: border-box;
    color: white;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
`;

const Circle = styled.div`
    width: 40px;
    height: 40px;
    border-radius: 50px;
    background: #8e1d38;
    border: 4px solid #e5e5e5;
    box-sizing: border-box;
    color: white;
`;

export default BattleRoyale;
