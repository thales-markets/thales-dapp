import { useQuery, UseQueryOptions } from 'react-query';
import QUERY_KEYS from 'constants/queryKeys';
import thalesData from 'thales-data';
import { NetworkId } from 'utils/network';
import { parseBytes32String } from 'ethers/lib/utils.js';
import { formatStrikePrice } from 'utils/formatters/number';
import { bigNumberFormatter, stableCoinFormatter } from 'utils/formatters/ethers';
import { orderBy } from 'lodash';
import { BALANCE_THRESHOLD } from 'constants/token';
import { UserLivePositions } from 'types/options';
import { Positions } from 'enums/options';

const useUserNotifications = (
    networkId: NetworkId,
    walletAddress: string,
    options?: UseQueryOptions<UserLivePositions[]>
) => {
    return useQuery<UserLivePositions[]>(
        QUERY_KEYS.User.UserNotifications(walletAddress, networkId),
        async () => {
            const today = new Date();

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

            const claimablePositions: any = [];
            const rangedClaimablePositions: any = [];

            positionBalances.map((positionBalance: any) => {
                if (bigNumberFormatter(positionBalance.amount) > BALANCE_THRESHOLD) {
                    if (Number(positionBalance.position.market.maturityDate) < today.getTime() / 1000) {
                        if (isOptionClaimable(positionBalance)) claimablePositions.push(positionBalance);
                    }
                }
            });

            rangedPositionBalances.map((positionBalance: any) => {
                if (bigNumberFormatter(positionBalance.amount) > BALANCE_THRESHOLD) {
                    if (Number(positionBalance.position.market.maturityDate) < today.getTime() / 1000) {
                        if (isOptionClaimable(positionBalance)) rangedClaimablePositions.push(positionBalance);
                    }
                }
            });

            const modifiedLivePositions: UserLivePositions[] = [
                ...claimablePositions.map((positionBalance: any) => {
                    return {
                        positionAddress: positionBalance.position.id,
                        market: positionBalance.position.market.id,
                        currencyKey: parseBytes32String(positionBalance.position.market.currencyKey),
                        amount: bigNumberFormatter(positionBalance.amount),
                        amountBigNumber: positionBalance.amount,
                        paid: stableCoinFormatter(positionBalance.paid, networkId),
                        maturityDate: Number(positionBalance.position.market.maturityDate) * 1000,
                        strikePrice: formatStrikePrice(
                            bigNumberFormatter(positionBalance.position.market.strikePrice),
                            positionBalance.position.side === 'long' ? Positions.UP : Positions.DOWN
                        ),
                        side: positionBalance.position.side === 'long' ? Positions.UP : Positions.DOWN,
                        value: bigNumberFormatter(positionBalance.amount),
                        claimable: true,
                    };
                }),

                ...rangedClaimablePositions.map((positionBalance: any) => {
                    return {
                        positionAddress: positionBalance.position.id,
                        market: positionBalance.position.market.id,
                        currencyKey: parseBytes32String(positionBalance.position.market.currencyKey),
                        amount: bigNumberFormatter(positionBalance.amount),
                        amountBigNumber: positionBalance.amount,
                        paid: stableCoinFormatter(positionBalance.paid, networkId),
                        maturityDate: Number(positionBalance.position.market.maturityDate) * 1000,
                        strikePrice: formatStrikePrice(
                            bigNumberFormatter(positionBalance.position.market.leftPrice),
                            positionBalance.position.side === 'in' ? Positions.IN : Positions.OUT,
                            bigNumberFormatter(positionBalance.position.market.rightPrice)
                        ),
                        side: positionBalance.position.side === 'in' ? Positions.IN : Positions.OUT,
                        value: bigNumberFormatter(positionBalance.amount),
                        claimable: true,
                    };
                }),
            ];
            return orderBy(modifiedLivePositions, ['maturityDate', 'currencyKey'], ['asc', 'asc']);
        },
        options
    );
};

const isOptionClaimable = (balance: any) =>
    (balance.position.side === 'long' && balance.position.market.result === 0) ||
    (balance.position.side === 'short' && balance.position.market.result === 1) ||
    (balance.position.side === 'in' && balance.position.market.result === 0) ||
    (balance.position.side === 'out' && balance.position.market.result === 1);

export default useUserNotifications;
