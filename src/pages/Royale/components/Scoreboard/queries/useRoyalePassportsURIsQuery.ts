import QUERY_KEYS from 'constants/queryKeys';
import { useQuery, UseQueryOptions } from 'react-query';
import snxJSConnector from 'utils/snxJSConnector';

type userRoyalePassportsURIsInfo = {
    nfts: Map<number, string>;
};

const useRoyalePassportsURIsQuery = (tokenIds: number[], options?: UseQueryOptions<userRoyalePassportsURIsInfo>) => {
    return useQuery<userRoyalePassportsURIsInfo>(
        QUERY_KEYS.Royale.RoyalePassportsURIs(tokenIds),
        async () => {
            const { thalesRoyalePassportContract } = snxJSConnector;
            return getFromContract(tokenIds, thalesRoyalePassportContract);
        },
        {
            ...options,
        }
    );
};

const getFromContract = async (
    tokenIds: number[],
    royalePassportContract: any
): Promise<userRoyalePassportsURIsInfo> => {
    const nfts: Map<any, any> = new Map();
    for (let i = 0; i < tokenIds.length; i++) {
        const dataURI = await royalePassportContract.tokenURI(tokenIds[i]);
        const response = await fetch(dataURI);
        const result = await response.text();
        nfts.set(tokenIds[i], JSON.parse(result).image);
    }

    return {
        nfts,
    };
};

export default useRoyalePassportsURIsQuery;
