import QUERY_KEYS from 'constants/queryKeys';
import { NFT_COLLECTIONS } from 'pages/TaleOfThales/components/Mint/constants';
import { useQuery, UseQueryOptions } from 'react-query';
import { NetworkId } from 'utils/network';
import snxJSConnector from 'utils/snxJSConnector';

const useNFTCollectionsQuery = (
    walletAddress: string,
    networkId: NetworkId,
    options?: UseQueryOptions<Record<number, boolean>>
) => {
    return useQuery<Record<number, boolean>>(
        QUERY_KEYS.TaleOfThales.NFTCollections(walletAddress, networkId),
        async () => {
            const response = {} as Record<number, boolean>;
            const { taleOfThalesNFTContract } = snxJSConnector as any;
            if (taleOfThalesNFTContract) {
                for (const collection of NFT_COLLECTIONS) {
                    const canMintCollection = await taleOfThalesNFTContract.isEligibleToMintCollection(
                        collection.collectionId,
                        walletAddress
                    );
                    response[collection.collectionId] = canMintCollection;
                }
            }
            return response;
        },
        {
            ...options,
        }
    );
};

export default useNFTCollectionsQuery;
