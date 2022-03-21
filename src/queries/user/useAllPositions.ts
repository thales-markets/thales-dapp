import { useQuery, UseQueryOptions } from 'react-query';
import QUERY_KEYS from 'constants/queryKeys';
import thalesData from 'thales-data';
import { OptionsMarkets, UsersAssets } from 'types/options';
import snxJSConnector from 'utils/snxJSConnector';
import { bigNumberFormatter } from 'utils/formatters/ethers';
import { NetworkId } from 'utils/network';
import Web3 from 'web3';
import binaryOptionsMarketDataContract from 'utils/contracts/binaryOptionsMarketDataContract';

type PositionsData = {
    claimed: any[];
    claimable: number;
    claimableAmount: number;
    matured: UsersAssets[];
    live: UsersAssets[];
};

const useAllPositions = (networkId: NetworkId, walletAddress: string, options?: UseQueryOptions<PositionsData>) => {
    return useQuery<PositionsData>(
        QUERY_KEYS.User.AllPositions(walletAddress, networkId),
        async () => {
            const optionsMarkets: OptionsMarkets = await thalesData.binaryOptions.markets({
                max: Infinity,
                network: networkId,
            });

            let claimable = 0;
            let claimableAmount = 0;

            const marketTx = await thalesData.binaryOptions.optionTransactions({
                account: walletAddress,
                network: networkId,
            });

            const txMap = new Map();

            const web3 = new Web3(window.ethereum as any);
            const batch = new web3.BatchRequest();

            const contract = new web3.eth.Contract(
                binaryOptionsMarketDataContract.abi as any,
                binaryOptionsMarketDataContract.addresses[networkId]
            );

            marketTx.map((tx: any) => {
                if (tx.type !== 'mint') {
                    txMap.set(tx.market, tx);
                }
            });

            const matured: UsersAssets[] = [];
            const live: UsersAssets[] = [];

            const promises: Promise<any>[] = [];

            optionsMarkets
                .filter((market) => market.maturityDate <= +Date.now())
                .map((market) => {
                    if (txMap.has(market.address)) {
                        txMap.set(market.address, { market, tx: txMap.get(market.address) });
                    }

                    const promise = new Promise((resolve) => {
                        batch.add(
                            contract.methods
                                .getAccountMarketData(market.address, walletAddress)
                                .call.request({}, async (_a: any, result: any) => {
                                    if (result) {
                                        if (bigNumberFormatter(result.balances.long) > 0 && market.result === 'long') {
                                            claimable++;
                                            claimableAmount += bigNumberFormatter(result.balances.long);
                                        }
                                        if (
                                            bigNumberFormatter(result.balances.short) > 0 &&
                                            market.result === 'short'
                                        ) {
                                            claimable++;
                                            claimableAmount += bigNumberFormatter(result.balances.short);
                                        }
                                        if (result.balances.long > 0 || result.balances.short > 0) {
                                            matured.push({
                                                market,
                                                balances: {
                                                    long: bigNumberFormatter(result.balances.long),
                                                    short: bigNumberFormatter(result.balances.short),
                                                },
                                            });
                                            console.log('matured pushed');
                                        }
                                    }
                                    resolve('');
                                })
                        );
                    });
                    promises.push(promise);
                });

            optionsMarkets
                .filter((market) => market.maturityDate > +Date.now())
                .map((market) => {
                    const promise = new Promise((resolve) => {
                        batch.add(
                            contract.methods
                                .getAccountMarketData(market.address, walletAddress)
                                .call.request({}, async (_a: any, result: any) => {
                                    let [positionValueUp, positionValueDown] = [0, 0];
                                    if (result) {
                                        if (result.balances.short > 0) {
                                            positionValueDown = bigNumberFormatter(
                                                await (snxJSConnector as any).ammContract.sellToAmmQuote(
                                                    market.address,
                                                    1,
                                                    result.balances.short
                                                )
                                            );
                                        }

                                        if (result.balances.long > 0) {
                                            positionValueUp = bigNumberFormatter(
                                                await (snxJSConnector as any).ammContract.sellToAmmQuote(
                                                    market.address,
                                                    0,
                                                    result.balances.long
                                                )
                                            );
                                        }
                                        if (result.balances.long > 0 || result.balances.short > 0) {
                                            live.push({
                                                market,
                                                balances: {
                                                    long: bigNumberFormatter(result.balances.long),
                                                    longValue: positionValueUp,
                                                    shortValue: positionValueDown,
                                                    short: bigNumberFormatter(result.balances.short),
                                                },
                                            });
                                            console.log('live pushed');
                                        }
                                    }
                                    resolve('');
                                })
                        );
                    });
                    promises.push(promise);
                });

            batch.execute();

            await Promise.all(promises);

            const result = {
                claimable,
                claimableAmount,
                claimed: Array.from(txMap.values()),
                matured,
                live,
            };

            return result;
        },
        options
    );
};

export default useAllPositions;
