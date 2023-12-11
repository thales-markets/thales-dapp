import Button from 'components/Button/Button';
import {
    getDefaultToastContent,
    getErrorToastOptions,
    getLoadingToastOptions,
    getSuccessToastOptions,
} from 'components/ToastMessage/ToastMessage';
import NumericInput from 'components/fields/NumericInput';
import { LP_TOKEN } from 'constants/currency';
import { ethers } from 'ethers';
import { InputContainer } from 'pages/Token/components/styled-components';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import {
    getIsWalletConnected,
    getNetworkId,
    getWalletAddress,
    getWalletConnectModalVisibility,
    setWalletConnectModalVisibility,
} from 'redux/modules/wallet';
import { RootState } from 'redux/rootReducer';
import styled from 'styled-components';
import { FlexDivColumnCentered } from 'styles/common';
import { formatCurrency, formatCurrencyWithKey, truncToDecimals } from 'thales-utils';
import { refetchLPStakingQueries, refetchTokenQueries } from 'utils/queryConnector';
import snxJSConnector from 'utils/snxJSConnector';
import { EarnSection, SectionContentContainer } from '../../styled-components';

type Properties = {
    staked: number;
};

const Unstake: React.FC<Properties> = ({ staked }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();

    const isWalletConnected = useSelector((state: RootState) => getIsWalletConnected(state));
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state)) || '';
    const connectWalletModalVisibility = useSelector((state: RootState) => getWalletConnectModalVisibility(state));

    const [isUnstaking, setIsUnstaking] = useState<boolean>(false);
    const [amountToUnstake, setAmountToUnstake] = useState<number | string>('');
    const [isAmountValid, setIsAmountValid] = useState<boolean>(true);
    const { lpStakingRewardsContract } = snxJSConnector as any;

    const isAmountEntered = Number(amountToUnstake) > 0;
    const insufficientBalance = Number(amountToUnstake) > staked || !staked;

    const isUnstakeButtonDisabled = isUnstaking || !lpStakingRewardsContract || !isWalletConnected;

    const handleUnstakeThales = async () => {
        const { lpStakingRewardsContract } = snxJSConnector as any;
        const id = toast.loading(getDefaultToastContent(t('common.progress')), getLoadingToastOptions());
        try {
            setIsUnstaking(true);
            const lpStakingRewardsContractWithSigner = lpStakingRewardsContract.connect((snxJSConnector as any).signer);
            const amount = ethers.utils.parseEther(amountToUnstake.toString());
            const tx = await lpStakingRewardsContractWithSigner.withdraw(amount);
            const txResult = await tx.wait();

            if (txResult && txResult.transactionHash) {
                toast.update(
                    id,
                    getSuccessToastOptions(
                        t('thales-token.gamified-staking.staking.unstake.unstake-confirmation-message'),
                        id
                    )
                );
                refetchTokenQueries(walletAddress, networkId);
                refetchLPStakingQueries(walletAddress, networkId);
                setIsUnstaking(false);
                setAmountToUnstake('');
            }
        } catch (e) {
            toast.update(id, getErrorToastOptions(t('common.errors.unknown-error-try-again'), id));
            setIsUnstaking(false);
        }
    };

    const getSubmitButton = () => {
        if (!isWalletConnected) {
            return (
                <Button
                    onClick={() =>
                        dispatch(
                            setWalletConnectModalVisibility({
                                visibility: !connectWalletModalVisibility,
                            })
                        )
                    }
                >
                    {t('common.wallet.connect-your-wallet')}
                </Button>
            );
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
                    ? `${t('thales-token.gamified-staking.staking.unstake.name')} ${formatCurrencyWithKey(
                          LP_TOKEN,
                          amountToUnstake
                      )}`
                    : `${t('thales-token.gamified-staking.staking.unstake.unstaking')} ${formatCurrencyWithKey(
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
                        label={t('thales-token.gamified-staking.staking.unstake.amount-to-unstake')}
                        onMaxButton={onMaxClick}
                        showValidation={!isAmountValid}
                        validationMessage={t(`common.errors.insufficient-staking-balance`, { currencyKey: LP_TOKEN })}
                        balance={isWalletConnected ? `${t('common.balance')}: ${formatCurrency(staked)}` : undefined}
                    />
                </InputContainer>
                <ButtonsContainer>{getSubmitButton()}</ButtonsContainer>
            </SectionContentContainer>
        </EarnSection>
    );
};

const ButtonsContainer = styled(FlexDivColumnCentered)`
    padding-top: 40px;
    padding-bottom: 10px;
    align-items: center;
    > * {
        &:nth-child(2) {
            margin-top: 15px;
        }
    }
`;

export default Unstake;
