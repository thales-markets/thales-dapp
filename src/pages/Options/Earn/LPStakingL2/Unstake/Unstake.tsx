import React, { useEffect, useState } from 'react';
import { EarnSection, SectionContentContainer, SectionHeader } from '../../components';
import { FlexDivColumnCentered } from '../../../../../theme/common';
import ValidationMessage from '../../../../../components/ValidationMessage/ValidationMessage';
import { useTranslation } from 'react-i18next';
import snxJSConnector from '../../../../../utils/snxJSConnector';
import { formatGasLimit, getL1FeeInWei } from '../../../../../utils/network';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../../redux/rootReducer';
import { getIsWalletConnected, getNetworkId, getWalletAddress } from '../../../../../redux/modules/wallet';
import NetworkFees from '../../../components/NetworkFees';
import styled from 'styled-components';
import { refetchTokenQueries, refetchUserTokenTransactions } from 'utils/queryConnector';
import NumericInput from '../../../Market/components/NumericInput';
import { CurrencyLabel, DefaultSubmitButton, InputContainer, InputLabel } from '../../../Market/components';
import { formatCurrencyWithKey, truncToDecimals } from '../../../../../utils/formatters/number';
import { dispatchMarketNotification } from 'utils/options';
import { GasLimit } from '../../../components/NetworkFees/NetworkFees';
import { MaxButton, ThalesWalletAmountLabel } from '../../Migration/components';
import onboardConnector from 'utils/onboardConnector';
import FieldValidationMessage from 'components/FieldValidationMessage';
import { MAX_L2_GAS_LIMIT } from 'constants/options';
import { ethers } from 'ethers';

type Properties = {
    staked: number;
};

const Unstake: React.FC<Properties> = ({ staked }) => {
    const { t } = useTranslation();
    const isWalletConnected = useSelector((state: RootState) => getIsWalletConnected(state));
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state)) || '';
    const [isUnstaking, setIsUnstaking] = useState<boolean>(false);
    const [unstakingEnded, setUnstakingEnded] = useState<boolean>(false);
    const [amountToUnstake, setAmountToUnstake] = useState<number | string>('');
    const [isAmountValid, setIsAmountValid] = useState<boolean>(true);
    const [gasLimit, setGasLimit] = useState<number | GasLimit[] | null>(null);
    const [l1Fee, setL1Fee] = useState<number | number[] | null>(null);
    const [txErrorMessage, setTxErrorMessage] = useState<string | null>(null);
    const { lpStakingRewardsContract } = snxJSConnector as any;

    const isAmountEntered = Number(amountToUnstake) > 0;
    const insufficientBalance = Number(amountToUnstake) > staked || !staked;

    const isStartUnstakeButtonDisabled =
        isUnstaking || !lpStakingRewardsContract || !isAmountEntered || insufficientBalance || !isWalletConnected;

    const isUnstakeButtonDisabled = isUnstaking || !lpStakingRewardsContract || !isWalletConnected;

    useEffect(() => {
        const fetchL1FeeUnstake = async (lpStakingRewardsContractWithSigner: any, amount: any) => {
            const txRequest = await lpStakingRewardsContractWithSigner.populateTransaction.withdraw(amount);
            return getL1FeeInWei(txRequest);
        };

        const fetchGasLimit = async () => {
            try {
                const { lpStakingRewardsContract } = snxJSConnector as any;
                const lpStakingRewardsContractWithSigner = lpStakingRewardsContract.connect(
                    (snxJSConnector as any).signer
                );
                const amount = ethers.utils.parseEther(amountToUnstake.toString());
                const [unstakeGasEstimate, l1FeeUnstakeInWei] = await Promise.all([
                    lpStakingRewardsContractWithSigner.estimateGas.withdraw(amount),
                    fetchL1FeeUnstake(lpStakingRewardsContractWithSigner, amount),
                ]);
                setGasLimit(formatGasLimit(unstakeGasEstimate, networkId));
                setL1Fee(l1FeeUnstakeInWei);
            } catch (e) {
                console.log(e);
                setGasLimit(null);
            }
        };
        if (isUnstakeButtonDisabled || isStartUnstakeButtonDisabled) return;
        fetchGasLimit();
    }, [isUnstaking, walletAddress, unstakingEnded, amountToUnstake]);

    const handleUnstakeThales = async () => {
        const { lpStakingRewardsContract } = snxJSConnector as any;

        try {
            setTxErrorMessage(null);
            setIsUnstaking(true);
            const lpStakingRewardsContractWithSigner = lpStakingRewardsContract.connect((snxJSConnector as any).signer);
            const amount = ethers.utils.parseEther(amountToUnstake.toString());
            const tx = await lpStakingRewardsContractWithSigner.withdraw(amount, { gasLimit: MAX_L2_GAS_LIMIT });
            const txResult = await tx.wait();

            if (txResult && txResult.transactionHash) {
                dispatchMarketNotification(t('options.earn.thales-staking.unstake.unstake-confirmation-message'));
                refetchTokenQueries(walletAddress, networkId);
                refetchUserTokenTransactions(walletAddress, networkId);
                setUnstakingEnded(true);
                setIsUnstaking(false);
                setGasLimit(null);
                setAmountToUnstake('');
            }
        } catch (e) {
            setTxErrorMessage(t('common.errors.unknown-error-try-again'));
            setIsUnstaking(false);
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
            return (
                <DefaultSubmitButton disabled={true}>
                    {t(`common.errors.insufficient-staking-balance`)}
                </DefaultSubmitButton>
            );
        }
        if (!isAmountEntered) {
            return <DefaultSubmitButton disabled={true}>{t(`common.errors.enter-amount`)}</DefaultSubmitButton>;
        }

        return (
            <DefaultSubmitButton onClick={handleUnstakeThales} disabled={isUnstakeButtonDisabled}>
                {!isUnstaking
                    ? `${t('options.earn.thales-staking.unstake.unstake')} ${formatCurrencyWithKey(
                          'LP Token',
                          amountToUnstake
                      )}`
                    : `${t('options.earn.thales-staking.unstake.unstaking')} ${formatCurrencyWithKey(
                          'LP Token',
                          amountToUnstake
                      )}...`}
            </DefaultSubmitButton>
        );
    };

    const onMaxClick = () => {
        setAmountToUnstake(truncToDecimals(staked, 8));
    };

    useEffect(() => {
        setIsAmountValid(
            Number(amountToUnstake) === 0 || (Number(amountToUnstake) > 0 && Number(amountToUnstake) <= staked)
        );
    }, [amountToUnstake, staked]);

    return (
        <EarnSection
            spanOnTablet={5}
            orderOnMobile={5}
            orderOnTablet={5}
            style={{ gridColumn: 'span 5', gridRow: 'span 2' }}
        >
            <SectionHeader>{t('options.earn.thales-staking.unstake.unstake')}</SectionHeader>
            <SectionContentContainer style={{ flexDirection: 'column', marginBottom: '25px' }}>
                <InputContainer>
                    <NumericInput
                        value={amountToUnstake}
                        onChange={(_, value) => setAmountToUnstake(value)}
                        disabled={isUnstaking}
                        className={isAmountValid ? '' : 'error'}
                    />
                    <InputLabel>{t('options.earn.thales-staking.unstake.amount-to-unstake')}</InputLabel>
                    <CurrencyLabel className={isUnstaking ? 'disabled' : ''}>{'LP Token'}</CurrencyLabel>
                    <ThalesWalletAmountLabel>
                        {isWalletConnected ? formatCurrencyWithKey('LP Token', staked) : '-'}
                        <MaxButton disabled={isUnstaking || !isWalletConnected} onClick={onMaxClick}>
                            {t('common.max')}
                        </MaxButton>
                    </ThalesWalletAmountLabel>
                    <FieldValidationMessage
                        showValidation={!isAmountValid}
                        message={t(`common.errors.insufficient-staking-balance`, { currencyKey: 'LP Token' })}
                    />
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

const ButtonsContainer = styled(FlexDivColumnCentered)`
    padding-top: 40px;
    align-items: center;
    > * {
        &:nth-child(2) {
            margin-top: 15px;
        }
    }
`;

export default Unstake;
