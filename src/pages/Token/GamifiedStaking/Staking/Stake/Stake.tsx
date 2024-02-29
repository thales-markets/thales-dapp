import React, { useEffect, useMemo, useState } from 'react';
import { ClaimMessage, EarnSection, SectionContentContainer } from '../../../styled-components';
import { formatCurrency, formatCurrencyWithKey, truncToDecimals } from 'thales-utils';
import { THALES_CURRENCY } from 'constants/currency';
import NumericInput from 'components/fields/NumericInput';
import { InputContainer } from 'pages/Token/components/styled-components';
import useThalesBalanceQuery from 'queries/walletBalances/useThalesBalanceQuery';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { RootState } from 'types/ui';
import { getIsAppReady } from 'redux/modules/app';
import { getIsWalletConnected, getNetworkId, getWalletAddress } from 'redux/modules/wallet';
import snxJSConnector from 'utils/snxJSConnector';
import { BigNumber, ethers } from 'ethers';
import { checkAllowance } from 'utils/network';
import { refetchTokenQueries } from 'utils/queryConnector';
import styled from 'styled-components';
import { FlexDivColumnCentered } from 'styles/common';
import ApprovalModal from 'components/ApprovalModal';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { UserStakingData } from 'types/token';
import useUserStakingDataQuery from 'queries/token/useUserStakingData';
import Button from 'components/Button/Button';
import { getIsMobile } from 'redux/modules/ui';
import { toast } from 'react-toastify';
import {
    getDefaultToastContent,
    getErrorToastOptions,
    getLoadingToastOptions,
    getSuccessToastOptions,
} from 'components/ToastMessage/ToastMessage';

const Stake: React.FC = () => {
    const { t } = useTranslation();
    const { openConnectModal } = useConnectModal();
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
    const isWalletConnected = useSelector((state: RootState) => getIsWalletConnected(state));
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state)) || '';
    const isMobile = useSelector((state: RootState) => getIsMobile(state));

    const [amountToStake, setAmountToStake] = useState<number | string>('');
    const [isAmountValid, setIsAmountValid] = useState<boolean>(true);
    const [isAllowingStake, setIsAllowingStake] = useState<boolean>(false);
    const [isStaking, setIsStaking] = useState<boolean>(false);
    const [hasStakeAllowance, setStakeAllowance] = useState<boolean>(false);
    const [openApprovalModal, setOpenApprovalModal] = useState<boolean>(false);
    const { stakingThalesContract } = snxJSConnector as any;
    const [lastValidUserStakingData, setLastValidUserStakingData] = useState<UserStakingData | undefined>(undefined);

    const thalesBalanceQuery = useThalesBalanceQuery(walletAddress, networkId, {
        enabled: isAppReady && isWalletConnected,
    });

    const userStakingDataQuery = useUserStakingDataQuery(walletAddress, networkId, {
        enabled: isAppReady && isWalletConnected,
    });

    useEffect(() => {
        if (userStakingDataQuery.isSuccess && userStakingDataQuery.data) {
            setLastValidUserStakingData(userStakingDataQuery.data);
        }
    }, [userStakingDataQuery.isSuccess, userStakingDataQuery.data]);

    const userStakingData: UserStakingData | undefined = useMemo(() => {
        if (userStakingDataQuery.isSuccess && userStakingDataQuery.data) {
            return userStakingDataQuery.data;
        }
        return lastValidUserStakingData;
    }, [userStakingDataQuery.isSuccess, userStakingDataQuery.data, lastValidUserStakingData]);

    const thalesBalance =
        thalesBalanceQuery.isSuccess && thalesBalanceQuery.data ? Number(thalesBalanceQuery.data.balance) : 0;
    const isUnstaking = userStakingData && userStakingData.isUnstaking;
    const isStakingPaused = userStakingData && userStakingData.isPaused;

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
            if (isWalletConnected && thalesTokenContractWithSigner.signer) {
                getAllowance();
            }
        }
    }, [walletAddress, isWalletConnected, hasStakeAllowance, stakingThalesContract, amountToStake, isAllowingStake]);

    const handleStakeThales = async () => {
        const id = toast.loading(getDefaultToastContent(t('common.progress')), getLoadingToastOptions());

        try {
            setIsStaking(true);
            const stakingThalesContractWithSigner = stakingThalesContract.connect((snxJSConnector as any).signer);
            const amount = ethers.utils.parseEther(amountToStake.toString());
            const tx = await stakingThalesContractWithSigner.stake(amount);
            const txResult = await tx.wait();

            if (txResult && txResult.transactionHash) {
                toast.update(
                    id,
                    getSuccessToastOptions(t('thales-token.gamified-staking.staking.stake.confirmation-message'), id)
                );
                refetchTokenQueries(walletAddress, networkId);
                setAmountToStake('');
                setIsStaking(false);
            }
        } catch (e) {
            toast.update(id, getErrorToastOptions(t('common.errors.unknown-error-try-again'), id));
            setIsStaking(false);
        }
    };

    const handleAllowance = async (approveAmount: BigNumber) => {
        const id = toast.loading(getDefaultToastContent(t('common.progress')), getLoadingToastOptions());
        const { thalesTokenContract, signer } = snxJSConnector as any;
        const thalesTokenContractWithSigner = thalesTokenContract.connect(signer);

        const addressToApprove = stakingThalesContract.address;
        try {
            setIsAllowingStake(true);

            const tx = (await thalesTokenContractWithSigner.approve(
                addressToApprove,
                approveAmount
            )) as ethers.ContractTransaction;
            setOpenApprovalModal(false);
            const txResult = await tx.wait();
            if (txResult && txResult.transactionHash) {
                toast.update(id, getSuccessToastOptions(t(`common.transaction.successful`), id));
                setIsAllowingStake(false);
            }
        } catch (e) {
            console.log(e);
            toast.update(id, getErrorToastOptions(t('common.errors.unknown-error-try-again'), id));
            setIsAllowingStake(false);
            setOpenApprovalModal(false);
        }
    };

    const getStakeButton = () => {
        if (!isWalletConnected) {
            return <Button onClick={openConnectModal}>{t('common.wallet.connect-your-wallet')}</Button>;
        }
        if (insufficientBalance) {
            return <Button disabled={true}>{t(`common.errors.insufficient-balance`)}</Button>;
        }
        if (!isAmountEntered) {
            return <Button disabled={true}>{t(`common.errors.enter-amount`)}</Button>;
        }
        if (!hasStakeAllowance) {
            return (
                <Button disabled={isAllowingStake} onClick={() => setOpenApprovalModal(true)}>
                    {!isAllowingStake
                        ? t('common.enable-wallet-access.approve-label', { currencyKey: THALES_CURRENCY })
                        : t('common.enable-wallet-access.approve-progress-label', {
                              currencyKey: THALES_CURRENCY,
                          })}
                </Button>
            );
        }

        return (
            <Button disabled={isButtonDisabled} onClick={handleStakeThales}>
                {!isStaking
                    ? `${t('thales-token.gamified-staking.staking.stake.name')} ${formatCurrencyWithKey(
                          THALES_CURRENCY,
                          amountToStake
                      )}`
                    : `${t('thales-token.gamified-staking.staking.stake.staking')} ${formatCurrencyWithKey(
                          THALES_CURRENCY,
                          amountToStake
                      )}...`}
            </Button>
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
        <EarnSection spanOnTablet={5} orderOnMobile={4} orderOnTablet={4}>
            <SectionContentContainer>
                <InputContainer marginTop={isMobile ? 20 : 40}>
                    <NumericInput
                        value={amountToStake}
                        onChange={(_, value) => setAmountToStake(value)}
                        disabled={isStaking || isUnstaking || isStakingPaused}
                        currencyLabel={THALES_CURRENCY}
                        placeholder={t('common.enter-amount')}
                        label={t('thales-token.gamified-staking.staking.stake.amount-to-stake')}
                        onMaxButton={onMaxClick}
                        showValidation={!isAmountValid}
                        validationMessage={t(`common.errors.insufficient-balance-wallet`, {
                            currencyKey: THALES_CURRENCY,
                        })}
                        balance={
                            isWalletConnected ? `${t('common.balance')}: ${formatCurrency(thalesBalance)}` : undefined
                        }
                        isBalanceLoading={thalesBalanceQuery.isLoading}
                    />
                </InputContainer>
                <StakeButtonDiv>
                    {getStakeButton()}
                    {isStakingPaused && (
                        <ClaimMessage>{t('thales-token.gamified-staking.staking.stake.paused-message')}</ClaimMessage>
                    )}
                </StakeButtonDiv>
            </SectionContentContainer>
            {openApprovalModal && (
                <ApprovalModal
                    defaultAmount={amountToStake}
                    tokenSymbol={THALES_CURRENCY}
                    isNonStable={true}
                    isAllowing={isAllowingStake}
                    onSubmit={handleAllowance}
                    onClose={() => setOpenApprovalModal(false)}
                />
            )}
        </EarnSection>
    );
};

const StakeButtonDiv = styled(FlexDivColumnCentered)`
    padding-top: 151px;
    padding-bottom: 25px;
    align-items: center;
    @media (max-width: 1024px) {
        padding-top: 15px;
        padding-bottom: 5px;
    }
`;

export default Stake;
