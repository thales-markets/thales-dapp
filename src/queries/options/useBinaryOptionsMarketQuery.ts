import { SIDE } from 'constants/options';
import QUERY_KEYS from 'constants/queryKeys';
import { useQuery, UseQueryOptions } from 'react-query';
import { bigNumberFormatter, parseBytes32String } from 'thales-utils';
import { OptionsMarketInfo } from 'types/options';
import { getSynthAsset } from 'utils/currency';
import { getContractForInteraction, getPhaseAndEndDate } from 'utils/options';
import snxJSConnector from 'utils/snxJSConnector';

const useBinaryOptionsMarketQuery = (
    marketAddress: string,
    networkId: number,
    isDeprecatedCurrency: boolean,
    options?: UseQueryOptions<OptionsMarketInfo | null>
) => {
    return useQuery<OptionsMarketInfo | null>(
        QUERY_KEYS.BinaryOptions.Market(marketAddress),
        async () => {
            try {
                const { binaryOptionsMarketDataContract, binaryOptionsMarketDataUSDCContract } = snxJSConnector;
                const binaryOptionsMarketDataContractForInteraction = getContractForInteraction(
                    networkId,
                    isDeprecatedCurrency,
                    binaryOptionsMarketDataContract,
                    binaryOptionsMarketDataUSDCContract
                );

                const [marketData, marketParameters] = await Promise.all([
                    binaryOptionsMarketDataContractForInteraction?.getMarketData(marketAddress),
                    binaryOptionsMarketDataContractForInteraction?.getMarketParameters(marketAddress),
                ]);

                const { times, oracleDetails, creator, options, fees } = marketParameters;
                const { totalSupplies, oraclePriceAndTimestamp, resolution, deposits } = marketData;

                const maturityDate = Number(times.maturity) * 1000;
                const expiryDate = Number(times.expiry) * 1000;

                const { phase, timeRemaining } = getPhaseAndEndDate(maturityDate, expiryDate);

                const currencyKey = parseBytes32String(oracleDetails.key);

                return {
                    isResolved: resolution.resolved,
                    address: marketAddress,
                    currencyKey,
                    priceUpdatedAt: Number(oraclePriceAndTimestamp.updatedAt) * 1000,
                    currentPrice: bigNumberFormatter(oraclePriceAndTimestamp.price),
                    finalPrice: bigNumberFormatter(oracleDetails.finalPrice),
                    asset: getSynthAsset(currencyKey),
                    strikePrice: bigNumberFormatter(oracleDetails.strikePrice),
                    maturityDate,
                    expiryDate,
                    result: SIDE[marketData.result],
                    totalSupplies: {
                        long: bigNumberFormatter(totalSupplies.up),
                        short: bigNumberFormatter(totalSupplies.down),
                    },
                    deposited: bigNumberFormatter(deposits.deposited),
                    phase,
                    customMarket: oracleDetails.customMarket,
                    oracleAdress: oracleDetails.iOracleInstanceAddress,
                    timeRemaining,
                    creator,
                    fees: {
                        creator: bigNumberFormatter(fees.creatorFee),
                        pool: bigNumberFormatter(fees.poolFee),
                    },
                    longAddress: options.up,
                    shortAddress: options.down,
                } as OptionsMarketInfo;
            } catch (e) {
                console.log(e);
                return null;
            }
        },
        {
            ...options,
        }
    );
};

export default useBinaryOptionsMarketQuery;
