import { ethers } from 'ethers';
import thalesRoyal from 'utils/contracts/thalesRoyalContract';
import priceFeed from 'utils/contracts/priceFeed';
import { parseBytes32String } from 'utils/formatters/ethers';

type RoundInformation = {
    positionInRound: number;
    targetPriceInRound: string;
};

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
};

let priceFeedContractAddress: string;

export const getEthPrice = async () => {
    if (!priceFeedContractAddress) {
        return;
    }
    const provider = new ethers.providers.Web3Provider((window as any).ethereum);
    const signer = provider.getSigner();
    const priceFeedContract = new ethers.Contract(priceFeedContractAddress, priceFeed.abi, signer);
    const currencies = await priceFeedContract.getCurrencies();
    return ethers.utils.formatEther(await priceFeedContract.rateForCurrency(currencies[2]));
};

export const getThalesRoyalData = async (walletAddress: string) => {
    const provider = new ethers.providers.Web3Provider((window as any).ethereum);
    const signer = provider.getSigner();
    const RoyalContract = new ethers.Contract(thalesRoyal.address, thalesRoyal.abi, signer);
    const data = await getFromContract(RoyalContract, walletAddress);
    return data;
};

export const signUp = async () => {};

const getFromContract = async (RoyalContract: ethers.Contract, walletAddress: string) => {
    const [
        players,
        alivePlayers,
        isPlayerAlive,
        rounds,
        round,
        targetPrice,
        roundChoosingLength,
        roundStartTime,
        roundEndTime,
        token,
        priceFeedAddress,
    ] = await Promise.all([
        RoyalContract.getPlayers(),
        RoyalContract.getAlivePlayers(),
        RoyalContract.isPlayerAlive(walletAddress),
        RoyalContract.rounds(),
        RoyalContract.round(),
        RoyalContract.roundTargetPrice(),
        RoyalContract.roundChoosingLength(),
        RoyalContract.roundStartTime(),
        RoyalContract.roundEndTime(),
        RoyalContract.oracleKey(),
        RoyalContract.priceFeed(),
    ]);

    priceFeedContractAddress = priceFeedAddress;

    const roundsInformation = [];

    for (let i = 1; i <= Number(round); i++) {
        const positionInRound = await RoyalContract.positionInARound(walletAddress, i);
        const targetPriceInRound = await RoyalContract.targetPricePerRound(i);
        roundsInformation.push({
            positionInRound: Number(positionInRound),
            targetPriceInRound: ethers.utils.formatEther(targetPriceInRound),
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
    };
};
