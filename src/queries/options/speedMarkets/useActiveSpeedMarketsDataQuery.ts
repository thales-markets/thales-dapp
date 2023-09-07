import { EvmPriceServiceConnection, PriceFeed } from '@pythnetwork/pyth-evm-js';
import { USD_SIGN } from 'constants/currency';
import { ZERO_ADDRESS } from 'constants/network';
import { OPTIONS_POSITIONS_MAP, SIDE, SPEED_MARKETS_QUOTE } from 'constants/options';
import { CONNECTION_TIMEOUT_MS, PYTH_CURRENCY_DECIMALS, SUPPORTED_ASSETS } from 'constants/pyth';
import QUERY_KEYS from 'constants/queryKeys';
import { secondsToMilliseconds } from 'date-fns';
import { Network } from 'enums/network';
import { Positions } from 'enums/options';
import { useQuery, UseQueryOptions } from 'react-query';
import { OptionSide, UserLivePositions } from 'types/options';
import { bigNumberFormatter, parseBytes32String, coinFormatter } from 'utils/formatters/ethers';
import { formatCurrencyWithSign } from 'utils/formatters/number';
import { getBenchmarksPriceFeeds, getCurrentPrices, getPriceId, getPriceServiceEndpoint } from 'utils/pyth';
import snxJSConnector from 'utils/snxJSConnector';

const useActiveSpeedMarketsDataQuery = (networkId: Network, options?: UseQueryOptions<UserLivePositions[]>) => {
    return useQuery<UserLivePositions[]>(
        QUERY_KEYS.BinaryOptions.ActiveSpeedMarkets(networkId),
        async () => {
            const activeSpeedMarketsData: UserLivePositions[] = [];

            const { speedMarketsAMMContract } = snxJSConnector;
            const priceConnection = new EvmPriceServiceConnection(getPriceServiceEndpoint(networkId), {
                timeout: CONNECTION_TIMEOUT_MS,
            });

            if (speedMarketsAMMContract) {
                const [lpFee, safeBoxImpact, numActiveMarkets] = await Promise.all([
                    speedMarketsAMMContract.lpFee(),
                    speedMarketsAMMContract.safeBoxImpact(),
                    speedMarketsAMMContract.numActiveMarkets(),
                ]);
                const fees = bigNumberFormatter(lpFee) + bigNumberFormatter(safeBoxImpact);

                const activeMarkets = await speedMarketsAMMContract.activeMarkets(0, numActiveMarkets);
                const marketsDataArray = await speedMarketsAMMContract.getMarketsData(activeMarkets);
                const maturedMarkets: any = marketsDataArray
                    .map((marketData: any, index: number) => ({ ...marketData, market: activeMarkets[index] }))
                    .filter((market: any) => secondsToMilliseconds(Number(market.strikeTime)) < Date.now());
                const openMarkets: any = marketsDataArray
                    .map((marketData: any, index: number) => ({ ...marketData, market: activeMarkets[index] }))
                    .filter((market: any) => secondsToMilliseconds(Number(market.strikeTime)) > Date.now());

                const unavailablePrices: { priceId: string; publishTime: number }[] = [];

                // Fetch prices for all matured markets
                const pricePromises = maturedMarkets.map((market: any) => {
                    const priceId = getPriceId(networkId, parseBytes32String(market.asset));
                    return priceConnection.getPriceFeed(priceId, Number(market.strikeTime)).catch((e) => {
                        console.log('Pyth price feed error', e);
                        unavailablePrices.push({
                            priceId: priceId.replace('0x', ''),
                            publishTime: Number(market.strikeTime),
                        });
                    });
                });
                const priceFeeds = await Promise.allSettled(pricePromises);

                // Secondary API for fetching prices using Pyth benchmarks in case that primary fails
                const benchmarksPriceFeeds = await getBenchmarksPriceFeeds(unavailablePrices);

                // Matured markets - not resolved
                for (let i = 0; i < maturedMarkets.length; i++) {
                    const marketData = maturedMarkets[i];
                    const side = OPTIONS_POSITIONS_MAP[SIDE[marketData.direction] as OptionSide] as Positions;
                    const payout = coinFormatter(marketData.buyinAmount, networkId) * SPEED_MARKETS_QUOTE;

                    let isClaimable = false;
                    const priceFeed: PromiseSettledResult<PriceFeed> = priceFeeds[i];
                    let price = 0;
                    if (priceFeed.status === 'fulfilled' && priceFeed.value) {
                        price = priceFeed.value.getPriceUnchecked().getPriceAsNumberUnchecked();
                    } else {
                        const priceId = getPriceId(networkId, parseBytes32String(marketData.asset)).replace('0x', '');
                        price =
                            benchmarksPriceFeeds.find(
                                (benchmarksPrice) =>
                                    benchmarksPrice.priceId === priceId &&
                                    benchmarksPrice.publishTime === Number(marketData.strikeTime)
                            )?.price || 0;
                    }

                    isClaimable =
                        (side === Positions.UP &&
                            price >= bigNumberFormatter(marketData.strikePrice, PYTH_CURRENCY_DECIMALS)) ||
                        (side === Positions.DOWN &&
                            price < bigNumberFormatter(marketData.strikePrice, PYTH_CURRENCY_DECIMALS));

                    const userData: UserLivePositions = {
                        positionAddress: ZERO_ADDRESS,
                        currencyKey: parseBytes32String(marketData.asset),
                        strikePrice: formatCurrencyWithSign(
                            USD_SIGN,
                            bigNumberFormatter(marketData.strikePrice, PYTH_CURRENCY_DECIMALS)
                        ),
                        amount: payout,
                        amountBigNumber: marketData.buyinAmount,
                        maturityDate: secondsToMilliseconds(Number(marketData.strikeTime)),
                        market: marketData.market,
                        side: side,
                        paid: coinFormatter(marketData.buyinAmount, networkId) * (1 + fees),
                        value: payout,
                        claimable: isClaimable,
                        finalPrice: price,
                        user: marketData.user,
                        isSpeedMarket: true,
                    };

                    activeSpeedMarketsData.push(userData);
                }

                // Fetch current prices
                const priceIds = SUPPORTED_ASSETS.map((asset) => getPriceId(networkId, asset));
                const prices: { [key: string]: number } = await getCurrentPrices(priceConnection, networkId, priceIds);

                // Open markets
                for (let i = 0; i < openMarkets.length; i++) {
                    const marketsData = openMarkets[i];
                    const currencyKey = parseBytes32String(marketsData.asset);
                    const side = OPTIONS_POSITIONS_MAP[SIDE[marketsData.direction] as OptionSide] as Positions;
                    const payout = coinFormatter(marketsData.buyinAmount, networkId) * SPEED_MARKETS_QUOTE;

                    const userData: UserLivePositions = {
                        positionAddress: ZERO_ADDRESS,
                        currencyKey: currencyKey,
                        strikePrice: formatCurrencyWithSign(
                            USD_SIGN,
                            bigNumberFormatter(marketsData.strikePrice, PYTH_CURRENCY_DECIMALS)
                        ),
                        amount: payout,
                        amountBigNumber: marketsData.buyinAmount,
                        maturityDate: secondsToMilliseconds(Number(marketsData.strikeTime)),
                        market: marketsData.market,
                        side: side,
                        paid: coinFormatter(marketsData.buyinAmount, networkId) * (1 + fees),
                        value: payout,
                        claimable: false,
                        finalPrice: 0,
                        currentPrice: prices[currencyKey],
                        user: marketsData.user,
                        isSpeedMarket: true,
                    };

                    activeSpeedMarketsData.push(userData);
                }
            }

            return activeSpeedMarketsData;
        },
        {
            ...options,
        }
    );
};

export default useActiveSpeedMarketsDataQuery;
