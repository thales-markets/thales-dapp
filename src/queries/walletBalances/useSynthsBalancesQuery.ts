import isEmpty from 'lodash/isEmpty';
import snxJSConnector from 'utils/snxJSConnector';
import { bytesFormatter, bigNumberFormatter, parseBytes32String } from 'utils/formatters/ethers';

import { SYNTHS_MAP, CurrencyKey } from 'constants/currency';
import { BigNumberish } from 'ethers';
import { useQuery, UseQueryOptions } from 'react-query';
import QUERY_KEYS from 'constants/queryKeys';
import { NetworkId } from 'utils/network';

const useSynthsBalancesQuery = (walletAddress: string, networkId: NetworkId, options?: UseQueryOptions<any>) => {
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
                (snxJSConnector as any).snxJS?.contracts.SynthUtil.synthsBalances(walletAddress),
                (snxJSConnector as any).snxJS?.contracts.SynthUtil.totalSynthsInKey(
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
        options
    );
};

export default useSynthsBalancesQuery;
