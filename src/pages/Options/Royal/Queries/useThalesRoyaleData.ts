import { useQuery, UseQueryOptions } from 'react-query';
import QUERY_KEYS from 'constants/queryKeys';
import { ethers } from 'ethers';
import { parseBytes32String } from 'utils/formatters/ethers';
import snxJSConnector from 'utils/snxJSConnector';

export type ThalesRoyaleData = {
    season: number;
    players: [];
    alivePlayers: [];
    isPlayerAlive: boolean;
    hasParticipatedInCurrentOrLastRoyale: boolean;
    rounds: number;
    roundInASeason: number;
    targetPrice: string;
    roundChoosingLength: number;
    roundInASeasonStartTime: Date;
    roundInASeasonEndTime: Date;
    token: string;
    roundsInformation: RoundInformation[];
    royaleSeasonCreationTime: Date;
    royaleSeasonEndTime: Date;
    royaleSeasonStartedTime: Date;
    signUpPeriod: Date;
    canCloseRound: boolean;
    canStartRoyale: boolean;
    canStartNewSeason: boolean;
    priceFeedAddress: string;
    playerSignedUpPerSeason: boolean;
    rewardCollectedPerSeason: number;
    rewardPerWinnerPerSeason: number;
    rewardPerSeason: number;
    unclaimedRewardPerSeason: number;
    seasonStarted: boolean;
    seasonFinished: boolean;
};

type RoundInformation = {
    positionInRound: number;
    targetPriceInRound: string;
    finalPriceInRound: string;
    roundResultPerSeason: number;
};

const useThalesRoyaleData = (walletAddress: string, options?: UseQueryOptions<Map<number, ThalesRoyaleData>>) => {
    return useQuery<Map<number, ThalesRoyaleData>>(
        QUERY_KEYS.Royale.Data(walletAddress),
        async () => {
            console.log('Royale Data Query');
            const provider = new ethers.providers.Web3Provider((window as any).ethereum);
            const signer = provider.getSigner();
            const { thalesRoyaleContract } = snxJSConnector;
            const thalesRoyaleContractAddress = thalesRoyaleContract ? thalesRoyaleContract.address : '';
            const thalesRoyaleContractAbi = thalesRoyaleContract ? thalesRoyaleContract.abi : '';
            const RoyaleContract = new ethers.Contract(
                thalesRoyaleContractAddress,
                thalesRoyaleContractAbi,
                walletAddress ? signer : provider
            );
            const data = await getFromContract(RoyaleContract, walletAddress);
            return data;
        },
        {
            refetchInterval: 5000,
            ...options,
        }
    );
};

export default useThalesRoyaleData;

const getFromContract = async (RoyaleContract: ethers.Contract, walletAddress: string) => {
    const lastSeason = await RoyaleContract.season();
    const seasonsData = new Map<number, ThalesRoyaleData>();
    for (let i = lastSeason; i <= 1; i--) {
        const isPlayerAliveInSpecificSeason = walletAddress
            ? await RoyaleContract.isPlayerAliveInSpecificSeason(walletAddress, i)
            : false;
        const playerSignedUpPerSeason = walletAddress
            ? await RoyaleContract.playerSignedUpPerSeason(i, walletAddress)
            : false;
        const rewardCollectedPerSeason = walletAddress
            ? await RoyaleContract.rewardCollectedPerSeason(i, walletAddress)
            : false;
        const hasParticipatedInCurrentOrLastRoyale = walletAddress
            ? await RoyaleContract.hasParticipatedInCurrentOrLastRoyale(walletAddress)
            : false;
        const [
            players,
            alivePlayers,
            rounds,
            roundInASeason,
            targetPrice,
            roundChoosingLength,
            roundInASeasonStartTime,
            roundInASeasonEndTime,
            token,
            priceFeedAddress,
            royaleSeasonCreationTime,
            royaleSeasonEndTime,
            royaleSeasonStartedTime,
            signUpPeriod,
            canCloseRound,
            canStartRoyale,
            canStartNewSeason,
            rewardPerWinnerPerSeason,
            rewardPerSeason,
            unclaimedRewardPerSeason,
            seasonStarted,
            seasonFinished,
        ] = await Promise.all([
            RoyaleContract.getPlayers(),
            RoyaleContract.getAlivePlayers(),
            RoyaleContract.rounds(),
            RoyaleContract.roundInASeason(i),
            RoyaleContract.roundTargetPrice(),
            RoyaleContract.roundChoosingLength(),
            RoyaleContract.roundInASeasonStartTime(i),
            RoyaleContract.roundInSeasonEndTime(i),
            RoyaleContract.oracleKey(),
            RoyaleContract.priceFeed(),
            RoyaleContract.seasonCreationTime(i),
            RoyaleContract.royaleSeasonEndTime(i),
            RoyaleContract.seasonStartedTime(i),
            RoyaleContract.signUpPeriod(),
            RoyaleContract.canCloseRound(),
            RoyaleContract.canStartRoyale(),
            RoyaleContract.canStartNewSeason(),
            RoyaleContract.rewardPerWinnerPerSeason(i),
            RoyaleContract.rewardPerSeason(i),
            RoyaleContract.unclaimedRewardPerSeason(i),
            RoyaleContract.seasonStart(i),
            RoyaleContract.seasonFinished(i),
        ]);

        const roundsInformation = [];

        for (let j = 1; j <= Number(roundInASeason); j++) {
            let positionAInRoundPerSeason = undefined;
            if (walletAddress)
                positionAInRoundPerSeason = await RoyaleContract.positionInARoundPerSeason(i, walletAddress, j);

            const targetPriceInRound = await RoyaleContract.targetPricePerRoundPerSeason(i, j);
            const finalPriceInRound = await RoyaleContract.finalPricePerRoundPerSeason(i, j);
            const roundResultPerSeason = await RoyaleContract.roundResultPerSeason(i, j);

            roundsInformation.push({
                positionInRound: Number(positionAInRoundPerSeason ?? 0),
                targetPriceInRound: ethers.utils.formatEther(targetPriceInRound),
                finalPriceInRound: ethers.utils.formatEther(finalPriceInRound),
                roundResultPerSeason: Number(roundResultPerSeason ?? 0),
            });
        }

        seasonsData.set(i, {
            season: i,
            players,
            alivePlayers,
            isPlayerAlive: isPlayerAliveInSpecificSeason,
            hasParticipatedInCurrentOrLastRoyale,
            rounds: Number(rounds),
            roundInASeason: Number(roundInASeason),
            targetPrice: ethers.utils.formatEther(targetPrice),
            roundChoosingLength: Number(roundChoosingLength),
            roundInASeasonStartTime: new Date(Number(roundInASeasonStartTime) * 1000),
            roundInASeasonEndTime: new Date(Number(roundInASeasonEndTime) * 1000),
            token: parseBytes32String(token),
            roundsInformation,
            royaleSeasonCreationTime: new Date(Number(royaleSeasonCreationTime) * 1000),
            royaleSeasonEndTime: new Date(Number(royaleSeasonEndTime) * 1000),
            royaleSeasonStartedTime: new Date(Number(royaleSeasonStartedTime) * 1000),
            signUpPeriod: new Date((Number(royaleSeasonCreationTime) + Number(signUpPeriod)) * 1000),
            canCloseRound,
            canStartRoyale,
            canStartNewSeason,
            priceFeedAddress,
            playerSignedUpPerSeason,
            rewardCollectedPerSeason,
            rewardPerWinnerPerSeason,
            rewardPerSeason,
            unclaimedRewardPerSeason,
            seasonStarted,
            seasonFinished,
        });
    }

    return seasonsData;
};
