import React, { useEffect, useMemo, useState } from 'react';
import { EarnSection, SectionHeader, FullRow, SectionContentContainer } from '../../components';
import { formatCurrencyWithKey } from '../../../../../utils/formatters/number';
import { THALES_CURRENCY } from '../../../../../constants/currency';
import { Button, FlexDiv, FlexDivCentered, FlexDivRowCentered } from '../../../../../theme/common';
import NumericInput from '../../../Market/components/NumericInput';
import { Divider, InputLabel } from '../../../Market/components';
import useThalesBalanceQuery from '../../../../../queries/walletBalances/useThalesBalanceQuery';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../../redux/rootReducer';
import { getIsAppReady } from '../../../../../redux/modules/app';
import {
    getCustomGasPrice,
    getGasSpeed,
    getIsWalletConnected,
    getNetworkId,
    getWalletAddress,
} from '../../../../../redux/modules/wallet';
import snxJSConnector from '../../../../../utils/snxJSConnector';
import { ethers } from 'ethers';
import { bigNumberFormatter, getAddress } from '../../../../../utils/formatters/ethers';
import { APPROVAL_EVENTS } from '../../../../../constants/events';
import ValidationMessage from '../../../../../components/ValidationMessage/ValidationMessage';
import NetworkFees from '../../../components/NetworkFees';
import { gasPriceInWei, normalizeGasLimit } from '../../../../../utils/network';
import useEthGasPriceQuery from '../../../../../queries/network/useEthGasPriceQuery';

type Properties = {
    thalesStaked: number;
    setThalesStaked: (staked: number) => void;
    balance: number;
    setBalance: (staked: number) => void;
    isUnstaking: boolean;
};

const Stake: React.FC<Properties> = ({ thalesStaked, setThalesStaked, isUnstaking, balance, setBalance }) => {
    const { t } = useTranslation();

    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
    const isWalletConnected = useSelector((state: RootState) => getIsWalletConnected(state));
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state)) || '';
    const gasSpeed = useSelector((state: RootState) => getGasSpeed(state));
    const customGasPrice = useSelector((state: RootState) => getCustomGasPrice(state));

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

    const thalesBalanceQuery = useThalesBalanceQuery(walletAddress, networkId, {
        enabled: isAppReady && isWalletConnected,
    });

    const [amountToStake, setAmountToStake] = useState<number | string>(0);
    const [isAllowingStake, setIsAllowingStake] = useState<boolean>(false);
    const [isStaking, setIsStaking] = useState<boolean>(false);
    const [hasStakeAllowance, setStakeAllowance] = useState<boolean>(false);
    const [txErrorMessage, setTxErrorMessage] = useState<string | null>(null);
    const [gasLimit, setGasLimit] = useState<number | null>(null);

    useEffect(() => {
        if (thalesBalanceQuery.isSuccess && thalesBalanceQuery.data) {
            setBalance(thalesBalanceQuery.data.balance);
        }
    }, [thalesBalanceQuery.isSuccess]);

    useEffect(() => {
        const { thalesTokenContract, stakingThalesContract } = snxJSConnector as any;
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
    }, [walletAddress, isWalletConnected, hasStakeAllowance]);

    useEffect(() => {
        const fetchGasLimit = async () => {
            const amount = ethers.utils.parseEther(amountToStake.toString());
            try {
                const { stakingThalesContract } = snxJSConnector as any;
                const stakingThalesContractWithSigner = stakingThalesContract.connect((snxJSConnector as any).signer);
                const gasEstimate = await stakingThalesContractWithSigner.estimateGas.stake(amount);
                setGasLimit(normalizeGasLimit(Number(gasEstimate)));
            } catch (e) {
                console.log(e);
                setGasLimit(null);
            }
        };
        if (!amountToStake || isStaking) return;
        fetchGasLimit();
    }, [amountToStake, isStaking, hasStakeAllowance, walletAddress]);

    const getStakeButton = () => {
        if (!hasStakeAllowance) {
            return (
                <Button disabled={isAllowingStake} onClick={handleAllowance} className="primary">
                    {!isAllowingStake
                        ? t('common.enable-wallet-access.approve-label', { currencyKey: THALES_CURRENCY })
                        : t('common.enable-wallet-access.approve-progress-label', {
                              currencyKey: THALES_CURRENCY,
                          })}
                </Button>
            );
        }

        return (
            <Button
                disabled={!amountToStake || isStaking || isUnstaking}
                onClick={handleStakeThales}
                className="primary"
            >
                {!isStaking
                    ? t('options.earn.thales-staking.stake.stake')
                    : t('options.earn.thales-staking.stake.staking')}
            </Button>
        );
    };

    const handleStakeThales = async () => {
        const { stakingThalesContract } = snxJSConnector as any;

        if (gasPrice !== null) {
            try {
                setIsStaking(true);
                const stakingThalesContractWithSigner = stakingThalesContract.connect((snxJSConnector as any).signer);
                const toStake = ethers.utils.parseEther(amountToStake.toString());
                const tx = await stakingThalesContractWithSigner.stake(toStake, {
                    gasPrice: gasPriceInWei(gasPrice),
                    gasLimit,
                });
                const txResult = await tx.wait();

                if (txResult && txResult.events) {
                    const rawData = txResult.events[txResult.events?.length - 1];
                    if (rawData && rawData.decode) {
                        setBalance(balance - Number(amountToStake));
                        setAmountToStake(0);
                        setThalesStaked(thalesStaked + Number(amountToStake));
                        setIsStaking(false);
                    }
                }
            } catch (e) {
                setTxErrorMessage(t('common.errors.unknown-error-try-again'));
                setIsStaking(false);
            }
        }
    };

    const handleAllowance = async () => {
        const { thalesTokenContract, stakingThalesContract } = snxJSConnector as any;
        const thalesTokenContractWithSigner = thalesTokenContract.connect((snxJSConnector as any).signer);

        const addressToApprove = stakingThalesContract.address;
        if (gasPrice !== null) {
            try {
                setIsAllowingStake(true);
                const gasEstimate = await thalesTokenContractWithSigner.estimateGas.approve(
                    addressToApprove,
                    ethers.constants.MaxUint256
                );
                const tx = (await thalesTokenContractWithSigner.approve(addressToApprove, ethers.constants.MaxUint256, {
                    gasLimit: normalizeGasLimit(Number(gasEstimate)),
                    gasPrice: gasPriceInWei(gasPrice),
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
        }
    };

    return (
        <EarnSection style={{ gridColumn: 'span 6' }}>
            <SectionHeader>{t('options.earn.thales-staking.stake.stake')}</SectionHeader>
            <SectionContentContainer style={{ height: '100%' }}>
                <FlexDivRowCentered>
                    <div>
                        {t('options.earn.thales-staking.stake.available-to-stake')}:{' '}
                        {formatCurrencyWithKey(THALES_CURRENCY, balance)}
                    </div>
                    <FlexDiv>
                        <NumericInput
                            value={amountToStake}
                            onChange={(_, value) => {
                                if (+value <= balance) {
                                    setAmountToStake(value);
                                }
                            }}
                            step="0.01"
                            max={balance.toString()}
                            disabled={false}
                        />
                        <InputLabel>{t('options.earn.thales-staking.stake.amount-to-stake')}</InputLabel>
                    </FlexDiv>
                </FlexDivRowCentered>
                <Divider />
                <NetworkFees gasLimit={gasLimit} disabled={isStaking} />
                <FlexDivCentered>{getStakeButton()}</FlexDivCentered>
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

export default Stake;
