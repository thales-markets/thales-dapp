import snxJSConnector from 'utils/snxJSConnector';

import { SYNTHS_MAP } from 'constants/currency';
import { ethers } from 'ethers';
import { useQuery, UseQueryOptions } from 'react-query';
import QUERY_KEYS from 'constants/queryKeys';
import { NetworkId } from 'utils/network';
import { POLYGON_ID } from '../../constants/network';

const useSynthsBalancesQuery = (walletAddress: string, networkId: NetworkId, options?: UseQueryOptions<any>) => {
    return useQuery<any>(
        QUERY_KEYS.WalletBalances.Synths(walletAddress ?? '', networkId),
        async () => {
            const collateral = snxJSConnector.collateral;

            let usdBalance = await collateral?.balanceOf(walletAddress);

            usdBalance = Number(ethers.utils.formatUnits(usdBalance)) * (networkId === POLYGON_ID ? 10e11 : 1);

            return {
                balances: {
                    [SYNTHS_MAP.sUSD]: {
                        balance: usdBalance,
                        balanceBN: usdBalance,
                        usdBalance: usdBalance,
                    },
                },
                usdBalance: usdBalance,
            };
        },
        options
    );
};

export default useSynthsBalancesQuery;
