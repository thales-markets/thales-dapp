import { useQuery, UseQueryOptions } from 'react-query';
import QUERY_KEYS from '../../constants/queryKeys';
import snxJSConnector from '../../utils/snxJSConnector';
import { NetworkId } from '../../utils/network';
import thalesData from 'thales-data';

type StakingClaimOnBehalfResponse = {
    enabledAddresses: string[];
};

const useStakingClaimOnBehalfQuery = (
    walletAddress: string,
    networkId: NetworkId,
    options?: UseQueryOptions<StakingClaimOnBehalfResponse>
) => {
    return useQuery<StakingClaimOnBehalfResponse>(
        QUERY_KEYS.Token.ClaimOnBehalf(walletAddress, networkId),
        async () => {
            const response: StakingClaimOnBehalfResponse = {
                enabledAddresses: [],
            };
            try {
                const { stakingThalesContract } = snxJSConnector as any;
                if (stakingThalesContract) {
                    const canClaimOnBehalfItems = await thalesData.binaryOptions.canClaimOnBehalfItems({
                        sender: walletAddress,
                        network: networkId,
                    });
                    canClaimOnBehalfItems.forEach((item: any) => {
                        if (item.canClaimOnBehalf) {
                            response.enabledAddresses.push(item.account.toLowerCase());
                        }
                    });
                }
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
