import React, { useEffect, useState } from 'react';
import { EarnSection, FullRow, Line, SectionContentContainer } from '../../styled-components';
import { FlexDivColumnCentered } from 'theme/common';
import ValidationMessage from 'components/ValidationMessage/ValidationMessage';
import { useTranslation } from 'react-i18next';
import snxJSConnector from 'utils/snxJSConnector';
import { formatGasLimit, getL1FeeInWei } from 'utils/network';
import { useSelector } from 'react-redux';
import { RootState } from 'redux/rootReducer';
import { getIsWalletConnected, getNetworkId, getWalletAddress } from 'redux/modules/wallet';
import NetworkFees from 'pages/Token/components/NetworkFees';
import styled from 'styled-components';
import { refetchTokenQueries, refetchLPStakingQueries } from 'utils/queryConnector';
import NumericInput from 'components/fields/NumericInput';
import { InputContainer } from 'pages/Token/components/styled-components';
import { formatCurrency, formatCurrencyWithKey, truncToDecimals } from 'utils/formatters/number';
import { dispatchMarketNotification } from 'utils/options';
import { GasLimit } from 'pages/Token/components/NetworkFees/NetworkFees';
import { getMaxGasLimitForNetwork } from 'constants/options';
import { ethers } from 'ethers';
import { LP_TOKEN } from 'constants/currency';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import Button from 'components/ButtonV2/Button';

type Properties = {
    staked: number;
};

const Unstake: React.FC<Properties> = ({ staked }) => {
    const { t } = useTranslation();
    const { openConnectModal } = useConnectModal();
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
            return getL1FeeInWei(txRequest, snxJSConnector);
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
            const tx = await lpStakingRewardsContractWithSigner.withdraw(amount, {
                gasLimit: getMaxGasLimitForNetwork(networkId),
            });
            const txResult = await tx.wait();

            if (txResult && txResult.transactionHash) {
                dispatchMarketNotification(
                    t('options.earn.gamified-staking.staking.unstake.unstake-confirmation-message')
                );
                refetchTokenQueries(walletAddress, networkId);
                refetchLPStakingQueries(walletAddress, networkId);
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
            return <Button onClick={openConnectModal}>{t('common.wallet.connect-your-wallet')}</Button>;
        }
        if (insufficientBalance) {
            return <Button disabled={true}>{t(`common.errors.insufficient-staking-balance`)}</Button>;
        }
        if (!isAmountEntered) {
            return <Button disabled={true}>{t(`common.errors.enter-amount`)}</Button>;
        }

        return (
            <Button disabled={isUnstakeButtonDisabled} onClick={handleUnstakeThales}>
                {!isUnstaking
                    ? `${t('options.earn.gamified-staking.staking.unstake.name')} ${formatCurrencyWithKey(
                          LP_TOKEN,
                          amountToUnstake
                      )}`
                    : `${t('options.earn.gamified-staking.staking.unstake.unstaking')} ${formatCurrencyWithKey(
                          LP_TOKEN,
                          amountToUnstake
                      )}...`}
            </Button>
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
        <EarnSection spanOnTablet={5} orderOnMobile={5} orderOnTablet={5}>
            <SectionContentContainer>
                <InputContainer>
                    <NumericInput
                        value={amountToUnstake}
                        onChange={(_, value) => setAmountToUnstake(value)}
                        disabled={isUnstaking}
                        currencyLabel={LP_TOKEN}
                        placeholder={t('common.enter-amount')}
                        label={t('options.earn.gamified-staking.staking.unstake.amount-to-unstake')}
                        onMaxButton={onMaxClick}
                        showValidation={!isAmountValid}
                        validationMessage={t(`common.errors.insufficient-staking-balance`, { currencyKey: LP_TOKEN })}
                        balance={
                            isWalletConnected
                                ? `${t('options.earn.gamified-staking.staking.unstake.balance')}: ${formatCurrency(
                                      staked
                                  )}`
                                : undefined
                        }
                    />
                </InputContainer>
                <Line margin={'0 0 10px 0'} />
                <NetworkFees gasLimit={gasLimit} disabled={isUnstaking} l1Fee={l1Fee} />
                <ButtonsContainer>{getSubmitButton()}</ButtonsContainer>
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
