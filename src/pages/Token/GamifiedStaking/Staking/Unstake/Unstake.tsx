import React, { useEffect, useState } from 'react';
import {
    ClaimMessage,
    EarnSection,
    FullRow,
    SectionContentContainer,
    StyledMaterialTooltip,
    Line,
    BalanceIcon,
} from '../../../components';
import { FlexDivColumnCentered, FlexDivRowCentered } from 'theme/common';
import ValidationMessage from 'components/ValidationMessage/ValidationMessage';
import { useTranslation } from 'react-i18next';
import snxJSConnector from 'utils/snxJSConnector';
import { formatGasLimit, getIsOVM, getL1FeeInWei } from 'utils/network';
import { useSelector } from 'react-redux';
import { RootState } from 'redux/rootReducer';
import { getIsWalletConnected, getNetworkId, getWalletAddress } from 'redux/modules/wallet';

import styled from 'styled-components';
import useStakingThalesQuery from 'queries/staking/useStakingThalesQuery';
import { getIsAppReady } from 'redux/modules/app';
import { refetchTokenQueries, refetchUserTokenTransactions } from 'utils/queryConnector';
import { ethers } from 'ethers';
import NumericInput from 'pages/Token/components/NumericInput';
import { CurrencyLabel, InputContainer, InputLabel } from 'pages/Token/components/components';
import { formatCurrency, formatCurrencyWithKey, truncToDecimals } from 'utils/formatters/number';
import { THALES_CURRENCY } from 'constants/currency';
import { dispatchMarketNotification } from 'utils/options';

import intervalToDuration from 'date-fns/intervalToDuration';
import { formattedDuration } from 'utils/formatters/date';
import { MaxButton, ThalesWalletAmountLabel } from '../../../Migration/components';
import onboardConnector from 'utils/onboardConnector';
import FieldValidationMessage from 'components/FieldValidationMessage';
import { MAX_L2_GAS_LIMIT } from 'constants/options';
import SimpleLoader from '../../../components/SimpleLoader';
import { GasLimit } from 'pages/Token/components/NetworkFees/NetworkFees';
import TimeRemaining from 'pages/Token/components/TimeRemaining';
import NetworkFees from 'pages/Token/components/NetworkFees';
import Button from 'pages/Token/components/Button';
import { ButtonType } from 'pages/Token/components/Button/Button';
import { isMobile } from 'utils/device';

const DEFAULT_UNSTAKE_PERIOD = 7 * 24 * 60 * 60;

const addDurationPeriod = (date: Date, unstakeDurationPeriod: number) => {
    return new Date(date.getTime() + unstakeDurationPeriod);
};

const Unstake: React.FC = () => {
    const { t } = useTranslation();
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
    const isWalletConnected = useSelector((state: RootState) => getIsWalletConnected(state));
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state)) || '';
    const [isUnstaking, setIsUnstaking] = useState<boolean>(false);
    const [isCanceling, setIsCanceling] = useState<boolean>(false);
    const [isUnstakingInContract, setIsUnstakingInContract] = useState<boolean>(false);
    const [unstakeDurationPeriod, setUnstakeDurationPeriod] = useState<number>(DEFAULT_UNSTAKE_PERIOD);
    const [unstakeEndTime, setUnstakeEndTime] = useState<Date>(addDurationPeriod(new Date(), unstakeDurationPeriod));
    const [unstakingEnded, setUnstakingEnded] = useState<boolean>(false);
    const [amountToUnstake, setAmountToUnstake] = useState<number | string>('');
    const [isAmountValid, setIsAmountValid] = useState<boolean>(true);
    const [showTooltip, setShowTooltip] = useState<boolean>(false);
    const [gasLimit, setGasLimit] = useState<number | GasLimit[] | null>(null);
    const [l1Fee, setL1Fee] = useState<number | number[] | null>(null);
    const [txErrorMessage, setTxErrorMessage] = useState<string | null>(null);
    const isL2 = getIsOVM(networkId);
    const { stakingThalesContract } = snxJSConnector as any;

    const stakingThalesQuery = useStakingThalesQuery(walletAddress, networkId, {
        enabled: isAppReady && isWalletConnected,
    });

    const thalesStaked =
        stakingThalesQuery.isSuccess && stakingThalesQuery.data ? Number(stakingThalesQuery.data.thalesStaked) : 0;
    const unstakingAmount =
        stakingThalesQuery.isSuccess && stakingThalesQuery.data ? Number(stakingThalesQuery.data.unstakingAmount) : 0;
    const isStakingPaused = stakingThalesQuery.isSuccess && stakingThalesQuery.data && stakingThalesQuery.data.paused;
    const isUserLPing = stakingThalesQuery.isSuccess && stakingThalesQuery.data && stakingThalesQuery.data.isUserLPing;

    const isAmountEntered = Number(amountToUnstake) > 0;
    const insufficientBalance = Number(amountToUnstake) > thalesStaked || !thalesStaked;

    const isStartUnstakeButtonDisabled =
        isUnstaking ||
        isCanceling ||
        !stakingThalesContract ||
        isUnstakingInContract ||
        !isAmountEntered ||
        insufficientBalance ||
        !isWalletConnected ||
        isStakingPaused ||
        isUserLPing;

    const isCancelUnstakeButtonDisabled = isUnstaking || isCanceling || !stakingThalesContract || !isWalletConnected;
    const isUnstakeButtonDisabled = isUnstaking || isCanceling || !stakingThalesContract || !isWalletConnected;

    useEffect(() => {
        if (stakingThalesQuery.isSuccess && stakingThalesQuery.data) {
            const { isUnstaking, lastUnstakeTime, unstakeDurationPeriod } = stakingThalesQuery.data;
            setIsUnstakingInContract(isUnstaking);
            setUnstakeDurationPeriod(unstakeDurationPeriod);
            if (isUnstaking) {
                setUnstakeEndTime(addDurationPeriod(new Date(lastUnstakeTime), unstakeDurationPeriod));
            }
        }
    }, [stakingThalesQuery.isSuccess, stakingThalesQuery.data]);

    useEffect(() => {
        const fetchL1FeeStartUnstake = async (stakingThalesContractWithSigner: any, amount: any) => {
            const txRequest = await stakingThalesContractWithSigner.populateTransaction.startUnstake(amount);
            return getL1FeeInWei(txRequest, snxJSConnector);
        };
        const fetchL1FeeUnstake = async (stakingThalesContractWithSigner: any) => {
            const txRequest = await stakingThalesContractWithSigner.populateTransaction.unstake();
            return getL1FeeInWei(txRequest, snxJSConnector);
        };
        const fetchL1FeeCancelUnstake = async (stakingThalesContractWithSigner: any) => {
            const txRequest = await stakingThalesContractWithSigner.populateTransaction.cancelUnstake();
            return getL1FeeInWei(txRequest, snxJSConnector);
        };

        const fetchGasLimit = async () => {
            try {
                const { stakingThalesContract } = snxJSConnector as any;
                const stakingThalesContractWithSigner = stakingThalesContract.connect((snxJSConnector as any).signer);
                if (isUnstakingInContract) {
                    if (unstakingEnded) {
                        if (isL2) {
                            const [
                                unstakeGasEstimate,
                                cancelUnstakeGasEstimate,
                                l1FeeUnstakeInWei,
                                fetchL1FeeCancelUnstakeInWei,
                            ] = await Promise.all([
                                stakingThalesContractWithSigner.estimateGas.unstake(),
                                stakingThalesContractWithSigner.estimateGas.cancelUnstake(),
                                fetchL1FeeUnstake(stakingThalesContractWithSigner),
                                fetchL1FeeCancelUnstake(stakingThalesContractWithSigner),
                            ]);
                            setGasLimit([
                                {
                                    gasLimit: formatGasLimit(unstakeGasEstimate, networkId),
                                    label: t('options.earn.gamified-staking.staking.unstake.network-fee-unstake'),
                                },
                                {
                                    gasLimit: formatGasLimit(cancelUnstakeGasEstimate, networkId),
                                    label: t('options.earn.gamified-staking.staking.unstake.network-fee-cancel'),
                                },
                            ]);
                            setL1Fee([l1FeeUnstakeInWei, fetchL1FeeCancelUnstakeInWei]);
                        } else {
                            const unstakeGasEstimate = await stakingThalesContractWithSigner.estimateGas.unstake();
                            const cancelUnstakeGasEstimate = await stakingThalesContractWithSigner.estimateGas.cancelUnstake();
                            setGasLimit([
                                {
                                    gasLimit: formatGasLimit(unstakeGasEstimate, networkId),
                                    label: t('options.earn.gamified-staking.staking.unstake.network-fee-unstake'),
                                },
                                {
                                    gasLimit: formatGasLimit(cancelUnstakeGasEstimate, networkId),
                                    label: t('options.earn.gamified-staking.staking.unstake.network-fee-cancel'),
                                },
                            ]);
                        }
                    } else {
                        if (isL2) {
                            const [gasEstimate, l1FeeInWei] = await Promise.all([
                                stakingThalesContractWithSigner.estimateGas.cancelUnstake(),
                                fetchL1FeeCancelUnstake(stakingThalesContractWithSigner),
                            ]);
                            setGasLimit([
                                {
                                    gasLimit: formatGasLimit(gasEstimate, networkId),
                                    label: t('options.earn.gamified-staking.staking.unstake.network-fee-cancel'),
                                },
                            ]);
                            setL1Fee([l1FeeInWei]);
                        } else {
                            const gasEstimate = await stakingThalesContractWithSigner.estimateGas.cancelUnstake();
                            setGasLimit([
                                {
                                    gasLimit: formatGasLimit(gasEstimate, networkId),
                                    label: t('options.earn.gamified-staking.staking.unstake.network-fee-cancel'),
                                },
                            ]);
                            setGasLimit(formatGasLimit(gasEstimate, networkId));
                        }
                    }
                } else {
                    const amount = ethers.utils.parseEther(amountToUnstake.toString());
                    if (isL2) {
                        const [gasEstimate, l1FeeInWei] = await Promise.all([
                            stakingThalesContractWithSigner.estimateGas.startUnstake(amount),
                            fetchL1FeeStartUnstake(stakingThalesContractWithSigner, amount),
                        ]);
                        setGasLimit(formatGasLimit(gasEstimate, networkId));
                        setL1Fee(l1FeeInWei);
                    } else {
                        const gasEstimate = await stakingThalesContractWithSigner.estimateGas.startUnstake(amount);
                        setGasLimit(formatGasLimit(gasEstimate, networkId));
                    }
                }
            } catch (e) {
                console.log(e);
                setGasLimit(null);
            }
        };
        if (isUnstakeButtonDisabled || (!isUnstakingInContract && isStartUnstakeButtonDisabled)) return;
        fetchGasLimit();
    }, [isUnstaking, isCanceling, isUnstakingInContract, walletAddress, unstakingEnded, amountToUnstake]);

    const handleStartUnstakingThales = async () => {
        const { stakingThalesContract } = snxJSConnector as any;
        setShowTooltip(false);

        try {
            setTxErrorMessage(null);
            setIsUnstaking(true);
            const stakingThalesContractWithSigner = stakingThalesContract.connect((snxJSConnector as any).signer);
            const amount = ethers.utils.parseEther(amountToUnstake.toString());
            const tx = await stakingThalesContractWithSigner.startUnstake(amount, { gasLimit: MAX_L2_GAS_LIMIT });
            const txResult = await tx.wait();

            if (txResult && txResult.transactionHash) {
                dispatchMarketNotification(
                    t('options.earn.gamified-staking.staking.unstake.cooldown-confirmation-message')
                );
                refetchTokenQueries(walletAddress, networkId);
                refetchUserTokenTransactions(walletAddress, networkId);
                setAmountToUnstake('');
                setIsUnstakingInContract(true);
                setUnstakeEndTime(addDurationPeriod(new Date(), unstakeDurationPeriod));
                setUnstakingEnded(false);
                setIsUnstaking(false);
                setGasLimit(null);
            }
        } catch (e) {
            setTxErrorMessage(t('common.errors.unknown-error-try-again'));
            setIsUnstaking(false);
        }
    };

    const handleUnstakeThales = async () => {
        const { stakingThalesContract } = snxJSConnector as any;

        try {
            setTxErrorMessage(null);
            setIsUnstaking(true);
            const stakingThalesContractWithSigner = stakingThalesContract.connect((snxJSConnector as any).signer);
            const tx = await stakingThalesContractWithSigner.unstake({ gasLimit: MAX_L2_GAS_LIMIT });
            const txResult = await tx.wait();

            if (txResult && txResult.transactionHash) {
                dispatchMarketNotification(
                    t('options.earn.gamified-staking.staking.unstake.unstake-confirmation-message')
                );
                refetchTokenQueries(walletAddress, networkId);
                refetchUserTokenTransactions(walletAddress, networkId);
                setIsUnstakingInContract(false);
                setUnstakingEnded(true);
                setIsUnstaking(false);
                setGasLimit(null);
            }
        } catch (e) {
            setTxErrorMessage(t('common.errors.unknown-error-try-again'));
            setIsUnstaking(false);
        }
    };

    const handleCancelUnstakingThales = async () => {
        const { stakingThalesContract } = snxJSConnector as any;

        try {
            setTxErrorMessage(null);
            setIsCanceling(true);
            const stakingThalesContractWithSigner = stakingThalesContract.connect((snxJSConnector as any).signer);
            const tx = await stakingThalesContractWithSigner.cancelUnstake({ gasLimit: MAX_L2_GAS_LIMIT });
            const txResult = await tx.wait();

            if (txResult && txResult.transactionHash) {
                refetchTokenQueries(walletAddress, networkId);
                refetchUserTokenTransactions(walletAddress, networkId);
                setIsUnstakingInContract(false);
                setUnstakingEnded(true);
                setIsCanceling(false);
                setGasLimit(null);
            }
        } catch (e) {
            setTxErrorMessage(t('common.errors.unknown-error-try-again'));
            setIsCanceling(false);
        }
    };

    const getSubmitButton = () => {
        if (!isWalletConnected) {
            return (
                <Button active={true} onClickHandler={() => onboardConnector.connectWallet()} type={ButtonType.submit}>
                    {t('common.wallet.connect-your-wallet')}
                </Button>
            );
        }
        if (isUnstakingInContract) {
            return (
                <>
                    {unstakingEnded && (
                        <Button
                            active={!isUnstakeButtonDisabled}
                            disabled={isUnstakeButtonDisabled}
                            onClickHandler={handleUnstakeThales}
                            type={ButtonType.submit}
                        >
                            {!isUnstaking
                                ? `${t('options.earn.gamified-staking.staking.unstake.name')} ${formatCurrencyWithKey(
                                      THALES_CURRENCY,
                                      unstakingAmount
                                  )}`
                                : `${t(
                                      'options.earn.gamified-staking.staking.unstake.unstaking'
                                  )} ${formatCurrencyWithKey(THALES_CURRENCY, unstakingAmount)}...`}
                        </Button>
                    )}
                    <Button
                        active={!isCancelUnstakeButtonDisabled}
                        disabled={isCancelUnstakeButtonDisabled}
                        onClickHandler={handleCancelUnstakingThales}
                        type={ButtonType.submit}
                    >
                        {!isCanceling
                            ? `${t('options.earn.gamified-staking.staking.unstake.cancel')} ${formatCurrencyWithKey(
                                  THALES_CURRENCY,
                                  unstakingAmount
                              )}`
                            : `${t('options.earn.gamified-staking.staking.unstake.canceling')} ${formatCurrencyWithKey(
                                  THALES_CURRENCY,
                                  unstakingAmount
                              )}...`}
                    </Button>
                </>
            );
        }
        if (insufficientBalance) {
            return (
                <Button disabled={true} type={ButtonType.submit}>
                    {t(`common.errors.insufficient-staking-balance`)}
                </Button>
            );
        }
        if (!isAmountEntered) {
            return (
                <Button disabled={true} type={ButtonType.submit}>
                    {t(`common.errors.enter-amount`)}
                </Button>
            );
        }

        return (
            <StyledMaterialTooltip
                arrow={true}
                open={showTooltip}
                disableHoverListener={isStartUnstakeButtonDisabled}
                disableTouchListener={isStartUnstakeButtonDisabled}
                title={t('options.earn.gamified-staking.staking.unstake.start-unstaking-tooltip') as string}
                placement="top"
            >
                <ButtonWrapperTooltip>
                    <Button
                        active={!isStartUnstakeButtonDisabled}
                        disabled={isStartUnstakeButtonDisabled}
                        onMouseOverHandler={() => {
                            setShowTooltip(true);
                        }}
                        onMouseOutHandler={() => {
                            setShowTooltip(false);
                        }}
                        onClickHandler={handleStartUnstakingThales}
                        type={ButtonType.submit}
                    >
                        {!isUnstaking
                            ? `${t(
                                  'options.earn.gamified-staking.staking.unstake.start-unstaking'
                              )} ${formatCurrencyWithKey(THALES_CURRENCY, amountToUnstake)}`
                            : `${t('options.earn.gamified-staking.staking.unstake.unstaking')} ${formatCurrencyWithKey(
                                  THALES_CURRENCY,
                                  amountToUnstake
                              )}...`}
                    </Button>
                </ButtonWrapperTooltip>
            </StyledMaterialTooltip>
        );
    };

    const dateTimeTranslationMap = {
        years: t('options.common.time-remaining.years'),
        year: t('options.common.time-remaining.year'),
        months: t('options.common.time-remaining.months'),
        month: t('options.common.time-remaining.month'),
        weeks: t('options.common.time-remaining.weeks'),
        week: t('options.common.time-remaining.week'),
        days: t('options.common.time-remaining.days'),
        day: t('options.common.time-remaining.day'),
        hours: t('options.common.time-remaining.hours'),
        hour: t('options.common.time-remaining.hour'),
        minutes: t('options.common.time-remaining.minutes'),
        minute: t('options.common.time-remaining.minute'),
        seconds: t('options.common.time-remaining.seconds'),
        second: t('options.common.time-remaining.second'),
        'days-short': t('options.common.time-remaining.days-short'),
        'hours-short': t('options.common.time-remaining.hours-short'),
        'minutes-short': t('options.common.time-remaining.minutes-short'),
        'seconds-short': t('options.common.time-remaining.seconds-short'),
    };

    const unstakeIntervalToDuration = intervalToDuration({
        start: Date.now(),
        end: Date.now() + unstakeDurationPeriod,
    });
    const unstakeDuration = formattedDuration(unstakeIntervalToDuration, dateTimeTranslationMap, false);

    const onMaxClick = () => {
        setAmountToUnstake(truncToDecimals(thalesStaked, 8));
    };

    useEffect(() => {
        setIsAmountValid(
            Number(amountToUnstake) === 0 || (Number(amountToUnstake) > 0 && Number(amountToUnstake) <= thalesStaked)
        );
    }, [amountToUnstake, thalesStaked]);

    return (
        <EarnSection spanOnTablet={5} orderOnMobile={5} orderOnTablet={5}>
            <SectionContentContainer>
                <UnstakingContainer twoButtons={isUnstakingInContract && unstakingEnded}>
                    <UnstakingTitleText>
                        {isUnstakingInContract
                            ? unstakingEnded
                                ? t('options.earn.gamified-staking.staking.unstake.cooldown-ended-text', {
                                      amount: formatCurrencyWithKey(THALES_CURRENCY, unstakingAmount, 0, true),
                                  })
                                : t('options.earn.gamified-staking.staking.unstake.cooldown-started-text', {
                                      amount: formatCurrencyWithKey(THALES_CURRENCY, unstakingAmount, 0, true),
                                  })
                            : t('options.earn.gamified-staking.staking.unstake.unlock-cooldown-text')}
                    </UnstakingTitleText>
                    {((!unstakingEnded && isUnstakingInContract) || !isUnstakingInContract) && (
                        <UnstakingPeriodWrapper>
                            <UnstakingPeriodConatiner>
                                <CooldownText>
                                    {t('options.earn.gamified-staking.staking.unstake.cooldown-label')}
                                </CooldownText>
                                <CooldownCounter>
                                    {!isUnstakingInContract ? (
                                        unstakeDuration
                                    ) : (
                                        <TimeRemaining
                                            onEnded={() => setUnstakingEnded(true)}
                                            end={unstakeEndTime}
                                            fontSize={16}
                                        />
                                    )}
                                </CooldownCounter>
                            </UnstakingPeriodConatiner>
                        </UnstakingPeriodWrapper>
                    )}
                </UnstakingContainer>
                <InputContainer>
                    <NumericInput
                        value={amountToUnstake}
                        onChange={(_, value) => setAmountToUnstake(value)}
                        disabled={isUnstakingInContract || isUnstaking || isCanceling || isStakingPaused || isUserLPing}
                        className={isAmountValid ? '' : 'error'}
                    />
                    <InputLabel>{t('options.earn.gamified-staking.staking.unstake.amount-to-unstake')}</InputLabel>
                    <CurrencyLabel
                        className={
                            isUnstakingInContract || isUnstaking || isCanceling || isStakingPaused || isUserLPing
                                ? 'disabled'
                                : ''
                        }
                    >
                        {THALES_CURRENCY}
                    </CurrencyLabel>
                    <ThalesWalletAmountLabel>
                        {!isMobile() && <BalanceIcon />}
                        {isWalletConnected ? (
                            stakingThalesQuery.isLoading ? (
                                <SimpleLoader />
                            ) : (
                                t('options.earn.gamified-staking.staking.unstake.balance') +
                                ' ' +
                                formatCurrency(thalesStaked)
                            )
                        ) : (
                            '-'
                        )}
                        <MaxButton
                            disabled={
                                isUnstakingInContract ||
                                isUnstaking ||
                                isCanceling ||
                                isStakingPaused ||
                                !isWalletConnected ||
                                isUserLPing
                            }
                            onClick={onMaxClick}
                        >
                            {t('common.max')}
                        </MaxButton>
                    </ThalesWalletAmountLabel>
                    <FieldValidationMessage
                        showValidation={!isAmountValid}
                        message={t(`common.errors.insufficient-staking-balance`, { currencyKey: THALES_CURRENCY })}
                    />
                </InputContainer>
                <Line margin={'0 0 10px 0'} />
                <NetworkFeesWrapper>
                    <NetworkFees gasLimit={gasLimit} disabled={isUnstaking} l1Fee={l1Fee} />
                </NetworkFeesWrapper>
                <ButtonsContainer twoButtons={isUnstakingInContract && unstakingEnded}>
                    {getSubmitButton()}
                    {isStakingPaused && (
                        <ClaimMessage>{t('options.earn.gamified-staking.staking.unstake.paused-message')}</ClaimMessage>
                    )}
                    {isUserLPing && (
                        <ClaimMessage>
                            {t('options.earn.gamified-staking.staking.unstake.user-lping-message')}
                        </ClaimMessage>
                    )}
                </ButtonsContainer>
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

const UnstakingContainer = styled(FlexDivRowCentered)<{ twoButtons: boolean }>`
    margin-bottom: 15px;
    min-height: ${(props) => (props.twoButtons ? '30px' : '66px')};
`;

const UnstakingPeriodWrapper = styled(FlexDivColumnCentered)`
    border: none;
    background: linear-gradient(190.01deg, #516aff -17.89%, #8208fc 90.41%);
    border-radius: 10px;
    padding: 1px;
    min-width: 160px;
    max-width: 160px;
    @media (max-width: 1192px) {
        min-width: 110px;
    }
    @media (max-width: 767px) {
        min-width: 110px;
    }
`;

const UnstakingPeriodConatiner = styled(FlexDivColumnCentered)`
    background: var(--color-primary);
    border-radius: 10px;
    padding: 10px 0;
    text-align: center;
`;

const CooldownText = styled.span`
    font-weight: normal;
    font-size: 14px;
    line-height: 24px;
    color: #ffffff;
    text-transform: uppercase;
`;

const CooldownCounter = styled.span`
    font-weight: bold;
    font-size: 16px;
    line-height: 20px;
    letter-spacing: 0.25px;
    color: #f6f6fe;
`;

const UnstakingTitleText = styled.span`
    font-weight: 400;
    font-size: 14px;
    line-height: 15px;
    margin-right: 10px;
    @media (max-width: 1192px) {
        font-size: 12px;
    }
    @media (max-width: 767px) {
        font-size: 12px;
        margin-right: 0px;
    }
`;

const ButtonsContainer = styled(FlexDivColumnCentered)<{ twoButtons: boolean }>`
    padding-top: 10px;
    padding-bottom: ${(props) => (props.twoButtons ? '10px' : '25px')};
    align-items: center;
    > * {
        &:nth-child(2) {
            margin-top: 15px;
        }
    }
    @media (max-width: 1024px) {
        padding-top: 15px;
        padding-bottom: 5px;
    }
`;

const ButtonWrapperTooltip = styled.div`
    width: 100%;
`;

const NetworkFeesWrapper = styled.div`
    min-height: 63px;
`;

export default Unstake;
