import ValidationMessage from 'components/ValidationMessage';
import { ethers } from 'ethers';
import {
    Container,
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
import { getIsWalletConnected, getNetworkId, getWalletAddress } from 'redux/modules/wallet';
import { bigNumberFormatter, getAddress } from 'utils/formatters/ethers';
import { APPROVAL_EVENTS } from 'constants/events';
import { RootState } from 'redux/rootReducer';
import { useSelector } from 'react-redux';
import { formatGasLimit } from 'utils/network';
import onboardConnector from 'utils/onboardConnector';
import { THALES_CURRENCY } from 'constants/currency';
import NetworkFees from 'pages/Options/components/NetworkFees';

const Migration: React.FC = () => {
    const { t } = useTranslation();
    const isWalletConnected = useSelector((state: RootState) => getIsWalletConnected(state));
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state)) || '';
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const [amountToMigrate, setAmountToMigrate] = useState<number | string>('');
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [txErrorMessage, setTxErrorMessage] = useState<string | null>(null);
    const [hasAllowance, setAllowance] = useState<boolean>(false);
    const [isAllowing, setIsAllowing] = useState<boolean>(false);
    const [gasLimit, setGasLimit] = useState<number | null>(null);

    const isAmountToMigrateEntered = Number(amountToMigrate) > 0;
    const isButtonDisabled = isSubmitting || !isWalletConnected || !isAmountToMigrateEntered;

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        const { thalesTokenContract, thalesExchangerContract } = snxJSConnector as any;

        if (thalesTokenContract && thalesExchangerContract) {
            const thalesTokenContractWithSigner = thalesTokenContract.connect((snxJSConnector as any).signer);
            const addressToApprove = thalesExchangerContract.address;

            const getAllowance = async () => {
                try {
                    const allowance = await thalesTokenContractWithSigner.allowance(walletAddress, addressToApprove);
                    setAllowance(!!bigNumberFormatter(allowance));
                } catch (e) {
                    console.log(e);
                }
            };

            const registerAllowanceListener = () => {
                thalesTokenContractWithSigner.on(APPROVAL_EVENTS.APPROVAL, (owner: string, spender: string) => {
                    if (owner === walletAddress && spender === getAddress(addressToApprove)) {
                        setAllowance(true);
                        setIsAllowing(false);
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
    }, [walletAddress, isWalletConnected, hasAllowance]);

    useEffect(() => {
        const fetchGasLimit = async () => {
            const { thalesExchangerContract } = snxJSConnector as any;

            if (thalesExchangerContract) {
                try {
                    const thalesExchangerContractWithSigner = thalesExchangerContract.connect(
                        (snxJSConnector as any).signer
                    );
                    const parsedAmount = ethers.utils.parseEther(amountToMigrate.toString());
                    const gasEstimate = await thalesExchangerContractWithSigner.estimateGas.exchangeThalesToL2OpThales(
                        parsedAmount
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
    }, [isButtonDisabled, amountToMigrate, hasAllowance, walletAddress]);

    const handleAllowance = async () => {
        const { thalesTokenContract, thalesExchangerContract } = snxJSConnector as any;

        if (thalesTokenContract && thalesExchangerContract) {
            const thalesTokenContractWithSigner = thalesTokenContract.connect((snxJSConnector as any).signer);
            const addressToApprove = thalesExchangerContract.address;

            try {
                setIsAllowing(true);
                const gasEstimate = await thalesTokenContractWithSigner.estimateGas.approve(
                    addressToApprove,
                    ethers.constants.MaxUint256
                );
                const tx = (await thalesTokenContractWithSigner.approve(addressToApprove, ethers.constants.MaxUint256, {
                    gasLimit: formatGasLimit(gasEstimate, networkId),
                })) as ethers.ContractTransaction;

                const txResult = await tx.wait();
                if (txResult && txResult.transactionHash) {
                    setAllowance(true);
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
            const { thalesExchangerContract } = snxJSConnector as any;
            const thalesExchangerContractWithSigner = thalesExchangerContract.connect((snxJSConnector as any).signer);

            const parsedAmount = ethers.utils.parseEther(amountToMigrate.toString());
            const tx = await thalesExchangerContractWithSigner.exchangeThalesToL2OpThales(parsedAmount);
            const txResult = await tx.wait();

            if (txResult && txResult.transactionHash) {
                dispatchMarketNotification(t('migration.migration-confirmation-message'));
                setIsSubmitting(false);
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
        if (!hasAllowance) {
            return (
                <DefaultSubmitButton disabled={isAllowing} onClick={handleAllowance}>
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
                {!isSubmitting ? t('migration.migration-button.label') : t('migration.migration-button.progress-label')}
            </DefaultSubmitButton>
        );
    };

    return (
        <Container>
            <InputContainer>
                <NumericInput value={amountToMigrate} onChange={(_, value) => setAmountToMigrate(value)} />
                <InputLabel>{t('migration.migration-amount-label')}</InputLabel>
            </InputContainer>
            <Divider />
            <NetworkFees gasLimit={gasLimit} disabled={isSubmitting} />
            <SubmitButtonContainer>{getSubmitButton()}</SubmitButtonContainer>
            <ValidationMessage
                showValidation={txErrorMessage !== null}
                message={txErrorMessage}
                onDismiss={() => setTxErrorMessage(null)}
            />
        </Container>
    );
};

export default Migration;
