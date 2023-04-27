import { useQuery, UseQueryOptions } from 'react-query';
import QUERY_KEYS from 'constants/queryKeys';
import { VestingSchedule } from 'types/token';
import { NetworkId } from 'utils/network';
import snxJSConnector from '../../utils/snxJSConnector';
import { bigNumberFormatter } from 'utils/formatters/ethers';
import differenceInCalendarWeeks from 'date-fns/differenceInCalendarWeeks';
import addWeeks from 'date-fns/addWeeks';
import getTime from 'date-fns/getTime';
import { orderBy } from 'lodash';

const NUMBER_OF_VESTING_PERIODS = 10;

const useVestingScheduleQuery = (
    walletAddress: string,
    networkId: NetworkId,
    options?: UseQueryOptions<VestingSchedule>
) => {
    return useQuery<VestingSchedule>(
        QUERY_KEYS.Token.VestingSchedule(walletAddress, networkId),
        async () => {
            const promises = [];
            for (let index = 0; index < NUMBER_OF_VESTING_PERIODS; index++) {
                promises.push((snxJSConnector as any).escrowThalesContract.vestingEntries(walletAddress, index));
            }

            const vestingEntries = await Promise.all(promises);

            const [currentVestingPeriod, lastPeriodTimeStamp] = await Promise.all([
                (snxJSConnector as any).escrowThalesContract.currentVestingPeriod(),
                (snxJSConnector as any).stakingThalesContract.lastPeriodTimeStamp(),
            ]);

            const lastPeriodDateTime = new Date(Number(lastPeriodTimeStamp) * 1000);
            const diffInWeeksCurrentDate = differenceInCalendarWeeks(new Date(), lastPeriodDateTime);

            const vestingSchedule: VestingSchedule = [];

            vestingEntries.forEach((entry) => {
                const amount = bigNumberFormatter(entry[0]);
                const period = Number(entry[1]);
                if (amount > 0 && period > 0) {
                    const diffInWeeksVestingPeriod = period - Number(currentVestingPeriod);
                    const vestingDate = addWeeks(lastPeriodDateTime, diffInWeeksCurrentDate + diffInWeeksVestingPeriod);
                    vestingSchedule.push({ date: getTime(vestingDate), amount });
                }
            });

            return orderBy(vestingSchedule, 'date', 'asc');
        },
        {
            refetchInterval: 5000,
            ...options,
        }
    );
};

export default useVestingScheduleQuery;
