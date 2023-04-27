import { useQuery, UseQueryOptions } from 'react-query';
import thalesData from 'thales-data';
import QUERY_KEYS from 'constants/queryKeys';
import { NetworkId } from 'utils/network';
import { VaultTrades, VaultTrade } from 'types/vault';
import { bigNumberFormatter } from 'utils/formatters/ethers';
import { VaultTradeStatus } from 'constants/vault';

const useVaultTradesQuery = (vaultAddress: string, networkId: NetworkId, options?: UseQueryOptions<VaultTrades>) => {
    return useQuery<VaultTrades>(
        QUERY_KEYS.Vault.Trades(vaultAddress, networkId),
        async () => {
            try {
                const vaultTrades = await thalesData.binaryOptions.vaultTransactions({
                    network: networkId,
                    vault: vaultAddress,
                });
                const mappedTrades = vaultTrades.map((trade: VaultTrade) => {
                    const result = trade.wholeMarket.result;
                    const currencyKey = hexToAscii(trade.wholeMarket.currencyKey);
                    const strikePrice = bigNumberFormatter(trade.wholeMarket.strikePrice);
                    const maturityDate = trade.wholeMarket.maturityDate * 1000;
                    const status =
                        result === null
                            ? VaultTradeStatus.IN_PROGRESS
                            : Number(result) === trade.position
                            ? VaultTradeStatus.WIN
                            : VaultTradeStatus.LOSE;

                    return {
                        ...trade,
                        currencyKey,
                        strikePrice,
                        maturityDate,
                        result,
                        status,
                    };
                });
                return mappedTrades;
            } catch (e) {
                console.log(e);
                return [];
            }
        },
        {
            ...options,
        }
    );
};

const hexToAscii = (str: string) => {
    const hex = str.toString();
    let out = '';
    for (let n = 2; n < hex.length; n += 2) {
        const nextPair = hex.substr(n, 2);
        if (nextPair !== '00') {
            out += String.fromCharCode(parseInt(nextPair, 16));
        }
    }
    return out;
};

export default useVaultTradesQuery;
