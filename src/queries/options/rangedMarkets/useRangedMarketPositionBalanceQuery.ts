import { useQuery, UseQueryOptions } from 'react-query';
import QUERY_KEYS from 'constants/queryKeys';
import { RangedMarketBalanceInfo } from 'types/options';
import snxJSConnector from 'utils/snxJSConnector';
import { bigNumberFormatter } from 'thales-utils';
import { Network } from 'enums/network';
import { ethers } from 'ethers';
import rangedMarketContract from 'utils/contracts/rangedMarketContract';
import erc20Contract from 'utils/contracts/collateralContract';
import { POSITION_BALANCE_THRESHOLD } from 'constants/options';

const useRangedMarketPositionBalanceQuery = (
    marketAddress: string,
    walletAddress: string,
    networkId: Network,
    options?: UseQueryOptions<RangedMarketBalanceInfo>
) => {
    return useQuery<RangedMarketBalanceInfo>(
        QUERY_KEYS.BinaryOptions.UserRangedMarketPositions(marketAddress, walletAddress, networkId),
        async () => {
            const rangedMarket = new ethers.Contract(
                marketAddress,
                rangedMarketContract.abi,
                (snxJSConnector as any).provider
            );

            const positions = await rangedMarket.positions();
            const inPositionAddress = positions.inp;
            const outPositionAddress = positions.outp;

            const inPosition = new ethers.Contract(
                inPositionAddress,
                erc20Contract.abi,
                (snxJSConnector as any).provider
            );

            const outPosition = new ethers.Contract(
                outPositionAddress,
                erc20Contract.abi,
                (snxJSConnector as any).provider
            );

            const [inBalance, outBalance] = await Promise.all([
                inPosition.balanceOf(walletAddress),
                outPosition.balanceOf(walletAddress),
            ]);

            return {
                in: bigNumberFormatter(inBalance) < POSITION_BALANCE_THRESHOLD ? 0 : bigNumberFormatter(inBalance),
                out: bigNumberFormatter(outBalance) < POSITION_BALANCE_THRESHOLD ? 0 : bigNumberFormatter(outBalance),
            };
        },
        {
            ...options,
        }
    );
};

export default useRangedMarketPositionBalanceQuery;
