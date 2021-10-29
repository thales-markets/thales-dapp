import ROUTES from 'constants/routes';
import { ethers } from 'ethers';
import React, { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { getNetworkId, getWalletAddress } from 'redux/modules/wallet';
import { RootState } from 'redux/rootReducer';
import { Background, Button, Text, Wrapper } from 'theme/common';
import thalesRoyal from 'utils/contracts/thalesRoyalContract';
import MarketHeader from '../Home/MarketHeader';

const ThalesRoyal: React.FC = () => {
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state));
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const [players, setPlayers] = useState([]);
    const [alivePlayers, setAlivePlayers] = useState([]);
    const [currentRound, setCurrentRound] = useState(0);
    const [rounds, setRounds] = useState(0);
    const thalesRoyalContract = useMemo(() => {
        if (walletAddress && networkId === 69) {
            const provider = new ethers.providers.Web3Provider((window as any).ethereum);
            const signer = provider.getSigner();
            const RoyalContract = new ethers.Contract(thalesRoyal.address, thalesRoyal.abi, signer);
            signer.getBalance().then((data: any) => console.log(ethers.utils.formatEther(data)));
            return RoyalContract;
        }
    }, [walletAddress, networkId]);

    useMemo(async () => {
        if (thalesRoyalContract) {
            console.log(thalesRoyalContract);
            setPlayers(await thalesRoyalContract.getPlayers());
            setAlivePlayers(await thalesRoyalContract.getAlivePlayers());
            setRounds(Number(await thalesRoyalContract.rounds()));
            setCurrentRound(Number(await thalesRoyalContract.round()));
        }
    }, [thalesRoyalContract]);

    const signUp = async (RoyalContract: any) => {
        const tx = await RoyalContract.signUp();
        tx.wait().then(async () => {
            setPlayers(await RoyalContract.getPlayers());
            setAlivePlayers(await RoyalContract.getAlivePlayers());
        });
    };

    return (
        <Background>
            <Wrapper>
                <MarketHeader route={ROUTES.Options.Royal} />
                <Button className="primary" onClick={signUp.bind(this, thalesRoyalContract)}>
                    Sign up
                </Button>
                <ul>
                    <Text className="text-m white bold">Participants: </Text>
                    {players.map((player: any, key: any) => (
                        <li key={key}>
                            <Text className="text-ms white">{player}</Text>
                        </li>
                    ))}
                </ul>

                <Text className="text-m white">
                    Alive players: {alivePlayers.length} / {players.length}
                </Text>

                <Text className="text-m white">
                    Round: {currentRound} / {rounds}
                </Text>
            </Wrapper>
        </Background>
    );
};

export default ThalesRoyal;
