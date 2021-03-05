import compact from 'lodash/compact';
import { getGasInfo } from 'utils/network';
import snxJSConnector from 'utils/snxJSConnector';
import { parseBytes32String } from 'utils/formatters';

const getNetworkPrices = async () => {
    return await getGasInfo();
};

const getFrozenSynths = async () => {
    const frozenSynths = await (snxJSConnector as any).synthSummaryUtilContract.frozenSynths();

    return compact(frozenSynths.map(parseBytes32String));
};

export const getExchangeData = async () => {
    try {
        const [networkPrices, frozenSynths] = await Promise.all([getNetworkPrices(), getFrozenSynths()]);
        return {
            networkPrices,
            frozenSynths,
        };
    } catch (e) {
        console.log('Error while fetching exchange data', e);
    }
};
