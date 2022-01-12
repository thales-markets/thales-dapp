import { ethers } from 'ethers';
import { dispatchMarketNotification } from 'utils/options';
import snxJSConnector from 'utils/snxJSConnector';

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
        const tx = await RoyalContract.startRoyale();
        await tx.wait();
        dispatchMarketNotification('Royale Started');
    } catch (e) {
        console.log(e);
    }
};
