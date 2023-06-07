import React, { useEffect, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { RootState } from 'redux/rootReducer';
import { getIsWalletConnected, getNetworkId, getWalletAddress } from 'redux/modules/wallet';
import { getIsAppReady } from 'redux/modules/app';
import snxJSConnector from 'utils/snxJSConnector';
import { ethers } from 'ethers';
import { MigratedRetroReward } from 'types/token';
import { formatCurrencyWithKey } from 'utils/formatters/number';
import { THALES_CURRENCY } from 'constants/currency';
import { refetchMigratedInvestorsRetroRewards, refetchUserTokenTransactions } from 'utils/queryConnector';
import { ButtonContainer, ClaimMessage, EarnSection, SectionHeader } from '../components';
import { Tip37Link } from '../../styled-components';
import { formatGasLimit, getIsOVM, getL1FeeInWei } from 'utils/network';
import NetworkFees from 'pages/Token/components/NetworkFees';
import {
    GridContainer,
    StakingRewardsContent,
    StakingRewardsItem,
    StakingRewardsLabel,
    GridAction,
} from '../gridComponents';
import useMigratedInvestorsRetroRewardsQuery from 'queries/token/useMigratedInvestorsRetroRewardsQuery';
import styled from 'styled-components';
import Tooltip from 'components/Tooltip/Tooltip';
import Button from 'components/Button';
import { toast } from 'react-toastify';
import {
    getDefaultToastContent,
    getErrorToastOptions,
    getLoadingToastOptions,
    getSuccessToastOptions,
} from 'components/ToastMessage/ToastMessage';

const ClaimMigratedRewards: React.FC = () => {
    const { t } = useTranslation();
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state)) || '';
    const isWalletConnected = useSelector((state: RootState) => getIsWalletConnected(state));
    const [migratedRewards, setMigratedRewards] = useState<MigratedRetroReward | undefined>(undefined);
    const [isClaiming, setIsClaiming] = useState(false);
    const [gasLimit, setGasLimit] = useState<number | null>(null);
    const [l1Fee, setL1Fee] = useState<number | null>(null);
    const isL2 = getIsOVM(networkId);
    const { unclaimedInvestorsRetroAirdropContract } = snxJSConnector as any;

    const isClaimAvailable =
        migratedRewards &&
        migratedRewards.reward &&
        migratedRewards.hasClaimRights &&
        !migratedRewards.claimed &&
        !migratedRewards.isPaused;

    const migratedRewardsQuery = useMigratedInvestorsRetroRewardsQuery(walletAddress, networkId, {
        enabled: isAppReady && isWalletConnected && !!unclaimedInvestorsRetroAirdropContract,
    });

    useEffect(() => {
        if (migratedRewardsQuery.isSuccess && migratedRewardsQuery.data) {
            setMigratedRewards(migratedRewardsQuery.data);
        }
    }, [migratedRewardsQuery.isSuccess, migratedRewardsQuery.data]);

    useEffect(() => {
        const fetchL1Fee = async (unclaimedInvestorsRetroAirdropContractWithSigner: any, migratedRewards: any) => {
            const txRequest = await unclaimedInvestorsRetroAirdropContractWithSigner.populateTransaction.claim(
                migratedRewards.reward.index,
                migratedRewards.reward.rawBalance,
                migratedRewards.reward.proof
            );
            return getL1FeeInWei(txRequest, snxJSConnector);
        };

        const fetchGasLimit = async () => {
            if (migratedRewards && migratedRewards.reward) {
                try {
                    const unclaimedInvestorsRetroAirdropContractWithSigner = unclaimedInvestorsRetroAirdropContract.connect(
                        (snxJSConnector as any).signer
                    );
                    if (isL2) {
                        const [gasEstimate, l1FeeInWei] = await Promise.all([
                            unclaimedInvestorsRetroAirdropContractWithSigner.estimateGas.claim(
                                migratedRewards.reward.index,
                                migratedRewards.reward.rawBalance,
                                migratedRewards.reward.proof
                            ),
                            fetchL1Fee(unclaimedInvestorsRetroAirdropContractWithSigner, migratedRewards),
                        ]);
                        setGasLimit(formatGasLimit(gasEstimate, networkId));
                        setL1Fee(l1FeeInWei);
                    } else {
                        const gasEstimate = await unclaimedInvestorsRetroAirdropContractWithSigner.estimateGas.claim(
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
        if (!isWalletConnected || !isClaimAvailable || !unclaimedInvestorsRetroAirdropContract) return;
        fetchGasLimit();
    }, [isWalletConnected, isClaimAvailable, unclaimedInvestorsRetroAirdropContract]);

    const handleClaimOngoingAirdrop = async () => {
        if (isClaimAvailable && migratedRewards && migratedRewards.reward) {
            const id = toast.loading(getDefaultToastContent(t('common.progress')), getLoadingToastOptions());
            try {
                setIsClaiming(true);
                const unclaimedInvestorsRetroAirdropContractWithSigner = unclaimedInvestorsRetroAirdropContract.connect(
                    (snxJSConnector as any).signer
                );
                const tx = (await unclaimedInvestorsRetroAirdropContractWithSigner.claim(
                    migratedRewards.reward.index,
                    migratedRewards.reward.rawBalance,
                    migratedRewards.reward.proof
                )) as ethers.ContractTransaction;
                const txResult = await tx.wait();

                if (txResult && txResult.transactionHash) {
                    toast.update(
                        id,
                        getSuccessToastOptions(
                            t('options.earn.thales-staking.staking-rewards.confirmation-message'),
                            id
                        )
                    );
                    refetchMigratedInvestorsRetroRewards(walletAddress, networkId);
                    refetchUserTokenTransactions(walletAddress, networkId);
                    setMigratedRewards({
                        ...migratedRewards,
                        claimed: true,
                    });
                    setIsClaiming(false);
                }
            } catch (e) {
                console.log(e);
                toast.update(id, getErrorToastOptions(t('common.errors.unknown-error-try-again'), id));
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
            style={{
                gridColumn: 'span 4',
                gridRow: 'span 2',
                padding: 0,
                border: '0',
                background: 'transparent',
            }}
        >
            <SectionHeader>
                <div>
                    {t('options.earn.thales-staking.staking-rewards.unclaimed-rewards.title')}
                    <Tooltip
                        overlay={
                            <Trans
                                i18nKey="options.earn.thales-staking.staking-rewards.unclaimed-rewards.info-tooltip"
                                components={[<span key="1" />, <Tip37Link key="2" />]}
                            />
                        }
                        iconFontSize={18}
                        mobileIconFontSize={15}
                        top={-1}
                    />
                </div>
            </SectionHeader>
            <GridContainer style={{ height: '100%' }}>
                <StyledStakingRewardsItem style={{ gridColumn: 'span 12' }}>
                    <StakingRewardsLabel>
                        {t('options.earn.thales-staking.staking-rewards.unclaimed-rewards.rewards-label')}
                    </StakingRewardsLabel>
                    <StakingRewardsContent>{formatCurrencyWithKey(THALES_CURRENCY, balance)}</StakingRewardsContent>
                </StyledStakingRewardsItem>
                <StyledGridAction>
                    <NetworkFees gasLimit={gasLimit} disabled={isClaiming} l1Fee={l1Fee} />
                    <ButtonContainer>
                        <Button onClick={handleClaimOngoingAirdrop} disabled={!isClaimAvailable || isClaiming}>
                            {isClaiming
                                ? t('options.earn.thales-staking.staking-rewards.claiming') +
                                  ` ${formatCurrencyWithKey(THALES_CURRENCY, balance)}...`
                                : t('options.earn.thales-staking.staking-rewards.claim') +
                                  ` ${formatCurrencyWithKey(THALES_CURRENCY, balance)}`}
                        </Button>
                        {migratedRewards && migratedRewards.isPaused && (
                            <ClaimMessage>
                                {t('options.earn.thales-staking.staking-rewards.paused-message')}
                            </ClaimMessage>
                        )}
                        {migratedRewards && !migratedRewards.isPaused && !migratedRewards.hasClaimRights && (
                            <ClaimMessage>
                                {t('options.earn.thales-staking.staking-rewards.not-eligible-message')}
                            </ClaimMessage>
                        )}
                        {migratedRewards &&
                            !migratedRewards.isPaused &&
                            migratedRewards.hasClaimRights &&
                            migratedRewards.claimed && (
                                <ClaimMessage>
                                    {t('options.earn.thales-staking.staking-rewards.migrated-rewards.claimed-message')}
                                </ClaimMessage>
                            )}
                    </ButtonContainer>
                </StyledGridAction>
            </GridContainer>
        </EarnSection>
    );
};

const StyledGridAction = styled(GridAction)`
    padding: 80px 20px 20px 20px;
`;

const StyledStakingRewardsItem = styled(StakingRewardsItem)`
    padding-top: 40px;
    padding-bottom: 40px;
`;

export default ClaimMigratedRewards;
