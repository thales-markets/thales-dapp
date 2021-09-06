import { useQuery, UseQueryOptions } from 'react-query';
import QUERY_KEYS from 'constants/queryKeys';
import { VestingSchedule } from 'types/token';

const useVestingScheduleQuery = (options?: UseQueryOptions<VestingSchedule>) => {
    return useQuery<VestingSchedule>(
        QUERY_KEYS.Token.VestingSchedule(),
        () => [
            {
                date: 1631491200 * 1000,
                amount: 230.15,
            },
            {
                date: 1632096000 * 1000,
                amount: 117.4,
            },
            {
                date: 1632700800 * 1000,
                amount: 1352.5,
            },
            {
                date: 1633305600 * 1000,
                amount: 485.6,
            },
            {
                date: 1633910400 * 1000,
                amount: 1123.78,
            },
            {
                date: 1634515200 * 1000,
                amount: 213.4,
            },
            {
                date: 1635292800 * 1000,
                amount: 412.6,
            },
        ],
        {
            refetchInterval: 5000,
            ...options,
        }
    );
};

export default useVestingScheduleQuery;
