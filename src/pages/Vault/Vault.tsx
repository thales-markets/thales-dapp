import { useConnectModal } from '@rainbow-me/rainbowkit';
import ApprovalModal from 'components/ApprovalModal';
import Button from 'components/Button/Button';
import SimpleLoader from 'components/SimpleLoader';
import Switch from 'components/SwitchInput/SwitchInput';
import TimeRemaining from 'components/TimeRemaining';
import {
    getDefaultToastContent,
    getErrorToastOptions,
    getLoadingToastOptions,
    getSuccessToastOptions,
} from 'components/ToastMessage/ToastMessage';
import Tooltip from 'components/Tooltip';
import NumericInput from 'components/fields/NumericInput';
import { PLAUSIBLE, PLAUSIBLE_KEYS } from 'constants/analytics';
import { USD_SIGN } from 'constants/currency';
import { LINKS } from 'constants/links';
import { VAULT_MAP } from 'constants/vault';
import { VaultTab } from 'enums/vault';
import { BigNumber, ethers } from 'ethers';
import useUserVaultDataQuery from 'queries/vault/useUserVaultDataQuery';
import useVaultDataQuery from 'queries/vault/useVaultDataQuery';
import useStableBalanceQuery from 'queries/walletBalances/useStableBalanceQuery';
import React, { useEffect, useMemo, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getIsAppReady } from 'redux/modules/app';
import { getIsWalletConnected, getNetworkId, getWalletAddress } from 'redux/modules/wallet';
import { useTheme } from 'styled-components';
import { formatCurrency, formatCurrencyWithSign, formatPercentage, getDefaultDecimalsForNetwork } from 'thales-utils';
import { RootState, ThemeInterface } from 'types/ui';
import { UserVaultData, VaultData } from 'types/vault';
import { getCurrencyKeyStableBalance } from 'utils/balances';
import vaultContract from 'utils/contracts/ammVaultContract';
import { getDefaultCollateral } from 'utils/currency';
import { checkAllowance } from 'utils/network';
import { refetchVaultData } from 'utils/queryConnector';
import { navigateTo } from 'utils/routes';
import snxJSConnector from 'utils/snxJSConnector';
import SPAAnchor from '../../components/SPAAnchor/SPAAnchor';
import ROUTES from '../../constants/routes';
import { buildHref } from '../../utils/routes';
import PnL from './PnL';
import Transactions from './Transactions';
import {
    BackIcon,
    BackLinkContainer,
    BoldContent,
    ButtonContainer,
    Container,
    ContentInfo,
    ContentInfoContainer,
    DeprecatedContainer,
    Description,
    Header,
    HeaderVaultIcon,
    Info,
    LeftContainer,
    LeftLoaderContainer,
    Link,
    RightContainer,
    RightLoaderContainer,
    RoundAllocation,
    RoundAllocationContainer,
    RoundAllocationLabel,
    RoundAllocationWrapper,
    RoundEnd,
    RoundEndContainer,
    RoundEndLabel,
    RoundInfo,
    RoundInfoContainer,
    RoundInfoWrapper,
    Title,
    TitleVaultIcon,
    ToggleContainer,
    UsersInVaultText,
    Variables,
    VariablesContainer,
    VariablesTitle,
    VaultFilledGraphicContainer,
    VaultFilledGraphicPercentage,
    VaultFilledText,
    WarningContentInfo,
    Wrapper,
} from './styled-components';

const IS_DEPRECATED = true;

type VaultProps = RouteComponentProps<{
    vaultId: string;
}>;

const Vault: React.FC<VaultProps> = (props) => {
    const { t } = useTranslation();
    const theme: ThemeInterface = useTheme();
    const { openConnectModal } = useConnectModal();
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
    const vaultId = params && params.vaultId && !!VAULT_MAP[params.vaultId] ? params.vaultId : '';
    const vaultAddress = !!vaultId ? VAULT_MAP[vaultId].addresses[networkId] : undefined;

    useEffect(() => {
        if (!vaultAddress) {
            navigateTo(ROUTES.Options.Vaults);
        }
    }, [vaultAddress]);

    const paymentTokenBalanceQuery = useStableBalanceQuery(walletAddress, networkId, true, {
        enabled: isAppReady && isWalletConnected,
    });

    useEffect(() => {
        if (paymentTokenBalanceQuery.isSuccess && paymentTokenBalanceQuery.data !== undefined) {
            setPaymentTokenBalance(
                getCurrencyKeyStableBalance(paymentTokenBalanceQuery.data, getDefaultCollateral(networkId, true))
            );
        }
    }, [paymentTokenBalanceQuery.isSuccess, paymentTokenBalanceQuery.data, networkId]);

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
                    const parsedAmount = ethers.utils.parseUnits(
                        Number(amount).toString(),
                        getDefaultDecimalsForNetwork(networkId, true)
                    );
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
    }, [walletAddress, isWalletConnected, hasAllowance, amount, isAllowing, vaultAddress, networkId]);

    const handleAllowance = async (approveAmount: BigNumber) => {
        const { signer, collateral } = snxJSConnector;
        if (signer && collateral) {
            const id = toast.loading(
                getDefaultToastContent(t('markets.market.toast-messsage.transaction-pending')),
                getLoadingToastOptions()
            );
            setIsAllowing(true);

            try {
                const collateralWithSigner = collateral.connect(signer);

                const tx = (await collateralWithSigner.approve(
                    vaultAddress,
                    approveAmount
                )) as ethers.ContractTransaction;
                setOpenApprovalModal(false);
                const txResult = await tx.wait();

                if (txResult && txResult.transactionHash) {
                    toast.update(
                        id,
                        getSuccessToastOptions(
                            t('markets.market.toast-messsage.approve-success', {
                                token: getDefaultCollateral(networkId, true),
                            }),
                            id
                        )
                    );
                    setIsAllowing(false);
                }
            } catch (e) {
                console.log(e);
                toast.update(id, getErrorToastOptions(t('common.errors.unknown-error-try-again'), id));
                setIsAllowing(false);
            }
        }
    };

    const handleDeposit = async () => {
        const { signer } = snxJSConnector;
        if (signer) {
            const id = toast.loading(
                getDefaultToastContent(t('markets.market.toast-messsage.transaction-pending')),
                getLoadingToastOptions()
            );
            setIsSubmitting(true);
            try {
                const ammVaultContractWithSigner = new ethers.Contract(vaultAddress, vaultContract.abi, signer);
                const parsedAmount = ethers.utils.parseUnits(
                    Number(amount).toString(),
                    getDefaultDecimalsForNetwork(networkId, true)
                );

                const tx = await ammVaultContractWithSigner.deposit(parsedAmount);
                const txResult = await tx.wait();

                if (txResult && txResult.events) {
                    PLAUSIBLE.trackEvent(PLAUSIBLE_KEYS.depositVaults, {
                        props: {
                            networkId,
                        },
                    });
                    toast.update(id, getSuccessToastOptions(t('vault.button.deposit-confirmation-message'), id));
                    setAmount('');
                    setIsSubmitting(false);
                    refetchVaultData(vaultAddress, walletAddress, networkId, vaultData?.round || 0);
                }
            } catch (e) {
                console.log(e);
                toast.update(id, getErrorToastOptions(t('common.errors.unknown-error-try-again'), id));
                setIsSubmitting(false);
            }
        }
    };

    const handleWithdrawalRequest = async () => {
        const { signer } = snxJSConnector;
        if (signer) {
            const id = toast.loading(
                getDefaultToastContent(t('markets.market.toast-messsage.transaction-pending')),
                getLoadingToastOptions()
            );
            setIsSubmitting(true);
            try {
                const ammVaultContractWithSigner = new ethers.Contract(vaultAddress, vaultContract.abi, signer);

                const tx = await ammVaultContractWithSigner.withdrawalRequest();
                const txResult = await tx.wait();

                if (txResult && txResult.events) {
                    toast.update(
                        id,
                        getSuccessToastOptions(t('vault.button.request-withdrawal-confirmation-message'), id)
                    );
                    setAmount('');
                    setIsSubmitting(false);
                    refetchVaultData(vaultAddress, walletAddress, networkId, vaultData?.round || 0);
                }
            } catch (e) {
                console.log(e);
                toast.update(id, getErrorToastOptions(t('common.errors.unknown-error-try-again'), id));
                setIsSubmitting(false);
            }
        }
    };

    const getDepositSubmitButton = () => {
        if (!isWalletConnected) {
            return <Button onClick={openConnectModal}>{t('common.wallet.connect-your-wallet')}</Button>;
        }
        if (insufficientBalance) {
            return <Button disabled={true}>{t(`common.errors.insufficient-balance`)}</Button>;
        }
        if (!isAmountEntered) {
            return <Button disabled={true}>{t(`common.errors.enter-amount`)}</Button>;
        }
        if (!hasAllowance) {
            return (
                <Button disabled={isAllowing} onClick={() => setOpenApprovalModal(true)}>
                    {!isAllowing
                        ? t('common.enable-wallet-access.approve-label', {
                              currencyKey: getDefaultCollateral(networkId, true),
                          })
                        : t('common.enable-wallet-access.approve-progress-label', {
                              currencyKey: getDefaultCollateral(networkId, true),
                          })}
                </Button>
            );
        }
        return (
            <Button disabled={isDepositButtonDisabled} onClick={handleDeposit}>
                {!isSubmitting ? t('vault.button.deposit-label') : t('vault.button.deposit-progress-label')}
            </Button>
        );
    };

    const getWithdrawSubmitButton = () => {
        if (!isWalletConnected) {
            return <Button onClick={openConnectModal}>{t('common.wallet.connect-your-wallet')}</Button>;
        }
        return (
            <Button disabled={isRequestWithdrawalButtonDisabled} onClick={handleWithdrawalRequest}>
                {t('vault.button.request-withdrawal-label')}
            </Button>
        );
    };

    return (
        <Wrapper>
            <Header>
                <SPAAnchor href={buildHref(ROUTES.Options.Vaults)}>
                    <BackLinkContainer>
                        <BackIcon className={`icon icon--left`} />
                        {t('vaults.title')}
                    </BackLinkContainer>
                </SPAAnchor>
                &nbsp;/ {t(`vault.${vaultId}.title`)}
                <HeaderVaultIcon className={`sidebar-icon icon--${vaultId}`} />
            </Header>
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
                                            <TimeRemaining end={vaultData.roundEndTime} fontSize={20} showFullCounter />
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
                                        <RoundAllocationLabel>{t('vault.spent-trading-label')}:</RoundAllocationLabel>
                                        <RoundAllocation>
                                            {formatCurrencyWithSign(USD_SIGN, vaultData.allocationSpentInARound)}
                                        </RoundAllocation>
                                    </RoundAllocationContainer>
                                    <RoundAllocationContainer>
                                        <RoundAllocationLabel>
                                            {t('vault.available-trading-label')}:
                                        </RoundAllocationLabel>
                                        <RoundAllocation>
                                            {formatCurrencyWithSign(USD_SIGN, vaultData.availableAllocationInARound)}
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
            <DeprecatedContainer>{t(`liquidity-pool.deprecated-info`)}</DeprecatedContainer>
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
                                                amount: formatCurrencyWithSign(USD_SIGN, userVaultData.balanceTotal),
                                            }}
                                        />
                                        {userVaultData.balanceCurrentRound > 0 && !isWithdrawalRequested && (
                                            <Tooltip
                                                overlay={t(`vault.estimated-amount-tooltip`)}
                                                iconFontSize={16}
                                                marginLeft={2}
                                                top={-2}
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
                                                overlay={t(`vault.estimated-amount-tooltip`)}
                                                iconFontSize={16}
                                                marginLeft={2}
                                                top={-2}
                                            />
                                        </WarningContentInfo>
                                    )}
                                </ContentInfoContainer>
                            )}
                            {!IS_DEPRECATED && (
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
                                        dotBackground={theme.textColor.primary}
                                        handleClick={() => {
                                            setSelectedTab(
                                                selectedTab === VaultTab.DEPOSIT ? VaultTab.WITHDRAW : VaultTab.DEPOSIT
                                            );
                                        }}
                                    />
                                </ToggleContainer>
                            )}
                            {selectedTab === VaultTab.DEPOSIT && !IS_DEPRECATED && (
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
                                    <NumericInput
                                        value={amount}
                                        disabled={isDepositAmountInputDisabled}
                                        onChange={(_, value) => setAmount(value)}
                                        currencyLabel={getDefaultCollateral(networkId, true)}
                                        placeholder={t('common.enter-amount')}
                                        showValidation={insufficientBalance || !!exceededVaultCap || !!invalidAmount}
                                        validationMessage={
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
                            {(selectedTab === VaultTab.WITHDRAW || IS_DEPRECATED) && (
                                <>
                                    {((vaultData && userVaultData && !isWithdrawalRequested) || !isWalletConnected) && (
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
                                                                            overlay={t(
                                                                                `vault.estimated-amount-tooltip`
                                                                            )}
                                                                            iconFontSize={16}
                                                                            marginLeft={2}
                                                                            top={-2}
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
                                                                overlay={t(`vault.estimated-amount-tooltip`)}
                                                                iconFontSize={16}
                                                                marginLeft={2}
                                                                top={-2}
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
                    tokenSymbol={getDefaultCollateral(networkId, true)}
                    isAllowing={isAllowing}
                    onSubmit={handleAllowance}
                    onClose={() => setOpenApprovalModal(false)}
                />
            )}
        </Wrapper>
    );
};

export default Vault;
