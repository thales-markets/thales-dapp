import { ethers } from 'ethers';
import { dispatchMarketNotification } from 'utils/options';
import snxJSConnector from 'utils/snxJSConnector';

export const startRoyaleSeason = async () => {
    const provider = new ethers.providers.Web3Provider((window as any).ethereum);
    const signer = provider.getSigner();
    const { thalesRoyaleContract } = snxJSConnector;
    const thalesRoyaleContractAddress = thalesRoyaleContract ? thalesRoyaleContract.address : '';
    const thalesRoyaleContractAbi = thalesRoyaleContract ? thalesRoyaleContract.abi : '';
    const RoyalContract = new ethers.Contract(thalesRoyaleContractAddress, thalesRoyaleContractAbi, signer);
    try {
        const tx = await RoyalContract.startNewSeason();
        await tx.wait();
        dispatchMarketNotification('Season Started');
    } catch (e) {
        console.log(e);
    }
};

export const signUp = async () => {
    const provider = new ethers.providers.Web3Provider((window as any).ethereum);
    const signer = provider.getSigner();
    const { thalesRoyaleContract } = snxJSConnector;
    const thalesRoyaleContractAddress = thalesRoyaleContract ? thalesRoyaleContract.address : '';
    const thalesRoyaleContractAbi = thalesRoyaleContract ? thalesRoyaleContract.abi : '';
    const RoyalContract = new ethers.Contract(thalesRoyaleContractAddress, thalesRoyaleContractAbi, signer);
    try {
        const tx = await RoyalContract.signUp();
        await tx.wait();
        dispatchMarketNotification('Successfully Signed Up');
    } catch (e) {
        console.log(e);
    }
};

export const startRoyale = async () => {
    const provider = new ethers.providers.Web3Provider((window as any).ethereum);
    const signer = provider.getSigner();
    const { thalesRoyaleContract } = snxJSConnector;
    const thalesRoyaleContractAddress = thalesRoyaleContract ? thalesRoyaleContract.address : '';
    const thalesRoyaleContractAbi = thalesRoyaleContract ? thalesRoyaleContract.abi : '';
    const RoyalContract = new ethers.Contract(thalesRoyaleContractAddress, thalesRoyaleContractAbi, signer);
    try {
        const tx = await RoyalContract.startRoyaleInASeason();
        await tx.wait();
        dispatchMarketNotification('Royale Started');
    } catch (e) {
        console.log(e);
    }
};
