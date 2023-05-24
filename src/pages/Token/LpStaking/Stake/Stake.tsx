import React, { useEffect, useState } from 'react';
import { ClaimMessage, EarnSection, FullRow, Line, SectionContentContainer } from '../../components';
import { formatCurrency, formatCurrencyWithKey, truncToDecimals } from 'utils/formatters/number';
import NumericInput from 'components/fields/NumericInput';
import { InputContainer } from 'pages/Token/components/components';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { RootState } from 'redux/rootReducer';
import { getIsAppReady } from 'redux/modules/app';
import { getIsWalletConnected, getNetworkId, getWalletAddress } from 'redux/modules/wallet';
import snxJSConnector from 'utils/snxJSConnector';
import { BigNumber, ethers } from 'ethers';
import ValidationMessage from 'components/ValidationMessage';
import NetworkFees from 'pages/Token/components/NetworkFees';
import { checkAllowance, formatGasLimit, getL1FeeInWei } from 'utils/network';
import { refetchTokenQueries, refetchLPStakingQueries } from 'utils/queryConnector';
import styled from 'styled-components';
import { dispatchMarketNotification } from 'utils/options';
import { FlexDivColumnCentered } from 'theme/common';
import useGelatoUserBalanceQuery from 'queries/token/useGelatoUserBalanceQuery';
import { LP_TOKEN } from 'constants/currency';
import ApprovalModal from 'components/ApprovalModal';
import { getMaxGasLimitForNetwork } from 'constants/options';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import Button from 'components/ButtonV2/Button';

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
    const [txErrorMessage, setTxErrorMessage] = useState<string | null>(null);
    const [gasLimit, setGasLimit] = useState<number | null>(null);
    const [l1Fee, setL1Fee] = useState<number | null>(null);
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

    useEffect(() => {
        const fetchL1Fee = async (lpStakingRewardsContractWithSigner: any, amount: any) => {
            const txRequest = await lpStakingRewardsContractWithSigner.populateTransaction.stake(amount);
            return getL1FeeInWei(txRequest, snxJSConnector);
        };

        const fetchGasLimit = async () => {
            const amount = ethers.utils.parseEther(amountToStake.toString());
            try {
                const lpStakingRewardsContractWithSigner = lpStakingRewardsContract.connect(
                    (snxJSConnector as any).signer
                );
                const [gasEstimate, l1FeeInWei] = await Promise.all([
                    lpStakingRewardsContractWithSigner.estimateGas.stake(amount),
                    fetchL1Fee(lpStakingRewardsContractWithSigner, amount),
                ]);
                setGasLimit(formatGasLimit(gasEstimate, networkId));
                setL1Fee(l1FeeInWei);
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
            const lpStakingRewardsContractWithSigner = lpStakingRewardsContract.connect((snxJSConnector as any).signer);
            const amount = ethers.utils.parseEther(amountToStake.toString());
            const tx = await lpStakingRewardsContractWithSigner.stake(amount, {
                gasLimit: getMaxGasLimitForNetwork(networkId),
            });
            const txResult = await tx.wait();

            if (txResult && txResult.transactionHash) {
                dispatchMarketNotification(t('options.earn.gamified-staking.staking.stake.confirmation-message'));
                refetchTokenQueries(walletAddress, networkId);
                refetchLPStakingQueries(walletAddress, networkId);
                setAmountToStake('');
                setIsStaking(false);
            }
        } catch (e) {
            setTxErrorMessage(t('common.errors.unknown-error-try-again'));
            setIsStaking(false);
        }
    };

    const handleAllowance = async (approveAmount: BigNumber) => {
        const { gelatoContract } = snxJSConnector as any;
        const gelatoContractWithSigner = gelatoContract.connect((snxJSConnector as any).signer);

        const addressToApprove = lpStakingRewardsContract.address;
        try {
            setIsAllowingStake(true);
            const gasEstimate = await gelatoContractWithSigner.estimateGas.approve(addressToApprove, approveAmount);
            const tx = (await gelatoContractWithSigner.approve(addressToApprove, approveAmount, {
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
                    ? `${t('options.earn.gamified-staking.staking.stake.name')} ${formatCurrencyWithKey(
                          LP_TOKEN,
                          amountToStake
                      )}`
                    : `${t('options.earn.gamified-staking.staking.stake.staking')} ${formatCurrencyWithKey(
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
                        label={t('options.earn.gamified-staking.staking.stake.amount-to-stake')}
                        onMaxButton={onMaxClick}
                        showValidation={!isAmountValid}
                        validationMessage={t(`common.errors.insufficient-balance-wallet`, { currencyKey: LP_TOKEN })}
                        balance={
                            isWalletConnected
                                ? `${t('options.earn.gamified-staking.staking.stake.balance')}: ${formatCurrency(
                                      lpTokensBalance
                                  )}`
                                : undefined
                        }
                        isBalanceLoading={lpTokensBalanceQuery.isLoading}
                    />
                </InputContainer>
                <Line margin={'0 0 10px 0'} />
                <NetworkFees gasLimit={gasLimit} disabled={isStaking} l1Fee={l1Fee} />
                <StakeButtonDiv>
                    {getStakeButton()}
                    {isStakingPaused && (
                        <ClaimMessage>{t('options.earn.gamified-staking.staking.stake.paused-message')}</ClaimMessage>
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
                    tokenSymbol={LP_TOKEN}
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
