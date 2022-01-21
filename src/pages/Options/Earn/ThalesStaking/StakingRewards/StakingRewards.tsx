import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from 'theme/common';
import { useSelector } from 'react-redux';
import { RootState } from 'redux/rootReducer';
import { getIsWalletConnected, getNetworkId, getWalletAddress } from 'redux/modules/wallet';
import { getIsAppReady } from 'redux/modules/app';
import snxJSConnector from 'utils/snxJSConnector';
import ValidationMessage from 'components/ValidationMessage/ValidationMessage';
import useOngoingAirdropQuery from 'queries/walletBalances/useOngoingAirdropQuery';
import { ethers } from 'ethers';
import { StakingReward } from 'types/token';
import { formatCurrencyWithKey } from 'utils/formatters/number';
import { THALES_CURRENCY } from 'constants/currency';
import { refetchOngoingAirdrop, refetchUserTokenTransactions } from 'utils/queryConnector';
import { ButtonContainer, ClaimMessage, EarnSection, SectionHeader, StyledMaterialTooltip } from '../../components';
import { formatGasLimit, getIsOVM, getL1FeeInWei } from 'utils/network';
import NetworkFees from 'pages/Options/components/NetworkFees';
import { bigNumberFormatter } from '../../../../../utils/formatters/ethers';
import { dispatchMarketNotification } from 'utils/options';
import TimeRemaining from 'pages/Options/components/TimeRemaining';
import {
    GridContainer,
    StakingRewardsContent,
    StakingRewardsItem,
    StakingRewardsLabel,
    GridAction,
} from '../../gridComponents';

type Properties = {
    escrowedBalance: number;
    setEscrowedBalance: (escrowed: number) => void;
};

const StakingRewards: React.FC<Properties> = ({ escrowedBalance, setEscrowedBalance }) => {
    const { t } = useTranslation();
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state)) || '';
    const isWalletConnected = useSelector((state: RootState) => getIsWalletConnected(state));
    const [txErrorMessage, setTxErrorMessage] = useState<string | null>(null);
    const [ongoingAirdrop, setOngoingAirdrop] = useState<StakingReward | undefined>(undefined);
    const [isClaiming, setIsClaiming] = useState(false);
    const [gasLimit, setGasLimit] = useState<number | null>(null);
    const [showTooltip, setShowTooltip] = useState<boolean>(false);
    const [l1Fee, setL1Fee] = useState<number | null>(null);
    const isL2 = getIsOVM(networkId);
    const { ongoingAirdropContract } = snxJSConnector as any;

    const isClaimAvailable =
        ongoingAirdrop &&
        ongoingAirdrop.reward &&
        ongoingAirdrop.hasClaimRights &&
        !ongoingAirdrop.claimed &&
        !ongoingAirdrop.isClaimPaused;

    const ongoingAirdropQuery = useOngoingAirdropQuery(walletAddress, networkId, {
        enabled: isAppReady && isWalletConnected && !!ongoingAirdropContract,
    });

    useEffect(() => {
        if (ongoingAirdropQuery.isSuccess && ongoingAirdropQuery.data) {
            setOngoingAirdrop(ongoingAirdropQuery.data);
        }
    }, [ongoingAirdropQuery.isSuccess, ongoingAirdropQuery.data]);

    useEffect(() => {
        const fetchL1Fee = async (ongoingAirdropContractWithSigner: any, ongoingAirdrop: any) => {
            const txRequest = await ongoingAirdropContractWithSigner.populateTransaction.claim(
                ongoingAirdrop.reward.index,
                ongoingAirdrop.reward.rawBalance,
                ongoingAirdrop.reward.proof
            );
            return getL1FeeInWei(txRequest);
        };

        const fetchGasLimit = async () => {
            if (ongoingAirdrop && ongoingAirdrop.reward) {
                try {
                    const ongoingAirdropContractWithSigner = ongoingAirdropContract.connect(
                        (snxJSConnector as any).signer
                    );
                    if (isL2) {
                        const [gasEstimate, l1FeeInWei] = await Promise.all([
                            ongoingAirdropContractWithSigner.estimateGas.claim(
                                ongoingAirdrop.reward.index,
                                ongoingAirdrop.reward.rawBalance,
                                ongoingAirdrop.reward.proof
                            ),
                            fetchL1Fee(ongoingAirdropContractWithSigner, ongoingAirdrop),
                        ]);
                        setGasLimit(formatGasLimit(gasEstimate, networkId));
                        setL1Fee(l1FeeInWei);
                    } else {
                        const gasEstimate = await ongoingAirdropContractWithSigner.estimateGas.claim(
                            ongoingAirdrop.reward.index,
                            ongoingAirdrop.reward.rawBalance,
                            ongoingAirdrop.reward.proof
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
        if (isClaimAvailable && ongoingAirdrop && ongoingAirdrop.reward) {
            try {
                setTxErrorMessage(null);
                setIsClaiming(true);
                const ongoingAirdropContractWithSigner = ongoingAirdropContract.connect((snxJSConnector as any).signer);
                const tx = (await ongoingAirdropContractWithSigner.claim(
                    ongoingAirdrop.reward.index,
                    ongoingAirdrop.reward.rawBalance,
                    ongoingAirdrop.reward.proof,
                    {
                        gasLimit,
                    }
                )) as ethers.ContractTransaction;
                const txResult = await tx.wait();

                if (txResult && txResult.transactionHash) {
                    dispatchMarketNotification(t('options.earn.thales-staking.staking-rewards.confirmation-message'));
                    refetchOngoingAirdrop(walletAddress, networkId);
                    refetchUserTokenTransactions(walletAddress, networkId);
                    setOngoingAirdrop({
                        ...ongoingAirdrop,
                        claimed: true,
                    });
                    setEscrowedBalance(escrowedBalance + bigNumberFormatter(ongoingAirdrop.reward.rawBalance));
                    setIsClaiming(false);
                }
            } catch (e) {
                console.log(e);
                setTxErrorMessage(t('common.errors.unknown-error-try-again'));
                setIsClaiming(false);
            }
        }
    };

    const balance = isClaimAvailable && ongoingAirdrop && ongoingAirdrop.reward ? ongoingAirdrop.reward.balance : 0;
    // const stakingBalance =
    //     isClaimAvailable && ongoingAirdrop && ongoingAirdrop.reward ? ongoingAirdrop.reward.stakingBalance : 0;
    // const snxBalance =
    //     isClaimAvailable && ongoingAirdrop && ongoingAirdrop.reward ? ongoingAirdrop.reward.snxBalance : 0;
    // const previousBalance =
    //     isClaimAvailable && ongoingAirdrop && ongoingAirdrop.reward ? ongoingAirdrop.reward.previousBalance : 0;

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
                    {ongoingAirdrop ? (
                        <TimeRemaining end={ongoingAirdrop.closingDate} fontSize={20} showFullCounter />
                    ) : (
                        '-'
                    )}
                </div>
            </SectionHeader>
            <GridContainer>
                <StakingRewardsItem style={{ padding: 15 }}>Weekly rewards</StakingRewardsItem>
                <StakingRewardsItem style={{ gridColumn: 'span 9', padding: 15 }}>Bonus rewards</StakingRewardsItem>
                <StakingRewardsItem>
                    <StakingRewardsLabel color="#64D9FE">Thales staking</StakingRewardsLabel>
                    <StakingRewardsContent>300 opTHALES</StakingRewardsContent>
                </StakingRewardsItem>
                <StakingRewardsItem>
                    <StakingRewardsLabel color="linear-gradient(154.67deg, #1AAB9B 17.5%, #64D9FE 95.42%)">
                        SNX staking
                    </StakingRewardsLabel>
                    <StakingRewardsContent>50 opTHALES</StakingRewardsContent>
                </StakingRewardsItem>
                <StakingRewardsItem>
                    <StakingRewardsLabel color="linear-gradient(87.09deg, #FFB636 -1%, #F55C05 106%)">
                        AMM
                    </StakingRewardsLabel>
                    <StakingRewardsContent>50 opTHALES</StakingRewardsContent>
                </StakingRewardsItem>
                <StakingRewardsItem>
                    <StakingRewardsLabel color="linear-gradient(87.09deg, #9AB676 -1%, #0F803C 106.68%);">
                        Thales Royale
                    </StakingRewardsLabel>
                    <StakingRewardsContent>10 opTHALES</StakingRewardsContent>
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
                                      ` ${formatCurrencyWithKey(THALES_CURRENCY, balance)}...`
                                    : t('options.earn.thales-staking.staking-rewards.claim') +
                                      ` ${formatCurrencyWithKey(THALES_CURRENCY, balance)}`}
                            </Button>
                        </StyledMaterialTooltip>
                        {ongoingAirdrop && ongoingAirdrop.isClaimPaused && (
                            <ClaimMessage>
                                {t('options.earn.thales-staking.staking-rewards.paused-message')}
                            </ClaimMessage>
                        )}
                        {ongoingAirdrop && !ongoingAirdrop.isClaimPaused && !ongoingAirdrop.hasClaimRights && (
                            <ClaimMessage>
                                {t('options.earn.thales-staking.staking-rewards.not-eligible-message')}
                            </ClaimMessage>
                        )}
                        {ongoingAirdrop &&
                            ongoingAirdrop.hasClaimRights &&
                            !ongoingAirdrop.isClaimPaused &&
                            ongoingAirdrop.claimed && (
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
