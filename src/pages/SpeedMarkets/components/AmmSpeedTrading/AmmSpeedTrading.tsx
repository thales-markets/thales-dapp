import { EvmPriceServiceConnection } from '@pythnetwork/pyth-evm-js';
import PythInterfaceAbi from '@pythnetwork/pyth-sdk-solidity/abis/IPyth.json';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import ApprovalModal from 'components/ApprovalModal';
import Button from 'components/Button';
import CollateralSelector from 'components/CollateralSelector';
import {
    getDefaultToastContent,
    getErrorToastOptions,
    getLoadingToastOptions,
    getSuccessToastOptions,
} from 'components/ToastMessage/ToastMessage';
import NumericInput from 'components/fields/NumericInput';
import { USD_SIGN } from 'constants/currency';
import { POSITIONS_TO_SIDE_MAP, SPEED_MARKETS_QUOTE } from 'constants/options';
import { CONNECTION_TIMEOUT_MS, PYTH_CONTRACT_ADDRESS } from 'constants/pyth';
import { secondsToMilliseconds } from 'date-fns';
import { Positions } from 'enums/options';
import { ScreenSizeBreakpoint } from 'enums/ui';
import { BigNumber, ethers } from 'ethers';
import TradingDetailsSentence from 'pages/Trade/components/AmmTrading/components/TradingDetailsSentence';
import { AmmSpeedMarketsLimits } from 'queries/options/speedMarkets/useAmmSpeedMarketsLimitsQuery';
import useExchangeRatesQuery, { Rates } from 'queries/rates/useExchangeRatesQuery';
import useMultipleCollateralBalanceQuery from 'queries/walletBalances/useMultipleCollateralBalanceQuery';
import useStableBalanceQuery from 'queries/walletBalances/useStableBalanceQuery';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { getIsAppReady } from 'redux/modules/app';
import { getIsMobile } from 'redux/modules/ui';
import {
    getIsWalletConnected,
    getNetworkId,
    getSelectedCollateralIndex,
    getWalletAddress,
    setSelectedCollateralIndex,
} from 'redux/modules/wallet';
import { RootState } from 'redux/rootReducer';
import styled from 'styled-components';
import { FlexDivCentered, FlexDivColumn, FlexDivRow, FlexDivRowCentered } from 'styles/common';
import { Coins } from 'types/options';
import { getCurrencyKeyStableBalance } from 'utils/balances';
import erc20Contract from 'utils/contracts/erc20Contract';
import {
    getCollateral,
    getCollaterals,
    getDefaultCollateral,
    getDefaultStableIndexByBalance,
    getCoinBalance,
    isStableCurrency,
} from 'utils/currency';
import { coinParser } from 'utils/formatters/ethers';
import {
    formatCurrency,
    formatCurrencyWithKey,
    formatCurrencyWithSign,
    formatPercentage,
    roundNumberToDecimals,
    truncToDecimals,
} from 'utils/formatters/number';
import { checkAllowance, getIsMultiCollateralSupported } from 'utils/network';
import { getPriceId, getPriceServiceEndpoint } from 'utils/pyth';
import { refetchUserSpeedMarkets } from 'utils/queryConnector';
import snxJSConnector from 'utils/snxJSConnector';
import { getTransactionForSpeedAMM } from 'utils/speedAmm';
import { delay } from 'utils/timer';

type AmmSpeedTradingProps = {
    currencyKey: string;
    positionType: Positions.UP | Positions.DOWN | undefined;
    strikeTimeSec: number;
    deltaTimeSec: number;
    stableBuyinAmount: number;
    setStableBuyinAmount: React.Dispatch<number>;
    ammSpeedMarketsLimits: AmmSpeedMarketsLimits | null;
    currentPrice: number;
    resetData: React.Dispatch<void>;
    showWalletBalance?: boolean;
    autoFocus?: boolean;
};

const AmmSpeedTrading: React.FC<AmmSpeedTradingProps> = ({
    currencyKey,
    positionType,
    strikeTimeSec,
    deltaTimeSec,
    stableBuyinAmount,
    setStableBuyinAmount,
    ammSpeedMarketsLimits,
    currentPrice,
    resetData,
    showWalletBalance,
}) => {
    const { t } = useTranslation();
    const { openConnectModal } = useConnectModal();
    const dispatch = useDispatch();

    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const isWalletConnected = useSelector((state: RootState) => getIsWalletConnected(state));
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state)) || '';
    const selectedCollateralIndex = useSelector((state: RootState) => getSelectedCollateralIndex(state));
    const isMobile = useSelector((state: RootState) => getIsMobile(state));

    const [paidAmount, setPaidAmount] = useState<number | string>(stableBuyinAmount ? stableBuyinAmount : '');
    const [totalPaidAmount, setTotalPaidAmount] = useState(0);
    const [isAllowing, setIsAllowing] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessageKey, setErrorMessageKey] = useState('');
    const [isCapBreached, setIsCapBreached] = useState(false);
    const [hasAllowance, setAllowance] = useState(false);
    const [openApprovalModal, setOpenApprovalModal] = useState(false);

    const isMultiCollateralSupported = getIsMultiCollateralSupported(networkId);
    const isButtonDisabled =
        positionType === undefined ||
        !(strikeTimeSec || deltaTimeSec) ||
        !paidAmount ||
        isSubmitting ||
        !hasAllowance ||
        !!errorMessageKey ||
        isCapBreached;

    const defaultCollateral = useMemo(() => getDefaultCollateral(networkId), [networkId]);
    const selectedCollateral = useMemo(() => getCollateral(networkId, selectedCollateralIndex, true), [
        networkId,
        selectedCollateralIndex,
    ]);
    const collateralAddress = isMultiCollateralSupported
        ? snxJSConnector.multipleCollateral && snxJSConnector.multipleCollateral[selectedCollateralIndex]?.address
        : snxJSConnector.collateral?.address;

    const stableBalanceQuery = useStableBalanceQuery(walletAddress, networkId, {
        enabled: isAppReady && isWalletConnected && !isMultiCollateralSupported,
    });
    const multipleCollateralBalances = useMultipleCollateralBalanceQuery(walletAddress, networkId, {
        enabled: isAppReady && isWalletConnected && isMultiCollateralSupported,
    });

    const walletBalancesMap = useMemo(() => {
        return stableBalanceQuery.isSuccess ? stableBalanceQuery.data : null;
    }, [stableBalanceQuery]);

    const collateralBalance = useMemo(() => {
        return isMultiCollateralSupported
            ? multipleCollateralBalances.isSuccess
                ? getCoinBalance(multipleCollateralBalances?.data, selectedCollateral)
                : null
            : getCurrencyKeyStableBalance(walletBalancesMap, defaultCollateral);
    }, [
        multipleCollateralBalances,
        walletBalancesMap,
        isMultiCollateralSupported,
        defaultCollateral,
        selectedCollateral,
    ]);

    const exchangeRatesMarketDataQuery = useExchangeRatesQuery(networkId, {
        enabled: isAppReady,
    });
    const exchangeRates: Rates | null =
        exchangeRatesMarketDataQuery.isSuccess && exchangeRatesMarketDataQuery.data
            ? exchangeRatesMarketDataQuery.data
            : null;

    const convertToStable = useCallback(
        (value: number) => {
            const rate = exchangeRates?.[selectedCollateral] || 0;
            return isStableCurrency(selectedCollateral) ? value : value * rate;
        },
        [selectedCollateral, exchangeRates]
    );
    const convertFromStable = useCallback(
        (value: number) => {
            const rate = exchangeRates?.[selectedCollateral];
            return isStableCurrency(selectedCollateral) ? value : rate ? value / rate : 0;
        },
        [selectedCollateral, exchangeRates]
    );

    const totalFee = useMemo(() => {
        if (ammSpeedMarketsLimits) {
            return ammSpeedMarketsLimits?.lpFee + ammSpeedMarketsLimits?.safeBoxImpact;
        }
    }, [ammSpeedMarketsLimits]);

    // If sUSD balance less than 1, select first stable with nonzero value as default
    useEffect(() => {
        if (
            isStableCurrency(selectedCollateral) &&
            multipleCollateralBalances?.data &&
            multipleCollateralBalances?.isSuccess &&
            selectedCollateral === defaultCollateral &&
            isMultiCollateralSupported
        ) {
            const defaultStableIndex = getDefaultStableIndexByBalance(
                multipleCollateralBalances?.data,
                networkId,
                defaultCollateral as Coins
            );
            dispatch(setSelectedCollateralIndex(defaultStableIndex));
        }
    }, [
        dispatch,
        multipleCollateralBalances?.isSuccess,
        multipleCollateralBalances?.data,
        isMultiCollateralSupported,
        networkId,
        selectedCollateral,
        defaultCollateral,
    ]);

    useEffect(() => {
        if (totalFee) {
            setTotalPaidAmount((1 + totalFee) * Number(paidAmount));
        }
    }, [paidAmount, totalFee]);

    useEffect(() => {
        setPaidAmount(stableBuyinAmount > 0 ? convertFromStable(stableBuyinAmount) : '');
    }, [stableBuyinAmount, convertFromStable]);

    // Reset inputs
    useEffect(() => {
        if (!isWalletConnected) {
            setStableBuyinAmount(0);
            setPaidAmount('');
        }
    }, [isWalletConnected, setStableBuyinAmount]);

    // Input field validations
    useEffect(() => {
        let messageKey = '';

        if (totalPaidAmount > collateralBalance) {
            messageKey = 'speed-markets.errors.insufficient-balance-fee';
        }
        if (
            (isWalletConnected && Number(paidAmount) > 0 && Number(paidAmount) > collateralBalance) ||
            collateralBalance === 0
        ) {
            messageKey = 'common.errors.insufficient-balance-wallet';
        }
        if (ammSpeedMarketsLimits && stableBuyinAmount > 0) {
            if (stableBuyinAmount < ammSpeedMarketsLimits.minBuyinAmount) {
                messageKey = 'speed-markets.errors.min-buyin';
            } else if (stableBuyinAmount > ammSpeedMarketsLimits.maxBuyinAmount) {
                messageKey = 'speed-markets.errors.max-buyin';
            }
        }

        setErrorMessageKey(messageKey);
    }, [ammSpeedMarketsLimits, paidAmount, collateralBalance, isWalletConnected, totalPaidAmount, stableBuyinAmount]);

    // Submit validations
    useEffect(() => {
        if (stableBuyinAmount > 0) {
            const riskData = ammSpeedMarketsLimits?.risksPerAsset.filter((data) => data.currency === currencyKey)[0];
            if (riskData) {
                setIsCapBreached(riskData?.current + stableBuyinAmount >= riskData?.max);
            }
        } else {
            setIsCapBreached(false);
        }
    }, [ammSpeedMarketsLimits, currencyKey, stableBuyinAmount]);

    // Check allowance
    useEffect(() => {
        if (!collateralAddress) {
            return;
        }
        const erc20Instance = new ethers.Contract(collateralAddress, erc20Contract.abi, snxJSConnector.provider);
        const addressToApprove = snxJSConnector.speedMarketsAMMContract?.address || '';

        const getAllowance = async () => {
            try {
                const parsedAmount: BigNumber = coinParser(
                    Number(paidAmount).toString(),
                    networkId,
                    selectedCollateral
                );

                const allowance = await checkAllowance(parsedAmount, erc20Instance, walletAddress, addressToApprove);

                setAllowance(allowance);
            } catch (e) {
                console.log(e);
            }
        };
        if (isWalletConnected && erc20Instance.provider) {
            getAllowance();
        }
    }, [
        collateralAddress,
        networkId,
        paidAmount,
        walletAddress,
        isWalletConnected,
        hasAllowance,
        isAllowing,
        selectedCollateral,
    ]);

    const handleAllowance = async (approveAmount: BigNumber) => {
        if (!collateralAddress) {
            return;
        }
        const erc20Instance = new ethers.Contract(collateralAddress, erc20Contract.abi, snxJSConnector.signer);
        const addressToApprove = snxJSConnector.speedMarketsAMMContract?.address || '';

        const id = toast.loading(getDefaultToastContent(t('common.progress')), getLoadingToastOptions());
        try {
            setIsAllowing(true);

            const tx = (await erc20Instance.approve(addressToApprove, approveAmount)) as ethers.ContractTransaction;
            setOpenApprovalModal(false);
            const txResult = await tx.wait();
            if (txResult && txResult.transactionHash) {
                toast.update(id, getSuccessToastOptions(t(`common.transaction.successful`), id));
                setIsAllowing(false);
            }
        } catch (e) {
            console.log(e);
            toast.update(id, getErrorToastOptions(t('common.errors.unknown-error-try-again'), id));
            setIsAllowing(false);
            setOpenApprovalModal(false);
        }
    };

    const handleSubmit = async () => {
        if (isButtonDisabled) return;

        const priceConnection = new EvmPriceServiceConnection(getPriceServiceEndpoint(networkId), {
            timeout: CONNECTION_TIMEOUT_MS,
        });

        const { speedMarketsAMMContract, signer } = snxJSConnector as any;
        if (speedMarketsAMMContract) {
            setIsSubmitting(true);
            const id = toast.loading(getDefaultToastContent(t('common.progress')), getLoadingToastOptions());

            const speedMarketsAMMContractWithSigner = speedMarketsAMMContract.connect(signer);
            try {
                const pythContract = new ethers.Contract(
                    PYTH_CONTRACT_ADDRESS[networkId],
                    PythInterfaceAbi as any,
                    (snxJSConnector as any).provider
                );
                const priceUpdateData = await priceConnection.getPriceFeedsUpdateData([
                    getPriceId(networkId, currencyKey),
                ]);
                const updateFee = await pythContract.getUpdateFee(priceUpdateData);

                const asset = ethers.utils.formatBytes32String(currencyKey);
                const side = POSITIONS_TO_SIDE_MAP[positionType];
                const buyInAmountBigNum = coinParser(paidAmount.toString(), networkId, selectedCollateral);
                const isNonDefaultCollateral = selectedCollateral !== defaultCollateral;

                const tx: ethers.ContractTransaction = await getTransactionForSpeedAMM(
                    speedMarketsAMMContractWithSigner,
                    isNonDefaultCollateral,
                    asset,
                    deltaTimeSec,
                    strikeTimeSec,
                    side,
                    buyInAmountBigNum,
                    priceUpdateData,
                    updateFee,
                    collateralAddress || ''
                );

                const txResult = await tx.wait();

                if (txResult && txResult.transactionHash) {
                    toast.update(id, getSuccessToastOptions(t(`common.buy.confirmation-message`), id));
                    refetchUserSpeedMarkets(networkId, walletAddress);

                    resetData();
                    setPaidAmount('');
                }
            } catch (e) {
                console.log(e);
                await delay(800);
                toast.update(id, getErrorToastOptions(t('common.errors.unknown-error-try-again'), id));
            }
            setIsSubmitting(false);
        }
    };

    const getSubmitButton = () => {
        if (!isWalletConnected) {
            return <Button onClick={openConnectModal}>{t('common.wallet.connect-your-wallet')}</Button>;
        }
        if (positionType === undefined) {
            return <Button disabled={true}>{t('markets.amm-trading.choose-direction')}</Button>;
        }
        if (!(strikeTimeSec || deltaTimeSec)) {
            return <Button disabled={true}>{t('markets.amm-trading.choose-time')}</Button>;
        }
        if (!paidAmount) {
            return <Button disabled={true}>{t('common.enter-amount')}</Button>;
        }
        if (isCapBreached) {
            return <Button disabled={true}>{t('speed-markets.errors.cap-breach')}</Button>;
        }
        if (!hasAllowance) {
            return (
                <Button disabled={isAllowing} onClick={() => setOpenApprovalModal(true)}>
                    {!isAllowing
                        ? `${t('common.enable-wallet-access.approve')} ${selectedCollateral}`
                        : `${t('common.enable-wallet-access.approve-progress')} ${selectedCollateral}...`}
                </Button>
            );
        }

        return (
            <Button disabled={isButtonDisabled} onClick={handleSubmit}>
                {isSubmitting ? t(`common.buy.progress-label`) : t(`common.buy.label`)}
            </Button>
        );
    };

    const onMaxClick = () => {
        if (ammSpeedMarketsLimits && collateralBalance > 0 && totalFee) {
            const totalToPay = Number(truncToDecimals(collateralBalance / (1 + totalFee)));
            setPaidAmount(Math.min(ammSpeedMarketsLimits.maxBuyinAmount, totalToPay));
            setStableBuyinAmount(Math.min(ammSpeedMarketsLimits.maxBuyinAmount, convertToStable(totalToPay)));
        }
    };

    const getTradingDetails = () => {
        return (
            <TradingDetailsContainer>
                <TradingDetailsSentence
                    currencyKey={currencyKey}
                    maturityDate={secondsToMilliseconds(strikeTimeSec)}
                    deltaTimeSec={deltaTimeSec}
                    market={{
                        address: 'Any',
                        strikePrice: currentPrice,
                        positionType,
                    }}
                    isRangedMarket={false}
                    isFetchingQuote={false}
                    priceProfit={SPEED_MARKETS_QUOTE - 1}
                    paidAmount={stableBuyinAmount}
                    breakFirstLine={false}
                />
                <ShareIcon className="sidebar-icon icon--share" disabled={false} onClick={() => {}} />
            </TradingDetailsContainer>
        );
    };

    return (
        <Container>
            {!isMobile && getTradingDetails()}
            <FinalizeTrade>
                <ColumnSpaceBetween>
                    <NumericInput
                        value={paidAmount}
                        disabled={isSubmitting}
                        placeholder={t('common.enter-amount')}
                        onChange={(_, value) => {
                            setPaidAmount(value);
                            setStableBuyinAmount(convertToStable(Number(value)));
                        }}
                        onMaxButton={onMaxClick}
                        showValidation={!!errorMessageKey}
                        validationMessage={t(errorMessageKey, {
                            currencyKey: selectedCollateral,
                            minAmount: convertFromStable(ammSpeedMarketsLimits?.minBuyinAmount || 0),
                            maxAmount: convertFromStable(ammSpeedMarketsLimits?.maxBuyinAmount || 0),
                            fee: totalFee ? formatPercentage(totalFee, 0) : '...',
                        })}
                        balance={
                            showWalletBalance && isWalletConnected
                                ? `${t('common.balance')}: ${formatCurrency(collateralBalance)}`
                                : undefined
                        }
                        currencyComponent={
                            isMultiCollateralSupported ? (
                                <CollateralSelector
                                    collateralArray={getCollaterals(networkId, true)}
                                    selectedItem={selectedCollateralIndex}
                                    onChangeCollateral={() => {}}
                                    disabled={isSubmitting}
                                />
                            ) : undefined
                        }
                        currencyLabel={!isMultiCollateralSupported ? defaultCollateral : undefined}
                    />
                    {isMobile && getTradingDetails()}
                    {getSubmitButton()}
                    <PaymentInfo>
                        {isStableCurrency(selectedCollateral)
                            ? t('speed-markets.total-pay', {
                                  amount: formatCurrencyWithSign(USD_SIGN, stableBuyinAmount),
                                  fee: totalFee ? formatPercentage(totalFee, 0) : '...',
                              })
                            : t('speed-markets.total-pay-conversion', {
                                  amount: formatCurrencyWithKey(selectedCollateral, paidAmount),
                                  convertedAmount: formatCurrencyWithSign(USD_SIGN, stableBuyinAmount),
                                  fee: totalFee ? formatPercentage(totalFee, 0) : '...',
                              })}
                    </PaymentInfo>
                </ColumnSpaceBetween>
            </FinalizeTrade>

            {openApprovalModal && (
                <ApprovalModal
                    defaultAmount={roundNumberToDecimals(totalPaidAmount)}
                    tokenSymbol={selectedCollateral}
                    isNonStable={false}
                    isAllowing={isAllowing}
                    onSubmit={handleAllowance}
                    onClose={() => setOpenApprovalModal(false)}
                />
            )}
        </Container>
    );
};

const Container = styled(FlexDivRow)`
    position: relative;
    z-index: 4;
    height: 78px;
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        min-width: initial;
        height: 100%;
        flex-direction: column;
    }
`;

const TradingDetailsContainer = styled(FlexDivRowCentered)`
    position: relative;
    width: 600px;
    background: ${(props) => props.theme.background.secondary};
    border-radius: 8px;
    padding: 10px;
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        width: 100%;
        margin-bottom: 10px;
    }
`;

const FinalizeTrade = styled(FlexDivCentered)`
    width: 350px;
    color: ${(props) => props.theme.textColor.primary};
    font-size: 13px;
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        width: 100%;
    }
`;

const ColumnSpaceBetween = styled(FlexDivColumn)`
    width: 100%;
    height: 100%;
    justify-content: space-between;
`;

const PaymentInfo = styled.span`
    font-size: 13px;
    font-weight: 600;
    line-height: 90%;
    text-align: center;
    color: ${(props) => props.theme.textColor.secondary};
    margin-top: 6px;
`;

const ShareIcon = styled.i<{ disabled: boolean }>`
    position: absolute;
    top: 12px;
    right: 12px;
    font-size: 18px;
    color: ${(props) => props.theme.textColor.primary};
    cursor: ${(props) => (props.disabled ? 'default' : 'pointer')};
    opacity: ${(props) => (props.disabled ? '0.5' : '1')};
`;

export default AmmSpeedTrading;
