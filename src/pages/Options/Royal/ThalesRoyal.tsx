import ROUTES from 'constants/routes';
import React, { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { getNetworkId, getWalletAddress } from 'redux/modules/wallet';
import { RootState } from 'redux/rootReducer';
import styled from 'styled-components';
import { Background, Button, Text, Wrapper } from 'theme/common';
import MarketHeader from '../Home/MarketHeader';
import { getThalesRoyalData, ThalesRoyalData } from './getThalesRoyalData';

const ThalesRoyal: React.FC = () => {
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state));
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const [thalesRoyalData, setData] = useState<undefined | ThalesRoyalData>(undefined);

    useMemo(async () => {
        if (walletAddress && networkId === 69) {
            setData(await getThalesRoyalData());
        }
    }, [walletAddress, networkId]);

    return (
        <Background>
            <Wrapper>
                <MarketHeader route={ROUTES.Options.Royal} />
                <Button className="primary">Sign up</Button>
                <ul>
                    <Text className="text-m white bold">Participants: </Text>
                    {thalesRoyalData?.players.map((player: any, key: any) => (
                        <li key={key}>
                            <Text className="text-ms white">{player}</Text>
                        </li>
                    ))}
                </ul>

                <Text className="text-m white">
                    Alive players:{' '}
                    {thalesRoyalData
                        ? thalesRoyalData.alivePlayers.length + ' / ' + thalesRoyalData.players.length
                        : 0 + ' / ' + 0}
                </Text>

                <Text className="text-m white">
                    Round: {thalesRoyalData ? thalesRoyalData.round + ' / ' + thalesRoyalData.rounds : 0 + ' / ' + 0}{' '}
                </Text>
                <CardWrapper>
                    {thalesRoyalData ? renderRounds(thalesRoyalData.rounds, thalesRoyalData.round) : <></>}
                </CardWrapper>
            </Wrapper>
        </Background>
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
                  <CurrentRound>
                      <RoundTitle>Round</RoundTitle>
                      <RoundText>{index}</RoundText>
                  </CurrentRound>
              )
            : index < 2
            ? cards.push(
                  <PrevRound>
                      <RoundTitle>Round</RoundTitle>
                      <RoundText style={{ textDecoration: 'line-through' }}>{index}</RoundText>
                  </PrevRound>
              )
            : cards.push(
                  <NextRound>
                      <RoundTitle>Round</RoundTitle>
                      <RoundText>{index}</RoundText>
                  </NextRound>
              );
    }
    return cards;
};

export default ThalesRoyal;
