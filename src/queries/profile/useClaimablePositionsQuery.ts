import { useQuery, UseQueryOptions } from 'react-query';
import QUERY_KEYS from 'constants/queryKeys';
import thalesData from 'thales-data';
import { UserPosition } from 'types/profile';
import { Network } from 'enums/network';
import { bigNumberFormatter, coinFormatter } from 'thales-utils';
import { POSITION_BALANCE_THRESHOLD } from 'constants/options';
import { Positions } from 'enums/options';
import { parseBytes32String } from 'ethers/lib/utils.js';
import { BigNumber } from 'ethers';
import { getMinMaturityDateForClaim, isOptionClaimable } from 'utils/options';

const useClaimablePositionsQuery = (
    networkId: Network,
    walletAddress: string,
    options?: UseQueryOptions<UserPosition[]>
) => {
    return useQuery<UserPosition[]>(
        QUERY_KEYS.Profile.ClaimablePositions(walletAddress, networkId),
        async () => {
            const [positionBalances, rangedPositionBalances] = await Promise.all([
                thalesData.binaryOptions.positionBalances({
                    max: Infinity,
                    network: networkId,
                    account: walletAddress.toLowerCase(),
                }),
                thalesData.binaryOptions.rangedPositionBalances({
                    max: Infinity,
                    network: networkId,
                    account: walletAddress.toLowerCase(),
                }),
            ]);

            const claimablePositions: UserPosition[] = [];
            const rangedClaimablePositions: UserPosition[] = [];

            const minMaturityDateForClaim = getMinMaturityDateForClaim();

            positionBalances.map((positionBalance: any) => {
                if (
                    bigNumberFormatter(positionBalance.amount) >= POSITION_BALANCE_THRESHOLD &&
                    positionBalance.position.market.result !== null &&
                    isOptionClaimable(positionBalance) &&
                    positionBalance.position.market.maturityDate >= minMaturityDateForClaim
                ) {
                    claimablePositions.push(positionBalance);
                }
            });

            rangedPositionBalances.map((positionBalance: any) => {
                if (
                    bigNumberFormatter(positionBalance.amount) >= POSITION_BALANCE_THRESHOLD &&
                    positionBalance.position.market.result !== null &&
                    isOptionClaimable(positionBalance) &&
                    positionBalance.position.market.maturityDate >= minMaturityDateForClaim
                ) {
                    rangedClaimablePositions.push(positionBalance);
                }
            });

            const modifiedClaimablePositions: UserPosition[] = [
                ...claimablePositions.map((positionBalance: any) => {
                    return {
                        positionAddress: positionBalance.position.id,
                        market: positionBalance.position.market.id,
                        currencyKey: parseBytes32String(positionBalance.position.market.currencyKey),
                        amount: bigNumberFormatter(positionBalance.amount),
                        amountBigNumber: BigNumber.from(0),
                        paid: coinFormatter(positionBalance.paid, networkId),
                        maturityDate: Number(positionBalance.position.market.maturityDate) * 1000,
                        expiryDate: Number(positionBalance.position.market.expiryDate) * 1000,
                        strikePrice: bigNumberFormatter(positionBalance.position.market.strikePrice),
                        leftPrice: 0,
                        rightPrice: 0,
                        finalPrice: positionBalance.position.market.finalPrice / 1e18,
                        side: positionBalance.position.side === 'long' ? Positions.UP : Positions.DOWN,
                        value: bigNumberFormatter(positionBalance.amount),
                        claimable: true,
                        claimed: false,
                        isRanged: false,
                        isSpeedMarket: false,
                    };
                }),
                ...rangedClaimablePositions.map((positionBalance: any) => {
                    return {
                        positionAddress: positionBalance.position.id,
                        market: positionBalance.position.market.id,
                        currencyKey: parseBytes32String(positionBalance.position.market.currencyKey),
                        amount: bigNumberFormatter(positionBalance.amount),
                        amountBigNumber: BigNumber.from(0),
                        paid: coinFormatter(positionBalance.paid, networkId),
                        maturityDate: Number(positionBalance.position.market.maturityDate) * 1000,
                        expiryDate: Number(positionBalance.position.market.expiryDate) * 1000,
                        strikePrice: 0,
                        leftPrice: bigNumberFormatter(positionBalance.position.market.leftPrice),
                        rightPrice: bigNumberFormatter(positionBalance.position.market.rightPrice),
                        finalPrice: positionBalance.position.market.finalPrice / 1e18,
                        side: positionBalance.position.side === 'in' ? Positions.IN : Positions.OUT,
                        value: bigNumberFormatter(positionBalance.amount),
                        claimable: true,
                        claimed: false,
                        isRanged: true,
                        isSpeedMarket: false,
                    };
                }),
            ];

            return modifiedClaimablePositions;
        },
        options
    );
};

export default useClaimablePositionsQuery;
