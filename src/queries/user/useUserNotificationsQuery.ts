import axios from 'axios';
import { generalConfig } from 'config/general';
import { POSITION_BALANCE_THRESHOLD } from 'constants/options';
import QUERY_KEYS from 'constants/queryKeys';
import { API_ROUTES } from 'constants/routes';
import { Network } from 'enums/network';
import { useQuery, UseQueryOptions } from 'react-query';
import { bigNumberFormatter } from 'thales-utils';
import { getMinMaturityDateForClaim, isOptionClaimable } from 'utils/options';

const useUserNotificationsQuery = (networkId: Network, walletAddress: string, options?: UseQueryOptions<number>) => {
    return useQuery<number>(
        QUERY_KEYS.User.Notifications(walletAddress, networkId),
        async () => {
            const [positionBalancesResponse, rangedPositionBalancesResponse] = await Promise.all([
                axios.get(
                    `${generalConfig.API_URL}/${
                        API_ROUTES.PositionBalance
                    }/${networkId}?account=${walletAddress.toLowerCase()}`
                ),
                axios.get(
                    `${generalConfig.API_URL}/${
                        API_ROUTES.RangedPositionBalance
                    }/${networkId}?account=${walletAddress.toLowerCase()}`
                ),
            ]);

            const positionBalances = positionBalancesResponse?.data ? positionBalancesResponse.data : [];
            const rangedPositionBalances = rangedPositionBalancesResponse?.data
                ? rangedPositionBalancesResponse.data
                : [];

            const claimablePositions: any = [];
            const rangedClaimablePositions: any = [];

            const minMaturityDateForClaim = getMinMaturityDateForClaim();

            positionBalances.map((positionBalance: any) => {
                if (
                    bigNumberFormatter(positionBalance.amount) >= POSITION_BALANCE_THRESHOLD &&
                    positionBalance.position.market.result !== null &&
                    isOptionClaimable(positionBalance) &&
                    positionBalance.position.market.maturityDate >= minMaturityDateForClaim
                ) {
                    claimablePositions.push(positionBalance);
                }
            });

            rangedPositionBalances.map((positionBalance: any) => {
                if (
                    bigNumberFormatter(positionBalance.amount) >= POSITION_BALANCE_THRESHOLD &&
                    positionBalance.position.market.result !== null &&
                    isOptionClaimable(positionBalance) &&
                    positionBalance.position.market.maturityDate >= minMaturityDateForClaim
                ) {
                    rangedClaimablePositions.push(positionBalance);
                }
            });

            return [...claimablePositions, ...rangedClaimablePositions].length;
        },
        options
    );
};

export default useUserNotificationsQuery;
