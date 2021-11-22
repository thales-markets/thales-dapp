import { useQuery, UseQueryOptions } from 'react-query';
import QUERY_KEYS from 'constants/queryKeys';
import { ethers } from 'ethers';
import thalesRoyal from 'utils/contracts/thalesRoyalContract';
import { parseBytes32String } from 'utils/formatters/ethers';

export type ThalesRoyalData = {
    players: [];
    alivePlayers: [];
    isPlayerAlive: boolean;
    rounds: number;
    round: number;
    targetPrice: string;
    roundChoosingLength: number;
    roundStartTime: Date;
    roundEndTime: Date;
    token: string;
    roundsInformation: RoundInformation[];
    creationTime: Date;
    signUpPeriod: Date;
    canCloseRound: boolean;
    canStartRoyale: boolean;
    priceFeedAddress: string;
};

type RoundInformation = {
    finalPriceInRound: string;
    positionInRound: number;
    targetPriceInRound: string;
};

const useThalesRoyaleData = (walletAddress: string, options?: UseQueryOptions<ThalesRoyalData>) => {
    return useQuery<ThalesRoyalData>(
        QUERY_KEYS.Royale.Data(walletAddress),
        async () => {
            console.log('Royale Data Query');
            const provider = new ethers.providers.Web3Provider((window as any).ethereum);
            const signer = provider.getSigner();
            const RoyalContract = new ethers.Contract(
                thalesRoyal.address,
                thalesRoyal.abi,
                walletAddress ? signer : provider
            );
            const data = await getFromContract(RoyalContract, walletAddress);
            return data;
        },
        {
            refetchInterval: 5000,
            ...options,
        }
    );
};

export default useThalesRoyaleData;

const getFromContract = async (RoyalContract: ethers.Contract, walletAddress: string) => {
    const isPlayerAlive = walletAddress ? await RoyalContract.isPlayerAlive(walletAddress) : false;
    const [
        players,
        alivePlayers,
        rounds,
        round,
        targetPrice,
        roundChoosingLength,
        roundStartTime,
        roundEndTime,
        token,
        priceFeedAddress,
        creationTime,
        signUpPeriod,
        canCloseRound,
        canStartRoyale,
    ] = await Promise.all([
        RoyalContract.getPlayers(),
        RoyalContract.getAlivePlayers(),
        RoyalContract.rounds(),
        RoyalContract.round(),
        RoyalContract.roundTargetPrice(),
        RoyalContract.roundChoosingLength(),
        RoyalContract.roundStartTime(),
        RoyalContract.roundEndTime(),
        RoyalContract.oracleKey(),
        RoyalContract.priceFeed(),
        RoyalContract.creationTime(),
        RoyalContract.signUpPeriod(),
        RoyalContract.canCloseRound(),
        RoyalContract.canStartRoyale(),
    ]);

    const roundsInformation = [];

    for (let i = 1; i <= Number(round); i++) {
        let positionInRound = undefined;
        if (walletAddress) positionInRound = await RoyalContract.positionInARound(walletAddress, i);

        const targetPriceInRound = await RoyalContract.targetPricePerRound(i);
        const finalPriceInRound = await RoyalContract.finalPricePerRound(i);
        roundsInformation.push({
            positionInRound: Number(positionInRound ?? 0),
            targetPriceInRound: ethers.utils.formatEther(targetPriceInRound),
            finalPriceInRound: ethers.utils.formatEther(finalPriceInRound),
        });
    }

    return {
        players,
        alivePlayers,
        isPlayerAlive,
        rounds: Number(rounds),
        round: Number(round),
        targetPrice: ethers.utils.formatEther(targetPrice),
        roundChoosingLength: Number(roundChoosingLength),
        roundStartTime: new Date(Number(roundStartTime) * 1000),
        roundEndTime: new Date(Number(roundEndTime) * 1000),
        token: parseBytes32String(token),
        roundsInformation,
        creationTime: new Date(Number(creationTime) * 1000),
        signUpPeriod: new Date((Number(creationTime) + Number(signUpPeriod)) * 1000),
        canCloseRound,
        priceFeedAddress,
        canStartRoyale,
    };
};
