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

const useThalesRoyaleData = (
    walletAddress: string,
    selectedSeason: number,
    options?: UseQueryOptions<ThalesRoyaleData>
) => {
    return useQuery<ThalesRoyaleData>(
        QUERY_KEYS.Royale.Data(walletAddress),
        async () => {
            const { thalesRoyaleContract } = snxJSConnector;
            if (thalesRoyaleContract) {
                const RoyaleContract = walletAddress
                    ? thalesRoyaleContract.connect((snxJSConnector as any).signer)
                    : thalesRoyaleContract;
                const data = await getFromContract(RoyaleContract, walletAddress, selectedSeason);
                return data;
            }
            const emptyData: ThalesRoyaleData = {
                season: 0,
                players: [],
                isPlayerAlive: false,
                hasParticipatedInCurrentOrLastRoyale: false,
                rounds: 0,
                buyInAmount: 0,
                roundInASeason: 0,
                targetPrice: '',
                roundChoosingLength: 0,
                roundInASeasonStartTime: new Date(),
                roundInASeasonEndTime: new Date(),
                token: '',
                roundsInformation: [],
                royaleSeasonCreationTime: new Date(),
                royaleSeasonEndTime: new Date(),
                signUpPeriod: new Date(),
                canCloseRound: false,
                canStartRoyale: false,
                canStartNewSeason: false,
                pauseBetweenSeasonsTime: 0,
                priceFeedAddress: '',
                playerSignedUpPerSeason: false,
                rewardCollectedPerSeason: false,
                rewardPerWinnerPerSeason: 0,
                rewardPerSeason: 0,
                unclaimedRewardPerSeason: 0,
                seasonStarted: false,
                seasonFinished: false,
            };
            return emptyData;
        },
        {
            refetchInterval: 5000,
            ...options,
        }
    );
};

export default useThalesRoyaleData;

const getFromContract = async (RoyaleContract: ethers.Contract, walletAddress: string, selectedSeason: number) => {
    const lastSeason = Number(await RoyaleContract.season());
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
        return {
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
            rewardPerSeason: Number(ethers.utils.formatEther(rewardPerSeason)),
            unclaimedRewardPerSeason,
            seasonStarted,
            seasonFinished,
        };
    }

    if (selectedSeason === 0) {
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
            isPlayerAliveInSpecificSeason,
            playerSignedUpPerSeason,
            rewardCollectedPerSeason,
            hasParticipatedInCurrentOrLastRoyale,
        ] = await Promise.all([
            RoyaleContract.getPlayersForSeason(lastSeason),
            RoyaleContract.rounds(),
            RoyaleContract.buyInAmount(),
            RoyaleContract.roundInASeason(lastSeason),
            RoyaleContract.roundTargetPrice(),
            RoyaleContract.roundChoosingLength(),
            RoyaleContract.roundInASeasonStartTime(lastSeason),
            RoyaleContract.roundInSeasonEndTime(lastSeason),
            RoyaleContract.oracleKey(),
            RoyaleContract.priceFeed(),
            RoyaleContract.seasonCreationTime(lastSeason),
            RoyaleContract.royaleSeasonEndTime(lastSeason),
            RoyaleContract.signUpPeriod(),
            RoyaleContract.canCloseRound(),
            RoyaleContract.canStartRoyale(),
            RoyaleContract.canStartNewSeason(),
            RoyaleContract.pauseBetweenSeasonsTime(),
            RoyaleContract.rewardPerWinnerPerSeason(lastSeason),
            RoyaleContract.rewardPerSeason(lastSeason),
            RoyaleContract.unclaimedRewardPerSeason(lastSeason),
            RoyaleContract.seasonStarted(lastSeason),
            RoyaleContract.seasonFinished(lastSeason),
            RoyaleContract.isPlayerAliveInASpecificSeason(walletAddress, lastSeason),
            RoyaleContract.playerSignedUpPerSeason(lastSeason, walletAddress),
            RoyaleContract.rewardCollectedPerSeason(lastSeason, walletAddress),
            RoyaleContract.hasParticipatedInCurrentOrLastRoyale(walletAddress),
        ]);

        const roundsInformation = [];

        for (let j = 1; j <= Number(roundInASeason); j++) {
            let positionAInRoundPerSeason = undefined;
            if (walletAddress) {
                positionAInRoundPerSeason = await RoyaleContract.positionInARoundPerSeason(
                    lastSeason,
                    walletAddress,
                    j
                );
            }
            const [
                targetPriceInRound,
                finalPriceInRound,
                roundResultPerSeason,
                totalPlayersPerRoundPerSeason,
            ] = await Promise.all([
                RoyaleContract.targetPricePerRoundPerSeason(lastSeason, j),
                RoyaleContract.finalPricePerRoundPerSeason(lastSeason, j),
                RoyaleContract.roundResultPerSeason(lastSeason, j),
                RoyaleContract.totalPlayersPerRoundPerSeason(lastSeason, j),
            ]);

            roundsInformation.push({
                positionInRound: Number(positionAInRoundPerSeason ?? 0),
                targetPriceInRound: ethers.utils.formatEther(targetPriceInRound),
                finalPriceInRound: ethers.utils.formatEther(finalPriceInRound),
                roundResultPerSeason: Number(roundResultPerSeason ?? 0),
                totalPlayersPerRoundPerSeason: Number(totalPlayersPerRoundPerSeason ?? 0),
            });
        }

        return {
            season: lastSeason,
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
            rewardPerSeason: Number(ethers.utils.formatEther(rewardPerSeason)),
            unclaimedRewardPerSeason,
            seasonStarted,
            seasonFinished,
        };
    } else {
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
            isPlayerAliveInSpecificSeason,
            playerSignedUpPerSeason,
            rewardCollectedPerSeason,
            hasParticipatedInCurrentOrLastRoyale,
        ] = await Promise.all([
            RoyaleContract.getPlayersForSeason(selectedSeason),
            RoyaleContract.rounds(),
            RoyaleContract.buyInAmount(),
            RoyaleContract.roundInASeason(selectedSeason),
            RoyaleContract.roundTargetPrice(),
            RoyaleContract.roundChoosingLength(),
            RoyaleContract.roundInASeasonStartTime(selectedSeason),
            RoyaleContract.roundInSeasonEndTime(selectedSeason),
            RoyaleContract.oracleKey(),
            RoyaleContract.priceFeed(),
            RoyaleContract.seasonCreationTime(selectedSeason),
            RoyaleContract.royaleSeasonEndTime(selectedSeason),
            RoyaleContract.signUpPeriod(),
            RoyaleContract.canCloseRound(),
            RoyaleContract.canStartRoyale(),
            RoyaleContract.canStartNewSeason(),
            RoyaleContract.pauseBetweenSeasonsTime(),
            RoyaleContract.rewardPerWinnerPerSeason(selectedSeason),
            RoyaleContract.rewardPerSeason(selectedSeason),
            RoyaleContract.unclaimedRewardPerSeason(selectedSeason),
            RoyaleContract.seasonStarted(selectedSeason),
            RoyaleContract.seasonFinished(selectedSeason),
            RoyaleContract.isPlayerAliveInASpecificSeason(walletAddress, selectedSeason),
            RoyaleContract.playerSignedUpPerSeason(selectedSeason, walletAddress),
            RoyaleContract.rewardCollectedPerSeason(selectedSeason, walletAddress),
            RoyaleContract.hasParticipatedInCurrentOrLastRoyale(walletAddress),
        ]);

        const roundsInformation = [];

        for (let j = 1; j <= Number(roundInASeason); j++) {
            let positionAInRoundPerSeason = undefined;
            if (walletAddress) {
                positionAInRoundPerSeason = await RoyaleContract.positionInARoundPerSeason(
                    selectedSeason,
                    walletAddress,
                    j
                );
            }
            const [
                targetPriceInRound,
                finalPriceInRound,
                roundResultPerSeason,
                totalPlayersPerRoundPerSeason,
            ] = await Promise.all([
                RoyaleContract.targetPricePerRoundPerSeason(selectedSeason, j),
                RoyaleContract.finalPricePerRoundPerSeason(selectedSeason, j),
                RoyaleContract.roundResultPerSeason(selectedSeason, j),
                RoyaleContract.totalPlayersPerRoundPerSeason(selectedSeason, j),
            ]);

            roundsInformation.push({
                positionInRound: Number(positionAInRoundPerSeason ?? 0),
                targetPriceInRound: ethers.utils.formatEther(targetPriceInRound),
                finalPriceInRound: ethers.utils.formatEther(finalPriceInRound),
                roundResultPerSeason: Number(roundResultPerSeason ?? 0),
                totalPlayersPerRoundPerSeason: Number(totalPlayersPerRoundPerSeason ?? 0),
            });
        }

        return {
            season: selectedSeason,
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
            rewardPerSeason: Number(ethers.utils.formatEther(rewardPerSeason)),
            unclaimedRewardPerSeason,
            seasonStarted,
            seasonFinished,
        };
    }
};
