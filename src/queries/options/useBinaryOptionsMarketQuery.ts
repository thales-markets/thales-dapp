import { useQuery, UseQueryOptions } from 'react-query';
import QUERY_KEYS from 'constants/queryKeys';
import snxJSConnector from 'utils/snxJSConnector';
import { OptionsMarketInfo } from 'types/options';
import { bigNumberFormatter, parseBytes32String } from 'utils/formatters/ethers';
import { SIDE } from 'constants/options';
import { getPhaseAndEndDate } from 'utils/options';
import { Contract } from 'ethers';

const useBinaryOptionsMarketQuery = (
    marketAddress: string,
    BOMContract: Contract,
    options?: UseQueryOptions<OptionsMarketInfo>
) => {
    return useQuery<OptionsMarketInfo>(
        QUERY_KEYS.BinaryOptions.Market(marketAddress),
        async () => {
            let withdrawalsEnabled = true;
            try {
                withdrawalsEnabled = await BOMContract.refundsEnabled();
            } catch (e) {}
            const [marketData, marketParameters] = await Promise.all([
                (snxJSConnector as any).binaryOptionsMarketDataContract.getMarketData(marketAddress),
                (snxJSConnector as any).binaryOptionsMarketDataContract.getMarketParameters(marketAddress),
            ]);

            const { times, oracleDetails, creator, options, fees, creatorLimits } = marketParameters;
            const {
                totalBids,
                totalClaimableSupplies,
                totalSupplies,
                deposits,
                prices,
                oraclePriceAndTimestamp,
                resolution,
            } = marketData;

            const biddingEndDate = Number(times.biddingEnd) * 1000;
            const maturityDate = Number(times.maturity) * 1000;
            const expiryDate = Number(times.expiry) * 1000;

            const { phase, timeRemaining } = getPhaseAndEndDate(biddingEndDate, maturityDate, expiryDate);

            const currencyKey = parseBytes32String(oracleDetails.key);
            return {
                isResolved: resolution.resolved,
                address: marketAddress,
                currencyKey,
                priceUpdatedAt: Number(oraclePriceAndTimestamp.updatedAt) * 1000,
                currentPrice: bigNumberFormatter(oraclePriceAndTimestamp.price),
                finalPrice: bigNumberFormatter(oracleDetails.finalPrice),
                asset:
                    snxJSConnector.synthsMap != null
                        ? snxJSConnector.synthsMap[currencyKey]?.asset || currencyKey
                        : null,
                strikePrice: bigNumberFormatter(oracleDetails.strikePrice),
                biddingEndDate,
                maturityDate,
                expiryDate,
                longPrice: bigNumberFormatter(prices.long),
                shortPrice: bigNumberFormatter(prices.short),
                result: SIDE[marketData.result],
                totalBids: {
                    long: bigNumberFormatter(totalBids.long),
                    short: bigNumberFormatter(totalBids.short),
                },
                totalClaimableSupplies: {
                    long: bigNumberFormatter(totalClaimableSupplies.long),
                    short: bigNumberFormatter(totalClaimableSupplies.short),
                },
                totalSupplies: {
                    long: bigNumberFormatter(totalSupplies.long),
                    short: bigNumberFormatter(totalSupplies.short),
                },
                deposits: {
                    deposited: bigNumberFormatter(deposits.deposited),
                    exercisableDeposits: bigNumberFormatter(deposits.exercisableDeposits),
                },
                phase,
                timeRemaining,
                creator,
                options: {
                    long: bigNumberFormatter(options.long),
                    short: bigNumberFormatter(options.short),
                },
                fees: {
                    creatorFee: bigNumberFormatter(fees.creatorFee),
                    poolFee: bigNumberFormatter(fees.poolFee),
                    refundFee: bigNumberFormatter(fees.refundFee),
                },
                creatorLimits: {
                    capitalRequirement: bigNumberFormatter(creatorLimits.capitalRequirement),
                    skewLimit: bigNumberFormatter(creatorLimits.skewLimit),
                },
                BN: {
                    totalLongBN: totalBids.long,
                    totalShortBN: totalBids.short,
                    depositedBN: deposits.deposited,
                    feeBN: fees.creatorFee.add(fees.poolFee),
                    refundFeeBN: fees.refundFee,
                },
                withdrawalsEnabled,
                longAddress: options.long,
                shortAddress: options.short,
            } as OptionsMarketInfo;
        },
        options
    );
};

export default useBinaryOptionsMarketQuery;
