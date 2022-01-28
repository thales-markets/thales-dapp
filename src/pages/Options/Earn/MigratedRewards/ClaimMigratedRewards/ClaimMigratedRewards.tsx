import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { RootState } from 'redux/rootReducer';
import { getIsWalletConnected, getNetworkId, getWalletAddress } from 'redux/modules/wallet';
import { getIsAppReady } from 'redux/modules/app';
import snxJSConnector from 'utils/snxJSConnector';
import ValidationMessage from 'components/ValidationMessage/ValidationMessage';
import { ethers } from 'ethers';
import { MigratedReward } from 'types/token';
import { formatCurrencyWithKey } from 'utils/formatters/number';
import { THALES_CURRENCY } from 'constants/currency';
import { refetchMigratedRewards, refetchUserTokenTransactions } from 'utils/queryConnector';
import { ButtonContainer, ClaimMessage, EarnSection, SectionHeader, StyledMaterialTooltip } from '../../components';
import { formatGasLimit, getIsOVM, getL1FeeInWei } from 'utils/network';
import NetworkFees from 'pages/Options/components/NetworkFees';
import { dispatchMarketNotification } from 'utils/options';
import {
    GridContainer,
    StakingRewardsContent,
    StakingRewardsItem,
    StakingRewardsLabel,
    GridAction,
} from '../../gridComponents';
import useMigratedRewardsQuery from 'queries/token/useMigratedRewardsQuery';
import { DefaultSubmitButton } from 'pages/Options/Market/components';

const ClaimMigratedRewards: React.FC = () => {
    const { t } = useTranslation();
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state)) || '';
    const isWalletConnected = useSelector((state: RootState) => getIsWalletConnected(state));
    const [txErrorMessage, setTxErrorMessage] = useState<string | null>(null);
    const [migratedRewards, setMigratedRewards] = useState<MigratedReward | undefined>(undefined);
    const [isClaiming, setIsClaiming] = useState(false);
    const [gasLimit, setGasLimit] = useState<number | null>(null);
    const [showTooltip, setShowTooltip] = useState<boolean>(false);
    const [l1Fee, setL1Fee] = useState<number | null>(null);
    const isL2 = getIsOVM(networkId);
    const { ongoingAirdropContract } = snxJSConnector as any;

    const isClaimAvailable =
        migratedRewards &&
        migratedRewards.reward &&
        migratedRewards.hasClaimRights &&
        !migratedRewards.claimed &&
        !migratedRewards.isClaimPaused;

    const migratedRewardsQuery = useMigratedRewardsQuery(walletAddress, networkId, {
        enabled: isAppReady && isWalletConnected && !!ongoingAirdropContract,
    });

    useEffect(() => {
        if (migratedRewardsQuery.isSuccess && migratedRewardsQuery.data) {
            setMigratedRewards(migratedRewardsQuery.data);
        }
    }, [migratedRewardsQuery.isSuccess, migratedRewardsQuery.data]);

    useEffect(() => {
        const fetchL1Fee = async (ongoingAirdropContractWithSigner: any, migratedRewards: any) => {
            const txRequest = await ongoingAirdropContractWithSigner.populateTransaction.claim(
                migratedRewards.reward.index,
                migratedRewards.reward.rawBalance,
                migratedRewards.reward.proof
            );
            return getL1FeeInWei(txRequest);
        };

        const fetchGasLimit = async () => {
            if (migratedRewards && migratedRewards.reward) {
                try {
                    const ongoingAirdropContractWithSigner = ongoingAirdropContract.connect(
                        (snxJSConnector as any).signer
                    );
                    if (isL2) {
                        const [gasEstimate, l1FeeInWei] = await Promise.all([
                            ongoingAirdropContractWithSigner.estimateGas.claim(
                                migratedRewards.reward.index,
                                migratedRewards.reward.rawBalance,
                                migratedRewards.reward.proof
                            ),
                            fetchL1Fee(ongoingAirdropContractWithSigner, migratedRewards),
                        ]);
                        setGasLimit(formatGasLimit(gasEstimate, networkId));
                        setL1Fee(l1FeeInWei);
                    } else {
                        const gasEstimate = await ongoingAirdropContractWithSigner.estimateGas.claim(
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
        if (!isWalletConnected || !isClaimAvailable || !ongoingAirdropContract) return;
        fetchGasLimit();
    }, [isWalletConnected, isClaimAvailable, ongoingAirdropContract]);

    const handleClaimOngoingAirdrop = async () => {
        setShowTooltip(false);
        if (isClaimAvailable && migratedRewards && migratedRewards.reward) {
            try {
                setTxErrorMessage(null);
                setIsClaiming(true);
                const ongoingAirdropContractWithSigner = ongoingAirdropContract.connect((snxJSConnector as any).signer);
                const tx = (await ongoingAirdropContractWithSigner.claim(
                    migratedRewards.reward.index,
                    migratedRewards.reward.rawBalance,
                    migratedRewards.reward.proof
                )) as ethers.ContractTransaction;
                const txResult = await tx.wait();

                if (txResult && txResult.transactionHash) {
                    dispatchMarketNotification(t('options.earn.thales-staking.staking-rewards.confirmation-message'));
                    refetchMigratedRewards(walletAddress, networkId);
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

    const balance = isClaimAvailable && migratedRewards && migratedRewards.reward ? migratedRewards.reward.balance : 0;

    return (
        <EarnSection
            orderOnMobile={3}
            orderOnTablet={3}
            style={{ gridColumn: 'span 10', gridRow: 'span 2', padding: 0, border: '0', background: 'transparent' }}
        >
            <SectionHeader>
                <div>{t('options.earn.thales-staking.staking-rewards.migrated-rewards.title')}</div>
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
                        <StyledMaterialTooltip
                            arrow={true}
                            title={t('options.earn.thales-staking.staking-rewards.button-tooltip') as string}
                            open={showTooltip}
                        >
                            <DefaultSubmitButton
                                onMouseOver={() => {
                                    setShowTooltip(true);
                                }}
                                onMouseOut={() => {
                                    setShowTooltip(false);
                                }}
                                onClick={handleClaimOngoingAirdrop}
                                disabled={!isClaimAvailable || isClaiming}
                            >
                                {isClaiming
                                    ? t('options.earn.thales-staking.staking-rewards.claiming') +
                                      ` ${formatCurrencyWithKey(THALES_CURRENCY, balance)}...`
                                    : t('options.earn.thales-staking.staking-rewards.claim') +
                                      ` ${formatCurrencyWithKey(THALES_CURRENCY, balance)}`}
                            </DefaultSubmitButton>
                        </StyledMaterialTooltip>
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
