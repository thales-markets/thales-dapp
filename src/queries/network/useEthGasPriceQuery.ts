import axios from 'axios';
import { useQuery, UseQueryOptions } from 'react-query';
import QUERY_KEYS from 'constants/queryKeys';

const ETH_GAS_STATION_API_URL = 'https://ethgasstation.info/json/ethgasAPI.json';

type EthGasStationResponse = {
    average: number;
    avgWait: number;
    blockNum: number;
    block_time: number;
    fast: number;
    fastWait: number;
    fastest: number;
    fastestWait: number;
    gasPriceRange: Record<number, number>;
    safeLow: number;
    safeLowWait: number;
    speed: number;
};

export type GasPrices = {
    slow: number;
    average: number;
    fast: number;
};

export type GasSpeed = keyof GasPrices;

export const GAS_SPEEDS: GasSpeed[] = ['slow', 'average', 'fast'];

const useEthGasPriceQuery = (options?: UseQueryOptions<GasPrices>) => {
    return useQuery<GasPrices>(
        QUERY_KEYS.Network.EthGasPrice,
        async () => {
            try {
                const result = await axios.get<EthGasStationResponse>(ETH_GAS_STATION_API_URL);
                const { fast, average, safeLow } = result.data;

                return {
                    fast: Math.round(fast / 10),
                    average: Math.round(average / 10),
                    slow: Math.round(safeLow / 10),
                };
            } catch (e) {
                console.log('Error while getting gas info', e);
                return {
                    fast: 0,
                    average: 0,
                    slow: 0,
                };
            }
        },
        options
    );
};

export default useEthGasPriceQuery;

// TODO - logic used on Kwenta, if we want to switch, uncomment code below

// import axios from 'axios';
// import { useQuery } from 'react-query';
// import QUERY_KEYS from 'constants/queryKeys';

// const ETH_GAS_STATION_API_URL = 'https://ethgasstation.info/json/ethgasAPI.json';
// const GAS_NOW_API_URL = 'https://www.gasnow.org/api/v3/gas/price';

// type EthGasStationResponse = {
//     average: number;
//     avgWait: number;
//     blockNum: number;
//     block_time: number;
//     fast: number;
//     fastWait: number;
//     fastest: number;
//     fastestWait: number;
//     gasPriceRange: Record<number, number>;
//     safeLow: number;
//     safeLowWait: number;
//     speed: number;
// };

// type GasNowResponse = {
//     code: number;
//     data: {
//         rapid: number;
//         fast: number;
//         standard: number;
//         slow: number;
//         timestamp: number;
//     };
// };

// export type GasPrices = {
//     fastest: number;
//     fast: number;
//     average: number;
// };

// export type GasSpeed = keyof GasPrices;

// export const GAS_SPEEDS: GasSpeed[] = ['average', 'fast', 'fastest'];

// const useEthGasPriceQuery = () => {
//     return useQuery<GasPrices>(QUERY_KEYS.Network.EthGasPrice, async () => {
//         try {
//             const result = await axios.get<GasNowResponse>(GAS_NOW_API_URL);
//             const { standard, fast, rapid: fastest } = result.data.data;

//             return {
//                 fastest: Math.round(fastest / 1e8 / 10),
//                 fast: Math.round(fast / 1e8 / 10),
//                 average: Math.round(standard / 1e8 / 10),
//             };
//         } catch (e) {
//             console.log(e);

//             const result = await axios.get<EthGasStationResponse>(ETH_GAS_STATION_API_URL);
//             const { average, fast, fastest } = result.data;

//             return {
//                 fastest: Math.round(fastest / 10),
//                 fast: Math.round(fast / 10),
//                 average: Math.round(average / 10),
//             };
//         }
//     });
// };

// export default useEthGasPriceQuery;
