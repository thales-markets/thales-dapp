import React, { useEffect, useState } from 'react';
import { EarnSection, SectionContentContainer, SectionHeader } from '../../components';
import { Button, FlexDivCentered, FlexDivColumnCentered, FlexDivRowCentered } from '../../../../../theme/common';
import TimeRemaining from '../../../components/TimeRemaining/TimeRemaining';
import ValidationMessage from '../../../../../components/ValidationMessage/ValidationMessage';
import { useTranslation } from 'react-i18next';
import snxJSConnector from '../../../../../utils/snxJSConnector';
import { formatGasLimit, getIsOVM, getL1FeeInWei } from '../../../../../utils/network';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../../redux/rootReducer';
import { getIsWalletConnected, getNetworkId, getWalletAddress } from '../../../../../redux/modules/wallet';
import NetworkFees from '../../../components/NetworkFees';
import styled from 'styled-components';
import useStakingThalesQuery from '../../../../../queries/staking/useStakingThalesQuery';
import { getIsAppReady } from '../../../../../redux/modules/app';
import { refetchUserTokenTransactions } from 'utils/queryConnector';
import { ethers } from 'ethers';
import NumericInput from '../../../Market/components/NumericInput';
import { CurrencyLabel, InputContainer, InputLabel } from '../../../Market/components';
import { formatCurrencyWithKey } from '../../../../../utils/formatters/number';
import { THALES_CURRENCY } from '../../../../../constants/currency';
import { dispatchMarketNotification } from 'utils/options';
import { withStyles } from '@material-ui/core';
import MaterialTooltip from '@material-ui/core/Tooltip';
import { GasLimit } from '../../../components/NetworkFees/NetworkFees';
import intervalToDuration from 'date-fns/intervalToDuration';
import { formattedDuration } from 'utils/formatters/date';
import { MaxButton, ThalesWalletAmountLabel } from '../../Migration/components';

type Properties = {
    isUnstakingInContract: boolean;
    setIsUnstakingInContract: (isUnstaking: boolean) => void;
    thalesStaked: string;
    setThalesStaked: (staked: string) => void;
    thalesBalance: string;
    setThalesBalance: (staked: string) => void;
};

const addDurationPeriod = (date: Date, unstakeDurationPeriod: number) => {
    return new Date(date.getTime() + unstakeDurationPeriod); // 30 seconds buffer for time discrepancies
};

const Unstake: React.FC<Properties> = ({
    isUnstakingInContract,
    setIsUnstakingInContract,
    thalesStaked,
    setThalesStaked,
    thalesBalance,
    setThalesBalance,
}) => {
    const { t } = useTranslation();

    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
    const isWalletConnected = useSelector((state: RootState) => getIsWalletConnected(state));
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state)) || '';

    const stakingThalesQuery = useStakingThalesQuery(walletAddress, networkId, {
        enabled: isAppReady && isWalletConnected,
    });
    const [unstakeDurationPeriod, setUnstakeDurationPeriod] = useState<number>(7 * 24 * 60 * 60);
    const [isUnstaking, setIsUnstaking] = useState<boolean>(false);
    const [isCanceling, setIsCanceling] = useState<boolean>(false);
    const [unstakeEndTime, setUnstakeEndTime] = useState<Date>(addDurationPeriod(new Date(), unstakeDurationPeriod));
    const [amountToUnstake, setAmountToUnstake] = useState<string>('0');
    const [unstakingAmount, setUnstakingAmount] = useState<string>('0');
    const [unstakingEnded, setUnstakingEnded] = useState<boolean>(false);
    const [showTooltip, setShowTooltip] = useState<boolean>(false);
    const [gasLimit, setGasLimit] = useState<number | GasLimit[] | null>(null);
    const [l1Fee, setL1Fee] = useState<number | number[] | null>(null);
    const isL2 = getIsOVM(networkId);
    const [txErrorMessage, setTxErrorMessage] = useState<string | null>(null);

    useEffect(() => {
        if (stakingThalesQuery.isSuccess && stakingThalesQuery.data) {
            const { isUnstaking, unstakingAmount, lastUnstakeTime, unstakeDurationPeriod } = stakingThalesQuery.data;
            setIsUnstakingInContract(isUnstaking);
            setUnstakingAmount(unstakingAmount);
            setUnstakeDurationPeriod(unstakeDurationPeriod);
            if (isUnstaking) {
                setUnstakeEndTime(addDurationPeriod(new Date(lastUnstakeTime), unstakeDurationPeriod));
            }
        }
    }, [stakingThalesQuery.isSuccess, stakingThalesQuery.data]);

    useEffect(() => {
        const fetchL1FeeStartUnstake = async (stakingThalesContractWithSigner: any, amount: any) => {
            const txRequest = await stakingThalesContractWithSigner.populateTransaction.startUnstake(amount);
            return getL1FeeInWei(txRequest);
        };
        const fetchL1FeeUnstake = async (stakingThalesContractWithSigner: any) => {
            const txRequest = await stakingThalesContractWithSigner.populateTransaction.unstake();
            return getL1FeeInWei(txRequest);
        };
        const fetchL1FeeCancelUnstake = async (stakingThalesContractWithSigner: any) => {
            const txRequest = await stakingThalesContractWithSigner.populateTransaction.cancelUnstake();
            return getL1FeeInWei(txRequest);
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
                                    label: t('options.earn.thales-staking.unstake.network-fee-unstake'),
                                },
                                {
                                    gasLimit: formatGasLimit(cancelUnstakeGasEstimate, networkId),
                                    label: t('options.earn.thales-staking.unstake.network-fee-cancel'),
                                },
                            ]);
                            setL1Fee([l1FeeUnstakeInWei, fetchL1FeeCancelUnstakeInWei]);
                        } else {
                            const unstakeGasEstimate = await stakingThalesContractWithSigner.estimateGas.unstake();
                            const cancelUnstakeGasEstimate = await stakingThalesContractWithSigner.estimateGas.cancelUnstake();
                            setGasLimit([
                                {
                                    gasLimit: formatGasLimit(unstakeGasEstimate, networkId),
                                    label: t('options.earn.thales-staking.unstake.network-fee-unstake'),
                                },
                                {
                                    gasLimit: formatGasLimit(cancelUnstakeGasEstimate, networkId),
                                    label: t('options.earn.thales-staking.unstake.network-fee-cancel'),
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
                                    label: t('options.earn.thales-staking.unstake.network-fee-cancel'),
                                },
                            ]);
                            setL1Fee([l1FeeInWei]);
                        } else {
                            const gasEstimate = await stakingThalesContractWithSigner.estimateGas.cancelUnstake();
                            setGasLimit([
                                {
                                    gasLimit: formatGasLimit(gasEstimate, networkId),
                                    label: t('options.earn.thales-staking.unstake.network-fee-cancel'),
                                },
                            ]);
                            setGasLimit(formatGasLimit(gasEstimate, networkId));
                        }
                    }
                } else {
                    const amount = ethers.utils.parseEther(amountToUnstake);
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
        if (isUnstaking || isCanceling || (!isUnstakingInContract && Number(amountToUnstake) <= 0)) return;
        fetchGasLimit();
    }, [isUnstaking, walletAddress, unstakingEnded, amountToUnstake, isUnstakingInContract, isCanceling]);

    const handleStartUnstakingThales = async () => {
        const { stakingThalesContract } = snxJSConnector as any;
        setShowTooltip(false);

        try {
            setTxErrorMessage(null);
            setIsUnstaking(true);
            const stakingThalesContractWithSigner = stakingThalesContract.connect((snxJSConnector as any).signer);
            const amount = ethers.utils.parseEther(amountToUnstake);
            const tx = await stakingThalesContractWithSigner.startUnstake(amount);
            const txResult = await tx.wait();

            if (txResult && txResult.events) {
                dispatchMarketNotification(t('options.earn.thales-staking.unstake.cooldown-confirmation-message'));
                const rawData = txResult.events[txResult.events?.length - 1];
                if (rawData && rawData.decode) {
                    const newThalesStaked = ethers.utils.parseEther(thalesStaked).sub(amount);
                    refetchUserTokenTransactions(walletAddress, networkId);
                    setUnstakeEndTime(addDurationPeriod(new Date(), unstakeDurationPeriod));
                    setUnstakingEnded(false);
                    setIsUnstaking(false);
                    setIsUnstakingInContract(true);
                    setThalesStaked(ethers.utils.formatEther(newThalesStaked));
                    setUnstakingAmount(ethers.utils.formatEther(amount));
                }
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
            const tx = await stakingThalesContractWithSigner.unstake();
            const txResult = await tx.wait();

            if (txResult && txResult.events) {
                dispatchMarketNotification(t('options.earn.thales-staking.unstake.unstake-confirmation-message'));
                const rawData = txResult.events[txResult.events?.length - 1];
                if (rawData && rawData.decode) {
                    const newThalesBalance = ethers.utils
                        .parseEther(thalesBalance)
                        .add(ethers.utils.parseEther(unstakingAmount));
                    setIsUnstaking(false);
                    setIsUnstakingInContract(false);
                    setThalesBalance(ethers.utils.formatEther(newThalesBalance));
                    setUnstakingAmount('0');
                    setAmountToUnstake('0');
                    setUnstakingEnded(true);
                    setGasLimit(null);
                }
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
            const tx = await stakingThalesContractWithSigner.cancelUnstake();
            const txResult = await tx.wait();

            if (txResult && txResult.events) {
                dispatchMarketNotification(t('options.earn.thales-staking.unstake.cancel-confirmation-message'));
                const rawData = txResult.events[txResult.events?.length - 1];
                if (rawData && rawData.decode) {
                    // const newThalesStaked = ethers.utils.parseEther(thalesStaked).add(unstakingAmount);
                    // setThalesStaked(ethers.utils.formatEther(newThalesStaked));
                    refetchUserTokenTransactions(walletAddress, networkId);
                    setIsUnstaking(false);
                    setIsUnstakingInContract(false);
                    setUnstakingAmount('0');
                    setAmountToUnstake('0');
                    setUnstakingEnded(true);
                    setIsCanceling(false);
                    setGasLimit(null);
                }
            }
        } catch (e) {
            setTxErrorMessage(t('common.errors.unknown-error-try-again'));
            setIsCanceling(false);
        }
    };

    const getSubmitButton = () => {
        if (isUnstakingInContract) {
            return (
                <>
                    {unstakingEnded && (
                        <Button className="primary" onClick={handleUnstakeThales} disabled={isUnstaking || isCanceling}>
                            {!isUnstaking
                                ? `${t('options.earn.thales-staking.unstake.unstake')} ${formatCurrencyWithKey(
                                      THALES_CURRENCY,
                                      unstakingAmount
                                  )}`
                                : `${t('options.earn.thales-staking.unstake.unstaking')} ${formatCurrencyWithKey(
                                      THALES_CURRENCY,
                                      unstakingAmount
                                  )}`}
                        </Button>
                    )}
                    <GradientButtonContainer>
                        <StyledButton onClick={handleCancelUnstakingThales} disabled={isUnstaking || isCanceling}>
                            {!isCanceling
                                ? `${t('options.earn.thales-staking.unstake.cancel')} ${formatCurrencyWithKey(
                                      THALES_CURRENCY,
                                      unstakingAmount
                                  )}`
                                : `${t('options.earn.thales-staking.unstake.canceling')} ${formatCurrencyWithKey(
                                      THALES_CURRENCY,
                                      unstakingAmount
                                  )}`}
                        </StyledButton>
                    </GradientButtonContainer>
                </>
            );
        }

        return (
            <StyledMaterialTooltip
                arrow={true}
                open={showTooltip}
                disableHoverListener={isUnstaking || !+amountToUnstake}
                disableTouchListener={isUnstaking || !+amountToUnstake}
                title={t('options.earn.thales-staking.unstake.start-unstaking-tooltip') as string}
                placement="top"
            >
                <Button
                    className="primary"
                    onMouseOver={() => {
                        setShowTooltip(true);
                    }}
                    onMouseOut={() => {
                        setShowTooltip(false);
                    }}
                    onClick={handleStartUnstakingThales}
                    disabled={isUnstaking || !+amountToUnstake}
                >
                    {!isUnstaking
                        ? `${t('options.earn.thales-staking.unstake.start-unstaking')} ${formatCurrencyWithKey(
                              THALES_CURRENCY,
                              amountToUnstake
                          )}`
                        : `${t('options.earn.thales-staking.unstake.unstaking')} ${formatCurrencyWithKey(
                              THALES_CURRENCY,
                              amountToUnstake
                          )}...`}
                </Button>
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

    return (
        <EarnSection
            spanOnTablet={5}
            orderOnMobile={5}
            orderOnTablet={5}
            style={{ gridColumn: 'span 5', gridRow: 'span 2' }}
        >
            <SectionHeader>{t('options.earn.thales-staking.unstake.unstake')}</SectionHeader>
            <SectionContentContainer style={{ flexDirection: 'column', marginBottom: '25px' }}>
                <UnstakingContainer>
                    <UnstakingTitleText>
                        {isUnstakingInContract
                            ? unstakingEnded
                                ? t('options.earn.thales-staking.unstake.cooldown-ended-text', {
                                      amount: formatCurrencyWithKey(THALES_CURRENCY, unstakingAmount, 0, true),
                                  })
                                : t('options.earn.thales-staking.unstake.cooldown-started-text', {
                                      amount: formatCurrencyWithKey(THALES_CURRENCY, unstakingAmount, 0, true),
                                  })
                            : t('options.earn.thales-staking.unstake.unlock-cooldown-text')}
                    </UnstakingTitleText>
                    {!unstakingEnded && (
                        <UnstakingPeriodWrapper>
                            <UnstakingPeriodConatiner>
                                <CooldownText>{t('options.earn.thales-staking.unstake.cooldown-label')}</CooldownText>
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
                        onChange={(_, value) => {
                            if (+value <= +thalesStaked) {
                                setAmountToUnstake(value);
                            }
                        }}
                        step="0.01"
                        max={thalesStaked.toString()}
                        disabled={isUnstakingInContract}
                    />
                    <InputLabel>{t('options.earn.thales-staking.unstake.amount-to-unstake')}</InputLabel>
                    <CurrencyLabel className={isUnstakingInContract ? 'disabled' : ''}>{THALES_CURRENCY}</CurrencyLabel>
                    <ThalesWalletAmountLabel>
                        {formatCurrencyWithKey(THALES_CURRENCY, thalesStaked)}
                        <MaxButton
                            disabled={isUnstakingInContract}
                            onClick={() => {
                                setAmountToUnstake(thalesStaked);
                            }}
                        >
                            {t('common.max')}
                        </MaxButton>
                    </ThalesWalletAmountLabel>
                </InputContainer>
                <NetworkFees gasLimit={gasLimit} disabled={isUnstaking} l1Fee={l1Fee} />
                <ButtonsContainer>{getSubmitButton()}</ButtonsContainer>
                <ValidationMessage
                    showValidation={txErrorMessage !== null}
                    message={txErrorMessage}
                    onDismiss={() => setTxErrorMessage(null)}
                />
            </SectionContentContainer>
        </EarnSection>
    );
};

const UnstakingContainer = styled(FlexDivRowCentered)`
    margin-bottom: 15px;
    @media (max-width: 767px) {
        flex-direction: column;
    }
`;

const UnstakingPeriodWrapper = styled(FlexDivColumnCentered)`
    border: none;
    background: linear-gradient(190.01deg, #516aff -17.89%, #8208fc 90.41%);
    border-radius: 10px;
    padding: 1px;
    min-width 160px;
    max-width 160px;
`;

const UnstakingPeriodConatiner = styled(FlexDivColumnCentered)`
    background: #04045a;
    border-radius: 10px;
    padding: 10px 0;
    text-align: center;
`;

const CooldownText = styled.span`
    font-weight: normal;
    font-size: 14px;
    line-height: 24px;
    color: #b8c6e5;
`;

const CooldownCounter = styled.span`
    font-weight: bold;
    font-size: 16px;
    line-height: 20px;
    letter-spacing: 0.25px;
    color: #f6f6fe;
`;

const UnstakingTitleText = styled.span`
    font-size: 16px;
    line-height: 24px;
    margin-right: 10px;
    @media (max-width: 767px) {
        margin-right: 0px;
        margin-bottom: 10px;
    }
`;

const StyledMaterialTooltip = withStyles(() => ({
    arrow: {
        '&:before': {
            border: '1px solid #7119e1',
        },
        color: '#04045A',
    },
    tooltip: {
        background: 'linear-gradient(281.48deg, #04045A -16.58%, #141874 97.94%)',
        borderRadius: '23px',
        border: '1px solid #7119e1',
        padding: '15px',
        fontSize: '14px',
        lineHeight: '24px',
        letterSpacing: '0.4px',
        color: '#F6F6FE',
        maxWidth: 330,
    },
}))(MaterialTooltip);

const ButtonsContainer = styled(FlexDivCentered)`
    padding-top: 15px;
    flex-wrap: wrap;
    > * {
        &:nth-child(2) {
            margin-top: 15px;
        }
    }
`;

const GradientButtonContainer = styled.div`
    background: linear-gradient(#ca91dc, #6ac1d5);
    border-radius: 40px;
`;

const StyledButton = styled(Button)`
    background: #04045a;
    margin: 2px;
    &:hover {
        background: #7119e1;
    }
`;

export default Unstake;
