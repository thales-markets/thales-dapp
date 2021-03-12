import { getGasInfo } from 'utils/network';

const getNetworkPrices = async () => {
    return await getGasInfo();
};

export const getExchangeData = async () => {
    try {
        const [networkPrices] = await Promise.all([getNetworkPrices()]);
        return {
            networkPrices,
        };
    } catch (e) {
        console.log('Error while fetching exchange data', e);
    }
};
