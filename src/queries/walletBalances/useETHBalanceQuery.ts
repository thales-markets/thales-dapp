import { useQuery, UseQueryOptions } from 'react-query';
import QUERY_KEYS from 'constants/queryKeys';
import snxJSConnector from 'utils/snxJSConnector';
import { SYNTHS_MAP } from 'constants/currency';
import { bigNumberFormatter, bytesFormatter } from 'utils/formatters/ethers';
import { NetworkId } from 'utils/network';

const useETHBalanceQuery = (walletAddress: string, networkId: NetworkId, options?: UseQueryOptions<any>) => {
    return useQuery<any>(
        QUERY_KEYS.WalletBalances.ETH(walletAddress ?? '', networkId),
        async () => {
            const balance = await (snxJSConnector as any).provider.getBalance(walletAddress);
            const usdBalance = await (snxJSConnector as any).snxJS?.contracts.ExchangeRates.effectiveValue(
                bytesFormatter(SYNTHS_MAP.sETH),
                balance,
                bytesFormatter(SYNTHS_MAP.sUSD)
            );

            return {
                balance: bigNumberFormatter(balance),
                usdBalance: bigNumberFormatter(usdBalance),
            };
        },
        options
    );
};

export default useETHBalanceQuery;
