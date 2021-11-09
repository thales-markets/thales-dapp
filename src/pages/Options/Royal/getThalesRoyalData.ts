import { ethers } from 'ethers';
import thalesRoyal from 'utils/contracts/thalesRoyalContract';
import priceFeed from 'utils/contracts/priceFeed';
import thalesData from 'thales-data';
import { parseBytes32String } from 'utils/formatters/ethers';

type RoundInformation = {
    positionInRound: number;
    targetPriceInRound: string;
};

export enum UserStatus {
    RDY,
    NOTVERIFIED,
    NOTSIGNED,
}

export type User = {
    isAlive: boolean;
    address: string;
    number: number;
    name: string;
    avatar: string;
    status: UserStatus;
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
    creationTime: Date;
    signUpPeriod: Date;
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

export const getIsPlayerSignedUp = async (walletAddress: string) => {
    const provider = new ethers.providers.Web3Provider((window as any).ethereum);
    const signer = provider.getSigner();
    const RoyalContract = new ethers.Contract(thalesRoyal.address, thalesRoyal.abi, signer);
    const data = await RoyalContract.playerSignedUp(walletAddress);
    return data;
};

export const getUsers = async (walletAddress: string | null, setUsers: any, setUser: any) => {
    const baseUrl = 'https://api.thales.market/thales-royale/';
    const response = await fetch(baseUrl);
    const result = JSON.parse(await response.text());
    const map = new Map(result);
    const data = await thalesData.binaryOptions.thalesRoyalePlayers({ network: 69 });
    const verified: User[] = [];
    const unverified: User[] = [];
    const unasigned: User[] = [];
    data.map((player: any, key: number) => {
        if (map.has(player.id.toLowerCase())) {
            const discordUser: any = map.get(player.id.toLowerCase());
            const user = {
                isAlive: player.isAlive,
                address: player.id,
                number: key + 1,
                name: discordUser.name,
                avatar: discordUser.avatar,
                status: UserStatus.RDY,
            };
            verified.push(user);
            if (walletAddress && user.address === walletAddress.toLowerCase()) {
                setUser(user);
            }
            map.delete(player.id.toLowerCase());
        } else {
            const user = {
                isAlive: player.isAlive,
                address: player.id,
                name: '',
                number: key + 1,
                avatar: '',
                status: UserStatus.NOTVERIFIED,
            };
            if (walletAddress && user.address === walletAddress.toLowerCase()) {
                setUser(user);
            }
            unverified.push(user);
        }
    });
    Array.from(map).map((player: any) => {
        const user = {
            isAlive: true,
            address: player[0],
            number: 0,
            name: player[1].name,
            avatar: player[1].avatar,
            status: UserStatus.NOTSIGNED,
        };
        if (walletAddress && user.address === walletAddress.toLowerCase()) {
            setUser(user);
        }
        unasigned.push(user);
    });
    setUsers([...verified, ...unverified, ...unasigned]);
};

export const signUp = async () => {
    const provider = new ethers.providers.Web3Provider((window as any).ethereum);
    const signer = provider.getSigner();
    const RoyalContract = new ethers.Contract(thalesRoyal.address, thalesRoyal.abi, signer);
    try {
        const tx = await RoyalContract.signUp();
        console.log(tx);
        const res = await tx.wait();
        console.log(res);
    } catch (e) {
        console.log(e);
    }
};

export const startRoyale = async () => {
    const provider = new ethers.providers.Web3Provider((window as any).ethereum);
    const signer = provider.getSigner();
    const RoyalContract = new ethers.Contract(thalesRoyal.address, thalesRoyal.abi, signer);
    try {
        const tx = await RoyalContract.startRoyale();
        console.log(tx);
        const res = await tx.wait();
        console.log(res);
    } catch (e) {
        console.log(e);
    }
};

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
        creationTime,
        signUpPeriod,
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
        RoyalContract.creationTime(),
        RoyalContract.signUpPeriod(),
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
        creationTime: new Date(Number(creationTime) * 1000),
        signUpPeriod: new Date((Number(creationTime) + Number(signUpPeriod)) * 1000),
    };
};
