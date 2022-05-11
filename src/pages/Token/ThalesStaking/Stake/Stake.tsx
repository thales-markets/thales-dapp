import React, { useEffect, useState } from 'react';
import {
    ClaimMessage,
    EarnSection,
    FullRow,
    SectionContentContainer,
    SectionHeader,
    StyledInfoIcon,
    StyledMaterialTooltip,
} from '../../components';
import { formatCurrencyWithKey, truncToDecimals } from 'utils/formatters/number';
import { THALES_CURRENCY } from 'constants/currency';
import NumericInput from 'pages/Token/components/NumericInput';
import { CurrencyLabel, DefaultSubmitButton, InputContainer, InputLabel } from 'pages/Token/components/components';
import useThalesBalanceQuery from 'queries/walletBalances/useThalesBalanceQuery';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { RootState } from 'redux/rootReducer';
import { getIsAppReady } from 'redux/modules/app';
import { getIsWalletConnected, getNetworkId, getWalletAddress } from 'redux/modules/wallet';
import snxJSConnector from 'utils/snxJSConnector';
import { BigNumber, ethers } from 'ethers';
import ValidationMessage from 'components/ValidationMessage';
import NetworkFees from 'pages/Token/components/NetworkFees';
import { checkAllowance, formatGasLimit, getIsOVM, getL1FeeInWei } from 'utils/network';
import { refetchTokenQueries, refetchUserTokenTransactions } from 'utils/queryConnector';
import styled from 'styled-components';
import { dispatchMarketNotification } from 'utils/options';
import SimpleLoader from '../../components/SimpleLoader';
import { MaxButton, ThalesWalletAmountLabel } from '../../Migration/components';
import onboardConnector from 'utils/onboardConnector';
import FieldValidationMessage from 'components/FieldValidationMessage';
import useStakingThalesQuery from 'queries/staking/useStakingThalesQuery';
import { MAX_L2_GAS_LIMIT } from 'constants/options';
import { FlexDivColumnCentered } from 'theme/common';
import ApprovalModal from 'components/ApprovalModal';

const Stake: React.FC = () => {
    const { t } = useTranslation();
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
    const isWalletConnected = useSelector((state: RootState) => getIsWalletConnected(state));
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state)) || '';
    const [amountToStake, setAmountToStake] = useState<number | string>('');
    const [isAmountValid, setIsAmountValid] = useState<boolean>(true);
    const [isAllowingStake, setIsAllowingStake] = useState<boolean>(false);
    const [isStaking, setIsStaking] = useState<boolean>(false);
    const [hasStakeAllowance, setStakeAllowance] = useState<boolean>(false);
    const [txErrorMessage, setTxErrorMessage] = useState<string | null>(null);
    const [gasLimit, setGasLimit] = useState<number | null>(null);
    const [l1Fee, setL1Fee] = useState<number | null>(null);
    const [openApprovalModal, setOpenApprovalModal] = useState<boolean>(false);
    const isL2 = getIsOVM(networkId);
    const { stakingThalesContract } = snxJSConnector as any;

    const thalesBalanceQuery = useThalesBalanceQuery(walletAddress, networkId, {
        enabled: isAppReady && isWalletConnected,
    });
    const stakingThalesQuery = useStakingThalesQuery(walletAddress, networkId, {
        enabled: isAppReady && isWalletConnected,
    });

    const thalesBalance =
        thalesBalanceQuery.isSuccess && thalesBalanceQuery.data ? Number(thalesBalanceQuery.data.balance) : 0;
    const isUnstaking = stakingThalesQuery.isSuccess && stakingThalesQuery.data && stakingThalesQuery.data.isUnstaking;
    const isStakingPaused = stakingThalesQuery.isSuccess && stakingThalesQuery.data && stakingThalesQuery.data.paused;

    const isAmountEntered = Number(amountToStake) > 0;
    const insufficientBalance = Number(amountToStake) > thalesBalance || !thalesBalance;
    const isButtonDisabled =
        isStaking ||
        !stakingThalesContract ||
        isUnstaking ||
        !isAmountEntered ||
        insufficientBalance ||
        !isWalletConnected ||
        isStakingPaused ||
        !hasStakeAllowance;

    useEffect(() => {
        if (!!stakingThalesContract) {
            const { thalesTokenContract } = snxJSConnector as any;
            const thalesTokenContractWithSigner = thalesTokenContract.connect((snxJSConnector as any).signer);
            const addressToApprove = stakingThalesContract.address;
            const getAllowance = async () => {
                try {
                    const parsedStakeAmount = ethers.utils.parseEther(Number(amountToStake).toString());
                    const allowance = await checkAllowance(
                        parsedStakeAmount,
                        thalesTokenContractWithSigner,
                        walletAddress,
                        addressToApprove
                    );
                    setStakeAllowance(allowance);
                } catch (e) {
                    console.log(e);
                }
            };
            if (isWalletConnected) {
                getAllowance();
            }
        }
    }, [walletAddress, isWalletConnected, hasStakeAllowance, stakingThalesContract, amountToStake, isAllowingStake]);

    useEffect(() => {
        const fetchL1Fee = async (stakingThalesContractWithSigner: any, amount: any) => {
            const txRequest = await stakingThalesContractWithSigner.populateTransaction.stake(amount);
            return getL1FeeInWei(txRequest);
        };

        const fetchGasLimit = async () => {
            const amount = ethers.utils.parseEther(amountToStake.toString());
            try {
                const stakingThalesContractWithSigner = stakingThalesContract.connect((snxJSConnector as any).signer);
                if (isL2) {
                    const [gasEstimate, l1FeeInWei] = await Promise.all([
                        stakingThalesContractWithSigner.estimateGas.stake(amount),
                        fetchL1Fee(stakingThalesContractWithSigner, amount),
                    ]);
                    setGasLimit(formatGasLimit(gasEstimate, networkId));
                    setL1Fee(l1FeeInWei);
                } else {
                    const gasEstimate = await stakingThalesContractWithSigner.estimateGas.stake(amount);
                    setGasLimit(formatGasLimit(gasEstimate, networkId));
                }
            } catch (e) {
                console.log(e);
                setGasLimit(null);
            }
        };
        if (isButtonDisabled) return;
        fetchGasLimit();
    }, [isButtonDisabled, amountToStake, hasStakeAllowance, walletAddress]);

    const handleStakeThales = async () => {
        try {
            setTxErrorMessage(null);
            setIsStaking(true);
            const stakingThalesContractWithSigner = stakingThalesContract.connect((snxJSConnector as any).signer);
            const amount = ethers.utils.parseEther(amountToStake.toString());
            const tx = await stakingThalesContractWithSigner.stake(amount, { gasLimit: MAX_L2_GAS_LIMIT });
            const txResult = await tx.wait();

            if (txResult && txResult.transactionHash) {
                dispatchMarketNotification(t('options.earn.thales-staking.stake.confirmation-message'));
                refetchTokenQueries(walletAddress, networkId);
                refetchUserTokenTransactions(walletAddress, networkId);
                setAmountToStake('');
                setIsStaking(false);
            }
        } catch (e) {
            setTxErrorMessage(t('common.errors.unknown-error-try-again'));
            setIsStaking(false);
        }
    };

    const handleAllowance = async (approveAmount: BigNumber) => {
        const { thalesTokenContract } = snxJSConnector as any;
        const thalesTokenContractWithSigner = thalesTokenContract.connect((snxJSConnector as any).signer);

        const addressToApprove = stakingThalesContract.address;
        try {
            setIsAllowingStake(true);
            const gasEstimate = await thalesTokenContractWithSigner.estimateGas.approve(
                addressToApprove,
                approveAmount
            );
            const tx = (await thalesTokenContractWithSigner.approve(addressToApprove, approveAmount, {
                gasLimit: formatGasLimit(gasEstimate, networkId),
            })) as ethers.ContractTransaction;
            setOpenApprovalModal(false);
            const txResult = await tx.wait();
            if (txResult && txResult.transactionHash) {
                setIsAllowingStake(false);
            }
        } catch (e) {
            console.log(e);
            setTxErrorMessage(t('common.errors.unknown-error-try-again'));
            setIsAllowingStake(false);
            setOpenApprovalModal(false);
        }
    };

    const getStakeButton = () => {
        if (!isWalletConnected) {
            return (
                <DefaultSubmitButton onClick={() => onboardConnector.connectWallet()}>
                    {t('common.wallet.connect-your-wallet')}
                </DefaultSubmitButton>
            );
        }
        if (insufficientBalance) {
            return <DefaultSubmitButton disabled={true}>{t(`common.errors.insufficient-balance`)}</DefaultSubmitButton>;
        }
        if (!isAmountEntered) {
            return <DefaultSubmitButton disabled={true}>{t(`common.errors.enter-amount`)}</DefaultSubmitButton>;
        }
        if (!hasStakeAllowance) {
            return (
                <DefaultSubmitButton disabled={isAllowingStake} onClick={() => setOpenApprovalModal(true)}>
                    {!isAllowingStake
                        ? t('common.enable-wallet-access.approve-label', { currencyKey: THALES_CURRENCY })
                        : t('common.enable-wallet-access.approve-progress-label', {
                              currencyKey: THALES_CURRENCY,
                          })}
                </DefaultSubmitButton>
            );
        }

        return (
            <DefaultSubmitButton disabled={isButtonDisabled} onClick={handleStakeThales}>
                {!isStaking
                    ? `${t('options.earn.thales-staking.stake.stake')} ${formatCurrencyWithKey(
                          THALES_CURRENCY,
                          amountToStake
                      )}`
                    : `${t('options.earn.thales-staking.stake.staking')} ${formatCurrencyWithKey(
                          THALES_CURRENCY,
                          amountToStake
                      )}...`}
            </DefaultSubmitButton>
        );
    };

    const onMaxClick = () => {
        setAmountToStake(truncToDecimals(thalesBalance, 8));
    };

    useEffect(() => {
        setIsAmountValid(
            Number(amountToStake) === 0 || (Number(amountToStake) > 0 && Number(amountToStake) <= thalesBalance)
        );
    }, [amountToStake, thalesBalance]);

    return (
        <EarnSection
            spanOnTablet={5}
            orderOnMobile={4}
            orderOnTablet={4}
            style={{ gridColumn: 'span 5', gridRow: 'span 2' }}
        >
            <SectionHeader>
                <div>
                    {t('options.earn.thales-staking.stake.stake')}
                    <StyledMaterialTooltip
                        arrow={true}
                        title={t('options.earn.thales-staking.stake.info-tooltip') as string}
                        interactive
                    >
                        <StyledInfoIcon />
                    </StyledMaterialTooltip>
                </div>
            </SectionHeader>
            <SectionContentContainer style={{ height: '100%' }}>
                <InputContainer>
                    <NumericInput
                        value={amountToStake}
                        onChange={(_, value) => setAmountToStake(value)}
                        disabled={isStaking || isUnstaking || isStakingPaused}
                        className={isAmountValid ? '' : 'error'}
                    />
                    <InputLabel>{t('options.earn.thales-staking.stake.amount-to-stake')}</InputLabel>
                    <CurrencyLabel className={isStaking || isUnstaking || isStakingPaused ? 'disabled' : ''}>
                        {THALES_CURRENCY}
                    </CurrencyLabel>
                    <ThalesWalletAmountLabel>
                        {isWalletConnected ? (
                            thalesBalanceQuery.isLoading ? (
                                <SimpleLoader />
                            ) : (
                                formatCurrencyWithKey(THALES_CURRENCY, thalesBalance)
                            )
                        ) : (
                            '-'
                        )}
                        <MaxButton
                            disabled={isStaking || isUnstaking || isStakingPaused || !isWalletConnected}
                            onClick={onMaxClick}
                        >
                            {t('common.max')}
                        </MaxButton>
                    </ThalesWalletAmountLabel>
                    <FieldValidationMessage
                        showValidation={!isAmountValid}
                        message={t(`common.errors.insufficient-balance-wallet`, { currencyKey: THALES_CURRENCY })}
                    />
                </InputContainer>
                <NetworkFees gasLimit={gasLimit} disabled={isStaking} l1Fee={l1Fee} />
                <StakeButtonDiv>
                    {getStakeButton()}
                    {isStakingPaused && (
                        <ClaimMessage>{t('options.earn.thales-staking.stake.paused-message')}</ClaimMessage>
                    )}
                </StakeButtonDiv>
                <FullRow>
                    <ValidationMessage
                        showValidation={txErrorMessage !== null}
                        message={txErrorMessage}
                        onDismiss={() => setTxErrorMessage(null)}
                    />
                </FullRow>
            </SectionContentContainer>
            {openApprovalModal && (
                <ApprovalModal
                    defaultAmount={amountToStake}
                    tokenSymbol={THALES_CURRENCY}
                    isAllowing={isAllowingStake}
                    onSubmit={handleAllowance}
                    onClose={() => setOpenApprovalModal(false)}
                />
            )}
        </EarnSection>
    );
};

const StakeButtonDiv = styled(FlexDivColumnCentered)`
    padding-top: 40px;
    align-items: center;
    @media (max-width: 1024px) {
        padding-top: 15px;
    }
`;

export default Stake;
