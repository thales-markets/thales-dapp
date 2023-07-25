import { ZERO_ADDRESS } from 'constants/network';
import { OPTIONS_POSITIONS_MAP, SIDE, SPEED_MARKETS_QUOTE } from 'constants/options';
import { PYTH_CURRENCY_DECIMALS } from 'constants/pyth';
import QUERY_KEYS from 'constants/queryKeys';
import { secondsToMilliseconds } from 'date-fns';
import { Network } from 'enums/network';
import { Positions } from 'enums/options';
import { useQuery, UseQueryOptions } from 'react-query';
import { OptionSide, UserLivePositions } from 'types/options';
import { bigNumberFormatter, parseBytes32String, stableCoinFormatter } from 'utils/formatters/ethers';
import { formatStrikePrice } from 'utils/formatters/number';
import snxJSConnector from 'utils/snxJSConnector';

const useUserSpeedMarketsDataQuery = (
    networkId: Network,
    walletAddress: string,
    options?: UseQueryOptions<UserLivePositions[]>
) => {
    return useQuery<UserLivePositions[]>(
        QUERY_KEYS.BinaryOptions.UserSpeedMarkets(networkId, walletAddress),
        async () => {
            const userSpeedMarketsData: UserLivePositions[] = [];

            const { speedMarketsAMMContract } = snxJSConnector;

            if (speedMarketsAMMContract) {
                const fees =
                    bigNumberFormatter(await speedMarketsAMMContract.lpFee()) +
                    bigNumberFormatter(await speedMarketsAMMContract.safeBoxImpact());
                const maturedMarkets = await speedMarketsAMMContract.activeMarketsPerUser(0, 10, walletAddress); // TODO: page size as param
                const marketsDataArray = await speedMarketsAMMContract.getMarketsData(maturedMarkets);

                for (let i = 0; i < marketsDataArray.length; i++) {
                    const marketsData = marketsDataArray[i];
                    const side = OPTIONS_POSITIONS_MAP[SIDE[marketsData.direction] as OptionSide] as Positions;
                    const payout = stableCoinFormatter(marketsData.buyinAmount, networkId) * SPEED_MARKETS_QUOTE;

                    const userData: UserLivePositions = {
                        positionAddress: ZERO_ADDRESS,
                        currencyKey: parseBytes32String(marketsData.asset),
                        strikePrice: formatStrikePrice(
                            bigNumberFormatter(marketsData.strikePrice, PYTH_CURRENCY_DECIMALS),
                            side
                        ),
                        amount: payout,
                        amountBigNumber: marketsData.buyinAmount,
                        maturityDate: secondsToMilliseconds(Number(marketsData.strikeTime)),
                        market: maturedMarkets[i],
                        side: side,
                        paid: stableCoinFormatter(marketsData.buyinAmount, networkId) * (1 + fees),
                        value: payout,
                        claimable: marketsData.isUserWinner,
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

export default useUserSpeedMarketsDataQuery;
