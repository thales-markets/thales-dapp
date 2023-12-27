import { Network } from 'enums/network';
import { useQuery, UseQueryOptions } from 'react-query';
import thalesData from 'thales-data';
import QUERY_KEYS from '../../constants/queryKeys';

type StakingClaimOnBehalfResponse = {
    enabledAddresses: string[];
};

const useStakingClaimOnBehalfQuery = (
    walletAddress: string,
    networkId: Network,
    options?: UseQueryOptions<StakingClaimOnBehalfResponse>
) => {
    return useQuery<StakingClaimOnBehalfResponse>(
        QUERY_KEYS.Token.ClaimOnBehalf(walletAddress, networkId),
        async () => {
            const response: StakingClaimOnBehalfResponse = {
                enabledAddresses: [],
            };
            try {
                const canClaimOnBehalfItems = await thalesData.binaryOptions.canClaimOnBehalfItems({
                    sender: walletAddress,
                    network: networkId,
                });
                canClaimOnBehalfItems.forEach((item: any) => {
                    if (item.canClaimOnBehalf) {
                        response.enabledAddresses.push(item.account.toLowerCase());
                    }
                });

                return response;
            } catch (e) {
                console.log(e);
                return response;
            }
        },
        {
            ...options,
        }
    );
};

export default useStakingClaimOnBehalfQuery;
