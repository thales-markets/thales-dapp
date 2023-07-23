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
import { ONE_HUNDRED_AND_THREE_PERCENT, POSITIONS_TO_SIDE_MAP } from 'constants/options';
import { CONNECTION_TIMEOUT_MS, PYTH_CONTRACT_ADDRESS } from 'constants/pyth';
import { Positions } from 'enums/options';
import { ScreenSizeBreakpoint } from 'enums/ui';
import { BigNumber, ethers } from 'ethers';
import { AmmSpeedMarketsLimits } from 'queries/options/speedMarkets/useAmmSpeedMarketsLimitsQuery';
import useMultipleCollateralBalanceQuery from 'queries/walletBalances/useMultipleCollateralBalanceQuery';
import useStableBalanceQuery from 'queries/walletBalances/useStableBalanceQuery';
import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { getIsAppReady } from 'redux/modules/app';
import { getIsWalletConnected, getNetworkId, getWalletAddress } from 'redux/modules/wallet';
import { RootState } from 'redux/rootReducer';
import styled from 'styled-components';
import { FlexDivCentered, FlexDivColumn, FlexDivRow, FlexDivRowCentered } from 'styles/common';
import { getCurrencyKeyStableBalance } from 'utils/balances';
import erc20Contract from 'utils/contracts/erc20Contract';
import { getCollateral, getCollaterals, getDefaultCollateral, getStableCoinBalance } from 'utils/currency';
import { stableCoinParser } from 'utils/formatters/ethers';
import { formatCurrency, roundNumberToDecimals } from 'utils/formatters/number';
import { checkAllowance, getMaxGasLimitForNetwork } from 'utils/network';
import { getPriceId, getPriceServiceEndpoint } from 'utils/pyth';
import snxJSConnector from 'utils/snxJSConnector';
import { delay } from 'utils/timer';

type AmmSpeedTradingProps = {
    currencyKey: string;
    positionType: Positions.UP | Positions.DOWN | undefined;
    strikeTimeSec: number;
    deltaTimeSec: number;
    buyinAmount: number;
    setBuyinAmount: React.Dispatch<number>;
    ammSpeedMarketsLimits: AmmSpeedMarketsLimits | null;
    showWalletBalance?: boolean;
    autoFocus?: boolean;
};

const AmmSpeedTrading: React.FC<AmmSpeedTradingProps> = ({
    currencyKey,
    positionType,
    strikeTimeSec,
    deltaTimeSec,
    buyinAmount,
    setBuyinAmount,
    ammSpeedMarketsLimits,
    showWalletBalance,
}) => {
    const { t } = useTranslation();
    const { openConnectModal } = useConnectModal();

    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const isWalletConnected = useSelector((state: RootState) => getIsWalletConnected(state));
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state)) || '';
    const selectedCollateralIndex = 0; // useSelector((state: RootState) => getSelectedCollateralIndex(state)); TODO: currently not supported

    const [paidAmount, setPaidAmount] = useState<number | string>(buyinAmount ? buyinAmount : '');
    const [isAllowing, setIsAllowing] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessageKey, setErrorMessageKey] = useState('');
    const [hasAllowance, setAllowance] = useState(false);
    const [openApprovalModal, setOpenApprovalModal] = useState(false);

    const isMultiCollateralSupported = false; // getIsMultiCollateralSupported(networkId); TODO: currently not supported
    const isButtonDisabled =
        positionType === undefined ||
        !(strikeTimeSec || deltaTimeSec) ||
        !paidAmount ||
        isSubmitting ||
        !hasAllowance ||
        !!errorMessageKey;

    const approvalCurrency = getCollateral(networkId, selectedCollateralIndex);
    const collateralAddress = useMemo(() => {
        return isMultiCollateralSupported
            ? snxJSConnector.multipleCollateral && snxJSConnector.multipleCollateral[selectedCollateralIndex]?.address
            : snxJSConnector.collateral?.address;
    }, [selectedCollateralIndex, networkId, isMultiCollateralSupported]);

    const stableBalanceQuery = useStableBalanceQuery(walletAddress, networkId, {
        enabled: isAppReady && isWalletConnected && !isMultiCollateralSupported,
    });
    const multipleStableBalances = useMultipleCollateralBalanceQuery(walletAddress, networkId, {
        enabled: isAppReady && isWalletConnected && isMultiCollateralSupported,
    });

    const walletBalancesMap = useMemo(() => {
        return stableBalanceQuery.isSuccess ? stableBalanceQuery.data : null;
    }, [stableBalanceQuery]);

    const stableBalance = useMemo(() => {
        return isMultiCollateralSupported
            ? multipleStableBalances.isSuccess
                ? getStableCoinBalance(multipleStableBalances?.data, getCollateral(networkId, selectedCollateralIndex))
                : null
            : getCurrencyKeyStableBalance(walletBalancesMap, getDefaultCollateral(networkId));
    }, [networkId, multipleStableBalances, walletBalancesMap, selectedCollateralIndex, isMultiCollateralSupported]);

    const priceConnection = useMemo(() => {
        return new EvmPriceServiceConnection(getPriceServiceEndpoint(networkId), { timeout: CONNECTION_TIMEOUT_MS });
    }, [networkId]);

    useEffect(() => {
        if (buyinAmount > 0) {
            setPaidAmount(buyinAmount);
        }
    }, [buyinAmount]);

    // Reset inputs
    useEffect(() => {
        if (!isWalletConnected) {
            setBuyinAmount(0);
            setPaidAmount('');
        }
    }, [isWalletConnected]);

    useEffect(() => {
        let messageKey = '';

        if (ammSpeedMarketsLimits && Number(paidAmount) > 0) {
            if (Number(paidAmount) < ammSpeedMarketsLimits.minBuyinAmount) {
                messageKey = 'speed-markets.errors.min-buyin';
            } else if (Number(paidAmount) > ammSpeedMarketsLimits.maxBuyinAmount) {
                messageKey = 'speed-markets.errors.max-buyin';
            }
        } else if (
            (isWalletConnected && Number(paidAmount) > 0 && Number(paidAmount) > stableBalance) ||
            stableBalance === 0
        ) {
            messageKey = 'common.errors.insufficient-balance-wallet';
        }

        setErrorMessageKey(messageKey);
    }, [ammSpeedMarketsLimits, paidAmount, stableBalance, isWalletConnected]);

    // Check allowance
    useEffect(() => {
        if (!collateralAddress) {
            return;
        }
        const erc20Instance = new ethers.Contract(collateralAddress, erc20Contract.abi, snxJSConnector.provider);
        const addressToApprove = snxJSConnector.speedMarketsAMMContract?.address || '';

        const getAllowance = async () => {
            try {
                const parsedAmount: BigNumber = stableCoinParser(
                    Number(paidAmount).toString(),
                    networkId,
                    getCollateral(networkId, selectedCollateralIndex)
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
        selectedCollateralIndex,
        walletAddress,
        isWalletConnected,
        hasAllowance,
        isAllowing,
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
            const providerOptions = {
                gasLimit: getMaxGasLimitForNetwork(networkId),
            };

            const tx = (await erc20Instance.approve(
                addressToApprove,
                approveAmount,
                providerOptions
            )) as ethers.ContractTransaction;
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

        setIsSubmitting(true);
        const id = toast.loading(getDefaultToastContent(t('common.progress')), getLoadingToastOptions());

        try {
            const { speedMarketsAMMContract, signer } = snxJSConnector as any;
            if (speedMarketsAMMContract) {
                const speedMarketsAMMContractWithSigner = speedMarketsAMMContract.connect(signer);

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
                const buyInAmount = stableCoinParser(buyinAmount.toString(), networkId);

                const tx: ethers.ContractTransaction = strikeTimeSec
                    ? await speedMarketsAMMContractWithSigner.createNewMarket(
                          asset,
                          strikeTimeSec,
                          side,
                          buyInAmount,
                          priceUpdateData,
                          { value: updateFee }
                      )
                    : await speedMarketsAMMContractWithSigner.createNewMarketWithDelta(
                          asset,
                          deltaTimeSec,
                          side,
                          buyInAmount,
                          priceUpdateData,
                          { value: updateFee }
                      );

                const txResult = await tx.wait();

                if (txResult && txResult.transactionHash) {
                    toast.update(id, getSuccessToastOptions(t(`common.buy.confirmation-message`), id));
                }
            } else {
                await delay(800);
                toast.update(id, getErrorToastOptions(t('common.errors.wallet-not-connected'), id));
            }
            setIsSubmitting(false);
        } catch (e) {
            console.log(e);
            await delay(800);
            toast.update(id, getErrorToastOptions(t('common.errors.unknown-error-try-again'), id));
            setIsSubmitting(false);
        }
    };

    const getSubmitButton = () => {
        if (!isWalletConnected) {
            return <Button onClick={openConnectModal}>{t('common.wallet.connect-your-wallet')}</Button>;
        }
        if (!hasAllowance) {
            return (
                <Button disabled={isAllowing} onClick={() => setOpenApprovalModal(true)}>
                    {!isAllowing
                        ? `${t('common.enable-wallet-access.approve')} ${approvalCurrency}`
                        : `${t('common.enable-wallet-access.approve-progress')} ${approvalCurrency}...`}
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
        if (ammSpeedMarketsLimits && stableBalance > 0) {
            setPaidAmount(Math.min(ammSpeedMarketsLimits.maxBuyinAmount, stableBalance));
        }
    };

    return (
        <Container>
            <TradingDetailsContainer>
                {/* <TradingDetailsSentence
                    currencyKey={currencyKey}
                    maturityDate={maturityDate}
                    market={market}
                    isRangedMarket={isRangedMarket}
                    isFetchingQuote={isFetchingQuote}
                    priceProfit={priceProfit}
                    paidAmount={paidAmount}
                    breakFirstLine={false}
                /> */}
            </TradingDetailsContainer>
            <FinalizeTrade>
                <ColumnSpaceBetween>
                    <NumericInput
                        value={paidAmount}
                        disabled={isSubmitting}
                        placeholder={t('common.enter-amount')}
                        onChange={(_, value) => {
                            setPaidAmount(value);
                            setBuyinAmount(Number(value));
                        }}
                        onMaxButton={onMaxClick}
                        showValidation={!!errorMessageKey}
                        validationMessage={t(errorMessageKey, {
                            currencyKey: getCollateral(networkId, selectedCollateralIndex),
                            minAmount: ammSpeedMarketsLimits?.minBuyinAmount,
                            maxAmount: ammSpeedMarketsLimits?.maxBuyinAmount,
                        })}
                        balance={
                            showWalletBalance && isWalletConnected
                                ? `${t('common.balance')}: ${formatCurrency(stableBalance)}`
                                : undefined
                        }
                        currencyComponent={
                            isMultiCollateralSupported ? (
                                <CollateralSelector
                                    collateralArray={getCollaterals(networkId)}
                                    selectedItem={selectedCollateralIndex}
                                    onChangeCollateral={() => {}}
                                    disabled={isSubmitting}
                                />
                            ) : undefined
                        }
                        currencyLabel={!isMultiCollateralSupported ? getDefaultCollateral(networkId) : undefined}
                    />
                    {getSubmitButton()}
                </ColumnSpaceBetween>
            </FinalizeTrade>

            {openApprovalModal && (
                <ApprovalModal
                    // add three percent to approval amount to take into account price changes
                    defaultAmount={roundNumberToDecimals(ONE_HUNDRED_AND_THREE_PERCENT * Number(paidAmount))}
                    tokenSymbol={approvalCurrency}
                    isNonStable={false}
                    isAllowing={isAllowing}
                    onSubmit={handleAllowance}
                    onClose={() => setOpenApprovalModal(false)}
                />
            )}
        </Container>
    );
};

export const Container = styled(FlexDivRow)`
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

export default AmmSpeedTrading;
