import { Network } from 'enums/network';
import { useQuery, UseQueryOptions } from 'react-query';
import { bigNumberFormatter, getDefaultDecimalsForNetwork } from 'thales-utils';
import { UserVaultData } from 'types/vault';
import snxJSConnector from 'utils/snxJSConnector';
import QUERY_KEYS from '../../constants/queryKeys';

const useUserVaultDataQuery = (
    vaultAddress: string,
    walletAddress: string,
    networkId: Network,
    options?: UseQueryOptions<UserVaultData | undefined>
) => {
    return useQuery<UserVaultData | undefined>(
        QUERY_KEYS.Vault.UserData(vaultAddress, walletAddress, networkId),
        async () => {
            const userVaultData: UserVaultData = {
                balanceCurrentRound: 0,
                balanceNextRound: 0,
                balanceTotal: 0,
                isWithdrawalRequested: false,
                hasDepositForCurrentRound: false,
                hasDepositForNextRound: false,
            };

            try {
                const { ammVaultDataContract } = snxJSConnector;
                if (ammVaultDataContract) {
                    const contractUserVaultData = await ammVaultDataContract.getUserAmmVaultData(
                        vaultAddress,
                        walletAddress
                    );

                    userVaultData.balanceCurrentRound = bigNumberFormatter(
                        contractUserVaultData.balanceCurrentRound,
                        getDefaultDecimalsForNetwork(networkId, true)
                    );

                    userVaultData.balanceNextRound = bigNumberFormatter(
                        contractUserVaultData.balanceNextRound,
                        getDefaultDecimalsForNetwork(networkId, true)
                    );

                    userVaultData.balanceTotal = contractUserVaultData.withdrawalRequested
                        ? 0
                        : userVaultData.balanceCurrentRound + userVaultData.balanceNextRound;
                    userVaultData.isWithdrawalRequested = contractUserVaultData.withdrawalRequested;
                    userVaultData.hasDepositForCurrentRound = userVaultData.balanceCurrentRound > 0;
                    userVaultData.hasDepositForNextRound = userVaultData.balanceNextRound > 0;

                    return userVaultData;
                }
            } catch (e) {
                console.log(e);
            }
            return undefined;
        },
        {
            ...options,
        }
    );
};

export default useUserVaultDataQuery;
