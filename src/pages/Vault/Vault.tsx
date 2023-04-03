import React, { useEffect, useMemo, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import {
    Container,
    Title,
    SubmitButton,
    ButtonContainer,
    Wrapper,
    ToggleContainer,
    Description,
    VaultFilledGraphicContainer,
    VaultFilledGraphicPercentage,
    VaultFilledText,
    RoundInfoWrapper,
    RoundInfoContainer,
    RoundInfo,
    LeftContainer,
    RightContainer,
    ContentInfoContainer,
    ContentInfo,
    BoldContent,
    WarningContentInfo,
    CloseRoundButton,
    LeftLoaderContainer,
    RightLoaderContainer,
    RoundEndContainer,
    RoundEndLabel,
    RoundEnd,
    RoundAllocationContainer,
    RoundAllocationLabel,
    RoundAllocation,
    RoundAllocationWrapper,
    UsersInVaultText,
    TitleVaultIcon,
    VariablesContainer,
    Info,
    Variables,
    VariablesTitle,
    Link,
} from './styled-components';
import { useSelector } from 'react-redux';
import { RootState } from 'redux/rootReducer';
import { getIsWalletConnected, getNetworkId, getWalletAddress } from 'redux/modules/wallet';
import { VaultTab, VAULT_MAP } from 'constants/vault';
import { getIsAppReady } from 'redux/modules/app';
import { UserVaultData, VaultData } from 'types/vault';
import useVaultDataQuery from 'queries/vault/useVaultDataQuery';
import { formatCurrencyWithSign, formatPercentage, formatCurrency } from 'utils/formatters/number';
import { SYNTHS_MAP, USD_SIGN } from 'constants/currency';
import TimeRemaining from 'components/TimeRemaining';
import useUserVaultDataQuery from 'queries/vault/useUserVaultDataQuery';
import snxJSConnector from 'utils/snxJSConnector';
import { toast } from 'react-toastify';
import { getErrorToastOptions, getSuccessToastOptions } from 'constants/ui';
import ApprovalModal from 'components/ApprovalModal';
import { checkAllowance } from 'utils/network';
import { BigNumber, ethers } from 'ethers';
import SimpleLoader from 'components/SimpleLoader';
import Transactions from './Transactions';
import PnL from './PnL';
import { RouteComponentProps } from 'react-router-dom';
import vaultContract from 'utils/contracts/sportVaultContract';
import { getStableCoinForNetwork } from 'utils/currency';
import { getCurrencyKeyStableBalance } from 'utils/balances';
import useStableBalanceQuery from 'queries/walletBalances/useStableBalanceQuery';
import Switch from 'components/SwitchInput/SwitchInputNew';
import onboardConnector from 'utils/onboardConnector';
import Tooltip from 'components/Tooltip';
import OpRewardsBanner from 'components/OpRewardsBanner';
import NumericInput from 'pages/Token/components/NumericInput';
import { CurrencyLabel, InputLabel, InputContainer } from 'pages/Token/components/components';
import FieldValidationMessage from 'components/FieldValidationMessage';
import Footer from 'components/Footer';
import { LINKS } from 'constants/links';
import ElectionsBanner from 'components/ElectionsBanner';
import { getMaxGasLimitForNetwork } from 'constants/options';

type VaultProps = RouteComponentProps<{
    vaultId: string;
}>;

const Vault: React.FC<VaultProps> = (props) => {
    const { t } = useTranslation();
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
    const isWalletConnected = useSelector((state: RootState) => getIsWalletConnected(state));
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state)) || '';
    const [amount, setAmount] = useState<number | string>('');
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [hasAllowance, setAllowance] = useState<boolean>(false);
    const [isAllowing, setIsAllowing] = useState<boolean>(false);
    const [openApprovalModal, setOpenApprovalModal] = useState<boolean>(false);
    const [selectedTab, setSelectedTab] = useState<VaultTab>(VaultTab.DEPOSIT);
    const [paymentTokenBalance, setPaymentTokenBalance] = useState<number | string>('');
    const [lastValidVaultData, setLastValidVaultData] = useState<VaultData | undefined>(undefined);
    const [lastValidUserVaultData, setLastValidUserVaultData] = useState<UserVaultData | undefined>(undefined);

    const { params } = props.match;
    const vaultId = params && params.vaultId ? params.vaultId : '';
    const vaultAddress = !!VAULT_MAP[vaultId] ? VAULT_MAP[vaultId].addresses[networkId] : undefined;

    const paymentTokenBalanceQuery = useStableBalanceQuery(walletAddress, networkId, {
        enabled: isAppReady && isWalletConnected,
    });

    useEffect(() => {
        if (paymentTokenBalanceQuery.isSuccess && paymentTokenBalanceQuery.data !== undefined) {
            setPaymentTokenBalance(
                getCurrencyKeyStableBalance(paymentTokenBalanceQuery.data, getStableCoinForNetwork(networkId))
            );
        }
    }, [paymentTokenBalanceQuery.isSuccess, paymentTokenBalanceQuery.data]);

    const vaultDataQuery = useVaultDataQuery(vaultAddress, networkId, {
        enabled: isAppReady && !!vaultAddress,
    });

    useEffect(() => {
        if (vaultDataQuery.isSuccess && vaultDataQuery.data) {
            setLastValidVaultData(vaultDataQuery.data);
        }
    }, [vaultDataQuery.isSuccess, vaultDataQuery.data]);

    const vaultData: VaultData | undefined = useMemo(() => {
        if (vaultDataQuery.isSuccess && vaultDataQuery.data) {
            return vaultDataQuery.data;
        }
        return lastValidVaultData;
    }, [vaultDataQuery.isSuccess, vaultDataQuery.data, lastValidVaultData]);

    const userVaultDataQuery = useUserVaultDataQuery(vaultAddress, walletAddress, networkId, {
        enabled: isAppReady && isWalletConnected && !!vaultAddress,
    });

    useEffect(() => {
        if (userVaultDataQuery.isSuccess && userVaultDataQuery.data) {
            setLastValidUserVaultData(userVaultDataQuery.data);
        }
    }, [userVaultDataQuery.isSuccess, userVaultDataQuery.data]);

    const userVaultData: UserVaultData | undefined = useMemo(() => {
        if (userVaultDataQuery.isSuccess && userVaultDataQuery.data) {
            return userVaultDataQuery.data;
        }
        return lastValidUserVaultData;
    }, [userVaultDataQuery.isSuccess, userVaultDataQuery.data, lastValidUserVaultData]);

    const isAmountEntered = Number(amount) > 0;
    const insufficientBalance =
        (Number(paymentTokenBalance) < Number(amount) || Number(paymentTokenBalance) === 0) && isWalletConnected;
    const exceededVaultCap = vaultData && vaultData.availableAllocationNextRound < Number(amount);
    const isWithdrawalRequested = userVaultData && userVaultData.isWithdrawalRequested;
    const nothingToWithdraw = userVaultData && userVaultData.balanceCurrentRound === 0;
    const isMaximumAmountOfUsersReached =
        vaultData &&
        vaultData.usersCurrentlyInVault === vaultData.maxAllowedUsers &&
        userVaultData &&
        !userVaultData.hasDepositForCurrentRound &&
        !userVaultData.hasDepositForNextRound;
    const invalidAmount = vaultData && Number(vaultData.minDepositAmount) > Number(amount) && isAmountEntered;
    const vaultPaused = vaultData && vaultData.paused;
    const isVaultCapReached = vaultData && vaultData.allocationNextRoundPercentage >= 100;

    const isRequestWithdrawalButtonDisabled =
        !isWalletConnected ||
        isSubmitting ||
        nothingToWithdraw ||
        (userVaultData && userVaultData.hasDepositForNextRound) ||
        vaultPaused;

    const isDepositButtonDisabled =
        !isWalletConnected ||
        !isAmountEntered ||
        insufficientBalance ||
        isSubmitting ||
        isWithdrawalRequested ||
        exceededVaultCap ||
        isMaximumAmountOfUsersReached ||
        invalidAmount ||
        vaultPaused ||
        isVaultCapReached;

    const isDepositAmountInputDisabled =
        isSubmitting || isWithdrawalRequested || isMaximumAmountOfUsersReached || vaultPaused || isVaultCapReached;

    useEffect(() => {
        const { signer, collateral } = snxJSConnector;
        if (signer && collateral) {
            const collateralWithSigner = collateral.connect(signer);
            const getAllowance = async () => {
                try {
                    const parsedAmount = ethers.utils.parseEther(Number(amount).toString());
                    const allowance = await checkAllowance(
                        parsedAmount,
                        collateralWithSigner,
                        walletAddress,
                        vaultAddress
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
    }, [walletAddress, isWalletConnected, hasAllowance, amount, isAllowing, vaultAddress]);

    const handleAllowance = async (approveAmount: BigNumber) => {
        const { signer, collateral } = snxJSConnector;
        if (signer && collateral) {
            const id = toast.loading(t('options.market.toast-messsage.transaction-pending'));
            setIsAllowing(true);

            try {
                const collateralWithSigner = collateral.connect(signer);

                const tx = (await collateralWithSigner.approve(vaultAddress, approveAmount, {
                    gasLimit: getMaxGasLimitForNetwork(networkId),
                })) as ethers.ContractTransaction;
                setOpenApprovalModal(false);
                const txResult = await tx.wait();

                if (txResult && txResult.transactionHash) {
                    toast.update(
                        id,
                        getSuccessToastOptions(
                            t('options.market.toast-messsage.approve-success', { token: SYNTHS_MAP.sUSD })
                        )
                    );
                    setIsAllowing(false);
                }
            } catch (e) {
                console.log(e);
                toast.update(id, getErrorToastOptions(t('common.errors.unknown-error-try-again')));
                setIsAllowing(false);
            }
        }
    };

    const handleDeposit = async () => {
        const { signer } = snxJSConnector;
        if (signer) {
            const id = toast.loading(t('options.market.toast-messsage.transaction-pending'));
            setIsSubmitting(true);
            try {
                const sportVaultContractWithSigner = new ethers.Contract(vaultAddress, vaultContract.abi, signer);
                const parsedAmount = ethers.utils.parseEther(Number(amount).toString());

                const tx = await sportVaultContractWithSigner.deposit(parsedAmount, {
                    gasLimit: getMaxGasLimitForNetwork(networkId),
                });
                const txResult = await tx.wait();

                if (txResult && txResult.events) {
                    toast.update(id, getSuccessToastOptions(t('vault.button.deposit-confirmation-message')));
                    setAmount('');
                    setIsSubmitting(false);
                }
            } catch (e) {
                console.log(e);
                toast.update(id, getErrorToastOptions(t('common.errors.unknown-error-try-again')));
                setIsSubmitting(false);
            }
        }
    };

    const handleWithdrawalRequest = async () => {
        const { signer } = snxJSConnector;
        if (signer) {
            const id = toast.loading(t('options.market.toast-messsage.transaction-pending'));
            setIsSubmitting(true);
            try {
                const sportVaultContractWithSigner = new ethers.Contract(vaultAddress, vaultContract.abi, signer);

                const tx = await sportVaultContractWithSigner.withdrawalRequest({
                    gasLimit: getMaxGasLimitForNetwork(networkId),
                });
                const txResult = await tx.wait();

                if (txResult && txResult.events) {
                    toast.update(id, getSuccessToastOptions(t('vault.button.request-withdrawal-confirmation-message')));
                    setAmount('');
                    setIsSubmitting(false);
                }
            } catch (e) {
                console.log(e);
                toast.update(id, getErrorToastOptions(t('common.errors.unknown-error-try-again')));
                setIsSubmitting(false);
            }
        }
    };

    const closeRound = async () => {
        const { signer } = snxJSConnector;
        if (signer) {
            const id = toast.loading(t('options.market.toast-messsage.transaction-pending'));
            setIsSubmitting(true);
            try {
                const sportVaultContractWithSigner = new ethers.Contract(vaultAddress, vaultContract.abi, signer);

                const tx = await sportVaultContractWithSigner.closeRound({
                    gasLimit: getMaxGasLimitForNetwork(networkId),
                });
                const txResult = await tx.wait();

                if (txResult && txResult.events) {
                    toast.update(id, getSuccessToastOptions(t('vault.button.close-round-confirmation-message')));
                    setIsSubmitting(false);
                }
            } catch (e) {
                console.log(e);
                toast.update(id, getErrorToastOptions(t('common.errors.unknown-error-try-again')));
                setIsSubmitting(false);
            }
        }
    };

    const getDepositSubmitButton = () => {
        if (!isWalletConnected) {
            return (
                <SubmitButton onClick={() => onboardConnector.connectWallet()}>
                    {t('common.wallet.connect-your-wallet')}
                </SubmitButton>
            );
        }
        if (insufficientBalance) {
            return <SubmitButton disabled={true}>{t(`common.errors.insufficient-balance`)}</SubmitButton>;
        }
        if (!isAmountEntered) {
            return <SubmitButton disabled={true}>{t(`common.errors.enter-amount`)}</SubmitButton>;
        }
        if (!hasAllowance) {
            return (
                <SubmitButton disabled={isAllowing} onClick={() => setOpenApprovalModal(true)}>
                    {!isAllowing
                        ? t('common.enable-wallet-access.approve-label', { currencyKey: SYNTHS_MAP.sUSD })
                        : t('common.enable-wallet-access.approve-progress-label', {
                              currencyKey: SYNTHS_MAP.sUSD,
                          })}
                </SubmitButton>
            );
        }
        return (
            <SubmitButton disabled={isDepositButtonDisabled} onClick={handleDeposit}>
                {!isSubmitting ? t('vault.button.deposit-label') : t('vault.button.deposit-progress-label')}
            </SubmitButton>
        );
    };

    const getWithdrawSubmitButton = () => {
        if (!isWalletConnected) {
            return (
                <SubmitButton onClick={() => onboardConnector.connectWallet()}>
                    {t('common.wallet.connect-your-wallet')}
                </SubmitButton>
            );
        }
        return (
            <SubmitButton disabled={isRequestWithdrawalButtonDisabled} onClick={handleWithdrawalRequest}>
                {t('vault.button.request-withdrawal-label')}
            </SubmitButton>
        );
    };

    return (
        <>
            <OpRewardsBanner />
            <ElectionsBanner />
            <Wrapper>
                {/* <BackToLink link={buildHref(ROUTES.Options.Vaults)} text={t('vault.back-to-vaults')} /> */}
                {vaultData && (
                    <>
                        <RoundInfoWrapper>
                            {vaultData.paused ? (
                                <RoundInfoContainer>
                                    <RoundInfo>{t('vault.vault-paused-message')}</RoundInfo>
                                </RoundInfoContainer>
                            ) : vaultData.vaultStarted ? (
                                <>
                                    <RoundEndContainer>
                                        <RoundEndLabel>{t('vault.round-end-label')}:</RoundEndLabel>
                                        <RoundEnd>
                                            {vaultData.isRoundEnded ? (
                                                t('vault.round-ended-label')
                                            ) : (
                                                <TimeRemaining
                                                    end={vaultData.roundEndTime}
                                                    fontSize={20}
                                                    showFullCounter
                                                />
                                            )}{' '}
                                            {vaultData.canCloseCurrentRound && (
                                                <CloseRoundButton disabled={isSubmitting} onClick={closeRound}>
                                                    {t('vault.button.close-round-label')}
                                                </CloseRoundButton>
                                            )}
                                        </RoundEnd>
                                    </RoundEndContainer>
                                    <RoundAllocationWrapper>
                                        <RoundAllocationContainer>
                                            <RoundAllocationLabel>
                                                {t('vault.round-allocation-label')}:
                                            </RoundAllocationLabel>
                                            <RoundAllocation>
                                                {formatCurrencyWithSign(USD_SIGN, vaultData.allocationCurrentRound)}
                                            </RoundAllocation>
                                        </RoundAllocationContainer>
                                        <RoundAllocationContainer>
                                            <RoundAllocationLabel>
                                                {t('vault.spent-trading-label')}:
                                            </RoundAllocationLabel>
                                            <RoundAllocation>
                                                {formatCurrencyWithSign(USD_SIGN, vaultData.allocationSpentInARound)}
                                            </RoundAllocation>
                                        </RoundAllocationContainer>
                                        <RoundAllocationContainer>
                                            <RoundAllocationLabel>
                                                {t('vault.available-trading-label')}:
                                            </RoundAllocationLabel>
                                            <RoundAllocation>
                                                {formatCurrencyWithSign(
                                                    USD_SIGN,
                                                    vaultData.availableAllocationInARound
                                                )}
                                            </RoundAllocation>
                                        </RoundAllocationContainer>
                                    </RoundAllocationWrapper>
                                </>
                            ) : (
                                <RoundInfoContainer>
                                    <RoundInfo>{t('vault.vault-not-started-message')}</RoundInfo>
                                </RoundInfoContainer>
                            )}
                        </RoundInfoWrapper>
                    </>
                )}
                <Container>
                    <LeftContainer>
                        <Title>
                            <TitleVaultIcon className={`sidebar-icon icon--${vaultId}`} />
                            {t(`vault.${vaultId}.title`)}
                        </Title>
                        {!vaultData ? (
                            <LeftLoaderContainer>
                                <SimpleLoader />
                            </LeftLoaderContainer>
                        ) : (
                            <>
                                {' '}
                                <Info>
                                    <Trans
                                        i18nKey={`vault.info`}
                                        components={{
                                            p: <p />,
                                            vaultLink: <Link href={LINKS.Vaults} target="_blank" rel="noreferrer" />,
                                        }}
                                    />{' '}
                                </Info>
                                <Description>
                                    <Trans
                                        i18nKey={`vault.${vaultId}.description`}
                                        components={{
                                            p: <p />,
                                        }}
                                        values={{
                                            odds: formatPercentage(vaultData.priceLowerLimit, 0),
                                            discount: formatPercentage(Math.abs(vaultData.skewImpactLimit), 0),
                                        }}
                                    />
                                </Description>
                                <VariablesTitle>{t(`vault.variables-title`)}:</VariablesTitle>
                                <VariablesContainer>
                                    <Variables>
                                        <Trans
                                            i18nKey={`vault.variables-left`}
                                            components={{
                                                p: <p />,
                                                ul: <ul />,
                                                li: <li />,
                                            }}
                                            values={{
                                                utilizationRate: formatPercentage(vaultData.utilizationRate, 0),
                                                priceLowerLimit: formatCurrencyWithSign(
                                                    USD_SIGN,
                                                    vaultData.priceLowerLimit,
                                                    2
                                                ),
                                                priceUpperLimit: formatCurrencyWithSign(
                                                    USD_SIGN,
                                                    vaultData.priceUpperLimit,
                                                    2
                                                ),
                                                skewImpactLimit: formatCurrency(vaultData.skewImpactLimit),
                                                allocationLimitsPerMarketPerRound: formatPercentage(
                                                    vaultData.allocationLimitsPerMarketPerRound
                                                ),
                                            }}
                                        />
                                    </Variables>
                                    <Variables>
                                        <Trans
                                            i18nKey={`vault.variables-right`}
                                            components={{
                                                p: <p />,
                                                ul: <ul />,
                                                li: <li />,
                                            }}
                                            values={{
                                                maxAllowedDeposit: formatCurrencyWithSign(
                                                    USD_SIGN,
                                                    vaultData.maxAllowedDeposit,
                                                    0
                                                ),
                                                maxAllowedUsers: vaultData.maxAllowedUsers,
                                                minTradeAmount: vaultData.minTradeAmount,
                                                minDepositAmount: formatCurrencyWithSign(
                                                    USD_SIGN,
                                                    vaultData.minDepositAmount,
                                                    0
                                                ),
                                                roundLength: 7, // vaultData.roundLength,
                                            }}
                                        />
                                    </Variables>
                                </VariablesContainer>
                            </>
                        )}
                    </LeftContainer>
                    <RightContainer>
                        {!vaultData ? (
                            <RightLoaderContainer>
                                <SimpleLoader />
                            </RightLoaderContainer>
                        ) : (
                            <>
                                {userVaultData && (
                                    <ContentInfoContainer>
                                        {vaultData.vaultStarted && (
                                            <ContentInfo>
                                                <Trans
                                                    i18nKey="vault.your-round-allocation-label"
                                                    components={{
                                                        bold: <BoldContent />,
                                                    }}
                                                    values={{
                                                        amount: formatCurrencyWithSign(
                                                            USD_SIGN,
                                                            userVaultData.balanceCurrentRound
                                                        ),
                                                    }}
                                                />
                                            </ContentInfo>
                                        )}
                                        <ContentInfo>
                                            <Trans
                                                i18nKey="vault.your-next-round-allocation-label"
                                                components={{
                                                    bold: <BoldContent />,
                                                }}
                                                values={{
                                                    amount: formatCurrencyWithSign(
                                                        USD_SIGN,
                                                        userVaultData.balanceTotal
                                                    ),
                                                }}
                                            />
                                            {userVaultData.balanceCurrentRound > 0 && !isWithdrawalRequested && (
                                                <Tooltip
                                                    message={t('vault.estimated-amount-tooltip')}
                                                    type={'info'}
                                                    container={{ display: 'inline' }}
                                                    iconFontSize={16}
                                                    iconTop={-2}
                                                />
                                            )}
                                        </ContentInfo>
                                        {isWithdrawalRequested && (
                                            <WarningContentInfo>
                                                <Trans
                                                    i18nKey="vault.withdrawal-request-label"
                                                    components={{
                                                        bold: <BoldContent />,
                                                    }}
                                                    values={{
                                                        amount: formatCurrencyWithSign(
                                                            USD_SIGN,
                                                            userVaultData.balanceCurrentRound
                                                        ),
                                                    }}
                                                />
                                                <Tooltip
                                                    message={t('vault.estimated-amount-tooltip')}
                                                    type={'info'}
                                                    container={{ display: 'inline' }}
                                                    iconFontSize={16}
                                                    iconTop={-2}
                                                    iconColor="#ffcc00"
                                                />
                                            </WarningContentInfo>
                                        )}
                                    </ContentInfoContainer>
                                )}
                                <ToggleContainer>
                                    <Switch
                                        active={selectedTab === VaultTab.WITHDRAW}
                                        width={'66px'}
                                        height={'30px'}
                                        dotSize={'20px'}
                                        label={{
                                            firstLabel: t(`vault.tabs.${VaultTab.DEPOSIT}`),
                                            secondLabel: t(`vault.tabs.${VaultTab.WITHDRAW}`),
                                            fontSize: '20px',
                                        }}
                                        dotBackground={'var(--amm-switch-circle)'}
                                        handleClick={() => {
                                            setSelectedTab(
                                                selectedTab === VaultTab.DEPOSIT ? VaultTab.WITHDRAW : VaultTab.DEPOSIT
                                            );
                                        }}
                                        shadow={true}
                                    />
                                </ToggleContainer>
                                {selectedTab === VaultTab.DEPOSIT && (
                                    <>
                                        <ContentInfo>{t('vault.deposit-message')}</ContentInfo>
                                        {isWithdrawalRequested && (
                                            <WarningContentInfo>
                                                <Trans i18nKey="vault.deposit-withdrawal-warning" />
                                            </WarningContentInfo>
                                        )}
                                        {isVaultCapReached && (
                                            <WarningContentInfo>
                                                <Trans i18nKey="vault.deposit-vault-cap-reached-warning" />
                                            </WarningContentInfo>
                                        )}
                                        {isMaximumAmountOfUsersReached && (
                                            <WarningContentInfo>
                                                <Trans i18nKey="vault.deposit-max-amount-of-users-warning" />
                                            </WarningContentInfo>
                                        )}
                                        <InputContainer marginTop={20} style={{ width: '100%' }}>
                                            <NumericInput
                                                value={amount}
                                                disabled={isDepositAmountInputDisabled}
                                                onChange={(_, value) => setAmount(value)}
                                                className={
                                                    insufficientBalance || !!exceededVaultCap || !!invalidAmount
                                                        ? 'error'
                                                        : ''
                                                }
                                            />
                                            <InputLabel>{t('vault.deposit-amount-label')}</InputLabel>
                                            <CurrencyLabel className={isDepositAmountInputDisabled ? 'disabled' : ''}>
                                                {SYNTHS_MAP.sUSD}
                                            </CurrencyLabel>
                                            <FieldValidationMessage
                                                showValidation={
                                                    insufficientBalance || !!exceededVaultCap || !!invalidAmount
                                                }
                                                message={
                                                    t(
                                                        `${
                                                            insufficientBalance
                                                                ? 'common.errors.insufficient-balance'
                                                                : exceededVaultCap
                                                                ? 'vault.deposit-vault-cap-error'
                                                                : 'vault.deposit-min-amount-error'
                                                        }`,
                                                        {
                                                            amount: formatCurrencyWithSign(
                                                                USD_SIGN,
                                                                vaultData.minDepositAmount
                                                            ),
                                                        }
                                                    ) as string
                                                }
                                            />
                                        </InputContainer>
                                        {vaultData && (
                                            <>
                                                {!vaultData.isRoundEnded && (
                                                    <ContentInfo>
                                                        <Trans
                                                            i18nKey="vault.next-round-start-label"
                                                            components={{
                                                                counter: (
                                                                    <TimeRemaining
                                                                        end={vaultData.roundEndTime}
                                                                        fontSize={18}
                                                                        showFullCounter
                                                                    />
                                                                ),
                                                            }}
                                                        />
                                                    </ContentInfo>
                                                )}
                                                <UsersInVaultText>
                                                    <Trans
                                                        i18nKey="vault.users-in-vault-label"
                                                        values={{
                                                            number: vaultData.usersCurrentlyInVault,
                                                            max: vaultData.maxAllowedUsers,
                                                        }}
                                                    />
                                                </UsersInVaultText>
                                                <VaultFilledText>
                                                    <Trans
                                                        i18nKey="vault.vault-filled-label"
                                                        values={{
                                                            amount: formatCurrencyWithSign(
                                                                USD_SIGN,
                                                                vaultData.allocationNextRound
                                                            ),
                                                            max: formatCurrencyWithSign(
                                                                USD_SIGN,
                                                                vaultData.maxAllowedDeposit
                                                            ),
                                                        }}
                                                    />
                                                </VaultFilledText>
                                                <VaultFilledGraphicContainer>
                                                    <VaultFilledGraphicPercentage
                                                        width={vaultData.allocationNextRoundPercentage}
                                                    ></VaultFilledGraphicPercentage>
                                                </VaultFilledGraphicContainer>
                                            </>
                                        )}
                                        <ButtonContainer>{getDepositSubmitButton()}</ButtonContainer>
                                    </>
                                )}
                                {selectedTab === VaultTab.WITHDRAW && (
                                    <>
                                        {((vaultData && userVaultData && !isWithdrawalRequested) ||
                                            !isWalletConnected) && (
                                            <>
                                                {nothingToWithdraw || !isWalletConnected ? (
                                                    <>
                                                        <ContentInfo>
                                                            <Trans i18nKey="vault.nothing-to-withdraw-label" />
                                                        </ContentInfo>
                                                        {userVaultData && userVaultData.balanceNextRound > 0 && (
                                                            <ContentInfo>
                                                                <Trans i18nKey="vault.first-deposit-withdrawal-message" />
                                                            </ContentInfo>
                                                        )}
                                                    </>
                                                ) : (
                                                    <>
                                                        {userVaultData && (
                                                            <>
                                                                {userVaultData.hasDepositForNextRound ? (
                                                                    <WarningContentInfo>
                                                                        <Trans i18nKey="vault.withdrawal-deposit-warning" />
                                                                    </WarningContentInfo>
                                                                ) : (
                                                                    <>
                                                                        <ContentInfo>
                                                                            <Trans
                                                                                i18nKey="vault.available-to-withdraw-label"
                                                                                components={{
                                                                                    bold: <BoldContent />,
                                                                                }}
                                                                                values={{
                                                                                    amount: formatCurrencyWithSign(
                                                                                        USD_SIGN,
                                                                                        userVaultData.balanceCurrentRound
                                                                                    ),
                                                                                }}
                                                                            />
                                                                            <Tooltip
                                                                                message={t(
                                                                                    'vault.estimated-amount-tooltip'
                                                                                )}
                                                                                type={'info'}
                                                                                container={{ display: 'inline' }}
                                                                                iconFontSize={16}
                                                                                iconTop={-2}
                                                                            />
                                                                        </ContentInfo>
                                                                        <ContentInfo>
                                                                            <Trans i18nKey="vault.withdrawal-message" />
                                                                        </ContentInfo>
                                                                    </>
                                                                )}
                                                            </>
                                                        )}
                                                        {!vaultData.isRoundEnded && (
                                                            <ContentInfo>
                                                                <Trans
                                                                    i18nKey="vault.withdraw-round-end-label"
                                                                    components={{
                                                                        counter: (
                                                                            <TimeRemaining
                                                                                end={vaultData.roundEndTime}
                                                                                fontSize={18}
                                                                                showFullCounter
                                                                            />
                                                                        ),
                                                                    }}
                                                                />
                                                            </ContentInfo>
                                                        )}
                                                    </>
                                                )}
                                                <ButtonContainer>{getWithdrawSubmitButton()}</ButtonContainer>
                                            </>
                                        )}
                                        {vaultData && userVaultData && userVaultData.isWithdrawalRequested && (
                                            <>
                                                <ContentInfo>
                                                    <Trans
                                                        i18nKey="vault.withdrawal-requested-message"
                                                        components={{
                                                            bold: <BoldContent />,
                                                            tooltip: (
                                                                <Tooltip
                                                                    message={t('vault.estimated-amount-tooltip')}
                                                                    type={'info'}
                                                                    container={{ display: 'inline' }}
                                                                    iconFontSize={16}
                                                                    iconTop={-2}
                                                                />
                                                            ),
                                                        }}
                                                        values={{
                                                            amount: formatCurrencyWithSign(
                                                                USD_SIGN,
                                                                userVaultData.balanceCurrentRound
                                                            ),
                                                        }}
                                                    />
                                                </ContentInfo>
                                                {!vaultData.isRoundEnded && (
                                                    <ContentInfo>
                                                        <Trans
                                                            i18nKey="vault.withdraw-round-end-label"
                                                            components={{
                                                                counter: (
                                                                    <TimeRemaining
                                                                        end={vaultData.roundEndTime}
                                                                        fontSize={18}
                                                                        showFullCounter
                                                                    />
                                                                ),
                                                            }}
                                                        />
                                                    </ContentInfo>
                                                )}
                                            </>
                                        )}
                                    </>
                                )}
                            </>
                        )}
                    </RightContainer>
                </Container>
                {vaultData && <PnL vaultAddress={vaultAddress} lifetimePnl={vaultData.lifetimePnl} />}
                {vaultData && <Transactions vaultAddress={vaultAddress} currentRound={vaultData.round} />}
                {openApprovalModal && (
                    <ApprovalModal
                        defaultAmount={amount}
                        tokenSymbol={SYNTHS_MAP.sUSD}
                        isAllowing={isAllowing}
                        onSubmit={handleAllowance}
                        onClose={() => setOpenApprovalModal(false)}
                    />
                )}
            </Wrapper>
            <Footer />
        </>
    );
};

export default Vault;
