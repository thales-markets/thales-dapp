import { NetworkId } from '../../utils/network';
import { HistoricalOptionsMarketInfo } from '../../types/options';
import { getPhaseAndEndDate } from '../../utils/options';

type OpenOrdersMap = Record<string, number> | null;

// TODO: discuss with team to change logic and store and update markets in redux to avoid this
export let openOrdersMapCache: OpenOrdersMap = null;

export const fetchOrders = async (
    networkId: NetworkId,
    optionsMarkets: HistoricalOptionsMarketInfo[],
    setOpenOrdersMap: (openOrdersMap: OpenOrdersMap) => void
) => {
    const openOrdersMap = {} as Record<string, number>;
    for (const o of optionsMarkets) {
        if ('trading' == getPhaseAndEndDate(o.maturityDate, o.expiryDate).phase && !o.openOrders) {
            // TODO move this to the config
            const baseUrl = 'https://api.thales.market/options/' + networkId;
            const response = await fetch(baseUrl + '/' + o.address);
            const count = await response.text();
            openOrdersMap[o.address] = parseInt(count);
        }
    }
    if (optionsMarkets.length) {
        setOpenOrdersMap(openOrdersMap);
        openOrdersMapCache = openOrdersMap;
    }
};
