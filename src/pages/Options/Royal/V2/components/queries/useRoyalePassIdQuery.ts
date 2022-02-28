import QUERY_KEYS from 'constants/queryKeys';
import { ethers } from 'ethers';
import { useQuery, UseQueryOptions } from 'react-query';
import erc20Contract from 'utils/contracts/erc20Contract';
import snxJSConnector from 'utils/snxJSConnector';

export type RoyalePassIdData = {
    id: number;
};

const useRoyalePassIdQuery = (walletAddress: string, options?: UseQueryOptions<RoyalePassIdData>) => {
    return useQuery<RoyalePassIdData>(
        QUERY_KEYS.Royale.RoyalePassId(walletAddress),
        async () => {
            const { thalesRoyalePassContract } = snxJSConnector;
            return getFromContract(thalesRoyalePassContract, walletAddress);
        },
        {
            refetchInterval: 3000,
            ...options,
        }
    );
};

const getFromContract = async (royalePassContract: any, walletAddress: string): Promise<RoyalePassIdData> => {
    const royaleContractInstance = new ethers.Contract(
        royalePassContract.address,
        erc20Contract.abi,
        snxJSConnector.signer
    );

    const [filterToAddress, filterFromAddress] = await Promise.all([
        royaleContractInstance.filters.Transfer(null, walletAddress),
        royaleContractInstance.filters.Transfer(walletAddress, null),
    ]);

    const [filteredToIds, filteredFromIds] = await Promise.all([
        royaleContractInstance.queryFilter(filterToAddress, -9000).then((resp: any) => {
            const ids = new Array<number>();
            for (const tx of resp) {
                ids.push(Number(tx.topics[3]));
            }

            return ids;
        }),
        royaleContractInstance.queryFilter(filterFromAddress, -9000).then((resp: any) => {
            const ids = new Array<number>();
            for (const tx of resp) {
                ids.push(Number(tx.topics[3]));
            }
            return ids;
        }),
    ]);

    const id = filteredToIds.filter((id) => !filteredFromIds.includes(id)).sort()[0];
    return {
        id,
    };
};

export default useRoyalePassIdQuery;
