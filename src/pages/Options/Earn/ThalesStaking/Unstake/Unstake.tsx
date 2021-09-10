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

type Properties = {
    isUnstakingInContract: boolean;
    setIsUnstakingInContract: (isUnstaking: boolean) => void;
    thalesStaked: string;
    setThalesStaked: (staked: string) => void;
    thalesBalance: string;
    setThalesBalance: (staked: string) => void;
};

// week 7 * 24 * 60 * 60 * 1000
const addWeek = (date: Date) => {
    return new Date(date.getTime() + 60 * 1000);
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

    const [isUnstaking, setIsUnstaking] = useState<boolean>(false);
    const [unstakeEndTime, setUnstakeEndTime] = useState<Date>(addWeek(new Date()));
    const [amountToUnstake, setAmountToUnstake] = useState<string>('0');
    const [unstakingAmount, setUnstakingAmount] = useState<string>('0');

    const unstakingEnded = useMemo(() => {
        return isUnstakingInContract && new Date() > unstakeEndTime;
    }, [isUnstakingInContract, unstakeEndTime]);

    const [gasLimit, setGasLimit] = useState<number | null>(null);
    const [txErrorMessage, setTxErrorMessage] = useState<string | null>(null);

    useEffect(() => {
        if (stakingThalesQuery.isSuccess && stakingThalesQuery.data) {
            const { isUnstaking, unstakingAmount, lastUnstakeTime } = stakingThalesQuery.data;
            setIsUnstakingInContract(isUnstaking);
            setUnstakingAmount(unstakingAmount);
            if (isUnstaking) {
                setUnstakeEndTime(addWeek(new Date(lastUnstakeTime)));
            }
        }
    }, [stakingThalesQuery.isSuccess]);

    useEffect(() => {
        const fetchGasLimit = async () => {
            try {
                const { stakingThalesContract } = snxJSConnector as any;
                const stakingThalesContractWithSigner = stakingThalesContract.connect((snxJSConnector as any).signer);
                let gasEstimate = null;
                if (unstakingEnded) {
                    gasEstimate = await stakingThalesContractWithSigner.estimateGas.unstake();
                } else {
                    const amount = ethers.utils.parseEther(amountToUnstake);
                    gasEstimate = await stakingThalesContractWithSigner.estimateGas.startUnstake(amount);
                }
                setGasLimit(normalizeGasLimit(Number(gasEstimate)));
            } catch (e) {
                console.log(e);
                setGasLimit(null);
            }
        };
        if (isUnstaking) return;
        fetchGasLimit();
    }, [isUnstaking, walletAddress, unstakingEnded]);

    const handleStartUnstakingThales = async () => {
        const { stakingThalesContract } = snxJSConnector as any;

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
                    const rawData = txResult.events[txResult.events?.length - 1];
                    if (rawData && rawData.decode) {
                        refetchUserTokenTransactions(walletAddress, networkId);
                        setIsUnstaking(false);
                        setIsUnstakingInContract(true);
                        setUnstakingAmount(amountToUnstake);
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
                setIsUnstaking(true);
                const stakingThalesContractWithSigner = stakingThalesContract.connect((snxJSConnector as any).signer);
                const tx = await stakingThalesContractWithSigner.unstake({
                    gasPrice: gasPriceInWei(gasPrice),
                    gasLimit,
                });
                const txResult = await tx.wait();

                if (txResult && txResult.events) {
                    const rawData = txResult.events[txResult.events?.length - 1];
                    if (rawData && rawData.decode) {
                        const newThalesBalance = ethers.utils
                            .parseEther(thalesBalance)
                            .add(ethers.utils.parseEther(unstakingAmount));
                        const newThalesStaked = ethers.utils
                            .parseEther(thalesStaked)
                            .sub(ethers.utils.parseEther(unstakingAmount.toString()));
                        setIsUnstaking(false);
                        setIsUnstakingInContract(false);
                        setThalesBalance(ethers.utils.formatEther(newThalesBalance));
                        setThalesStaked(ethers.utils.formatEther(newThalesStaked));
                        setUnstakingAmount('0');
                        setAmountToUnstake('0');
                    }
                }
            } catch (e) {
                setTxErrorMessage(t('common.errors.unknown-error-try-again'));
                setIsUnstaking(false);
            }
        }
    };

    const getSubmitButton = () => {
        if (isUnstakingInContract) {
            return (
                <Button className="primary" onClick={handleUnstakeThales} disabled={!unstakingEnded || isUnstaking}>
                    {!isUnstaking
                        ? t('options.earn.thales-staking.unstake.unstake')
                        : t('options.earn.thales-staking.unstake.unstaking')}
                </Button>
            );
        }

        return (
            <Button
                className="primary"
                onClick={handleStartUnstakingThales}
                disabled={isUnstaking || !+amountToUnstake}
            >
                {!isUnstaking
                    ? t('options.earn.thales-staking.unstake.start-unstaking')
                    : t('options.earn.thales-staking.unstake.unstaking')}
            </Button>
        );
    };

    return (
        <EarnSection style={{ gridColumn: 'span 3', gridRow: 'span 2' }}>
            <SectionHeader>{t('options.earn.thales-staking.unstake.unstake')}</SectionHeader>
            <SectionContentContainer style={{ flexDirection: 'column', marginBottom: '25px' }}>
                <FlexDivColumn>
                    <UnstakingTitleText>
                        {isUnstakingInContract
                            ? t('options.earn.thales-staking.unstake.cooldown-started-text')
                            : t('options.earn.thales-staking.unstake.unlock-cooldown-text')}
                        :
                    </UnstakingTitleText>
                    <FlexDivCentered style={{ height: '100%', padding: '20px 0' }}>
                        <GradientText
                            gradient="linear-gradient(90deg, #3936c7, #2d83d2, #23a5dd, #35dadb)"
                            fontSize={25}
                            fontWeight={600}
                        >
                            {!isUnstakingInContract ? '7 days' : <TimeRemaining end={unstakeEndTime} fontSize={25} />}
                        </GradientText>
                    </FlexDivCentered>
                </FlexDivColumn>
                <FlexDiv style={{ paddingBottom: '15px' }}>
                    <NumericInput
                        style={{ flex: 1, padding: '15px 0px 0 20px' }}
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
                <FlexDivCentered style={{ paddingTop: '15px' }}>{getSubmitButton()}</FlexDivCentered>
                <ValidationMessage
                    showValidation={txErrorMessage !== null}
                    message={txErrorMessage}
                    onDismiss={() => setTxErrorMessage(null)}
                />
            </SectionContentContainer>
        </EarnSection>
    );
};

const UnstakingTitleText = styled.span`
    font-size: 16px;
    line-height: 24px;
`;

export default Unstake;
