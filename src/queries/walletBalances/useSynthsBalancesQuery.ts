import isEmpty from 'lodash/isEmpty';
import snxJSConnector from 'utils/snxJSConnector';
import { bytesFormatter, bigNumberFormatter, parseBytes32String } from 'utils/formatters';

import { SYNTHS_MAP, CurrencyKey } from 'constants/currency';
import { BigNumberish } from 'ethers/utils';
import { useQuery } from 'react-query';
import QUERY_KEYS from 'constants/queryKeys';
import { NetworkId } from 'utils/network';

const useSynthsBalancesQuery = (walletAddress: string, networkId: NetworkId, enabled: boolean) => {
    return useQuery<any>(
        QUERY_KEYS.WalletBalances.Synths(walletAddress ?? '', networkId),
        async () => {
            const balances: Record<
                CurrencyKey,
                {
                    balance: number;
                    balanceBN: BigNumberish;
                    usdBalance: number;
                }
            > = {};

            const [balanceResults, totalBalanceResults] = await Promise.all([
                (snxJSConnector as any).synthSummaryUtilContract.synthsBalances(walletAddress),
                (snxJSConnector as any).synthSummaryUtilContract.totalSynthsInKey(
                    walletAddress,
                    bytesFormatter(SYNTHS_MAP.sUSD)
                ),
            ]);

            const [synthsKeys, synthsBalances, synthsUSDBalances] = balanceResults;

            synthsKeys.forEach((key: string, i: string) => {
                const synthName = parseBytes32String(key) as CurrencyKey;
                balances[synthName] = {
                    balance: bigNumberFormatter(synthsBalances[i]),
                    balanceBN: synthsBalances[i],
                    usdBalance: bigNumberFormatter(synthsUSDBalances[i]),
                };
            });

            return {
                balances: isEmpty(balances) ? 0 : balances,
                usdBalance: totalBalanceResults ? bigNumberFormatter(totalBalanceResults) : 0,
            };
        },
        {
            enabled,
        }
    );
};

export default useSynthsBalancesQuery;
