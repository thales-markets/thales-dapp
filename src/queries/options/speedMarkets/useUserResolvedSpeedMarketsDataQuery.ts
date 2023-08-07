import { USD_SIGN } from 'constants/currency';
import { OPTIONS_POSITIONS_MAP, SIDE, SPEED_MARKETS_QUOTE } from 'constants/options';
import { PYTH_CURRENCY_DECIMALS } from 'constants/pyth';
import QUERY_KEYS from 'constants/queryKeys';
import { secondsToMilliseconds } from 'date-fns';
import { Network } from 'enums/network';
import { Positions } from 'enums/options';
import { useQuery, UseQueryOptions } from 'react-query';
import { OptionSide, UserClosedPositions } from 'types/options';
import { bigNumberFormatter, parseBytes32String, stableCoinFormatter } from 'utils/formatters/ethers';
import { formatCurrencyWithSign } from 'utils/formatters/number';
import snxJSConnector from 'utils/snxJSConnector';

const useUserResolvedSpeedMarketsDataQuery = (
    networkId: Network,
    walletAddress: string,
    options?: UseQueryOptions<UserClosedPositions[]>
) => {
    return useQuery<UserClosedPositions[]>(
        QUERY_KEYS.BinaryOptions.UserResolvedSpeedMarkets(networkId, walletAddress),
        async () => {
            const userSpeedMarketsData: UserClosedPositions[] = [];
            const { speedMarketsAMMContract } = snxJSConnector;

            if (speedMarketsAMMContract) {
                const [lpFee, safeBoxImpact, numMaturedMarkets] = await Promise.all([
                    speedMarketsAMMContract.lpFee(),
                    speedMarketsAMMContract.safeBoxImpact(),
                    speedMarketsAMMContract.numMaturedMarketsPerUser(walletAddress),
                ]);
                const fees = bigNumberFormatter(lpFee) + bigNumberFormatter(safeBoxImpact);
                const lastTenMaturedMarkets = await speedMarketsAMMContract.maturedMarketsPerUser(
                    numMaturedMarkets >= 10 ? numMaturedMarkets - 10 : 0,
                    10,
                    walletAddress
                );
                const marketsDataArray = await speedMarketsAMMContract.getMarketsData(lastTenMaturedMarkets);

                for (let i = 0; i < marketsDataArray.length; i++) {
                    const marketsData = marketsDataArray[i];
                    const side = OPTIONS_POSITIONS_MAP[SIDE[marketsData.direction] as OptionSide] as Positions;
                    const payout = stableCoinFormatter(marketsData.buyinAmount, networkId) * SPEED_MARKETS_QUOTE;

                    const userData: UserClosedPositions = {
                        currencyKey: parseBytes32String(marketsData.asset),
                        strikePrice: formatCurrencyWithSign(
                            USD_SIGN,
                            bigNumberFormatter(marketsData.strikePrice, PYTH_CURRENCY_DECIMALS)
                        ),
                        amount: payout,
                        amountBigNumber: marketsData.buyinAmount,
                        maturityDate: secondsToMilliseconds(Number(marketsData.strikeTime)),
                        market: lastTenMaturedMarkets[i],
                        side: side,
                        paid: stableCoinFormatter(marketsData.buyinAmount, networkId) * (1 + fees),
                        value: payout,
                        finalPrice: bigNumberFormatter(marketsData.finalPrice, PYTH_CURRENCY_DECIMALS),
                        isUserWinner: marketsData.isUserWinner,
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

export default useUserResolvedSpeedMarketsDataQuery;
