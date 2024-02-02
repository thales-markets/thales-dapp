import { EvmPriceServiceConnection } from '@pythnetwork/pyth-evm-js';
import { ZERO_ADDRESS } from 'constants/network';
import { OPTIONS_POSITIONS_MAP, SIDE, SPEED_MARKETS_QUOTE } from 'constants/options';
import { CONNECTION_TIMEOUT_MS, PYTH_CURRENCY_DECIMALS, SUPPORTED_ASSETS } from 'constants/pyth';
import QUERY_KEYS from 'constants/queryKeys';
import { hoursToMilliseconds, secondsToMilliseconds } from 'date-fns';
import { Network } from 'enums/network';
import { Positions } from 'enums/options';
import { UseQueryOptions, useQuery } from 'react-query';
import { bigNumberFormatter, coinFormatter, parseBytes32String } from 'thales-utils';
import { OptionSide, UserLivePositions } from 'types/options';
import { getCurrentPrices, getPriceId, getPriceServiceEndpoint } from 'utils/pyth';
import snxJSConnector from 'utils/snxJSConnector';
import { getFeesFromHistory } from 'utils/speedAmm';

const useActiveSpeedMarketsDataQuery = (networkId: Network, options?: UseQueryOptions<UserLivePositions[]>) => {
    return useQuery<UserLivePositions[]>(
        QUERY_KEYS.BinaryOptions.ActiveSpeedMarkets(networkId),
        async () => {
            const activeSpeedMarketsData: UserLivePositions[] = [];

            const { speedMarketsAMMContract, speedMarketsDataContract } = snxJSConnector;
            const priceConnection = new EvmPriceServiceConnection(getPriceServiceEndpoint(networkId), {
                timeout: CONNECTION_TIMEOUT_MS,
            });

            if (speedMarketsAMMContract && speedMarketsDataContract) {
                const ammParams = await speedMarketsDataContract.getSpeedMarketsAMMParameters(ZERO_ADDRESS);

                const activeMarkets = await speedMarketsAMMContract.activeMarkets(0, ammParams.numActiveMarkets);
                const marketsDataArray = activeMarkets.length
                    ? await speedMarketsDataContract.getMarketsData(activeMarkets)
                    : [];
                const maturedMarkets: any = marketsDataArray
                    .map((marketData: any, index: number) => ({ ...marketData, market: activeMarkets[index] }))
                    .filter((market: any) => secondsToMilliseconds(Number(market.strikeTime)) < Date.now());
                const openMarkets: any = marketsDataArray
                    .map((marketData: any, index: number) => ({ ...marketData, market: activeMarkets[index] }))
                    .filter((market: any) => secondsToMilliseconds(Number(market.strikeTime)) > Date.now());

                // Matured markets - not resolved
                for (let i = 0; i < maturedMarkets.length; i++) {
                    const marketData = maturedMarkets[i];
                    const side = OPTIONS_POSITIONS_MAP[SIDE[marketData.direction] as OptionSide] as Positions;
                    const payout = coinFormatter(marketData.buyinAmount, networkId) * SPEED_MARKETS_QUOTE;

                    const maturityDate = secondsToMilliseconds(Number(marketData.strikeTime));
                    const createdAt = !marketData.createdAt.isZero()
                        ? secondsToMilliseconds(Number(marketData.createdAt))
                        : maturityDate - hoursToMilliseconds(1);
                    const lpFee = !marketData.lpFee.isZero()
                        ? bigNumberFormatter(marketData.lpFee)
                        : getFeesFromHistory(createdAt).lpFee;
                    const safeBoxImpact = !marketData.safeBoxImpact.isZero()
                        ? bigNumberFormatter(marketData.safeBoxImpact)
                        : getFeesFromHistory(createdAt).safeBoxImpact;
                    const fees = lpFee + safeBoxImpact;

                    const userData: UserLivePositions = {
                        positionAddress: ZERO_ADDRESS,
                        currencyKey: parseBytes32String(marketData.asset),
                        strikePrice: bigNumberFormatter(marketData.strikePrice, PYTH_CURRENCY_DECIMALS).toString(),
                        amount: payout,
                        amountBigNumber: marketData.buyinAmount,
                        maturityDate,
                        market: marketData.market,
                        side: side,
                        paid: coinFormatter(marketData.buyinAmount, networkId) * (1 + fees),
                        value: payout,
                        claimable: undefined,
                        finalPrice: undefined,
                        user: marketData.user,
                        isSpeedMarket: true,
                    };

                    activeSpeedMarketsData.push(userData);
                }

                // Fetch current prices
                let prices: { [key: string]: number } = {};
                if (openMarkets.length) {
                    const priceIds = SUPPORTED_ASSETS.map((asset) => getPriceId(networkId, asset));
                    prices = await getCurrentPrices(priceConnection, networkId, priceIds);
                }

                // Open markets
                for (let i = 0; i < openMarkets.length; i++) {
                    const marketData = openMarkets[i];
                    const currencyKey = parseBytes32String(marketData.asset);
                    const side = OPTIONS_POSITIONS_MAP[SIDE[marketData.direction] as OptionSide] as Positions;
                    const payout = coinFormatter(marketData.buyinAmount, networkId) * SPEED_MARKETS_QUOTE;

                    const lpFee = !marketData.lpFee.isZero()
                        ? bigNumberFormatter(marketData.lpFee)
                        : getFeesFromHistory(Date.now()).lpFee;
                    const safeBoxImpact = !marketData.safeBoxImpact.isZero()
                        ? bigNumberFormatter(marketData.safeBoxImpact)
                        : getFeesFromHistory(Date.now()).safeBoxImpact;
                    const fees = lpFee + safeBoxImpact;

                    const userData: UserLivePositions = {
                        positionAddress: ZERO_ADDRESS,
                        currencyKey: currencyKey,
                        strikePrice: bigNumberFormatter(marketData.strikePrice, PYTH_CURRENCY_DECIMALS).toString(),
                        amount: payout,
                        amountBigNumber: marketData.buyinAmount,
                        maturityDate: secondsToMilliseconds(Number(marketData.strikeTime)),
                        market: marketData.market,
                        side: side,
                        paid: coinFormatter(marketData.buyinAmount, networkId) * (1 + fees),
                        value: payout,
                        claimable: false,
                        finalPrice: 0,
                        currentPrice: prices[currencyKey],
                        user: marketData.user,
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
