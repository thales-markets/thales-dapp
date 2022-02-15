import { dispatchMarketNotification } from 'utils/options';
import snxJSConnector from 'utils/snxJSConnector';

export const startRoyaleSeason = async () => {
    const { thalesRoyaleContract } = snxJSConnector;
    if (thalesRoyaleContract) {
        const RoyalContract = thalesRoyaleContract.connect((snxJSConnector as any).signer);
        try {
            const tx = await RoyalContract.startNewSeason();
            await tx.wait();
            dispatchMarketNotification('Season Started');
        } catch (e) {
            console.log(e);
        }
    }
};

export const signUp = async () => {
    const { thalesRoyaleContract } = snxJSConnector;
    if (thalesRoyaleContract) {
        const RoyalContract = thalesRoyaleContract.connect((snxJSConnector as any).signer);
        try {
            const tx = await RoyalContract.signUp();
            await tx.wait();
            dispatchMarketNotification('Successfully Signed Up');
        } catch (e) {
            console.log(e);
        }
    }
};

export const signUpWithPosition = async (position: number) => {
    const { thalesRoyaleContract } = snxJSConnector;
    if (thalesRoyaleContract) {
        const RoyalContract = thalesRoyaleContract.connect((snxJSConnector as any).signer);
        try {
            const tx = await RoyalContract.signUpWithPosition(position);
            await tx.wait();
            dispatchMarketNotification('Successfully Signed Up With Position');
        } catch (e) {
            console.log(e);
        }
    }
};

export const startRoyale = async () => {
    const { thalesRoyaleContract } = snxJSConnector;
    if (thalesRoyaleContract) {
        const RoyalContract = thalesRoyaleContract.connect((snxJSConnector as any).signer);
        try {
            const tx = await RoyalContract.startRoyaleInASeason();
            await tx.wait();
            dispatchMarketNotification('Royale Started');
        } catch (e) {
            console.log(e);
        }
    }
};
