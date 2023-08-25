import { generalConfig } from 'config/general';
import { SIDE, SPEED_MARKETS_QUOTE } from 'constants/options';
import { PYTH_CURRENCY_DECIMALS } from 'constants/pyth';
import QUERY_KEYS from 'constants/queryKeys';
import { secondsToMilliseconds } from 'date-fns';
import { Network } from 'enums/network';
import { UseQueryOptions, useQuery } from 'react-query';
import { OptionSide } from 'types/options';
import { TradeWithMarket } from 'types/profile';
import { bigNumberFormatter, coinFormatter, parseBytes32String } from 'utils/formatters/ethers';
import { getAPIKeyByNetwork } from 'utils/network';
import snxJSConnector from 'utils/snxJSConnector';

const useUserSpeedMarketsTransactionsQuery = (
    networkId: Network,
    walletAddress: string,
    options?: UseQueryOptions<TradeWithMarket[]>
) => {
    return useQuery<TradeWithMarket[]>(
        QUERY_KEYS.BinaryOptions.UserSpeedMarketsTransactions(networkId, walletAddress),
        async () => {
            const userTransactions: TradeWithMarket[] = [];

            const { speedMarketsAMMContract } = snxJSConnector;

            if (speedMarketsAMMContract) {
                const [lpFee, safeBoxImpact, numActiveMarkets, numMaturedMarkets] = await Promise.all([
                    speedMarketsAMMContract.lpFee(),
                    speedMarketsAMMContract.safeBoxImpact(),
                    speedMarketsAMMContract.numActiveMarketsPerUser(walletAddress),
                    speedMarketsAMMContract.numMaturedMarketsPerUser(walletAddress),
                ]);
                const fees = bigNumberFormatter(lpFee) + bigNumberFormatter(safeBoxImpact);

                const [activeMarkets, maturedMarkets] = await Promise.all([
                    speedMarketsAMMContract.activeMarketsPerUser(0, numActiveMarkets, walletAddress),
                    speedMarketsAMMContract.maturedMarketsPerUser(0, numMaturedMarkets, walletAddress),
                ]);
                const allMarkets: any[] = activeMarkets.concat(maturedMarkets);

                const MAX_CONTRACT_ADDRESSES_PER_REQUEST = 5;
                const contractCreationDataArray: {
                    contractAddress: string;
                    contractCreator: string;
                    txHash: string;
                }[] = [];
                // Fetch each market creation timestamp
                for (let i = 0; i < Math.ceil(allMarkets.length / MAX_CONTRACT_ADDRESSES_PER_REQUEST); i++) {
                    const contractAddresses = allMarkets
                        .slice(
                            i * MAX_CONTRACT_ADDRESSES_PER_REQUEST,
                            i * MAX_CONTRACT_ADDRESSES_PER_REQUEST + MAX_CONTRACT_ADDRESSES_PER_REQUEST
                        )
                        .toString();

                    try {
                        const apiKey = getAPIKeyByNetwork(networkId);
                        const response = await fetch(
                            `${generalConfig.NETWORK_API_URL[networkId]}api?module=contract&action=getcontractcreation&contractaddresses=${contractAddresses}&apikey=${apiKey}`
                        );
                        const bodyText = JSON.parse(await response.text());
                        if (bodyText.status == 1) {
                            contractCreationDataArray.push(...bodyText.result);
                        } else {
                            console.log('Failed to fetch Speed Markets contract data', bodyText.result);
                        }
                    } catch (e) {
                        console.log('Failed to fetch Speed Markets transactions');
                    }
                }

                const allMarketsDataArray = await speedMarketsAMMContract.getMarketsData(allMarkets);
                const allMarketsData = allMarketsDataArray.map((marketData: any, index: number) => ({
                    ...marketData,
                    market: allMarkets[index],
                }));

                for (let i = 0; i < allMarketsData.length; i++) {
                    const marketData = allMarketsData[i];
                    const side = SIDE[marketData.direction] as OptionSide;
                    const payout = coinFormatter(marketData.buyinAmount, networkId) * SPEED_MARKETS_QUOTE;

                    const txHash = contractCreationDataArray.find(
                        (data) => data.contractAddress.toLowerCase() === marketData.market.toLowerCase()
                    )?.txHash;
                    const transactionResponse = txHash && (await snxJSConnector.provider?.getTransaction(txHash));

                    if (transactionResponse && transactionResponse.blockNumber) {
                        const transactionBlock = await snxJSConnector.provider?.getBlock(
                            transactionResponse?.blockNumber
                        );

                        if (transactionBlock) {
                            const userData: TradeWithMarket = {
                                id: txHash,
                                transactionHash: txHash,
                                timestamp: secondsToMilliseconds(transactionBlock.timestamp),
                                orderHash: txHash,
                                maker: '', // not used
                                taker: walletAddress,
                                makerToken: '', // not used
                                takerToken: '', // not used
                                makerAmount: payout,
                                takerAmount: coinFormatter(marketData.buyinAmount, networkId) * (1 + fees),
                                blockNumber: transactionResponse.blockNumber,
                                market: marketData.market,
                                orderSide: 'buy',
                                optionSide: side,
                                marketItem: {
                                    address: marketData.market,
                                    timestamp: secondsToMilliseconds(transactionBlock.timestamp),
                                    currencyKey: parseBytes32String(marketData.asset),
                                    strikePrice: bigNumberFormatter(marketData.strikePrice, PYTH_CURRENCY_DECIMALS),
                                    maturityDate: secondsToMilliseconds(Number(marketData.strikeTime)),
                                    isOpen: !marketData.resolved,
                                    result: marketData.resolved ? side : null,
                                    finalPrice: bigNumberFormatter(marketData.finalPrice, PYTH_CURRENCY_DECIMALS),
                                    isSpeedMarket: true,
                                },
                            };

                            userTransactions.push(userData);
                        }
                    }
                }
            }

            return userTransactions;
        },
        {
            ...options,
        }
    );
};

export default useUserSpeedMarketsTransactionsQuery;
