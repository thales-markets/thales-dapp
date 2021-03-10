import { useQuery } from 'react-query';
import snxData from 'synthetix-data';
import QUERY_KEYS from 'constants/queryKeys';
//import { OptionsMarkets } from 'types/options';

const useBinaryOptionsMarkets = () => {
    return useQuery<any>(QUERY_KEYS.BinaryOptions.Markets, () => snxData.binaryOptions.markets({ max: Infinity }));
};

export default useBinaryOptionsMarkets;
