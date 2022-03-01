import { dispatchMarketNotification } from 'utils/options';
import snxJSConnector from 'utils/snxJSConnector';

export const startRoyaleSeason = async () => {
    const { thalesRoyaleContract } = snxJSConnector;
    if (thalesRoyaleContract) {
        const royaleContract = thalesRoyaleContract.connect((snxJSConnector as any).signer);
        try {
            const tx = await royaleContract.startNewSeason();
            await tx.wait();
            dispatchMarketNotification('Season Started');
        } catch (e) {
            console.log(e);
        }
    }
};

export const signUp = async (setIsBuyingIn: any) => {
    const { thalesRoyaleContract } = snxJSConnector;
    if (thalesRoyaleContract) {
        const royaleContract = thalesRoyaleContract.connect((snxJSConnector as any).signer);
        try {
            const tx = await royaleContract.signUp();
            await tx.wait();
            dispatchMarketNotification('Successfully Signed Up');
        } catch (e) {
            console.log(e);
            setIsBuyingIn(false);
        }
    }
};

export const signUpWithPosition = async (position: number, setIsBuyingIn: any) => {
    const { thalesRoyaleContract } = snxJSConnector;
    if (thalesRoyaleContract) {
        const royaleContract = thalesRoyaleContract.connect((snxJSConnector as any).signer);
        try {
            const tx = await royaleContract.signUpWithPosition(position);
            await tx.wait();
            dispatchMarketNotification('Successfully Signed Up With Position');
        } catch (e) {
            console.log(e);
            setIsBuyingIn(false);
        }
    }
};

export const signUpWithPass = async (royalePassId: number, setIsBuyingIn: any) => {
    const { thalesRoyaleContract } = snxJSConnector;
    if (thalesRoyaleContract) {
        const royaleContract = thalesRoyaleContract.connect((snxJSConnector as any).signer);
        try {
            const tx = await royaleContract.signUpWithPass(royalePassId);
            await tx.wait();
            dispatchMarketNotification('Successfully Signed Up With Royale Pass');
        } catch (e) {
            console.log(e);
            setIsBuyingIn(false);
        }
    }
};

export const signUpWithWithPassWithPosition = async (royalePassId: number, position: number, setIsBuyingIn: any) => {
    const { thalesRoyaleContract } = snxJSConnector;
    if (thalesRoyaleContract) {
        const royaleContract = thalesRoyaleContract.connect((snxJSConnector as any).signer);
        try {
            const tx = await royaleContract.signUpWithPassWithPosition(royalePassId, position);
            await tx.wait();
            dispatchMarketNotification('Successfully Signed Up With Royale Pass And With Position');
        } catch (e) {
            console.log(e);
            setIsBuyingIn(false);
        }
    }
};

export const startRoyale = async () => {
    const { thalesRoyaleContract } = snxJSConnector;
    if (thalesRoyaleContract) {
        const royaleContract = thalesRoyaleContract.connect((snxJSConnector as any).signer);
        try {
            const tx = await royaleContract.startRoyaleInASeason();
            await tx.wait();
            dispatchMarketNotification('Royale Started');
        } catch (e) {
            console.log(e);
        }
    }
};
