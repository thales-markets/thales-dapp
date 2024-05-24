import axios from 'axios';
import { generalConfig } from 'config/general';
import QUERY_KEYS from 'constants/queryKeys';
import { API_ROUTES } from 'constants/routes';
import { Network } from 'enums/network';
import { VaultTradeStatus } from 'enums/vault';
import { useQuery, UseQueryOptions } from 'react-query';
import { bigNumberFormatter } from 'thales-utils';
import { VaultTrade, VaultTrades } from 'types/vault';

const useVaultTradesQuery = (vaultAddress: string, networkId: Network, options?: UseQueryOptions<VaultTrades>) => {
    return useQuery<VaultTrades>(
        QUERY_KEYS.Vault.Trades(vaultAddress, networkId),
        async () => {
            try {
                const response = await axios.get(
                    `${generalConfig.API_URL}/${API_ROUTES.VaultsTransactions}/${networkId}?vault=${vaultAddress}`
                );

                if (!response?.data) return [];

                const vaultTrades = response.data;

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
