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
import { bigNumberFormatter, parseBytes32String, stableCoinFormatter } from 'utils/formatters/ethers';
import { formatCurrencyWithSign } from 'utils/formatters/number';
import { getCurrentPrices, getPriceId, getPriceServiceEndpoint } from 'utils/pyth';
import snxJSConnector from 'utils/snxJSConnector';

const useActiveSpeedMarketsDataQuery = (networkId: Network, options?: UseQueryOptions<UserLivePositions[]>) => {
    return useQuery<UserLivePositions[]>(
        QUERY_KEYS.BinaryOptions.ActiveSpeedMarkets(networkId),
        async () => {
            const maturedSpeedMarketsData: UserLivePositions[] = [];

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
                const maturedMarkets: any = marketsDataArray.filter(
                    (market: any) => secondsToMilliseconds(Number(market.strikeTime)) < Date.now()
                );
                const openMarkets: any = marketsDataArray.filter(
                    (market: any) => secondsToMilliseconds(Number(market.strikeTime)) > Date.now()
                );

                // Fetch prices for all matured markets
                const pricePromises = maturedMarkets.map((market: any) =>
                    priceConnection
                        .getPriceFeed(
                            getPriceId(networkId, parseBytes32String(market.asset)),
                            Number(market.strikeTime)
                        )
                        .catch((e) => console.log('Pyth price feed error', e))
                );
                const priceFeeds = await Promise.allSettled(pricePromises);

                // Matured markets
                for (let i = 0; i < maturedMarkets.length; i++) {
                    const marketsData = maturedMarkets[i];
                    const side = OPTIONS_POSITIONS_MAP[SIDE[marketsData.direction] as OptionSide] as Positions;
                    const payout = stableCoinFormatter(marketsData.buyinAmount, networkId) * SPEED_MARKETS_QUOTE;

                    let isClaimable = false;
                    let price = 0;
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
                        user: marketsData.user,
                    };

                    maturedSpeedMarketsData.push(userData);
                }

                // Fetch current prices
                const priceIds = SUPPORTED_ASSETS.map((asset) => getPriceId(networkId, asset));
                const prices: { [key: string]: number } = await getCurrentPrices(priceConnection, networkId, priceIds);

                // Open markets
                for (let i = 0; i < openMarkets.length; i++) {
                    const marketsData = openMarkets[i];
                    const currencyKey = parseBytes32String(marketsData.asset);
                    const side = OPTIONS_POSITIONS_MAP[SIDE[marketsData.direction] as OptionSide] as Positions;
                    const payout = stableCoinFormatter(marketsData.buyinAmount, networkId) * SPEED_MARKETS_QUOTE;

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
                        market: activeMarkets[i],
                        side: side,
                        paid: stableCoinFormatter(marketsData.buyinAmount, networkId) * (1 + fees),
                        value: payout,
                        claimable: false,
                        finalPrice: prices[currencyKey],
                        user: marketsData.user,
                    };

                    maturedSpeedMarketsData.push(userData);
                }
            }

            return maturedSpeedMarketsData;
        },
        {
            ...options,
        }
    );
};

export default useActiveSpeedMarketsDataQuery;
