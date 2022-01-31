import React, { useEffect, useState } from 'react';
import { EarnSection, FullRow, SectionContentContainer, SectionHeader } from '../../components';
import { formatCurrencyWithKey, truncToDecimals } from '../../../../../utils/formatters/number';
import { THALES_CURRENCY } from '../../../../../constants/currency';
import { FlexDivCentered } from '../../../../../theme/common';
import NumericInput from '../../../Market/components/NumericInput';
import { CurrencyLabel, DefaultSubmitButton, InputContainer, InputLabel } from '../../../Market/components';
import useThalesBalanceQuery from '../../../../../queries/walletBalances/useThalesBalanceQuery';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../../redux/rootReducer';
import { getIsAppReady } from '../../../../../redux/modules/app';
import { getIsWalletConnected, getNetworkId, getWalletAddress } from '../../../../../redux/modules/wallet';
import snxJSConnector from '../../../../../utils/snxJSConnector';
import { ethers } from 'ethers';
import { bigNumberFormatter, getAddress } from '../../../../../utils/formatters/ethers';
import { APPROVAL_EVENTS } from '../../../../../constants/events';
import ValidationMessage from '../../../../../components/ValidationMessage/ValidationMessage';
import NetworkFees from '../../../components/NetworkFees';
import { formatGasLimit, getIsOVM, getL1FeeInWei } from '../../../../../utils/network';
import { refetchTokenQueries, refetchUserTokenTransactions } from 'utils/queryConnector';
import styled from 'styled-components';
import { dispatchMarketNotification } from 'utils/options';
import SimpleLoader from '../../components/SimpleLoader';
import { MaxButton, ThalesWalletAmountLabel } from '../../Migration/components';
import onboardConnector from 'utils/onboardConnector';
import FieldValidationMessage from 'components/FieldValidationMessage';
import useStakingThalesQuery from 'queries/staking/useStakingThalesQuery';
import { MAX_L2_GAS_LIMIT } from 'constants/options';

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

    const isAmountEntered = Number(amountToStake) > 0;
    const insufficientBalance = Number(amountToStake) > thalesBalance || !thalesBalance;
    const isButtonDisabled =
        isStaking ||
        !stakingThalesContract ||
        isUnstaking ||
        !isAmountEntered ||
        insufficientBalance ||
        !isWalletConnected;

    useEffect(() => {
        if (!!stakingThalesContract) {
            const { thalesTokenContract } = snxJSConnector as any;
            const thalesTokenContractWithSigner = thalesTokenContract.connect((snxJSConnector as any).signer);
            const addressToApprove = stakingThalesContract.address;
            const getAllowance = async () => {
                try {
                    const allowance = await thalesTokenContractWithSigner.allowance(walletAddress, addressToApprove);
                    setStakeAllowance(!!bigNumberFormatter(allowance));
                } catch (e) {
                    console.log(e);
                }
            };

            const registerAllowanceListener = () => {
                thalesTokenContractWithSigner.on(APPROVAL_EVENTS.APPROVAL, (owner: string, spender: string) => {
                    if (owner === walletAddress && spender === getAddress(addressToApprove)) {
                        setStakeAllowance(true);
                        setIsAllowingStake(false);
                    }
                });
            };
            if (isWalletConnected) {
                getAllowance();
                registerAllowanceListener();
            }
            return () => {
                thalesTokenContractWithSigner.removeAllListeners(APPROVAL_EVENTS.APPROVAL);
            };
        }
    }, [walletAddress, isWalletConnected, hasStakeAllowance, stakingThalesContract]);

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

    const handleAllowance = async () => {
        const { thalesTokenContract } = snxJSConnector as any;
        const thalesTokenContractWithSigner = thalesTokenContract.connect((snxJSConnector as any).signer);

        const addressToApprove = stakingThalesContract.address;
        try {
            setIsAllowingStake(true);
            const gasEstimate = await thalesTokenContractWithSigner.estimateGas.approve(
                addressToApprove,
                ethers.constants.MaxUint256
            );
            const tx = (await thalesTokenContractWithSigner.approve(addressToApprove, ethers.constants.MaxUint256, {
                gasLimit: formatGasLimit(gasEstimate, networkId),
            })) as ethers.ContractTransaction;

            const txResult = await tx.wait();
            if (txResult && txResult.transactionHash) {
                setStakeAllowance(true);
                setIsAllowingStake(false);
            }
        } catch (e) {
            console.log(e);
            setTxErrorMessage(t('common.errors.unknown-error-try-again'));
            setIsAllowingStake(false);
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
                <DefaultSubmitButton disabled={isAllowingStake} onClick={handleAllowance}>
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
            <SectionHeader>{t('options.earn.thales-staking.stake.stake')}</SectionHeader>
            <SectionContentContainer style={{ height: '100%' }}>
                <InputContainer>
                    <NumericInput
                        value={amountToStake}
                        onChange={(_, value) => setAmountToStake(value)}
                        disabled={isStaking || isUnstaking}
                        className={isAmountValid ? '' : 'error'}
                    />
                    <InputLabel>{t('options.earn.thales-staking.stake.amount-to-stake')}</InputLabel>
                    <CurrencyLabel className={isStaking || isUnstaking ? 'disabled' : ''}>
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
                        <MaxButton disabled={isStaking || isUnstaking || !isWalletConnected} onClick={onMaxClick}>
                            {t('common.max')}
                        </MaxButton>
                    </ThalesWalletAmountLabel>
                    <FieldValidationMessage
                        showValidation={!isAmountValid}
                        message={t(`common.errors.insufficient-balance-wallet`, { currencyKey: THALES_CURRENCY })}
                    />
                </InputContainer>
                <NetworkFees gasLimit={gasLimit} disabled={isStaking} l1Fee={l1Fee} />
                <StakeButtonDiv>{getStakeButton()}</StakeButtonDiv>
                <FullRow>
                    <ValidationMessage
                        showValidation={txErrorMessage !== null}
                        message={txErrorMessage}
                        onDismiss={() => setTxErrorMessage(null)}
                    />
                </FullRow>
            </SectionContentContainer>
        </EarnSection>
    );
};

const StakeButtonDiv = styled(FlexDivCentered)`
    padding-top: 40px;
    @media (max-width: 1024px) {
        padding-top: 15px;
    }
`;

export default Stake;
