import React, { useEffect, useMemo, useState } from 'react';
import { EarnSection, MaxButton, MaxButtonContainer, SectionContentContainer, SectionHeader } from '../../components';
import { Button, FlexDiv, FlexDivCentered, FlexDivColumn, GradientText } from '../../../../../theme/common';
import TimeRemaining from '../../../components/TimeRemaining/TimeRemaining';
import ValidationMessage from '../../../../../components/ValidationMessage/ValidationMessage';
import { useTranslation } from 'react-i18next';
import snxJSConnector from '../../../../../utils/snxJSConnector';
import { gasPriceInWei, normalizeGasLimit } from '../../../../../utils/network';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../../redux/rootReducer';
import {
    getCustomGasPrice,
    getGasSpeed,
    getIsWalletConnected,
    getNetworkId,
    getWalletAddress,
} from '../../../../../redux/modules/wallet';
import useEthGasPriceQuery from '../../../../../queries/network/useEthGasPriceQuery';
import NetworkFees from '../../../components/NetworkFees';
import styled from 'styled-components';
import useStakingThalesQuery from '../../../../../queries/staking/useStakingThalesQuery';
import { getIsAppReady } from '../../../../../redux/modules/app';
import { refetchUserTokenTransactions } from 'utils/queryConnector';
import { ethers } from 'ethers';
import NumericInput from '../../../Market/components/NumericInput';
import { InputLabel } from '../../../Market/components';
import ComingSoon from 'components/ComingSoon';
import { formatCurrencyWithKey } from '../../../../../utils/formatters/number';
import { THALES_CURRENCY } from '../../../../../constants/currency';
import { dispatchMarketNotification } from 'utils/options';
import { withStyles } from '@material-ui/core';
import MaterialTooltip from '@material-ui/core/Tooltip';
import { GasLimit } from '../../../components/NetworkFees/NetworkFees';

type Properties = {
    isUnstakingInContract: boolean;
    setIsUnstakingInContract: (isUnstaking: boolean) => void;
    thalesStaked: string;
    setThalesStaked: (staked: string) => void;
    thalesBalance: string;
    setThalesBalance: (staked: string) => void;
};

const addDurationPeriod = (date: Date, unstakeDurationPeriod: number) => {
    return new Date(date.getTime() + unstakeDurationPeriod + 30000); // 30 seconds buffer for time discrepancies
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
    const gasSpeed = useSelector((state: RootState) => getGasSpeed(state));
    const customGasPrice = useSelector((state: RootState) => getCustomGasPrice(state));

    const stakingThalesQuery = useStakingThalesQuery(walletAddress, networkId, {
        enabled: isAppReady && isWalletConnected,
    });

    const ethGasPriceQuery = useEthGasPriceQuery();
    const gasPrice = useMemo(
        () =>
            customGasPrice !== null
                ? customGasPrice
                : ethGasPriceQuery.data != null
                ? ethGasPriceQuery.data[gasSpeed]
                : null,
        [customGasPrice, ethGasPriceQuery.data, gasSpeed]
    );
    const [unstakeDurationPeriod, setUnstakeDurationPeriod] = useState<number>(7 * 24 * 60 * 60);
    const [isUnstaking, setIsUnstaking] = useState<boolean>(false);
    const [isCanceling, setIsCanceling] = useState<boolean>(false);
    const [unstakeEndTime, setUnstakeEndTime] = useState<Date>(addDurationPeriod(new Date(), unstakeDurationPeriod));
    const [amountToUnstake, setAmountToUnstake] = useState<string>('0');
    const [unstakingAmount, setUnstakingAmount] = useState<string>('0');
    const [unstakingEnded, setUnstakingEnded] = useState<boolean>(false);
    const [showTooltip, setShowTooltip] = useState<boolean>(false);

    const [gasLimit, setGasLimit] = useState<number | GasLimit[] | null>(null);
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
        const fetchGasLimit = async () => {
            try {
                const { stakingThalesContract } = snxJSConnector as any;
                const stakingThalesContractWithSigner = stakingThalesContract.connect((snxJSConnector as any).signer);
                let gasEstimate = null;
                if (isUnstakingInContract) {
                    if (unstakingEnded) {
                        setGasLimit([
                            {
                                gasLimit: normalizeGasLimit(
                                    Number(await stakingThalesContractWithSigner.estimateGas.unstake())
                                ),
                                label: t('options.earn.thales-staking.unstake.network-fee-unstake'),
                            },
                            {
                                gasLimit: normalizeGasLimit(
                                    Number(await stakingThalesContractWithSigner.estimateGas.cancelUnstake())
                                ),
                                label: t('options.earn.thales-staking.unstake.network-fee-cancel'),
                            },
                        ]);
                    } else {
                        setGasLimit([
                            {
                                gasLimit: normalizeGasLimit(
                                    Number(await stakingThalesContractWithSigner.estimateGas.cancelUnstake())
                                ),
                                label: t('options.earn.thales-staking.unstake.network-fee-cancel'),
                            },
                        ]);
                    }
                } else {
                    const amount = ethers.utils.parseEther(amountToUnstake);
                    gasEstimate = await stakingThalesContractWithSigner.estimateGas.startUnstake(amount);
                    setGasLimit(normalizeGasLimit(Number(gasEstimate)));
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

        if (gasPrice !== null) {
            try {
                setTxErrorMessage(null);
                setIsUnstaking(true);
                const stakingThalesContractWithSigner = stakingThalesContract.connect((snxJSConnector as any).signer);
                const amount = ethers.utils.parseEther(amountToUnstake);
                const tx = await stakingThalesContractWithSigner.startUnstake(amount, {
                    gasPrice: gasPriceInWei(gasPrice),
                    gasLimit,
                });
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
        }
    };

    const handleUnstakeThales = async () => {
        const { stakingThalesContract } = snxJSConnector as any;

        if (gasPrice !== null) {
            try {
                setTxErrorMessage(null);
                setIsUnstaking(true);
                const stakingThalesContractWithSigner = stakingThalesContract.connect((snxJSConnector as any).signer);
                const tx = await stakingThalesContractWithSigner.unstake({
                    gasPrice: gasPriceInWei(gasPrice),
                    gasLimit: (gasLimit as GasLimit[])?.find(
                        (gas) => gas.label === t('options.earn.thales-staking.unstake.network-fee-unstake')
                    )?.gasLimit,
                });
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
        }
    };

    const handleCancelUnstakingThales = async () => {
        const { stakingThalesContract } = snxJSConnector as any;

        if (gasPrice !== null) {
            try {
                setTxErrorMessage(null);
                setIsCanceling(true);
                const stakingThalesContractWithSigner = stakingThalesContract.connect((snxJSConnector as any).signer);
                const tx = await stakingThalesContractWithSigner.cancelUnstake({
                    gasPrice: gasPriceInWei(gasPrice),
                    gasLimit: (gasLimit as GasLimit[])?.find(
                        (gas) => gas.label === t('options.earn.thales-staking.unstake.network-fee-cancel')
                    )?.gasLimit,
                });
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

    const tokenStakingDisabled = process.env.REACT_APP_TOKEN_STAKING_DISABLED === 'true';

    return (
        <EarnSection
            spanOnTablet={5}
            orderOnMobile={2}
            orderOnTablet={2}
            style={{ gridColumn: 'span 3', gridRow: 'span 2' }}
        >
            <SectionHeader>{t('options.earn.thales-staking.unstake.unstake')}</SectionHeader>
            {tokenStakingDisabled && <ComingSoon />}
            {!tokenStakingDisabled && (
                <SectionContentContainer style={{ flexDirection: 'column', marginBottom: '25px' }}>
                    <FlexDivColumn>
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
                        <FlexDivCentered style={{ height: '100%', padding: '20px 0' }}>
                            {!unstakingEnded && (
                                <GradientText
                                    gradient="linear-gradient(90deg, #3936c7, #2d83d2, #23a5dd, #35dadb)"
                                    fontSize={25}
                                    fontWeight={600}
                                >
                                    {!isUnstakingInContract ? (
                                        '7 days'
                                    ) : (
                                        <TimeRemaining
                                            onEnded={() => setUnstakingEnded(true)}
                                            end={unstakeEndTime}
                                            fontSize={25}
                                        />
                                    )}
                                </GradientText>
                            )}
                        </FlexDivCentered>
                    </FlexDivColumn>
                    <FlexDiv style={{ paddingBottom: '15px' }}>
                        <NumericInput
                            style={{ flex: 1, padding: '15px 0px 0 20px', maxWidth: '60%' }}
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
                        <MaxButtonContainer>
                            <MaxButton
                                disabled={isUnstakingInContract}
                                onClick={() => {
                                    setAmountToUnstake(thalesStaked);
                                }}
                            >
                                MAX
                            </MaxButton>
                        </MaxButtonContainer>
                    </FlexDiv>
                    <NetworkFees gasLimit={gasLimit} disabled={isUnstaking} />
                    <ButtonsContainer>{getSubmitButton()}</ButtonsContainer>
                    <ValidationMessage
                        showValidation={txErrorMessage !== null}
                        message={txErrorMessage}
                        onDismiss={() => setTxErrorMessage(null)}
                    />
                </SectionContentContainer>
            )}
        </EarnSection>
    );
};

const UnstakingTitleText = styled.span`
    font-size: 16px;
    line-height: 24px;
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
