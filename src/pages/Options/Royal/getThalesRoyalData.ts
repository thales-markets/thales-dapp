import { ethers } from 'ethers';
import thalesRoyal from 'utils/contracts/thalesRoyalContract';
import { dispatchMarketNotification } from 'utils/options';

export const signUp = async () => {
    const provider = new ethers.providers.Web3Provider((window as any).ethereum);
    const signer = provider.getSigner();
    const RoyalContract = new ethers.Contract(thalesRoyal.address, thalesRoyal.abi, signer);
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
    const RoyalContract = new ethers.Contract(thalesRoyal.address, thalesRoyal.abi, signer);
    try {
        const tx = await RoyalContract.startRoyale();
        await tx.wait();
        dispatchMarketNotification('Royale Started');
    } catch (e) {
        console.log(e);
    }
};
