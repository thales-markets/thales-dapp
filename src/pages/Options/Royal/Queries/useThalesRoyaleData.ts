import { useQuery, UseQueryOptions } from 'react-query';
import QUERY_KEYS from 'constants/queryKeys';
import { ethers } from 'ethers';
import { parseBytes32String } from 'utils/formatters/ethers';
import snxJSConnector from 'utils/snxJSConnector';

export type ThalesRoyaleData = {
    season: number;
    players: [];
    isPlayerAlive: boolean;
    hasParticipatedInCurrentOrLastRoyale: boolean;
    rounds: number;
    buyInAmount: number;
    roundInASeason: number;
    targetPrice: string;
    roundChoosingLength: number;
    roundInASeasonStartTime: Date;
    roundInASeasonEndTime: Date;
    token: string;
    roundsInformation: RoundInformation[];
    royaleSeasonCreationTime: Date;
    royaleSeasonEndTime: Date;
    signUpPeriod: Date;
    canCloseRound: boolean;
    canStartRoyale: boolean;
    canStartNewSeason: boolean;
    pauseBetweenSeasonsTime: number;
    priceFeedAddress: string;
    playerSignedUpPerSeason: boolean;
    rewardCollectedPerSeason: boolean;
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
    totalPlayersPerRoundPerSeason: number;
};

const useThalesRoyaleData = (walletAddress: string, options?: UseQueryOptions<Map<number, ThalesRoyaleData>>) => {
    return useQuery<Map<number, ThalesRoyaleData>>(
        QUERY_KEYS.Royale.Data(walletAddress),
        async () => {
            const { thalesRoyaleContract } = snxJSConnector;
            if (thalesRoyaleContract) {
                const RoyaleContract = walletAddress
                    ? thalesRoyaleContract.connect((snxJSConnector as any).signer)
                    : thalesRoyaleContract;
                const data = await getFromContract(RoyaleContract, walletAddress);
                console.log(data);
                return data;
            }
            return new Map<any, any>();
        },
        {
            refetchInterval: 5000,
            ...options,
        }
    );
};

export default useThalesRoyaleData;

const getFromContract = async (RoyaleContract: ethers.Contract, walletAddress: string) => {
    const lastSeason = Number(await RoyaleContract.season());
    const seasonsData = new Map<number, ThalesRoyaleData>();
    if (lastSeason === 0) {
        const [
            players,
            rounds,
            buyInAmount,
            roundInASeason,
            targetPrice,
            roundChoosingLength,
            roundInASeasonStartTime,
            roundInASeasonEndTime,
            token,
            priceFeedAddress,
            royaleSeasonCreationTime,
            royaleSeasonEndTime,
            signUpPeriod,
            canCloseRound,
            canStartRoyale,
            canStartNewSeason,
            pauseBetweenSeasonsTime,
            rewardPerWinnerPerSeason,
            rewardPerSeason,
            unclaimedRewardPerSeason,
            seasonStarted,
            seasonFinished,
        ] = await Promise.all([
            RoyaleContract.getPlayersForSeason(0),
            RoyaleContract.rounds(),
            RoyaleContract.buyInAmount(),
            RoyaleContract.roundInASeason(0),
            RoyaleContract.roundTargetPrice(),
            RoyaleContract.roundChoosingLength(),
            RoyaleContract.roundInASeasonStartTime(0),
            RoyaleContract.roundInSeasonEndTime(0),
            RoyaleContract.oracleKey(),
            RoyaleContract.priceFeed(),
            RoyaleContract.seasonCreationTime(0),
            RoyaleContract.royaleSeasonEndTime(0),
            RoyaleContract.signUpPeriod(),
            RoyaleContract.canCloseRound(),
            RoyaleContract.canStartRoyale(),
            RoyaleContract.canStartNewSeason(),
            RoyaleContract.pauseBetweenSeasonsTime(),
            RoyaleContract.rewardPerWinnerPerSeason(0),
            RoyaleContract.rewardPerSeason(0),
            RoyaleContract.unclaimedRewardPerSeason(0),
            RoyaleContract.seasonStarted(0),
            RoyaleContract.seasonFinished(0),
        ]);
        seasonsData.set(0, {
            season: 0,
            players,
            isPlayerAlive: false,
            hasParticipatedInCurrentOrLastRoyale: false,
            rounds: Number(rounds),
            buyInAmount: Number(ethers.utils.formatEther(buyInAmount)),
            roundInASeason: Number(roundInASeason),
            targetPrice: ethers.utils.formatEther(targetPrice),
            roundChoosingLength: Number(roundChoosingLength),
            roundInASeasonStartTime: new Date(Number(roundInASeasonStartTime) * 1000),
            roundInASeasonEndTime: new Date(Number(roundInASeasonEndTime) * 1000),
            token: parseBytes32String(token),
            roundsInformation: [],
            royaleSeasonCreationTime: new Date(Number(royaleSeasonCreationTime) * 1000),
            royaleSeasonEndTime: new Date(Number(royaleSeasonEndTime) * 1000),
            signUpPeriod: new Date((Number(royaleSeasonCreationTime) + Number(signUpPeriod)) * 1000),
            canCloseRound,
            canStartRoyale,
            canStartNewSeason,
            pauseBetweenSeasonsTime: Number(pauseBetweenSeasonsTime),
            priceFeedAddress,
            playerSignedUpPerSeason: false,
            rewardCollectedPerSeason: false,
            rewardPerWinnerPerSeason,
            rewardPerSeason,
            unclaimedRewardPerSeason,
            seasonStarted,
            seasonFinished,
        });
    }

    for (let i = 1; i <= lastSeason; i++) {
        const isPlayerAliveInSpecificSeason = walletAddress
            ? await RoyaleContract.isPlayerAliveInASpecificSeason(walletAddress, i)
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
            rounds,
            buyInAmount,
            roundInASeason,
            targetPrice,
            roundChoosingLength,
            roundInASeasonStartTime,
            roundInASeasonEndTime,
            token,
            priceFeedAddress,
            royaleSeasonCreationTime,
            royaleSeasonEndTime,
            signUpPeriod,
            canCloseRound,
            canStartRoyale,
            canStartNewSeason,
            pauseBetweenSeasonsTime,
            rewardPerWinnerPerSeason,
            rewardPerSeason,
            unclaimedRewardPerSeason,
            seasonStarted,
            seasonFinished,
        ] = await Promise.all([
            RoyaleContract.getPlayersForSeason(i),
            RoyaleContract.rounds(),
            RoyaleContract.buyInAmount(),
            RoyaleContract.roundInASeason(i),
            RoyaleContract.roundTargetPrice(),
            RoyaleContract.roundChoosingLength(),
            RoyaleContract.roundInASeasonStartTime(i),
            RoyaleContract.roundInSeasonEndTime(i),
            RoyaleContract.oracleKey(),
            RoyaleContract.priceFeed(),
            RoyaleContract.seasonCreationTime(i),
            RoyaleContract.royaleSeasonEndTime(i),
            RoyaleContract.signUpPeriod(),
            RoyaleContract.canCloseRound(),
            RoyaleContract.canStartRoyale(),
            RoyaleContract.canStartNewSeason(),
            RoyaleContract.pauseBetweenSeasonsTime(),
            RoyaleContract.rewardPerWinnerPerSeason(i),
            RoyaleContract.rewardPerSeason(i),
            RoyaleContract.unclaimedRewardPerSeason(i),
            RoyaleContract.seasonStarted(i),
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
            const totalPlayersPerRoundPerSeason = await RoyaleContract.totalPlayersPerRoundPerSeason(i, j);

            roundsInformation.push({
                positionInRound: Number(positionAInRoundPerSeason ?? 0),
                targetPriceInRound: ethers.utils.formatEther(targetPriceInRound),
                finalPriceInRound: ethers.utils.formatEther(finalPriceInRound),
                roundResultPerSeason: Number(roundResultPerSeason ?? 0),
                totalPlayersPerRoundPerSeason: Number(totalPlayersPerRoundPerSeason ?? 0),
            });
        }

        seasonsData.set(i, {
            season: i,
            players,
            isPlayerAlive: isPlayerAliveInSpecificSeason,
            hasParticipatedInCurrentOrLastRoyale,
            rounds: Number(rounds),
            buyInAmount: Number(ethers.utils.formatEther(buyInAmount)),
            roundInASeason: Number(roundInASeason),
            targetPrice: ethers.utils.formatEther(targetPrice),
            roundChoosingLength: Number(roundChoosingLength),
            roundInASeasonStartTime: new Date(Number(roundInASeasonStartTime) * 1000),
            roundInASeasonEndTime: new Date(Number(roundInASeasonEndTime) * 1000),
            token: parseBytes32String(token),
            roundsInformation,
            royaleSeasonCreationTime: new Date(Number(royaleSeasonCreationTime) * 1000),
            royaleSeasonEndTime: new Date(Number(royaleSeasonEndTime) * 1000),
            signUpPeriod: new Date((Number(royaleSeasonCreationTime) + Number(signUpPeriod)) * 1000),
            canCloseRound,
            canStartRoyale,
            canStartNewSeason,
            pauseBetweenSeasonsTime: Number(pauseBetweenSeasonsTime),
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
