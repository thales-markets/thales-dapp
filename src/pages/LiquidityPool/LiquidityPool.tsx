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
import RadioButton from 'components/fields/RadioButton';
import { PLAUSIBLE, PLAUSIBLE_KEYS } from 'constants/analytics';
import { USD_SIGN } from 'constants/currency';
import { LINKS } from 'constants/links';
import { LiquidityPoolCollateral, LiquidityPoolPnlType, LiquidityPoolTab } from 'enums/liquidityPool';
import { BigNumber, Contract, ethers } from 'ethers';
import useLiquidityPoolDataQuery from 'queries/liquidityPool/useLiquidityPoolDataQuery';
import useLiquidityPoolUserDataQuery from 'queries/liquidityPool/useLiquidityPoolUserDataQuery';
import queryString from 'query-string';
import React, { useEffect, useMemo, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getIsAppReady } from 'redux/modules/app';
import { getIsWalletConnected, getNetworkId, getWalletAddress } from 'redux/modules/wallet';
import { useTheme } from 'styled-components';
import { FlexDivRow } from 'styles/common';
import { coinParser, formatCurrencyWithSign, formatPercentage } from 'thales-utils';
import { LiquidityPoolData, UserLiquidityPoolData } from 'types/liquidityPool';
import { RootState, ThemeInterface } from 'types/ui';
import liquidityPoolContract from 'utils/contracts/liquidityPoolContract';
import { checkAllowance } from 'utils/network';
import { refetchLiquidityPoolData } from 'utils/queryConnector';
import snxJSConnector from 'utils/snxJSConnector';
import { delay } from 'utils/timer';
import SPAAnchor from '../../components/SPAAnchor';
import ROUTES from '../../constants/routes';
import { Network } from '../../enums/network';
import useMultipleCollateralBalanceQuery from '../../queries/walletBalances/useMultipleCollateralBalanceQuery';
import { getDefaultLpCollateral, getLiquidityPools, getLpAddress, getLpCollateral } from '../../utils/liquidityPool';
import { buildHref } from '../../utils/routes';
import PnL from './PnL';
import Transactions from './Transactions';
import {
    BoldContent,
    ButtonContainer,
    Container,
    ContentContainer,
    ContentInfo,
    ContentInfoContainer,
    CopyContainer,
    DeprecatedContainer,
    Description,
    LiquidityPoolFilledGraphicContainer,
    LiquidityPoolFilledGraphicPercentage,
    LiquidityPoolFilledText,
    LiquidityPoolInfo,
    LiquidityPoolInfoContainer,
    LiquidityPoolInfoGraphic,
    LiquidityPoolInfoLabel,
    LiquidityPoolInfoTitle,
    LoaderContainer,
    MainContainer,
    NavigationContainer,
    NavigationItem,
    RadioButtonContainer,
    RoundEnd,
    RoundEndContainer,
    RoundEndLabel,
    RoundInfo,
    RoundInfoContainer,
    SliderContainer,
    SliderRange,
    StyledSlider,
    TipLink,
    Title,
    ToggleContainer,
    WarningContentInfo,
    Wrapper,
    defaultButtonProps,
} from './styled-components';

const LiquidityPool: React.FC = () => {
    const { t } = useTranslation();
    const theme: ThemeInterface = useTheme();
    const location = useLocation();
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
    const [selectedTab, setSelectedTab] = useState<LiquidityPoolTab>(LiquidityPoolTab.DEPOSIT);
    const [paymentTokenBalance, setPaymentTokenBalance] = useState<number | string>('');
    const [lastValidLiquidityPoolData, setLastValidLiquidityPoolData] = useState<LiquidityPoolData | undefined>(
        undefined
    );
    const [lastValidUserLiquidityPoolData, setLastValidUserLiquidityPoolData] = useState<
        UserLiquidityPoolData | undefined
    >(undefined);
    const [withdrawAll, setWithdrawAll] = useState<boolean>(true);
    const [withdrawalPercentage, setWithdrawalPercentage] = useState<number | string>(10);
    const [isWithdrawalPercentageValid, setIsWithdrawalPercentageValid] = useState<boolean>(true);
    const [withdrawalAmount, setWithdrawalAmount] = useState<number>(0);

    const paramCollateral: LiquidityPoolCollateral =
        networkId === Network.OptimismMainnet
            ? queryString.parse(location.search).collateral || getDefaultLpCollateral(networkId)
            : getDefaultLpCollateral(networkId);
    const isSUSD = paramCollateral === LiquidityPoolCollateral.sUSD;

    const collateral = getLpCollateral(networkId, paramCollateral);

    const liquidityPoolAddress = getLpAddress(networkId, paramCollateral);
    const liquidityPools = getLiquidityPools(networkId);

    const multipleCollateralBalanceQuery = useMultipleCollateralBalanceQuery(walletAddress, networkId, {
        enabled: isAppReady && isWalletConnected,
    });

    useEffect(() => {
        if (multipleCollateralBalanceQuery.isSuccess && multipleCollateralBalanceQuery.data !== undefined) {
            setPaymentTokenBalance(Number(multipleCollateralBalanceQuery.data[collateral]));
        }
    }, [multipleCollateralBalanceQuery.isSuccess, multipleCollateralBalanceQuery.data, collateral]);

    const liquidityPoolDataQuery = useLiquidityPoolDataQuery(liquidityPoolAddress, collateral, networkId, {
        enabled: isAppReady && liquidityPoolAddress !== undefined,
    });

    useEffect(() => {
        if (liquidityPoolDataQuery.isSuccess && liquidityPoolDataQuery.data) {
            setLastValidLiquidityPoolData(liquidityPoolDataQuery.data);
        }
    }, [liquidityPoolDataQuery.isSuccess, liquidityPoolDataQuery.data]);

    const liquidityPoolData: LiquidityPoolData | undefined = useMemo(() => {
        if (liquidityPoolDataQuery.isSuccess && liquidityPoolDataQuery.data) {
            return liquidityPoolDataQuery.data;
        }
        return lastValidLiquidityPoolData;
    }, [liquidityPoolDataQuery.isSuccess, liquidityPoolDataQuery.data, lastValidLiquidityPoolData]);

    const userLiquidityPoolDataQuery = useLiquidityPoolUserDataQuery(
        liquidityPoolAddress,
        collateral,
        walletAddress,
        networkId,
        {
            enabled: isAppReady && isWalletConnected && liquidityPoolAddress !== undefined,
        }
    );

    useEffect(() => {
        if (userLiquidityPoolDataQuery.isSuccess && userLiquidityPoolDataQuery.data) {
            setLastValidUserLiquidityPoolData(userLiquidityPoolDataQuery.data);
        }
    }, [userLiquidityPoolDataQuery.isSuccess, userLiquidityPoolDataQuery.data]);

    const userLiquidityPoolData: UserLiquidityPoolData | undefined = useMemo(() => {
        if (userLiquidityPoolDataQuery.isSuccess && userLiquidityPoolDataQuery.data) {
            return userLiquidityPoolDataQuery.data;
        }
        return lastValidUserLiquidityPoolData;
    }, [userLiquidityPoolDataQuery.isSuccess, userLiquidityPoolDataQuery.data, lastValidUserLiquidityPoolData]);

    const isAmountEntered = Number(amount) > 0;
    const invalidAmount =
        liquidityPoolData &&
        Number(liquidityPoolData.minDepositAmount) > Number(amount) &&
        userLiquidityPoolData &&
        !userLiquidityPoolData.hasDepositForCurrentRound &&
        !userLiquidityPoolData.hasDepositForNextRound &&
        isAmountEntered;

    const insufficientBalance =
        (Number(paymentTokenBalance) < Number(amount) || Number(paymentTokenBalance) === 0) && isWalletConnected;

    const liquidityPoolPaused = liquidityPoolData && liquidityPoolData.paused;

    const exceededLiquidityPoolCap =
        liquidityPoolData && liquidityPoolData.availableAllocationNextRound < Number(amount);
    const isMaximumAmountOfUsersReached =
        liquidityPoolData &&
        liquidityPoolData.usersCurrentlyInLiquidityPool === liquidityPoolData.maxAllowedUsers &&
        userLiquidityPoolData &&
        !userLiquidityPoolData.hasDepositForCurrentRound &&
        !userLiquidityPoolData.hasDepositForNextRound;
    const isLiquidityPoolCapReached = liquidityPoolData && liquidityPoolData.allocationNextRoundPercentage >= 100;

    const isWithdrawalRequested = userLiquidityPoolData && userLiquidityPoolData.isWithdrawalRequested;
    const nothingToWithdraw = userLiquidityPoolData && userLiquidityPoolData.balanceCurrentRound === 0;

    const isRequestWithdrawalButtonDisabled =
        !isWalletConnected ||
        isSubmitting ||
        nothingToWithdraw ||
        (userLiquidityPoolData && userLiquidityPoolData.hasDepositForNextRound) ||
        liquidityPoolPaused;

    const isPartialWithdrawalDisabled = isRequestWithdrawalButtonDisabled || withdrawAll;

    const isDepositButtonDisabled =
        !isWalletConnected ||
        !isAmountEntered ||
        insufficientBalance ||
        isSubmitting ||
        isWithdrawalRequested ||
        exceededLiquidityPoolCap ||
        isMaximumAmountOfUsersReached ||
        invalidAmount ||
        liquidityPoolPaused ||
        isLiquidityPoolCapReached;

    const isDepositAmountInputDisabled =
        isSubmitting ||
        isWithdrawalRequested ||
        isMaximumAmountOfUsersReached ||
        liquidityPoolPaused ||
        isLiquidityPoolCapReached;

    useEffect(() => {
        const { signer, multipleCollateral } = snxJSConnector;

        if (signer && multipleCollateral) {
            const collateralContractWithSigner = multipleCollateral[collateral]?.connect(signer);

            const getAllowance = async () => {
                try {
                    const parsedAmount = coinParser(Number(amount).toString(), networkId, collateral);
                    const allowance = await checkAllowance(
                        parsedAmount,
                        collateralContractWithSigner,
                        walletAddress,
                        liquidityPoolAddress
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
    }, [
        walletAddress,
        isWalletConnected,
        hasAllowance,
        amount,
        isAllowing,
        networkId,
        collateral,
        liquidityPoolAddress,
    ]);

    const handleAllowance = async (approveAmount: BigNumber) => {
        const { signer, multipleCollateral } = snxJSConnector;
        if (signer && multipleCollateral) {
            const id = toast.loading(
                getDefaultToastContent(t('markets.market.toast-messsage.transaction-pending')),
                getLoadingToastOptions()
            );
            setIsAllowing(true);

            try {
                const collateralContractWithSigner = multipleCollateral[collateral]?.connect(signer);

                const tx = (await collateralContractWithSigner?.approve(
                    liquidityPoolAddress,
                    approveAmount
                )) as ethers.ContractTransaction;
                setOpenApprovalModal(false);
                const txResult = await tx.wait();

                if (txResult && txResult.transactionHash) {
                    toast.update(
                        id,
                        getSuccessToastOptions(
                            t('markets.market.toast-messsage.approve-success', { token: collateral }),
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
                const liquidityPoolContractWithSigner = new Contract(
                    liquidityPoolAddress,
                    liquidityPoolContract.abi,
                    signer
                );
                const parsedAmount = coinParser(Number(amount).toString(), networkId, collateral);

                const tx = await liquidityPoolContractWithSigner.deposit(parsedAmount);
                const txResult = await tx.wait();

                if (txResult && txResult.events) {
                    PLAUSIBLE.trackEvent(PLAUSIBLE_KEYS.depositLp, {
                        props: {
                            networkId,
                        },
                    });
                    toast.update(
                        id,
                        getSuccessToastOptions(t('liquidity-pool.button.deposit-confirmation-message'), id)
                    );
                    setAmount('');
                    setIsSubmitting(false);
                    refetchLiquidityPoolData(
                        walletAddress,
                        networkId,
                        liquidityPoolData?.round || 0,
                        liquidityPoolAddress
                    );
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
                const liquidityPoolContractWithSigner = new Contract(
                    liquidityPoolAddress,
                    liquidityPoolContract.abi,
                    signer
                );
                const parsedPercentage = ethers.utils.parseEther((Number(withdrawalPercentage) / 100).toString());

                const tx = withdrawAll
                    ? await liquidityPoolContractWithSigner.withdrawalRequest()
                    : await liquidityPoolContractWithSigner.partialWithdrawalRequest(parsedPercentage);
                const txResult = await tx.wait();

                if (txResult && txResult.events) {
                    toast.update(
                        id,
                        getSuccessToastOptions(t('liquidity-pool.button.request-withdrawal-confirmation-message'), id)
                    );
                    setAmount('');
                    setIsSubmitting(false);
                    refetchLiquidityPoolData(
                        walletAddress,
                        networkId,
                        liquidityPoolData?.round || 0,
                        liquidityPoolAddress
                    );
                }
            } catch (e) {
                console.log(e);
                toast.update(id, getErrorToastOptions(t('common.errors.unknown-error-try-again'), id));
                setIsSubmitting(false);
            }
        }
    };

    const closeRound = async () => {
        const id = toast.loading(getDefaultToastContent(t('liquidity-pool.closing-round')), getLoadingToastOptions());
        setIsSubmitting(true);
        try {
            const { signer } = snxJSConnector;

            if (signer) {
                const lpContractWithSigner = new Contract(liquidityPoolAddress, liquidityPoolContract.abi, signer);

                const canCloseCurrentRound = await lpContractWithSigner?.canCloseCurrentRound();
                const roundClosingPrepared = await lpContractWithSigner?.roundClosingPrepared();

                let getUsersCountInCurrentRound = await lpContractWithSigner?.getUsersCountInCurrentRound();
                let usersProcessedInRound = await lpContractWithSigner?.usersProcessedInRound();
                if (canCloseCurrentRound) {
                    try {
                        if (!roundClosingPrepared) {
                            const tx = await lpContractWithSigner.prepareRoundClosing({
                                type: 2,
                            });
                            await tx.wait().then(() => {
                                console.log('prepareRoundClosing closed');
                            });
                            await delay(1000 * 2);
                        }

                        while (usersProcessedInRound < getUsersCountInCurrentRound) {
                            const tx = await lpContractWithSigner.processRoundClosingBatch(100, {
                                type: 2,
                            });
                            await tx.wait().then(() => {
                                console.log('processRoundClosingBatch for batch done');
                            });
                            await delay(1000 * 2);
                            getUsersCountInCurrentRound = await lpContractWithSigner.getUsersCountInCurrentRound();
                            usersProcessedInRound = await lpContractWithSigner.usersProcessedInRound();
                        }

                        const tx = await lpContractWithSigner.closeRound({
                            type: 2,
                        });
                        await tx.wait().then(() => {
                            console.log('Round closed');
                        });

                        toast.update(id, getSuccessToastOptions(t('liquidity-pool.round-successfully-closed'), id));
                        setIsSubmitting(false);
                    } catch (e) {
                        toast.update(id, getErrorToastOptions(t('common.errors.unknown-error-try-again'), id));
                        setIsSubmitting(false);
                        console.log(e);
                    }
                }
            }
        } catch (e) {
            console.log('E ', e);
            toast.update(id, getErrorToastOptions(t('common.errors.unknown-error-try-again'), id));
            setIsSubmitting(false);
        }
    };

    const getDepositSubmitButton = () => {
        if (!isWalletConnected) {
            return (
                <Button onClick={openConnectModal} {...defaultButtonProps}>
                    {t('common.wallet.connect-your-wallet')}
                </Button>
            );
        }
        if (insufficientBalance) {
            return (
                <Button disabled={true} {...defaultButtonProps}>
                    {t(`common.errors.insufficient-balance`)}
                </Button>
            );
        }
        if (!isAmountEntered) {
            return (
                <Button disabled={true} {...defaultButtonProps}>
                    {t(`common.errors.enter-amount`)}
                </Button>
            );
        }
        if (!hasAllowance) {
            return (
                <Button disabled={isAllowing} onClick={() => setOpenApprovalModal(true)} {...defaultButtonProps}>
                    {!isAllowing
                        ? t('common.enable-wallet-access.approve-label', { currencyKey: collateral })
                        : t('common.enable-wallet-access.approve-progress-label', {
                              currencyKey: collateral,
                          })}
                </Button>
            );
        }
        return (
            <Button disabled={isDepositButtonDisabled} onClick={handleDeposit} {...defaultButtonProps}>
                {!isSubmitting
                    ? t('liquidity-pool.button.deposit-label')
                    : t('liquidity-pool.button.deposit-progress-label')}
            </Button>
        );
    };

    const getWithdrawSubmitButton = () => {
        if (!isWalletConnected) {
            return (
                <Button onClick={openConnectModal} {...defaultButtonProps}>
                    {t('common.wallet.connect-your-wallet')}
                </Button>
            );
        }
        return (
            <Button
                disabled={isRequestWithdrawalButtonDisabled || !isWithdrawalPercentageValid}
                onClick={handleWithdrawalRequest}
                {...defaultButtonProps}
            >
                {t('liquidity-pool.button.request-withdrawal-label')}
            </Button>
        );
    };

    const infoGraphicPercentages = getInfoGraphicPercentages(
        userLiquidityPoolData ? userLiquidityPoolData.balanceCurrentRound : 0,
        userLiquidityPoolData ? userLiquidityPoolData.balanceTotal : 0
    );

    useEffect(
        () =>
            setIsWithdrawalPercentageValid(
                (Number(withdrawalPercentage) <= 90 && Number(withdrawalPercentage) >= 10) || withdrawAll
            ),
        [withdrawalPercentage, withdrawAll]
    );

    useEffect(() => {
        if (userLiquidityPoolData) {
            setWithdrawalAmount(
                withdrawAll
                    ? userLiquidityPoolData.balanceCurrentRound
                    : (userLiquidityPoolData.balanceCurrentRound * Number(withdrawalPercentage)) / 100
            );
        }
    }, [withdrawalPercentage, withdrawAll, userLiquidityPoolData]);

    return (
        <Wrapper>
            <Title>{t('liquidity-pool.title')}</Title>
            {networkId === Network.OptimismMainnet && (
                <NavigationContainer>
                    {liquidityPools.map((item: any) => {
                        const lpCollateral = item.collateral.toLowerCase() as LiquidityPoolCollateral;
                        return (
                            <SPAAnchor
                                key={item.name}
                                href={`${buildHref(ROUTES.Options.LiquidityPool)}?collateral=${lpCollateral}`}
                            >
                                <NavigationItem className={`${lpCollateral === paramCollateral ? 'selected' : ''}`}>
                                    {`${item.name}${
                                        lpCollateral === LiquidityPoolCollateral.sUSD ? ' (DEPRECATED)' : ''
                                    }`}
                                </NavigationItem>
                            </SPAAnchor>
                        );
                    })}
                </NavigationContainer>
            )}
            {isSUSD && <DeprecatedContainer>{t(`liquidity-pool.deprecated-info`)}</DeprecatedContainer>}
            {liquidityPoolData && (
                <Container>
                    <ContentContainer>
                        {liquidityPoolPaused ? (
                            <RoundInfoContainer>
                                <RoundInfo>{t('liquidity-pool.liquidity-pool-paused-message')}</RoundInfo>
                            </RoundInfoContainer>
                        ) : liquidityPoolData.liquidityPoolStarted ? (
                            <>
                                <RoundEndContainer>
                                    <RoundEndLabel>{t('liquidity-pool.round-end-label')}:</RoundEndLabel>
                                    <RoundEnd>
                                        {liquidityPoolData.isRoundEnded ? (
                                            t('liquidity-pool.round-ended-label')
                                        ) : (
                                            <TimeRemaining
                                                end={liquidityPoolData.roundEndTime}
                                                fontSize={20}
                                                showFullCounter
                                            />
                                        )}
                                        {liquidityPoolData.canCloseCurrentRound && (
                                            <Button disabled={isSubmitting} onClick={closeRound}>
                                                {t('liquidity-pool.button.close-round')}
                                            </Button>
                                        )}
                                    </RoundEnd>
                                </RoundEndContainer>
                            </>
                        ) : (
                            <RoundInfoContainer>
                                <RoundInfo>{t('liquidity-pool.liquidity-pool-not-started-message')}</RoundInfo>
                            </RoundInfoContainer>
                        )}
                    </ContentContainer>
                    <ContentContainer>
                        {!isSUSD && (
                            <ToggleContainer>
                                <Switch
                                    active={selectedTab === LiquidityPoolTab.WITHDRAW}
                                    width={'66px'}
                                    height={'30px'}
                                    dotSize="18px"
                                    label={{
                                        firstLabel: t(`liquidity-pool.tabs.${LiquidityPoolTab.DEPOSIT}`),
                                        secondLabel: t(`liquidity-pool.tabs.${LiquidityPoolTab.WITHDRAW}`),
                                        fontSize: '18px',
                                    }}
                                    dotBackground={theme.textColor.primary}
                                    handleClick={() => {
                                        setSelectedTab(
                                            selectedTab === LiquidityPoolTab.DEPOSIT
                                                ? LiquidityPoolTab.WITHDRAW
                                                : LiquidityPoolTab.DEPOSIT
                                        );
                                    }}
                                />
                            </ToggleContainer>
                        )}
                        {selectedTab === LiquidityPoolTab.DEPOSIT && !isSUSD && (
                            <>
                                {isWithdrawalRequested && (
                                    <WarningContentInfo>
                                        <Trans i18nKey="liquidity-pool.deposit-withdrawal-warning" />
                                    </WarningContentInfo>
                                )}
                                {isLiquidityPoolCapReached && (
                                    <WarningContentInfo>
                                        <Trans i18nKey="liquidity-pool.deposit-liquidity-pool-cap-reached-warning" />
                                    </WarningContentInfo>
                                )}
                                {isMaximumAmountOfUsersReached && (
                                    <WarningContentInfo>
                                        <Trans i18nKey="liquidity-pool.deposit-max-amount-of-users-warning" />
                                    </WarningContentInfo>
                                )}
                                <NumericInput
                                    value={amount}
                                    disabled={isDepositAmountInputDisabled}
                                    onChange={(_, value) => setAmount(value)}
                                    currencyLabel={collateral}
                                    placeholder={t('common.enter-amount')}
                                    showValidation={
                                        insufficientBalance || !!exceededLiquidityPoolCap || !!invalidAmount
                                    }
                                    validationMessage={
                                        t(
                                            `${
                                                insufficientBalance
                                                    ? 'common.errors.insufficient-balance'
                                                    : exceededLiquidityPoolCap
                                                    ? 'liquidity-pool.deposit-liquidity-pool-cap-error'
                                                    : 'liquidity-pool.deposit-min-amount-error'
                                            }`,
                                            {
                                                amount: formatCurrencyWithSign(
                                                    USD_SIGN,
                                                    liquidityPoolData.minDepositAmount
                                                ),
                                            }
                                        ) as string
                                    }
                                />
                                <ButtonContainer>{getDepositSubmitButton()}</ButtonContainer>
                            </>
                        )}
                        {(selectedTab === LiquidityPoolTab.WITHDRAW || isSUSD) && (
                            <>
                                {((liquidityPoolData && userLiquidityPoolData && !isWithdrawalRequested) ||
                                    !isWalletConnected) && (
                                    <>
                                        {nothingToWithdraw || !isWalletConnected ? (
                                            <>
                                                <ContentInfo>
                                                    <Trans i18nKey="liquidity-pool.nothing-to-withdraw-label" />
                                                </ContentInfo>
                                                {userLiquidityPoolData && userLiquidityPoolData.hasDepositForNextRound && (
                                                    <ContentInfo>
                                                        <Trans i18nKey="liquidity-pool.first-deposit-withdrawal-message" />
                                                    </ContentInfo>
                                                )}
                                            </>
                                        ) : (
                                            <>
                                                {userLiquidityPoolData && (
                                                    <>
                                                        {userLiquidityPoolData.hasDepositForNextRound ? (
                                                            <WarningContentInfo>
                                                                <Trans i18nKey="liquidity-pool.withdrawal-deposit-warning" />
                                                            </WarningContentInfo>
                                                        ) : (
                                                            <>
                                                                <ContentInfo>
                                                                    <Trans
                                                                        i18nKey="liquidity-pool.available-to-withdraw-label"
                                                                        components={{
                                                                            bold: <BoldContent />,
                                                                        }}
                                                                        values={{
                                                                            amount: formatCurrencyWithSign(
                                                                                USD_SIGN,
                                                                                userLiquidityPoolData.balanceCurrentRound
                                                                            ),
                                                                        }}
                                                                    />
                                                                    <Tooltip
                                                                        overlay={t(
                                                                            `liquidity-pool.estimated-amount-tooltip`
                                                                        )}
                                                                        iconFontSize={14}
                                                                        marginLeft={2}
                                                                        top={-1}
                                                                    />
                                                                </ContentInfo>
                                                                <ContentInfo>
                                                                    <Trans i18nKey="liquidity-pool.withdrawal-message" />
                                                                </ContentInfo>
                                                                <RadioButtonContainer>
                                                                    <RadioButton
                                                                        checked={withdrawAll}
                                                                        value={'true'}
                                                                        onChange={() => setWithdrawAll(true)}
                                                                        label={t(
                                                                            `liquidity-pool.full-withdrawal-label`
                                                                        )}
                                                                    />
                                                                    <RadioButton
                                                                        checked={!withdrawAll}
                                                                        value={'false'}
                                                                        onChange={() => setWithdrawAll(false)}
                                                                        label={t(
                                                                            `liquidity-pool.partial-withdrawal-label`
                                                                        )}
                                                                    />
                                                                </RadioButtonContainer>
                                                                <NumericInput
                                                                    value={withdrawalPercentage}
                                                                    onChange={(_, value) =>
                                                                        setWithdrawalPercentage(value)
                                                                    }
                                                                    disabled={isPartialWithdrawalDisabled}
                                                                    step="1"
                                                                    currencyLabel="%"
                                                                    placeholder={t('common.enter-percentage')}
                                                                    showValidation={!isWithdrawalPercentageValid}
                                                                    validationMessage={t(
                                                                        Number(withdrawalPercentage) == 0
                                                                            ? 'common.errors.enter-percentage'
                                                                            : 'common.errors.invalid-percentage-range',
                                                                        { min: 10, max: 90 }
                                                                    )}
                                                                />
                                                                <SliderContainer>
                                                                    <StyledSlider
                                                                        value={Number(withdrawalPercentage)}
                                                                        step={1}
                                                                        max={90}
                                                                        min={10}
                                                                        onChange={(_: any, value: any) =>
                                                                            setWithdrawalPercentage(Number(value))
                                                                        }
                                                                        disabled={isPartialWithdrawalDisabled}
                                                                    />
                                                                    <FlexDivRow>
                                                                        <SliderRange
                                                                            className={
                                                                                isPartialWithdrawalDisabled
                                                                                    ? 'disabled'
                                                                                    : ''
                                                                            }
                                                                        >
                                                                            10%
                                                                        </SliderRange>
                                                                        <SliderRange
                                                                            className={
                                                                                isPartialWithdrawalDisabled
                                                                                    ? 'disabled'
                                                                                    : ''
                                                                            }
                                                                        >
                                                                            90%
                                                                        </SliderRange>
                                                                    </FlexDivRow>
                                                                </SliderContainer>
                                                                <ContentInfo>
                                                                    <Trans
                                                                        i18nKey="liquidity-pool.withdrawal-amount-label"
                                                                        components={{
                                                                            bold: <BoldContent />,
                                                                        }}
                                                                        values={{
                                                                            amount: formatCurrencyWithSign(
                                                                                USD_SIGN,
                                                                                withdrawalAmount
                                                                            ),
                                                                        }}
                                                                    />
                                                                    <Tooltip
                                                                        overlay={t(
                                                                            `liquidity-pool.estimated-amount-tooltip`
                                                                        )}
                                                                        iconFontSize={14}
                                                                        marginLeft={2}
                                                                        top={-1}
                                                                    />
                                                                </ContentInfo>
                                                            </>
                                                        )}
                                                    </>
                                                )}
                                            </>
                                        )}
                                        <ButtonContainer> {getWithdrawSubmitButton()}</ButtonContainer>
                                    </>
                                )}
                                {liquidityPoolData &&
                                    userLiquidityPoolData &&
                                    userLiquidityPoolData.isWithdrawalRequested && (
                                        <>
                                            <ContentInfo>
                                                <Trans
                                                    i18nKey={`liquidity-pool.${
                                                        userLiquidityPoolData.isPartialWithdrawalRequested
                                                            ? 'partial'
                                                            : 'full'
                                                    }-withdrawal-requested-message`}
                                                    components={{
                                                        bold: <BoldContent />,
                                                        tooltip: (
                                                            <Tooltip
                                                                overlay={t(`liquidity-pool.estimated-amount-tooltip`)}
                                                                iconFontSize={14}
                                                                marginLeft={2}
                                                                top={-1}
                                                            />
                                                        ),
                                                    }}
                                                    values={{
                                                        amount: formatCurrencyWithSign(
                                                            USD_SIGN,
                                                            userLiquidityPoolData.withdrawalAmount
                                                        ),
                                                        percentage: formatPercentage(
                                                            userLiquidityPoolData.withdrawalShare
                                                        ),
                                                    }}
                                                />
                                            </ContentInfo>
                                            <ContentInfo>
                                                <Trans i18nKey="liquidity-pool.withdrawal-requested-message" />
                                            </ContentInfo>
                                        </>
                                    )}
                            </>
                        )}
                    </ContentContainer>
                </Container>
            )}
            {liquidityPoolData && (
                <CopyContainer>
                    <Description>
                        <Trans
                            i18nKey={`liquidity-pool.description`}
                            components={{
                                h1: <h1 />,
                                p: <p />,
                                tipLink: <TipLink href={LINKS.ThalesTip139} />,
                            }}
                            values={{
                                thalesStakedAmount: 1 / liquidityPoolData.stakedThalesMultiplier,
                                currency: collateral,
                            }}
                        />
                    </Description>
                    <Description>
                        <Trans
                            i18nKey={`liquidity-pool.variables`}
                            components={{
                                h1: <h1 />,
                                p: <p />,
                                ul: <ul />,
                                li: <li />,
                            }}
                            values={{
                                maxAllowedDeposit: formatCurrencyWithSign(
                                    USD_SIGN,
                                    liquidityPoolData.maxAllowedDeposit,
                                    0
                                ),
                                maxAllowedUsers: liquidityPoolData.maxAllowedUsers,
                                minDepositAmount: formatCurrencyWithSign(
                                    USD_SIGN,
                                    liquidityPoolData.minDepositAmount,
                                    0
                                ),
                                roundLength: liquidityPoolData.roundLength,
                            }}
                        />
                    </Description>
                </CopyContainer>
            )}
            <MainContainer>
                {!liquidityPoolData ? (
                    <LoaderContainer>
                        <SimpleLoader />
                    </LoaderContainer>
                ) : (
                    <>
                        <ContentContainer>
                            {liquidityPoolData && (
                                <>
                                    <LiquidityPoolInfoTitle>
                                        {t('liquidity-pool.total-info-label')}
                                    </LiquidityPoolInfoTitle>
                                    <span>
                                        <Trans
                                            i18nKey="liquidity-pool.users-in-liquidity-pool-label"
                                            values={{
                                                number: liquidityPoolData.usersCurrentlyInLiquidityPool,
                                                max: liquidityPoolData.maxAllowedUsers,
                                            }}
                                        />
                                    </span>
                                    <LiquidityPoolFilledGraphicContainer>
                                        <LiquidityPoolFilledGraphicPercentage
                                            width={liquidityPoolData.allocationNextRoundPercentage}
                                        ></LiquidityPoolFilledGraphicPercentage>
                                    </LiquidityPoolFilledGraphicContainer>
                                    <LiquidityPoolFilledText>
                                        <span>{`${formatCurrencyWithSign(
                                            USD_SIGN,
                                            liquidityPoolData.allocationNextRound
                                        )} / ${formatCurrencyWithSign(
                                            USD_SIGN,
                                            liquidityPoolData.maxAllowedDeposit
                                        )}`}</span>
                                        <span>
                                            <Trans
                                                i18nKey="liquidity-pool.your-share-label"
                                                values={{
                                                    percentage: formatPercentage(
                                                        (userLiquidityPoolData
                                                            ? userLiquidityPoolData.balanceTotal
                                                            : 0) / liquidityPoolData.allocationNextRound
                                                    ),
                                                }}
                                            />
                                        </span>
                                    </LiquidityPoolFilledText>
                                </>
                            )}
                            <ContentInfoContainer>
                                <LiquidityPoolInfoTitle>{t('liquidity-pool.your-info-label')}</LiquidityPoolInfoTitle>
                                {liquidityPoolData.liquidityPoolStarted && (
                                    <LiquidityPoolInfoContainer>
                                        <LiquidityPoolInfoLabel>
                                            {t('liquidity-pool.current-balance-label')}:
                                        </LiquidityPoolInfoLabel>
                                        <LiquidityPoolInfoGraphic
                                            background={'linear-gradient(90.21deg, #A40A95 0.18%, #FC6679 99.82%)'}
                                            widthPercentage={infoGraphicPercentages.currentBalancePercenatage}
                                        />
                                        <LiquidityPoolInfo>
                                            {formatCurrencyWithSign(
                                                USD_SIGN,
                                                userLiquidityPoolData ? userLiquidityPoolData.balanceCurrentRound : 0
                                            )}
                                        </LiquidityPoolInfo>
                                    </LiquidityPoolInfoContainer>
                                )}
                                <LiquidityPoolInfoContainer>
                                    <LiquidityPoolInfoLabel>
                                        {t('liquidity-pool.next-round-balance-label')}:
                                    </LiquidityPoolInfoLabel>
                                    <LiquidityPoolInfoGraphic
                                        background={'linear-gradient(90deg, #2A3895 0%, #893CE2 100%)'}
                                        widthPercentage={infoGraphicPercentages.nextRoundBalancePercenatage}
                                    />
                                    <LiquidityPoolInfo>
                                        {formatCurrencyWithSign(
                                            USD_SIGN,
                                            userLiquidityPoolData ? userLiquidityPoolData.balanceTotal : 0
                                        )}
                                        {userLiquidityPoolData &&
                                            userLiquidityPoolData.balanceCurrentRound > 0 &&
                                            userLiquidityPoolData.balanceTotal > 0 && (
                                                <Tooltip
                                                    overlay={t(`liquidity-pool.estimated-amount-tooltip`)}
                                                    iconFontSize={14}
                                                    marginLeft={2}
                                                    top={-1}
                                                />
                                            )}
                                    </LiquidityPoolInfo>
                                </LiquidityPoolInfoContainer>
                                {isWithdrawalRequested && (
                                    <WarningContentInfo>
                                        <Trans
                                            i18nKey={`liquidity-pool.${
                                                userLiquidityPoolData.isPartialWithdrawalRequested ? 'partial' : 'full'
                                            }-withdrawal-request-label`}
                                            components={{
                                                tooltip: (
                                                    <Tooltip
                                                        overlay={t(`liquidity-pool.estimated-amount-tooltip`)}
                                                        iconFontSize={14}
                                                        marginLeft={2}
                                                        top={-1}
                                                    />
                                                ),
                                            }}
                                            values={{
                                                amount: formatCurrencyWithSign(
                                                    USD_SIGN,
                                                    userLiquidityPoolData ? userLiquidityPoolData.withdrawalAmount : 0
                                                ),
                                                percentage: formatPercentage(
                                                    userLiquidityPoolData ? userLiquidityPoolData.withdrawalShare : 0
                                                ),
                                            }}
                                        />
                                    </WarningContentInfo>
                                )}
                            </ContentInfoContainer>
                        </ContentContainer>
                        <ContentContainer>
                            {liquidityPoolData && (
                                <PnL
                                    lifetimePnl={liquidityPoolData.lifetimePnl}
                                    type={LiquidityPoolPnlType.PNL_PER_ROUND}
                                    liquidityPoolAddress={liquidityPoolAddress}
                                />
                            )}
                        </ContentContainer>
                        <ContentContainer>
                            {liquidityPoolData && (
                                <PnL
                                    lifetimePnl={liquidityPoolData.lifetimePnl}
                                    type={LiquidityPoolPnlType.CUMULATIVE_PNL}
                                    liquidityPoolAddress={liquidityPoolAddress}
                                />
                            )}
                        </ContentContainer>
                    </>
                )}
            </MainContainer>
            {liquidityPoolData && (
                <Transactions currentRound={liquidityPoolData.round} liquidityPoolAddress={liquidityPoolAddress} />
            )}
            {openApprovalModal && (
                <ApprovalModal
                    defaultAmount={amount}
                    tokenSymbol={collateral}
                    isAllowing={isAllowing}
                    onSubmit={handleAllowance}
                    onClose={() => setOpenApprovalModal(false)}
                />
            )}
        </Wrapper>
    );
};

const getInfoGraphicPercentages = (currentBalance: number, nextRoundBalance: number) => {
    let currentBalancePercenatage = 1;
    let nextRoundBalancePercenatage = 1;

    if (currentBalance > nextRoundBalance) {
        nextRoundBalancePercenatage = nextRoundBalance / currentBalance;
    } else if (nextRoundBalance === 0) {
        currentBalancePercenatage = 0;
        nextRoundBalancePercenatage = 0;
    } else {
        currentBalancePercenatage = currentBalance / nextRoundBalance;
    }

    return {
        currentBalancePercenatage,
        nextRoundBalancePercenatage,
    };
};

export default LiquidityPool;
