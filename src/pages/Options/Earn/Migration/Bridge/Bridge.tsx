import ValidationMessage from 'components/ValidationMessage';
import { BigNumber, ethers } from 'ethers';
import {
    CurrencyLabel,
    DefaultSubmitButton,
    Divider,
    InputContainer,
    InputLabel,
    SubmitButtonContainer,
} from 'pages/Options/Market/components';
import NumericInput from 'pages/Options/Market/components/NumericInput';
import React, { useEffect, useState } from 'react';
import { dispatchMarketNotification } from 'utils/options';
import snxJSConnector from 'utils/snxJSConnector';
import { useTranslation } from 'react-i18next';
import { getIsWalletConnected, getNetwork, getNetworkId, getWalletAddress } from 'redux/modules/wallet';
import { RootState } from 'redux/rootReducer';
import { useSelector } from 'react-redux';
import { checkAllowance, formatGasLimit, NetworkId, SUPPORTED_NETWORKS_NAMES } from 'utils/network';
import onboardConnector from 'utils/onboardConnector';
import { THALES_CURRENCY } from 'constants/currency';
import NetworkFees from 'pages/Options/components/NetworkFees';
import { L1_TO_L2_NETWORK_MAPPER } from 'constants/network';
import { ReactComponent as ArrowDown } from 'assets/images/arrow-down-blue.svg';
import { getIsAppReady } from 'redux/modules/app';
import { formatCurrencyWithKey, truncToDecimals } from 'utils/formatters/number';
import FieldValidationMessage from 'components/FieldValidationMessage';
import {
    ArrowContainer,
    MaxButton,
    NetworkLabel,
    Result,
    ResultContainer,
    ThalesWalletAmountLabel,
} from '../components';
import SimpleLoader from '../../components/SimpleLoader';
import InfoMessage from 'components/InfoMessage';
import InfoWarningMessage from 'components/InfoWarningMessage';
import { FlexDiv } from 'theme/common';
import styled from 'styled-components';
import ApprovalModal from 'components/ApprovalModal';
import useOpThalesBalanceQuery from '../../../../../queries/walletBalances/useOpThalesBalanceQuery';
import { thalesContract as thalesTokenContract } from '../../../../../utils/contracts/thalesContract';

const Bridge: React.FC = () => {
    const { t } = useTranslation();
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
    const isWalletConnected = useSelector((state: RootState) => getIsWalletConnected(state));
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state)) || '';
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const network = useSelector((state: RootState) => getNetwork(state));
    const [amount, setAmount] = useState<number | string>('');
    const [isAmountValid, setIsAmountValid] = useState<boolean>(true);
    const [opThalesBalance, setOpThalesBalance] = useState<number | string>('');
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [txErrorMessage, setTxErrorMessage] = useState<string | null>(null);
    const [hasAllowance, setAllowance] = useState<boolean>(false);
    const [isAllowing, setIsAllowing] = useState<boolean>(false);
    const [gasLimit, setGasLimit] = useState<number | null>(null);
    const [openApprovalModal, setOpenApprovalModal] = useState<boolean>(false);

    const isAmountEntered = Number(amount) > 0;
    const insufficientBalance = Number(opThalesBalance) < Number(amount) || Number(opThalesBalance) === 0;

    const isButtonDisabled =
        isSubmitting || !isWalletConnected || !isAmountEntered || insufficientBalance || !hasAllowance;

    const opThalesBalanceQuery = useOpThalesBalanceQuery(walletAddress, networkId, {
        enabled: isAppReady && isWalletConnected,
    });

    useEffect(() => {
        if (opThalesBalanceQuery.isSuccess && opThalesBalanceQuery.data) {
            setOpThalesBalance(Number(opThalesBalanceQuery.data.balance));
        }
    }, [opThalesBalanceQuery.isSuccess, opThalesBalanceQuery.data]);

    useEffect(() => {
        const { opThalesTokenContract, bridgeContract } = snxJSConnector as any;

        if (opThalesTokenContract && bridgeContract) {
            const opThalesTokenContractWithSigner = opThalesTokenContract.connect((snxJSConnector as any).signer);
            const addressToApprove = bridgeContract.address;

            const getAllowance = async () => {
                try {
                    const parsedAmount = ethers.utils.parseEther(Number(amount).toString());
                    const allowance = await checkAllowance(
                        parsedAmount,
                        opThalesTokenContractWithSigner,
                        walletAddress,
                        addressToApprove
                    );
                    setAllowance(allowance);
                } catch (e) {
                    console.log(e);
                }
            };
            if (isWalletConnected) {
                getAllowance();
            }
        }
    }, [walletAddress, isWalletConnected, hasAllowance, networkId, amount, isAllowing]);

    useEffect(() => {
        const fetchGasLimit = async () => {
            const { bridgeContract, opThalesTokenContract } = snxJSConnector as any;
            if (bridgeContract) {
                try {
                    const bridgeContractWithSigner = bridgeContract.connect((snxJSConnector as any).signer);
                    const parsedAmount = ethers.utils.parseEther(amount.toString());
                    const gasEstimate = await bridgeContractWithSigner.estimateGas.depositERC20To(
                        opThalesTokenContract.address,
                        (thalesTokenContract as any).addresses[L1_TO_L2_NETWORK_MAPPER[networkId]],
                        walletAddress,
                        parsedAmount,
                        2000000,
                        '0x'
                    );
                    setGasLimit(formatGasLimit(gasEstimate, networkId));
                } catch (e) {
                    console.log(e);
                    setGasLimit(null);
                }
            }
        };
        if (isButtonDisabled) return;
        fetchGasLimit();
    }, [isButtonDisabled, amount, hasAllowance, walletAddress]);

    const handleAllowance = async (approveAmount: BigNumber) => {
        const { opThalesTokenContract, bridgeContract } = snxJSConnector as any;

        if (opThalesTokenContract && bridgeContract) {
            const opThalesTokenContractWithSigner = opThalesTokenContract.connect((snxJSConnector as any).signer);
            const addressToApprove = bridgeContract.address;

            try {
                setIsAllowing(true);
                const gasEstimate = await opThalesTokenContractWithSigner.estimateGas.approve(
                    addressToApprove,
                    approveAmount
                );
                const tx = (await opThalesTokenContractWithSigner.approve(addressToApprove, approveAmount, {
                    gasLimit: formatGasLimit(gasEstimate, networkId),
                })) as ethers.ContractTransaction;
                setOpenApprovalModal(false);
                const txResult = await tx.wait();
                if (txResult && txResult.transactionHash) {
                    setIsAllowing(false);
                }
            } catch (e) {
                console.log(e);
                setTxErrorMessage(t('common.errors.unknown-error-try-again'));
                setIsAllowing(false);
            }
        }
    };

    const handleSubmit = async () => {
        setTxErrorMessage(null);
        setIsSubmitting(true);

        try {
            const { bridgeContract, opThalesTokenContract } = snxJSConnector as any;
            const bridgeContractWithSigner = bridgeContract.connect((snxJSConnector as any).signer);

            const parsedAmount = ethers.utils.parseEther(amount.toString());
            const tx = await bridgeContractWithSigner.depositERC20To(
                opThalesTokenContract.address,
                (thalesTokenContract as any).addresses[L1_TO_L2_NETWORK_MAPPER[networkId]],
                walletAddress,
                parsedAmount,
                2000000,
                '0x'
            );
            const txResult = await tx.wait();

            if (txResult && txResult.transactionHash) {
                dispatchMarketNotification(t('migration.bridge-button.confirmation-message'));
                setIsSubmitting(false);
                setAmount('');
            }
        } catch (e) {
            console.log(e);
            setTxErrorMessage(t('common.errors.unknown-error-try-again'));
            setIsSubmitting(false);
        }
    };

    const getSubmitButton = () => {
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
        if (!hasAllowance) {
            return (
                <DefaultSubmitButton disabled={isAllowing} onClick={() => setOpenApprovalModal(true)}>
                    {!isAllowing
                        ? t('common.enable-wallet-access.approve-label', { currencyKey: THALES_CURRENCY })
                        : t('common.enable-wallet-access.approve-progress-label', {
                              currencyKey: THALES_CURRENCY,
                          })}
                </DefaultSubmitButton>
            );
        }
        return (
            <DefaultSubmitButton disabled={isButtonDisabled || !gasLimit} onClick={handleSubmit}>
                {!isSubmitting ? t('migration.bridge-button.label') : t('migration.bridge-button.progress-label')}
            </DefaultSubmitButton>
        );
    };

    const onMaxClick = () => {
        setAmount(truncToDecimals(opThalesBalance, 8));
    };

    useEffect(() => {
        setIsAmountValid(Number(amount) === 0 || (Number(amount) > 0 && Number(amount) <= opThalesBalance));
    }, [amount, opThalesBalance]);

    return (
        <>
            <InputContainer>
                <NumericInput
                    value={amount}
                    onChange={(_, value) => setAmount(value)}
                    disabled={isSubmitting}
                    className={isAmountValid ? '' : 'error'}
                />
                <InputLabel>
                    {t('migration.from-label')}
                    <NetworkLabel>{network.networkName}</NetworkLabel>
                </InputLabel>
                <CurrencyLabel className={isSubmitting ? 'disabled' : ''}>{THALES_CURRENCY}</CurrencyLabel>
                <ThalesWalletAmountLabel>
                    {isWalletConnected ? (
                        opThalesBalanceQuery.isLoading ? (
                            <SimpleLoader />
                        ) : (
                            formatCurrencyWithKey(THALES_CURRENCY, opThalesBalance)
                        )
                    ) : (
                        '-'
                    )}
                    <MaxButton disabled={isSubmitting || !isWalletConnected} onClick={onMaxClick}>
                        {t('common.max')}
                    </MaxButton>
                </ThalesWalletAmountLabel>
                <FieldValidationMessage
                    showValidation={!isAmountValid}
                    message={t(`common.errors.insufficient-balance-wallet`, { currencyKey: THALES_CURRENCY })}
                />
            </InputContainer>
            <ArrowContainer>
                <ArrowDown />
            </ArrowContainer>
            <ResultContainer>
                <Result>{amount}</Result>
                <InputLabel>
                    {t('migration.to-label')}
                    <NetworkLabel>
                        {SUPPORTED_NETWORKS_NAMES[L1_TO_L2_NETWORK_MAPPER[networkId] as NetworkId]}
                    </NetworkLabel>
                </InputLabel>
                <CurrencyLabel>{THALES_CURRENCY}</CurrencyLabel>
            </ResultContainer>
            <Divider />
            <NetworkFees gasLimit={gasLimit} disabled={isSubmitting} />
            <MessageContainer>
                <InfoMessage message={t('migration.migration-delay-info')}></InfoMessage>
            </MessageContainer>
            <MessageContainer>
                <InfoWarningMessage message={t('migration.migration-multisig-contact-warning')}></InfoWarningMessage>
            </MessageContainer>
            <SubmitButtonContainer>{getSubmitButton()}</SubmitButtonContainer>
            <ValidationMessage
                showValidation={txErrorMessage !== null}
                message={txErrorMessage}
                onDismiss={() => setTxErrorMessage(null)}
            />
            {openApprovalModal && (
                <ApprovalModal
                    defaultAmount={amount}
                    tokenSymbol={THALES_CURRENCY}
                    isAllowing={isAllowing}
                    onSubmit={handleAllowance}
                    onClose={() => setOpenApprovalModal(false)}
                />
            )}
        </>
    );
};

const MessageContainer = styled(FlexDiv)`
    margin-top: 10px;
`;

export default Bridge;
