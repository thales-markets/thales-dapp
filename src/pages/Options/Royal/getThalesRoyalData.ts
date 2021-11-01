import { ethers } from 'ethers';
import thalesRoyal from 'utils/contracts/thalesRoyalContract';
import { parseBytes32String } from 'utils/formatters/ethers';

export type ThalesRoyalData = {
    players: [];
    alivePlayers: [];
    rounds: number;
    round: number;
    targetPrice: string;
    roundChoosingLength: number;
    roundStartTime: Date;
    roundEndTime: Date;
    token: string;
};

export const getThalesRoyalData = async () => {
    const provider = new ethers.providers.Web3Provider((window as any).ethereum);
    const signer = provider.getSigner();
    const RoyalContract = new ethers.Contract(thalesRoyal.address, thalesRoyal.abi, signer);
    const rawData = await getFromContract(RoyalContract);
    return populateThalesData(rawData as any);
};

export const signUp = async () => {};

const getFromContract = async (RoyalContract: ethers.Contract) => {
    return Promise.all([
        RoyalContract.getPlayers(),
        RoyalContract.getAlivePlayers(),
        RoyalContract.rounds(),
        RoyalContract.round(),
        RoyalContract.roundTargetPrice(),
        RoyalContract.roundChoosingLength(),
        RoyalContract.roundStartTime(),
        RoyalContract.roundEndTime(),
        RoyalContract.oracleKey(),
    ]);
};

const populateThalesData = (data: any): ThalesRoyalData => {
    return {
        players: data[0],
        alivePlayers: data[1],
        rounds: Number(data[2]),
        round: Number(data[3]),
        targetPrice: ethers.utils.formatEther(data[4]),
        roundChoosingLength: Number(data[5]),
        roundStartTime: new Date(Number(data[6]) * 1000),
        roundEndTime: new Date(Number(data[7]) * 1000),
        token: parseBytes32String(data[8]),
    };
};
