import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from 'theme/common';
import { useSelector } from 'react-redux';
import { RootState } from 'redux/rootReducer';
import { getIsWalletConnected, getNetworkId, getWalletAddress } from 'redux/modules/wallet';
import { getIsAppReady } from 'redux/modules/app';
import snxJSConnector from 'utils/snxJSConnector';
import ValidationMessage from 'components/ValidationMessage/ValidationMessage';
import { ethers } from 'ethers';
import { StakingReward } from 'types/token';
import { formatCurrencyWithKey } from 'utils/formatters/number';
import { THALES_CURRENCY } from 'constants/currency';
import { refetchStakingRewards, refetchUserTokenTransactions } from 'utils/queryConnector';
import {
    BonusRewardButton,
    BonusRewardInnerButton,
    ButtonContainer,
    ClaimMessage,
    EarnSection,
    SectionHeader,
    StyledMaterialTooltip,
} from '../../components';
import { formatGasLimit, getIsOVM, getL1FeeInWei } from 'utils/network';
import NetworkFees from 'pages/Options/components/NetworkFees';
import { dispatchMarketNotification } from 'utils/options';
import TimeRemaining from 'pages/Options/components/TimeRemaining';
import {
    GridContainer,
    StakingRewardsContent,
    StakingRewardsItem,
    StakingRewardsLabel,
    GridAction,
    StakingRewardsNotice,
    StakingRewardsHeaderLabel,
} from '../../gridComponents';
import useStakingRewardsQuery from 'queries/token/useStakingRewardsQuery';

type StakingRewardsProps = {
    escrowedBalance: number;
    setEscrowedBalance: (escrowed: number) => void;
};

const StakingRewards: React.FC<StakingRewardsProps> = ({ escrowedBalance, setEscrowedBalance }) => {
    const { t } = useTranslation();
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state)) || '';
    const isWalletConnected = useSelector((state: RootState) => getIsWalletConnected(state));
    const [txErrorMessage, setTxErrorMessage] = useState<string | null>(null);
    const [stakingRewards, setStakingRewards] = useState<StakingReward | undefined>(undefined);
    const [isClaiming, setIsClaiming] = useState(false);
    const [gasLimit, setGasLimit] = useState<number | null>(null);
    const [showTooltip, setShowTooltip] = useState<boolean>(false);
    const [l1Fee, setL1Fee] = useState<number | null>(null);
    const isL2 = getIsOVM(networkId);
    const { stakingThalesContract } = snxJSConnector as any;

    const isClaimAvailable =
        stakingRewards && stakingRewards.hasClaimRights && !stakingRewards.claimed && !stakingRewards.isClaimPaused;

    const stakingRewardsQuery = useStakingRewardsQuery(walletAddress, networkId, {
        enabled: isAppReady && isWalletConnected && !!stakingThalesContract,
    });

    useEffect(() => {
        if (stakingRewardsQuery.isSuccess && stakingRewardsQuery.data) {
            setStakingRewards(stakingRewardsQuery.data);
        }
    }, [stakingRewardsQuery.isSuccess, stakingRewardsQuery.data]);

    useEffect(() => {
        const fetchL1Fee = async (stakingThalesContractWithSigner: any) => {
            const txRequest = await stakingThalesContractWithSigner.populateTransaction.claimReward();
            return getL1FeeInWei(txRequest);
        };

        const fetchGasLimit = async () => {
            if (stakingRewards) {
                try {
                    const stakingThalesContractWithSigner = stakingThalesContract.connect(
                        (snxJSConnector as any).signer
                    );
                    if (isL2) {
                        const [gasEstimate, l1FeeInWei] = await Promise.all([
                            stakingThalesContractWithSigner.estimateGas.claimReward(),
                            fetchL1Fee(stakingThalesContractWithSigner),
                        ]);
                        setGasLimit(formatGasLimit(gasEstimate, networkId));
                        setL1Fee(l1FeeInWei);
                    } else {
                        const gasEstimate = await stakingThalesContractWithSigner.estimateGas.claimReward();
                        setGasLimit(formatGasLimit(gasEstimate, networkId));
                    }
                } catch (e) {
                    console.log(e);
                    setGasLimit(null);
                }
            }
        };
        if (!isWalletConnected || !isClaimAvailable || !stakingThalesContract) return;
        fetchGasLimit();
    }, [isWalletConnected, isClaimAvailable, stakingThalesContract]);

    const handleClaimOngoingAirdrop = async () => {
        setShowTooltip(false);
        if (isClaimAvailable && stakingRewards) {
            try {
                setTxErrorMessage(null);
                setIsClaiming(true);
                const stakingThalesContractWithSigner = stakingThalesContract.connect((snxJSConnector as any).signer);
                const tx = (await stakingThalesContractWithSigner.claimReward({
                    gasLimit,
                })) as ethers.ContractTransaction;
                const txResult = await tx.wait();

                if (txResult && txResult.transactionHash) {
                    dispatchMarketNotification(t('options.earn.thales-staking.staking-rewards.confirmation-message'));
                    refetchStakingRewards(walletAddress, networkId);
                    refetchUserTokenTransactions(walletAddress, networkId);
                    setStakingRewards({
                        ...stakingRewards,
                        claimed: true,
                    });
                    setEscrowedBalance(escrowedBalance + stakingRewards.rewards);
                    setIsClaiming(false);
                }
            } catch (e) {
                console.log(e);
                setTxErrorMessage(t('common.errors.unknown-error-try-again'));
                setIsClaiming(false);
            }
        }
    };

    const rewards = isClaimAvailable && stakingRewards ? stakingRewards.rewards : 0;
    const baseRewards = isClaimAvailable && stakingRewards ? stakingRewards.baseRewards : 0;
    const snxBonus = isClaimAvailable && stakingRewards ? stakingRewards.snxBonus : 0;
    const ammBonus = isClaimAvailable && stakingRewards ? stakingRewards.ammBonus : 0;
    const thalesRoyaleBonus = isClaimAvailable && stakingRewards ? stakingRewards.thalesRoyaleBonus : 0;
    const maxSnxBonus = isClaimAvailable && stakingRewards ? stakingRewards.maxSnxBonus : 0;
    const maxAmmBonus = isClaimAvailable && stakingRewards ? stakingRewards.maxAmmBonus : 0;
    const maxThalesRoyaleBonus = isClaimAvailable && stakingRewards ? stakingRewards.maxThalesRoyaleBonus : 0;

    return (
        <EarnSection
            orderOnMobile={3}
            orderOnTablet={3}
            style={{ gridColumn: 'span 10', gridRow: 'span 2', padding: 0, border: '0', background: 'transparent' }}
        >
            <SectionHeader>
                <div>{t('options.earn.thales-staking.staking-rewards.title')}</div>
                <div>
                    {t('options.earn.thales-staking.staking-rewards.period')}:{' '}
                    {stakingRewards ? (
                        <TimeRemaining end={stakingRewards.closingDate} fontSize={20} showFullCounter />
                    ) : (
                        '-'
                    )}
                </div>
            </SectionHeader>
            <GridContainer>
                <StakingRewardsItem style={{ padding: 15 }}>
                    <StakingRewardsHeaderLabel>
                        {t('options.earn.thales-staking.staking-rewards.weekly-base-rewards')}
                    </StakingRewardsHeaderLabel>
                    <StakingRewardsNotice>70.000 THALES</StakingRewardsNotice>
                </StakingRewardsItem>
                <StakingRewardsItem style={{ gridColumn: 'span 9', padding: 15 }}>
                    <StakingRewardsHeaderLabel>
                        {t('options.earn.thales-staking.staking-rewards.weekly-bonus-rewards')}
                    </StakingRewardsHeaderLabel>
                    <StakingRewardsNotice>21.000 THALES</StakingRewardsNotice>
                </StakingRewardsItem>
                <StakingRewardsItem>
                    <StakingRewardsLabel color="#64D9FE">
                        {t('options.earn.thales-staking.staking-rewards.thales-staking-label')}
                    </StakingRewardsLabel>
                    <StakingRewardsContent>{formatCurrencyWithKey(THALES_CURRENCY, baseRewards)}</StakingRewardsContent>
                </StakingRewardsItem>
                <StakingRewardsItem>
                    <StakingRewardsLabel color="linear-gradient(154.67deg, #1AAB9B 17.5%, #64D9FE 95.42%)">
                        {t('options.earn.thales-staking.staking-rewards.snx-staking-label')}
                    </StakingRewardsLabel>
                    <StakingRewardsNotice>
                        {t('options.earn.thales-staking.staking-rewards.max-reward-label', {
                            max: formatCurrencyWithKey(THALES_CURRENCY, maxSnxBonus),
                        })}
                    </StakingRewardsNotice>
                    <StakingRewardsContent>{formatCurrencyWithKey(THALES_CURRENCY, snxBonus)}</StakingRewardsContent>
                    <BonusRewardButton>
                        <BonusRewardInnerButton>
                            {t('options.earn.thales-staking.staking-rewards.bonus-button.snx-staking-label')}
                        </BonusRewardInnerButton>
                    </BonusRewardButton>
                </StakingRewardsItem>
                <StakingRewardsItem>
                    <StakingRewardsLabel color="linear-gradient(87.09deg, #FFB636 -1%, #F55C05 106%)">
                        {t('options.earn.thales-staking.staking-rewards.amm-label')}
                    </StakingRewardsLabel>
                    <StakingRewardsNotice>
                        {t('options.earn.thales-staking.staking-rewards.max-reward-label', {
                            max: formatCurrencyWithKey(THALES_CURRENCY, maxAmmBonus),
                        })}
                    </StakingRewardsNotice>
                    <StakingRewardsContent>{formatCurrencyWithKey(THALES_CURRENCY, ammBonus)}</StakingRewardsContent>
                    <BonusRewardButton>
                        <BonusRewardInnerButton>
                            {t('options.earn.thales-staking.staking-rewards.bonus-button.amm-label')}
                        </BonusRewardInnerButton>
                    </BonusRewardButton>
                </StakingRewardsItem>
                <StakingRewardsItem>
                    <StakingRewardsLabel color="linear-gradient(87.09deg, #9AB676 -1%, #0F803C 106.68%)">
                        {t('options.earn.thales-staking.staking-rewards.thales-royale-label')}
                    </StakingRewardsLabel>
                    <StakingRewardsNotice>
                        {t('options.earn.thales-staking.staking-rewards.max-reward-label', {
                            max: formatCurrencyWithKey(THALES_CURRENCY, maxThalesRoyaleBonus),
                        })}
                    </StakingRewardsNotice>
                    <StakingRewardsContent>
                        {formatCurrencyWithKey(THALES_CURRENCY, thalesRoyaleBonus)}
                    </StakingRewardsContent>
                    <BonusRewardButton>
                        <BonusRewardInnerButton>
                            {t('options.earn.thales-staking.staking-rewards.bonus-button.thales-royale-label')}
                        </BonusRewardInnerButton>
                    </BonusRewardButton>
                </StakingRewardsItem>
                <GridAction>
                    <NetworkFees gasLimit={gasLimit} disabled={isClaiming} l1Fee={l1Fee} />
                    <ButtonContainer>
                        <StyledMaterialTooltip
                            arrow={true}
                            title={t('options.earn.thales-staking.staking-rewards.button-tooltip') as string}
                            open={showTooltip}
                        >
                            <Button
                                onMouseOver={() => {
                                    setShowTooltip(true);
                                }}
                                onMouseOut={() => {
                                    setShowTooltip(false);
                                }}
                                onClick={handleClaimOngoingAirdrop}
                                disabled={!isClaimAvailable || isClaiming}
                                className="primary"
                            >
                                {isClaiming
                                    ? t('options.earn.thales-staking.staking-rewards.claiming') +
                                      ` ${formatCurrencyWithKey(THALES_CURRENCY, rewards)}...`
                                    : t('options.earn.thales-staking.staking-rewards.claim') +
                                      ` ${formatCurrencyWithKey(THALES_CURRENCY, rewards)}`}
                            </Button>
                        </StyledMaterialTooltip>
                        {stakingRewards && stakingRewards.isClaimPaused && (
                            <ClaimMessage>
                                {t('options.earn.thales-staking.staking-rewards.paused-message')}
                            </ClaimMessage>
                        )}
                        {stakingRewards && !stakingRewards.isClaimPaused && !stakingRewards.hasClaimRights && (
                            <ClaimMessage>
                                {t('options.earn.thales-staking.staking-rewards.not-eligible-message')}
                            </ClaimMessage>
                        )}
                        {stakingRewards &&
                            stakingRewards.hasClaimRights &&
                            !stakingRewards.isClaimPaused &&
                            stakingRewards.claimed && (
                                <ClaimMessage>
                                    {t('options.earn.thales-staking.staking-rewards.claimed-message')}
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

export default StakingRewards;
