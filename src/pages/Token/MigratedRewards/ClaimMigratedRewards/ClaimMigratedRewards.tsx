import React, { useEffect, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { RootState } from 'redux/rootReducer';
import { getIsWalletConnected, getNetworkId, getWalletAddress } from 'redux/modules/wallet';
import { getIsAppReady } from 'redux/modules/app';
import snxJSConnector from 'utils/snxJSConnector';
import ValidationMessage from 'components/ValidationMessage/ValidationMessage';
import { ethers } from 'ethers';
import { MigratedRetroReward } from 'types/token';
import { formatCurrencyWithKey } from 'utils/formatters/number';
import { THALES_CURRENCY } from 'constants/currency';
import { refetchMigratedRetroRewards, refetchUserTokenTransactions } from 'utils/queryConnector';
import {
    StyledInfoIcon,
    ButtonContainer,
    ClaimMessage,
    EarnSection,
    SectionHeader,
    StyledMaterialTooltip,
    Tip37Link,
} from '../../components';
import { formatGasLimit, getIsOVM, getL1FeeInWei } from 'utils/network';
import NetworkFees from 'pages/Token/components/NetworkFees';
import { dispatchMarketNotification } from 'utils/options';
import {
    GridContainer,
    StakingRewardsContent,
    StakingRewardsItem,
    StakingRewardsLabel,
    GridAction,
} from '../../gridComponents';
import useMigratedRetroRewardsQuery from 'queries/token/useMigratedRetroRewardsQuery';
import { DefaultSubmitButton } from 'pages/Token/components/components';
import { MAX_L2_GAS_LIMIT } from 'constants/options';

const ClaimMigratedRewards: React.FC = () => {
    const { t } = useTranslation();
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state)) || '';
    const isWalletConnected = useSelector((state: RootState) => getIsWalletConnected(state));
    const [txErrorMessage, setTxErrorMessage] = useState<string | null>(null);
    const [migratedRewards, setMigratedRewards] = useState<MigratedRetroReward | undefined>(undefined);
    const [isClaiming, setIsClaiming] = useState(false);
    const [gasLimit, setGasLimit] = useState<number | null>(null);
    const [l1Fee, setL1Fee] = useState<number | null>(null);
    const isL2 = getIsOVM(networkId);
    const { unclaimedRetroAirdropContract } = snxJSConnector as any;

    const isClaimAvailable =
        migratedRewards &&
        migratedRewards.reward &&
        migratedRewards.hasClaimRights &&
        !migratedRewards.claimed &&
        !migratedRewards.isClaimPaused;

    const migratedRewardsQuery = useMigratedRetroRewardsQuery(walletAddress, networkId, {
        enabled: isAppReady && isWalletConnected && !!unclaimedRetroAirdropContract,
    });

    useEffect(() => {
        if (migratedRewardsQuery.isSuccess && migratedRewardsQuery.data) {
            setMigratedRewards(migratedRewardsQuery.data);
        }
    }, [migratedRewardsQuery.isSuccess, migratedRewardsQuery.data]);

    useEffect(() => {
        const fetchL1Fee = async (unclaimedRetroAirdropContractWithSigner: any, migratedRewards: any) => {
            const txRequest = await unclaimedRetroAirdropContractWithSigner.populateTransaction.claim(
                migratedRewards.reward.index,
                migratedRewards.reward.rawBalance,
                migratedRewards.reward.proof
            );
            return getL1FeeInWei(txRequest, snxJSConnector);
        };

        const fetchGasLimit = async () => {
            if (migratedRewards && migratedRewards.reward) {
                try {
                    const unclaimedRetroAirdropContractWithSigner = unclaimedRetroAirdropContract.connect(
                        (snxJSConnector as any).signer
                    );
                    if (isL2) {
                        const [gasEstimate, l1FeeInWei] = await Promise.all([
                            unclaimedRetroAirdropContractWithSigner.estimateGas.claim(
                                migratedRewards.reward.index,
                                migratedRewards.reward.rawBalance,
                                migratedRewards.reward.proof
                            ),
                            fetchL1Fee(unclaimedRetroAirdropContractWithSigner, migratedRewards),
                        ]);
                        setGasLimit(formatGasLimit(gasEstimate, networkId));
                        setL1Fee(l1FeeInWei);
                    } else {
                        const gasEstimate = await unclaimedRetroAirdropContractWithSigner.estimateGas.claim(
                            migratedRewards.reward.index,
                            migratedRewards.reward.rawBalance,
                            migratedRewards.reward.proof
                        );
                        setGasLimit(formatGasLimit(gasEstimate, networkId));
                    }
                } catch (e) {
                    console.log(e);
                    setGasLimit(null);
                }
            }
        };
        if (!isWalletConnected || !isClaimAvailable || !unclaimedRetroAirdropContract) return;
        fetchGasLimit();
    }, [isWalletConnected, isClaimAvailable, unclaimedRetroAirdropContract]);

    const handleClaimOngoingAirdrop = async () => {
        if (isClaimAvailable && migratedRewards && migratedRewards.reward) {
            try {
                setTxErrorMessage(null);
                setIsClaiming(true);
                const unclaimedRetroAirdropContractWithSigner = unclaimedRetroAirdropContract.connect(
                    (snxJSConnector as any).signer
                );
                const tx = (await unclaimedRetroAirdropContractWithSigner.claim(
                    migratedRewards.reward.index,
                    migratedRewards.reward.rawBalance,
                    migratedRewards.reward.proof,
                    { gasLimit: MAX_L2_GAS_LIMIT }
                )) as ethers.ContractTransaction;
                const txResult = await tx.wait();

                if (txResult && txResult.transactionHash) {
                    dispatchMarketNotification(t('options.earn.thales-staking.staking-rewards.confirmation-message'));
                    refetchMigratedRetroRewards(walletAddress, networkId);
                    refetchUserTokenTransactions(walletAddress, networkId);
                    setMigratedRewards({
                        ...migratedRewards,
                        claimed: true,
                    });
                    setIsClaiming(false);
                }
            } catch (e) {
                console.log(e);
                setTxErrorMessage(t('common.errors.unknown-error-try-again'));
                setIsClaiming(false);
            }
        }
    };

    const balance =
        migratedRewards && migratedRewards.reward && migratedRewards.hasClaimRights && !migratedRewards.claimed
            ? migratedRewards.reward.balance
            : 0;

    return (
        <EarnSection
            orderOnMobile={3}
            orderOnTablet={3}
            style={{ gridColumn: 'span 10', gridRow: 'span 2', padding: 0, border: '0', background: 'transparent' }}
        >
            <SectionHeader>
                <div>
                    {t('options.earn.thales-staking.staking-rewards.migrated-rewards.title')}
                    <StyledMaterialTooltip
                        arrow={true}
                        title={
                            <Trans
                                i18nKey="options.earn.thales-staking.staking-rewards.migrated-rewards.info-tooltip"
                                components={[<span key="1" />, <Tip37Link key="2" />]}
                            />
                        }
                        interactive
                    >
                        <StyledInfoIcon />
                    </StyledMaterialTooltip>
                </div>
            </SectionHeader>
            <GridContainer>
                <StakingRewardsItem style={{ gridColumn: 'span 12' }}>
                    <StakingRewardsLabel color="#64D9FE">
                        {t('options.earn.thales-staking.staking-rewards.migrated-rewards.rewards-label')}
                    </StakingRewardsLabel>
                    <StakingRewardsContent>{formatCurrencyWithKey(THALES_CURRENCY, balance)}</StakingRewardsContent>
                </StakingRewardsItem>
                <GridAction>
                    <NetworkFees gasLimit={gasLimit} disabled={isClaiming} l1Fee={l1Fee} />
                    <ButtonContainer>
                        <DefaultSubmitButton
                            onClick={handleClaimOngoingAirdrop}
                            disabled={!isClaimAvailable || isClaiming}
                        >
                            {isClaiming
                                ? t('options.earn.thales-staking.staking-rewards.claiming') +
                                  ` ${formatCurrencyWithKey(THALES_CURRENCY, balance)}...`
                                : t('options.earn.thales-staking.staking-rewards.claim') +
                                  ` ${formatCurrencyWithKey(THALES_CURRENCY, balance)}`}
                        </DefaultSubmitButton>
                        {migratedRewards && migratedRewards.isClaimPaused && (
                            <ClaimMessage>
                                {t('options.earn.thales-staking.staking-rewards.paused-message')}
                            </ClaimMessage>
                        )}
                        {migratedRewards && !migratedRewards.isClaimPaused && !migratedRewards.hasClaimRights && (
                            <ClaimMessage>
                                {t('options.earn.thales-staking.staking-rewards.not-eligible-message')}
                            </ClaimMessage>
                        )}
                        {migratedRewards &&
                            !migratedRewards.isClaimPaused &&
                            migratedRewards.hasClaimRights &&
                            migratedRewards.claimed && (
                                <ClaimMessage>
                                    {t('options.earn.thales-staking.staking-rewards.migrated-rewards.claimed-message')}
                                </ClaimMessage>
                            )}
                    </ButtonContainer>
                    <ValidationMessage
                        showValidation={txErrorMessage !== null}
                        message={txErrorMessage}
                        onDismiss={() => setTxErrorMessage(null)}
                    />
                </GridAction>
            </GridContainer>
        </EarnSection>
    );
};

export default ClaimMigratedRewards;
