import { Network } from 'enums/network';
import { useQuery, UseQueryOptions } from 'react-query';
import { bigNumberFormatter, getDefaultDecimalsForNetwork } from 'thales-utils';
import { VaultData } from 'types/vault';
import snxJSConnector from 'utils/snxJSConnector';
import QUERY_KEYS from '../../constants/queryKeys';

const useVaultDataQuery = (
    vaultAddress: string,
    networkId: Network,
    options?: UseQueryOptions<VaultData | undefined>
) => {
    return useQuery<VaultData | undefined>(
        QUERY_KEYS.Vault.Data(vaultAddress, networkId),
        async () => {
            const vaultData: VaultData = {
                vaultStarted: false,
                maxAllowedDeposit: 0,
                round: 0,
                roundEndTime: 0,
                allocationNextRound: 0,
                allocationNextRoundPercentage: 0,
                allocationCurrentRound: 0,
                isRoundEnded: false,
                availableAllocationNextRound: 0,
                minDepositAmount: 0,
                maxAllowedUsers: 0,
                usersCurrentlyInVault: 0,
                canCloseCurrentRound: false,
                paused: false,
                lifetimePnl: 0,
                utilizationRate: 0,
                priceLowerLimit: 0,
                priceUpperLimit: 0,
                skewImpactLimit: 0,
                allocationLimitsPerMarketPerRound: 0,
                minTradeAmount: 0,
                allocationSpentInARound: 0,
                availableAllocationInARound: 0,
                roundLength: 0,
            };

            try {
                const { ammVaultDataContract } = snxJSConnector;
                if (ammVaultDataContract) {
                    const contractVaultData = await ammVaultDataContract.getAmmVaultData(vaultAddress);

                    vaultData.vaultStarted = contractVaultData.vaultStarted;
                    vaultData.maxAllowedDeposit = bigNumberFormatter(
                        contractVaultData.maxAllowedDeposit,
                        getDefaultDecimalsForNetwork(networkId, true)
                    );
                    vaultData.round = Number(contractVaultData.round);
                    vaultData.roundEndTime = Number(contractVaultData.roundEndTime) * 1000;
                    vaultData.availableAllocationNextRound = bigNumberFormatter(
                        contractVaultData.availableAllocationNextRound,
                        getDefaultDecimalsForNetwork(networkId, true)
                    );
                    vaultData.isRoundEnded = new Date().getTime() > vaultData.roundEndTime;
                    vaultData.minDepositAmount = bigNumberFormatter(
                        contractVaultData.minDepositAmount,
                        getDefaultDecimalsForNetwork(networkId, true)
                    );
                    vaultData.maxAllowedUsers = Number(contractVaultData.maxAllowedUsers);
                    vaultData.usersCurrentlyInVault = Number(contractVaultData.usersCurrentlyInVault);
                    vaultData.canCloseCurrentRound = contractVaultData.canCloseCurrentRound;
                    vaultData.paused = contractVaultData.paused;
                    vaultData.utilizationRate = bigNumberFormatter(contractVaultData.utilizationRate);
                    vaultData.priceLowerLimit = bigNumberFormatter(contractVaultData.priceLowerLimit);
                    vaultData.priceUpperLimit = bigNumberFormatter(contractVaultData.priceUpperLimit);
                    vaultData.skewImpactLimit = bigNumberFormatter(contractVaultData.skewImpactLimit);
                    vaultData.allocationLimitsPerMarketPerRound =
                        bigNumberFormatter(contractVaultData.allocationLimitsPerMarketPerRound) / 100;
                    vaultData.minTradeAmount = bigNumberFormatter(contractVaultData.minTradeAmount);
                    vaultData.roundLength = Number(contractVaultData.roundLength) / 60 / 60 / 24;
                    vaultData.allocationCurrentRound = bigNumberFormatter(
                        contractVaultData.allocationCurrentRound,
                        getDefaultDecimalsForNetwork(networkId, true)
                    );
                    vaultData.allocationNextRound = bigNumberFormatter(
                        contractVaultData.allocationNextRound,
                        getDefaultDecimalsForNetwork(networkId, true)
                    );
                    vaultData.allocationNextRoundPercentage =
                        (vaultData.allocationNextRound / vaultData.maxAllowedDeposit) * 100;
                    vaultData.lifetimePnl =
                        bigNumberFormatter(contractVaultData.lifetimePnl) === 0
                            ? 0
                            : bigNumberFormatter(contractVaultData.lifetimePnl) - 1;
                    vaultData.allocationSpentInARound = bigNumberFormatter(
                        contractVaultData.allocationSpentInARound,
                        getDefaultDecimalsForNetwork(networkId, true)
                    );
                    vaultData.availableAllocationInARound =
                        bigNumberFormatter(
                            contractVaultData.tradingAllocation,
                            getDefaultDecimalsForNetwork(networkId, true)
                        ) - vaultData.allocationSpentInARound;

                    return vaultData;
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

export default useVaultDataQuery;
