import { EvmPriceServiceConnection, PriceFeed } from '@pythnetwork/pyth-evm-js';
import { USD_SIGN } from 'constants/currency';
import { ZERO_ADDRESS } from 'constants/network';
import { OPTIONS_POSITIONS_MAP, SIDE, SPEED_MARKETS_QUOTE } from 'constants/options';
import { CONNECTION_TIMEOUT_MS, PYTH_CURRENCY_DECIMALS } from 'constants/pyth';
import QUERY_KEYS from 'constants/queryKeys';
import { secondsToMilliseconds } from 'date-fns';
import { Network } from 'enums/network';
import { Positions } from 'enums/options';
import { reject } from 'lodash';
import { useQuery, UseQueryOptions } from 'react-query';
import { OptionSide, UserLivePositions } from 'types/options';
import { bigNumberFormatter, parseBytes32String, stableCoinFormatter } from 'utils/formatters/ethers';
import { formatCurrencyWithSign } from 'utils/formatters/number';
import { getPriceId, getPriceServiceEndpoint } from 'utils/pyth';
import snxJSConnector from 'utils/snxJSConnector';

const useUserActiveSpeedMarketsDataQuery = (
    networkId: Network,
    walletAddress: string,
    options?: UseQueryOptions<UserLivePositions[]>
) => {
    return useQuery<UserLivePositions[]>(
        QUERY_KEYS.BinaryOptions.UserSpeedMarkets(networkId, walletAddress),
        async () => {
            const userSpeedMarketsData: UserLivePositions[] = [];

            const { speedMarketsAMMContract } = snxJSConnector;
            const priceConnection = new EvmPriceServiceConnection(getPriceServiceEndpoint(networkId), {
                timeout: CONNECTION_TIMEOUT_MS,
            });

            if (speedMarketsAMMContract) {
                const fees =
                    bigNumberFormatter(await speedMarketsAMMContract.lpFee()) +
                    bigNumberFormatter(await speedMarketsAMMContract.safeBoxImpact());
                const numActiveMarkets = await speedMarketsAMMContract.numActiveMarketsPerUser(walletAddress);
                const activeMarkets = await speedMarketsAMMContract.activeMarketsPerUser(
                    0,
                    numActiveMarkets,
                    walletAddress
                );
                const marketsDataArray = await speedMarketsAMMContract.getMarketsData(activeMarkets);

                // Fetch prices for all matured markets
                const pricePromises = marketsDataArray.map((market: any) => {
                    const isMarketMatured = secondsToMilliseconds(Number(market.strikeTime)) < Date.now();
                    if (isMarketMatured) {
                        return priceConnection
                            .getPriceFeed(
                                getPriceId(networkId, parseBytes32String(market.asset)),
                                Number(market.strikeTime)
                            )
                            .catch((e) => console.log('Pyth price feed error', e));
                    } else {
                        return reject(`Price still unknown as this is for future time: ${market.strikeTime}`);
                    }
                });
                const priceFeeds = await Promise.allSettled(pricePromises);

                for (let i = 0; i < marketsDataArray.length; i++) {
                    const marketsData = marketsDataArray[i];
                    const side = OPTIONS_POSITIONS_MAP[SIDE[marketsData.direction] as OptionSide] as Positions;
                    const payout = stableCoinFormatter(marketsData.buyinAmount, networkId) * SPEED_MARKETS_QUOTE;

                    let isClaimable = false;
                    let price = 0;
                    const isMarketMatured = secondsToMilliseconds(Number(marketsData.strikeTime)) < Date.now();
                    if (isMarketMatured) {
                        const priceFeed: PromiseSettledResult<PriceFeed> = priceFeeds[i];
                        price =
                            priceFeed.status === 'fulfilled'
                                ? priceFeed.value?.getPriceUnchecked().getPriceAsNumberUnchecked()
                                : 0;

                        isClaimable =
                            (side === Positions.UP &&
                                price >= bigNumberFormatter(marketsData.strikePrice, PYTH_CURRENCY_DECIMALS)) ||
                            (side === Positions.DOWN &&
                                price < bigNumberFormatter(marketsData.strikePrice, PYTH_CURRENCY_DECIMALS));
                    }

                    const userData: UserLivePositions = {
                        positionAddress: ZERO_ADDRESS,
                        currencyKey: parseBytes32String(marketsData.asset),
                        strikePrice: formatCurrencyWithSign(
                            USD_SIGN,
                            bigNumberFormatter(marketsData.strikePrice, PYTH_CURRENCY_DECIMALS)
                        ),
                        amount: payout,
                        amountBigNumber: marketsData.buyinAmount,
                        maturityDate: secondsToMilliseconds(Number(marketsData.strikeTime)),
                        market: activeMarkets[i],
                        side: side,
                        paid: stableCoinFormatter(marketsData.buyinAmount, networkId) * (1 + fees),
                        value: payout,
                        claimable: isClaimable,
                        finalPrice: price,
                    };

                    userSpeedMarketsData.push(userData);
                }
            }

            return userSpeedMarketsData;
        },
        {
            ...options,
        }
    );
};

export default useUserActiveSpeedMarketsDataQuery;