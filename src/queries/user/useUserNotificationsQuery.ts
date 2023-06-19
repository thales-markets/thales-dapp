import { useQuery, UseQueryOptions } from 'react-query';
import QUERY_KEYS from 'constants/queryKeys';
import thalesData from 'thales-data';
import { NetworkId } from 'utils/network';
import { bigNumberFormatter } from 'utils/formatters/ethers';
import { POSITION_BALANCE_THRESHOLD } from 'constants/options';
import { isOptionClaimable } from 'utils/options';

const useUserNotificationsQuery = (networkId: NetworkId, walletAddress: string, options?: UseQueryOptions<number>) => {
    return useQuery<number>(
        QUERY_KEYS.User.Notifications(walletAddress, networkId),
        async () => {
            const [positionBalances, rangedPositionBalances] = await Promise.all([
                thalesData.binaryOptions.positionBalances({
                    max: Infinity,
                    network: networkId,
                    account: walletAddress.toLowerCase(),
                }),
                thalesData.binaryOptions.rangedPositionBalances({
                    max: Infinity,
                    network: networkId,
                    account: walletAddress.toLowerCase(),
                }),
            ]);

            const claimablePositions: any = [];
            const rangedClaimablePositions: any = [];

            positionBalances.map((positionBalance: any) => {
                if (
                    bigNumberFormatter(positionBalance.amount) >= POSITION_BALANCE_THRESHOLD &&
                    positionBalance.position.market.result !== null &&
                    isOptionClaimable(positionBalance)
                ) {
                    claimablePositions.push(positionBalance);
                }
            });

            rangedPositionBalances.map((positionBalance: any) => {
                if (
                    bigNumberFormatter(positionBalance.amount) >= POSITION_BALANCE_THRESHOLD &&
                    positionBalance.position.market.result !== null &&
                    isOptionClaimable(positionBalance)
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
