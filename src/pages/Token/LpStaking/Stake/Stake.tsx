import React, { useEffect, useState } from 'react';
import { ClaimMessage, EarnSection, SectionContentContainer } from '../../styled-components';
import { formatCurrency, formatCurrencyWithKey, truncToDecimals } from 'utils/formatters/number';
import NumericInput from 'components/fields/NumericInput';
import { InputContainer } from 'pages/Token/components/styled-components';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { RootState } from 'redux/rootReducer';
import { getIsAppReady } from 'redux/modules/app';
import { getIsWalletConnected, getNetworkId, getWalletAddress } from 'redux/modules/wallet';
import snxJSConnector from 'utils/snxJSConnector';
import { BigNumber, ethers } from 'ethers';
import { checkAllowance } from 'utils/network';
import { refetchTokenQueries, refetchLPStakingQueries } from 'utils/queryConnector';
import styled from 'styled-components';
import { FlexDivColumnCentered } from 'styles/common';
import useGelatoUserBalanceQuery from 'queries/token/useGelatoUserBalanceQuery';
import { LP_TOKEN } from 'constants/currency';
import ApprovalModal from 'components/ApprovalModal';
import { getMaxGasLimitForNetwork } from 'constants/options';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import Button from 'components/Button/Button';
import { toast } from 'react-toastify';
import {
    getDefaultToastContent,
    getErrorToastOptions,
    getLoadingToastOptions,
    getSuccessToastOptions,
} from 'components/ToastMessage/ToastMessage';

type Properties = {
    isStakingPaused: boolean;
};

const Stake: React.FC<Properties> = ({ isStakingPaused }) => {
    const { t } = useTranslation();
    const { openConnectModal } = useConnectModal();
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
    const isWalletConnected = useSelector((state: RootState) => getIsWalletConnected(state));
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state)) || '';
    const [amountToStake, setAmountToStake] = useState<number | string>('');
    const [isAmountValid, setIsAmountValid] = useState<boolean>(true);
    const [isAllowingStake, setIsAllowingStake] = useState<boolean>(false);
    const [isStaking, setIsStaking] = useState<boolean>(false);
    const [hasStakeAllowance, setStakeAllowance] = useState<boolean>(false);
    const [openApprovalModal, setOpenApprovalModal] = useState<boolean>(false);
    const { lpStakingRewardsContract } = snxJSConnector as any;

    const lpTokensBalanceQuery = useGelatoUserBalanceQuery(walletAddress, networkId, {
        enabled: isAppReady && isWalletConnected,
    });
    const lpTokensBalance =
        lpTokensBalanceQuery.isSuccess && lpTokensBalanceQuery.data ? Number(lpTokensBalanceQuery.data.balance) : 0;

    const isAmountEntered = Number(amountToStake) > 0;
    const insufficientBalance = Number(amountToStake) > lpTokensBalance || !lpTokensBalance;
    const isButtonDisabled =
        isStaking ||
        !lpStakingRewardsContract ||
        !isAmountEntered ||
        insufficientBalance ||
        !isWalletConnected ||
        !hasStakeAllowance;

    useEffect(() => {
        if (!!lpStakingRewardsContract) {
            const { gelatoContract } = snxJSConnector as any;
            const gelatoContractWithSigner = gelatoContract.connect((snxJSConnector as any).signer);
            const addressToApprove = lpStakingRewardsContract.address;
            const getAllowance = async () => {
                try {
                    const parsedAmountToStake = ethers.utils.parseEther(Number(amountToStake).toString());
                    const allowance = await checkAllowance(
                        parsedAmountToStake,
                        gelatoContractWithSigner,
                        walletAddress,
                        addressToApprove
                    );
                    setStakeAllowance(allowance);
                } catch (e) {
                    console.log(e);
                }
            };
            if (isWalletConnected && gelatoContractWithSigner.signer) {
                getAllowance();
            }
        }
    }, [walletAddress, isWalletConnected, hasStakeAllowance, lpStakingRewardsContract, amountToStake, isAllowingStake]);

    const handleStakeThales = async () => {
        const id = toast.loading(getDefaultToastContent(t('common.progress')), getLoadingToastOptions());
        try {
            setIsStaking(true);
            const lpStakingRewardsContractWithSigner = lpStakingRewardsContract.connect((snxJSConnector as any).signer);
            const amount = ethers.utils.parseEther(amountToStake.toString());
            const tx = await lpStakingRewardsContractWithSigner.stake(amount, {
                gasLimit: getMaxGasLimitForNetwork(networkId),
            });
            const txResult = await tx.wait();

            if (txResult && txResult.transactionHash) {
                toast.update(
                    id,
                    getSuccessToastOptions(t('thales-token.gamified-staking.staking.stake.confirmation-message'), id)
                );
                refetchTokenQueries(walletAddress, networkId);
                refetchLPStakingQueries(walletAddress, networkId);
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
        const { gelatoContract, signer } = snxJSConnector as any;
        const gelatoContractWithSigner = gelatoContract.connect(signer);

        const addressToApprove = lpStakingRewardsContract.address;
        try {
            setIsAllowingStake(true);
            const tx = (await gelatoContractWithSigner.approve(addressToApprove, approveAmount, {
                gasLimit: getMaxGasLimitForNetwork(networkId),
            })) as ethers.ContractTransaction;
            setOpenApprovalModal(false);
            const txResult = await tx.wait();
            if (txResult && txResult.transactionHash) {
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
                        ? t('common.enable-wallet-access.approve-label', { currencyKey: LP_TOKEN })
                        : t('common.enable-wallet-access.approve-progress-label', {
                              currencyKey: LP_TOKEN,
                          })}
                </Button>
            );
        }

        return (
            <Button disabled={isButtonDisabled} onClick={handleStakeThales}>
                {!isStaking
                    ? `${t('thales-token.gamified-staking.staking.stake.name')} ${formatCurrencyWithKey(
                          LP_TOKEN,
                          amountToStake
                      )}`
                    : `${t('thales-token.gamified-staking.staking.stake.staking')} ${formatCurrencyWithKey(
                          LP_TOKEN,
                          amountToStake
                      )}...`}
            </Button>
        );
    };

    const onMaxClick = () => {
        setAmountToStake(truncToDecimals(lpTokensBalance, 8));
    };

    useEffect(() => {
        setIsAmountValid(
            Number(amountToStake) === 0 || (Number(amountToStake) > 0 && Number(amountToStake) <= lpTokensBalance)
        );
    }, [amountToStake, lpTokensBalance]);

    return (
        <EarnSection spanOnTablet={5} orderOnMobile={4} orderOnTablet={4}>
            <SectionContentContainer>
                <InputContainer>
                    <NumericInput
                        value={amountToStake}
                        onChange={(_, value) => setAmountToStake(value)}
                        disabled={isStaking}
                        currencyLabel={LP_TOKEN}
                        placeholder={t('common.enter-amount')}
                        label={t('thales-token.gamified-staking.staking.stake.amount-to-stake')}
                        onMaxButton={onMaxClick}
                        showValidation={!isAmountValid}
                        validationMessage={t(`common.errors.insufficient-balance-wallet`, { currencyKey: LP_TOKEN })}
                        balance={
                            isWalletConnected
                                ? `${t('thales-token.gamified-staking.staking.stake.balance')}: ${formatCurrency(
                                      lpTokensBalance
                                  )}`
                                : undefined
                        }
                        isBalanceLoading={lpTokensBalanceQuery.isLoading}
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
                    tokenSymbol={LP_TOKEN}
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
    padding-top: 40px;
    padding-bottom: 10px;
    align-items: center;
    @media (max-width: 1024px) {
        padding-top: 15px;
    }
`;

export default Stake;
