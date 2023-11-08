import { generalConfig } from 'config/general';
import { MIN_MATURITY, SIDE, SPEED_MARKETS_QUOTE } from 'constants/options';
import { PYTH_CURRENCY_DECIMALS } from 'constants/pyth';
import QUERY_KEYS from 'constants/queryKeys';
import { secondsToMilliseconds } from 'date-fns';
import { Network } from 'enums/network';
import { UseQueryOptions, useQuery } from 'react-query';
import { OptionSide } from 'types/options';
import { TradeWithMarket } from 'types/profile';
import { bigNumberFormatter, coinFormatter, parseBytes32String } from 'thales-utils';
import { getAPIKeyByNetwork } from 'utils/network';
import snxJSConnector from 'utils/snxJSConnector';
import { getFeesFromHistory } from 'utils/speedAmm';

const useUserSpeedMarketsTransactionsQuery = (
    networkId: Network,
    walletAddress: string,
    options?: UseQueryOptions<TradeWithMarket[]>
) => {
    return useQuery<TradeWithMarket[]>(
        QUERY_KEYS.BinaryOptions.UserSpeedMarketsTransactions(networkId, walletAddress),
        async () => {
            const userTransactions: TradeWithMarket[] = [];

            const { speedMarketsAMMContract, speedMarketsDataContract } = snxJSConnector;

            if (speedMarketsAMMContract && speedMarketsDataContract) {
                const ammParams = await speedMarketsDataContract.getSpeedMarketsAMMParameters(walletAddress);

                const [activeMarkets, maturedMarkets] = await Promise.all([
                    speedMarketsAMMContract.activeMarketsPerUser(0, ammParams.numActiveMarketsPerUser, walletAddress),
                    speedMarketsAMMContract.maturedMarketsPerUser(0, ammParams.numMaturedMarketsPerUser, walletAddress),
                ]);
                const allMarkets: any[] = activeMarkets.concat(maturedMarkets);

                const allMarketsDataArray = await speedMarketsDataContract.getMarketsData(allMarkets);
                const filteredMarketsData = allMarketsDataArray
                    .map((marketData: any, index: number) => ({
                        ...marketData,
                        market: allMarkets[index],
                    }))
                    .filter((marketData: any) => Number(marketData.strikeTime) > MIN_MATURITY);

                const MAX_CONTRACT_ADDRESSES_PER_REQUEST = 5;
                const contractCreationDataArray: {
                    contractAddress: string;
                    contractCreator: string;
                    txHash: string;
                }[] = [];
                // Fetch each market creation timestamp
                for (let i = 0; i < Math.ceil(filteredMarketsData.length / MAX_CONTRACT_ADDRESSES_PER_REQUEST); i++) {
                    const contractAddresses = filteredMarketsData
                        .map((marketData: any) => marketData.market)
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

                for (let i = 0; i < filteredMarketsData.length; i++) {
                    const marketData = filteredMarketsData[i];
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
                            const txTimestamp = secondsToMilliseconds(transactionBlock.timestamp);
                            const createdAt = !marketData.createdAt.isZero()
                                ? secondsToMilliseconds(Number(marketData.createdAt))
                                : txTimestamp;
                            const lpFee = !marketData.lpFee.isZero()
                                ? bigNumberFormatter(marketData.lpFee)
                                : getFeesFromHistory(createdAt).lpFee;
                            const safeBoxImpact = !marketData.safeBoxImpact.isZero()
                                ? bigNumberFormatter(marketData.safeBoxImpact)
                                : getFeesFromHistory(createdAt).safeBoxImpact;
                            const fees = lpFee + safeBoxImpact;

                            const userData: TradeWithMarket = {
                                id: txHash,
                                transactionHash: txHash,
                                timestamp: txTimestamp,
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
                                    timestamp: txTimestamp,
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
