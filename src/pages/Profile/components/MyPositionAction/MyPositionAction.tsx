import { useMatomo } from '@datapunt/matomo-tracker-react';
import { EvmPriceServiceConnection } from '@pythnetwork/pyth-evm-js';
import PythInterfaceAbi from '@pythnetwork/pyth-sdk-solidity/abis/IPyth.json';
import ApprovalModal from 'components/ApprovalModal/ApprovalModal';
import Button from 'components/Button/Button';
import CollateralSelector from 'components/CollateralSelector/CollateralSelector';
import TimeRemaining from 'components/TimeRemaining/TimeRemaining';
import {
    getDefaultToastContent,
    getErrorToastOptions,
    getLoadingToastOptions,
    getSuccessToastOptions,
} from 'components/ToastMessage/ToastMessage';
import Tooltip from 'components/Tooltip/Tooltip';
import { USD_SIGN } from 'constants/currency';
import { ZERO_ADDRESS } from 'constants/network';
import { POSITIONS_TO_SIDE_MAP, SLIPPAGE_PERCENTAGE } from 'constants/options';
import { CONNECTION_TIMEOUT_MS, PYTH_CONTRACT_ADDRESS } from 'constants/pyth';
import { differenceInSeconds, millisecondsToSeconds, secondsToMilliseconds } from 'date-fns';
import { Positions } from 'enums/options';
import { ScreenSizeBreakpoint } from 'enums/ui';
import { BigNumber, ethers } from 'ethers';
import React, { useEffect, useMemo, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { getIsMobile } from 'redux/modules/ui';
import { getIsWalletConnected, getNetworkId, getSelectedCollateralIndex, getWalletAddress } from 'redux/modules/wallet';
import { RootState } from 'types/ui';
import styled, { CSSProperties, useTheme } from 'styled-components';
import { FlexDivCentered, FlexDivColumnCentered } from 'styles/common';
import { coinFormatter, coinParser, formatCurrencyWithSign, roundNumberToDecimals } from 'thales-utils';
import { UserLivePositions } from 'types/options';
import { UserPosition } from 'types/profile';
import { ThemeInterface } from 'types/ui';
import { getQuoteFromAMM, getQuoteFromRangedAMM, prepareTransactionForAMM } from 'utils/amm';
import binaryOptionMarketContract from 'utils/contracts/binaryOptionsMarketContract';
import erc20Contract from 'utils/contracts/erc20Contract';
import rangedMarketContract from 'utils/contracts/rangedMarketContract';
import { getCollateral, getCollaterals, getDefaultCollateral } from 'utils/currency';
import { checkAllowance, getIsMultiCollateralSupported } from 'utils/network';
import { getPriceId, getPriceServiceEndpoint } from 'utils/pyth';
import {
    refetchBalances,
    refetchUserNotifications,
    refetchUserOpenPositions,
    refetchUserProfileQueries,
    refetchUserResolvedSpeedMarkets,
    refetchUserSpeedMarkets,
} from 'utils/queryConnector';
import snxJSConnector from 'utils/snxJSConnector';
import { delay } from 'utils/timer';
import { UsingAmmLink } from '../styled-components';

const ONE_HUNDRED_AND_THREE_PERCENT = 1.03;

type MyPositionActionProps = {
    position: UserPosition | UserLivePositions;
    isProfileAction?: boolean;
    maxPriceDelayForResolvingSec?: number;
    isMultipleContainerRows?: boolean;
};

const MyPositionAction: React.FC<MyPositionActionProps> = ({
    position,
    isProfileAction,
    maxPriceDelayForResolvingSec,
    isMultipleContainerRows,
}) => {
    const { t } = useTranslation();
    const { trackEvent } = useMatomo();
    const theme: ThemeInterface = useTheme();
    const isRangedMarket = [Positions.IN, Positions.OUT].includes(position.side);

    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state)) || '';
    const isWalletConnected = useSelector((state: RootState) => getIsWalletConnected(state));
    const isMobile = useSelector((state: RootState) => getIsMobile(state));
    const selectedCollateralIndex = useSelector((state: RootState) => getSelectedCollateralIndex(state));

    const isMultiCollateralSupported = getIsMultiCollateralSupported(networkId, true);
    const defaultCollateral = useMemo(() => getDefaultCollateral(networkId), [networkId]);
    const selectedCollateral = useMemo(() => getCollateral(networkId, selectedCollateralIndex, true), [
        networkId,
        selectedCollateralIndex,
    ]);
    const isDefaultCollateral = selectedCollateral === defaultCollateral;
    const collateralAddress = isMultiCollateralSupported
        ? snxJSConnector.multipleCollateral && snxJSConnector.multipleCollateral[selectedCollateral]?.address
        : snxJSConnector.collateral?.address;

    const [openApprovalModal, setOpenApprovalModal] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [hasAllowance, setAllowance] = useState(false);
    const [isAllowing, setIsAllowing] = useState(false);

    useEffect(() => {
        if (
            (position.positionAddress === ZERO_ADDRESS && !position.isSpeedMarket) ||
            (isDefaultCollateral && position.isSpeedMarket)
        ) {
            return;
        }

        const { ammContract, rangedMarketAMMContract, speedMarketsAMMContract, collateral } = snxJSConnector;
        const erc20Instance = new ethers.Contract(
            position.isSpeedMarket ? collateral?.address || '' : position.positionAddress,
            erc20Contract.abi,
            snxJSConnector.provider
        );
        const addressToApprove =
            (position.isSpeedMarket
                ? speedMarketsAMMContract?.address
                : isRangedMarket
                ? rangedMarketAMMContract?.address
                : ammContract?.address) || '';

        const getAllowance = async () => {
            try {
                const parsedAmount = position.isSpeedMarket
                    ? coinParser(position.value.toString(), networkId)
                    : position.amountBigNumber;

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
        position.positionAddress,
        position.amountBigNumber,
        position.isSpeedMarket,
        position.value,
        networkId,
        walletAddress,
        isWalletConnected,
        hasAllowance,
        isAllowing,
        isRangedMarket,
        isDefaultCollateral,
    ]);

    const handleAllowance = async (approveAmount: BigNumber) => {
        const { ammContract, rangedMarketAMMContract, speedMarketsAMMContract, collateral } = snxJSConnector;
        const erc20Instance = new ethers.Contract(
            position.isSpeedMarket ? collateral?.address || '' : position.positionAddress,
            erc20Contract.abi,
            snxJSConnector.signer
        );
        const addressToApprove =
            (position.isSpeedMarket
                ? speedMarketsAMMContract?.address
                : isRangedMarket
                ? rangedMarketAMMContract?.address
                : ammContract?.address) || '';

        const id = toast.loading(getDefaultToastContent(t('common.progress')), getLoadingToastOptions());
        try {
            setIsAllowing(true);

            const tx = (await erc20Instance.approve(addressToApprove, approveAmount)) as ethers.ContractTransaction;
            setOpenApprovalModal(false);
            const txResult = await tx.wait();
            if (txResult && txResult.transactionHash) {
                toast.update(id, getSuccessToastOptions(t(`common.transaction.successful`), id));
                if (!position.isSpeedMarket) {
                    handleCashout();
                }
                setAllowance(true);
                setIsAllowing(false);
            }
        } catch (e) {
            console.log(e);
            toast.update(id, getErrorToastOptions(t('common.errors.unknown-error-try-again'), id));
            setIsAllowing(false);
            setOpenApprovalModal(false);
        }
    };

    const handleCashout = async () => {
        const fetchAmmPriceData = async (totalToPay: number) => {
            let totalValueChanged = false;

            if (position.market && totalToPay > 0) {
                try {
                    const { ammContract, rangedMarketAMMContract } = snxJSConnector as any;
                    const contract = isRangedMarket ? rangedMarketAMMContract : ammContract;

                    const promises = isRangedMarket
                        ? getQuoteFromRangedAMM(
                              false,
                              false,
                              contract,
                              position.amountBigNumber,
                              position.market,
                              POSITIONS_TO_SIDE_MAP[position.side]
                          )
                        : getQuoteFromAMM(
                              false,
                              false,
                              contract,
                              position.amountBigNumber,
                              position.market,
                              POSITIONS_TO_SIDE_MAP[position.side]
                          );

                    const [ammQuotes]: Array<BigNumber> = await Promise.all(promises);

                    const ammPrice = coinFormatter(ammQuotes, networkId) / position.amount;
                    // changes in cash out value less than 2% are not relevant
                    totalValueChanged =
                        ammPrice * position.amount < Number(position.value) * (1 - SLIPPAGE_PERCENTAGE[2] / 100) ||
                        ammPrice * position.amount > Number(position.value) * (1 + SLIPPAGE_PERCENTAGE[2] / 100);
                } catch (e) {
                    console.log(e);
                    totalValueChanged = true;
                }
            }

            return totalValueChanged;
        };

        setIsSubmitting(true);
        const id = toast.loading(getDefaultToastContent(t('common.progress')), getLoadingToastOptions());

        const totalValueChanged = await fetchAmmPriceData(position.paid);
        if (totalValueChanged) {
            toast.update(id, getErrorToastOptions(t('common.errors.try-again'), id));
            setIsSubmitting(false);
            refetchUserOpenPositions(walletAddress, networkId);
            return;
        }
        try {
            const { ammContract, rangedMarketAMMContract, signer } = snxJSConnector as any;
            const ammContractWithSigner = (isRangedMarket ? rangedMarketAMMContract : ammContract).connect(signer);

            const parsedTotal = coinParser(position.value.toString(), networkId);
            const parsedSlippage = ethers.utils.parseEther((SLIPPAGE_PERCENTAGE[2] / 100).toString());

            const tx: ethers.ContractTransaction = await prepareTransactionForAMM(
                false,
                false,
                ammContractWithSigner,
                position.market,
                POSITIONS_TO_SIDE_MAP[position.side],
                position.amountBigNumber,
                parsedTotal,
                parsedSlippage,
                undefined,
                '',
                networkId
            );

            const txResult = await tx.wait();

            if (txResult && txResult.transactionHash) {
                toast.update(id, getSuccessToastOptions(t(`common.sell.confirmation-message`), id));

                refetchBalances(walletAddress, networkId);
                refetchUserNotifications(walletAddress, networkId);
                refetchUserOpenPositions(walletAddress, networkId);
                refetchUserProfileQueries(walletAddress, networkId);

                setIsSubmitting(false);

                trackEvent({
                    category: isRangedMarket ? 'RangeAMM' : 'AMM',
                    action: 'sell-to-amm',
                });
            }
        } catch (e) {
            console.log(e);
            toast.update(id, getErrorToastOptions(t('common.errors.unknown-error-try-again'), id));
            setIsSubmitting(false);
        }
    };

    const handleExercise = async () => {
        const marketContract = new ethers.Contract(
            position.market,
            isRangedMarket ? rangedMarketContract.abi : binaryOptionMarketContract.abi
        );

        if (marketContract && snxJSConnector.signer) {
            setIsSubmitting(true);

            const marketContractWithSigner = marketContract.connect(snxJSConnector.signer);
            const id = toast.loading(getDefaultToastContent(t('common.progress')), getLoadingToastOptions());

            try {
                const tx = (isRangedMarket
                    ? await marketContractWithSigner.exercisePositions()
                    : await marketContractWithSigner.exerciseOptions()) as ethers.ContractTransaction;

                const txResult = await tx.wait();
                if (txResult && txResult.transactionHash) {
                    toast.update(
                        id,
                        getSuccessToastOptions(
                            t(`markets.market.trade-card.maturity.confirm-button.confirmation-message`),
                            id
                        )
                    );
                    refetchBalances(walletAddress, networkId);
                    refetchUserNotifications(walletAddress, networkId);
                    refetchUserOpenPositions(walletAddress, networkId);
                    refetchUserProfileQueries(walletAddress, networkId);
                    setIsSubmitting(false);
                }
            } catch (e) {
                console.log(e);
                toast.update(id, getErrorToastOptions(t('common.errors.unknown-error-try-again'), id));
                setIsSubmitting(false);
            }
        }
    };

    const handleResolve = async () => {
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

                const [priceFeedUpdateVaa, publishTime] = await priceConnection.getVaa(
                    getPriceId(networkId, position.currencyKey),
                    millisecondsToSeconds(position.maturityDate)
                );

                // check if price feed is not too late
                if (
                    maxPriceDelayForResolvingSec &&
                    differenceInSeconds(secondsToMilliseconds(publishTime), position.maturityDate) >
                        maxPriceDelayForResolvingSec
                ) {
                    await delay(800);
                    toast.update(id, getErrorToastOptions(t('speed-markets.user-positions.errors.price-stale'), id));
                    setIsSubmitting(false);
                    return;
                }

                const priceUpdateData = ['0x' + Buffer.from(priceFeedUpdateVaa, 'base64').toString('hex')];
                const updateFee = await pythContract.getUpdateFee(priceUpdateData);

                const isEth = collateralAddress === ZERO_ADDRESS;

                const tx: ethers.ContractTransaction = isDefaultCollateral
                    ? await speedMarketsAMMContractWithSigner.resolveMarket(position.market, priceUpdateData, {
                          value: updateFee,
                      })
                    : await speedMarketsAMMContractWithSigner.resolveMarketWithOfframp(
                          position.market,
                          priceUpdateData,
                          collateralAddress,
                          isEth,
                          { value: updateFee }
                      );

                const txResult = await tx.wait();

                if (txResult && txResult.transactionHash) {
                    toast.update(
                        id,
                        getSuccessToastOptions(t(`speed-markets.user-positions.confirmation-message`), id)
                    );
                    refetchUserSpeedMarkets(false, networkId, walletAddress);
                    refetchUserResolvedSpeedMarkets(false, networkId, walletAddress);
                }
            } catch (e) {
                console.log(e);
                await delay(800);
                toast.update(id, getErrorToastOptions(t('common.errors.unknown-error-try-again'), id));
            }
            setIsSubmitting(false);
        }
    };

    const getResolveButton = () => (
        <Button
            {...getDefaultButtonProps(isMobile)}
            disabled={isSubmitting}
            additionalStyles={additionalButtonStyle}
            backgroundColor={theme.button.textColor.quaternary}
            onClick={() => (hasAllowance || isDefaultCollateral ? handleResolve() : setOpenApprovalModal(true))}
        >
            {hasAllowance || isDefaultCollateral
                ? `${
                      isSubmitting
                          ? t('markets.user-positions.claim-win-progress')
                          : t('markets.user-positions.claim-win')
                  } ${formatCurrencyWithSign(USD_SIGN, position.value, 2)}`
                : isAllowing
                ? `${t('common.enable-wallet-access.approve-progress')} ${defaultCollateral}...`
                : t('common.enable-wallet-access.approve-swap', {
                      currencyKey: selectedCollateral,
                      defaultCurrency: defaultCollateral,
                  })}{' '}
        </Button>
    );

    const getButton = () => {
        if (position.isSpeedMarket) {
            if (position.claimable) {
                return hasAllowance || isDefaultCollateral ? (
                    getResolveButton()
                ) : (
                    <Tooltip
                        overlay={t('markets.user-positions.approve-swap-tooltip', {
                            currencyKey: selectedCollateral,
                            defaultCurrency: defaultCollateral,
                        })}
                    >
                        <div>{getResolveButton()}</div>
                    </Tooltip>
                );
            } else if (position.finalPrice) {
                return (
                    <ResultsContainer>
                        <Label>{t('common.result')}</Label>
                        <Value isUpperCase color={theme.error.textColor.primary}>
                            {t('common.loss')}
                        </Value>
                    </ResultsContainer>
                );
            } else {
                return (
                    <ResultsContainer minWidth="180px">
                        <Label>{t('markets.user-positions.results')}</Label>
                        <TimeRemaining fontSize={13} end={position.maturityDate} showFullCounter showSecondsCounter />
                    </ResultsContainer>
                );
            }
        }
        if (position.claimable && position.amount > 0) {
            return (
                <Button
                    {...getDefaultButtonProps(isMobile)}
                    disabled={isSubmitting}
                    additionalStyles={additionalButtonStyle}
                    backgroundColor={theme.button.textColor.quaternary}
                    onClick={() => handleExercise()}
                >
                    {`${
                        isSubmitting
                            ? t(`markets.user-positions.claim-win-progress`)
                            : t('markets.user-positions.claim-win')
                    } ${formatCurrencyWithSign(USD_SIGN, position.value, 2)}`}
                </Button>
            );
        }
        const today = new Date();
        if (position.maturityDate > today.getTime() / 1000 && position.value > 0) {
            return (
                <Tooltip overlay={t('markets.user-positions.tooltip-cash-out')}>
                    <div>
                        <Button
                            {...getDefaultButtonProps(isMobile)}
                            disabled={isAllowing || isSubmitting}
                            additionalStyles={additionalButtonStyle}
                            onClick={() => (hasAllowance ? handleCashout() : setOpenApprovalModal(true))}
                        >
                            {isAllowing
                                ? `${t('common.enable-wallet-access.approve-progress')} ${position.side}...`
                                : `${
                                      isSubmitting
                                          ? t('markets.user-positions.cash-out-progress')
                                          : t('markets.user-positions.cash-out')
                                  } ${formatCurrencyWithSign(USD_SIGN, position.value, 2)}`}
                        </Button>
                    </div>
                </Tooltip>
            );
        }
        if (position.maturityDate > today.getTime() / 1000 && position.value === 0) {
            return isProfileAction ? (
                <PositionValueContainer>
                    <Label>{t('markets.user-positions.position-value')}</Label>
                    <Value>
                        N/A
                        <Tooltip
                            overlay={
                                <Trans
                                    i18nKey={t('common.no-liquidity-tooltip')}
                                    components={[
                                        <span key="1">
                                            <UsingAmmLink key="2" />
                                        </span>,
                                    ]}
                                />
                            }
                            iconFontSize={12}
                            top={-1}
                        />
                    </Value>
                </PositionValueContainer>
            ) : (
                <>
                    <Separator />
                    <ResultsContainer>
                        <Label>{t('markets.user-positions.results')}</Label>
                        <TimeRemaining fontSize={13} end={position.maturityDate} showFullCounter />
                        <Tooltip
                            overlay={
                                <Trans
                                    i18nKey={t('common.no-liquidity-tooltip')}
                                    components={[
                                        <span key="1">
                                            <UsingAmmLink key="2" />
                                        </span>,
                                    ]}
                                />
                            }
                            iconFontSize={12}
                            marginLeft={1}
                        />
                    </ResultsContainer>
                </>
            );
        }
    };

    return (
        <>
            <FlexDivCentered>
                {getButton()}
                {isMultiCollateralSupported && position.isSpeedMarket && position.claimable && (
                    <CollateralSelectorContainer>
                        <InLabel color={theme.button.textColor.quaternary}>{t('common.in')}</InLabel>
                        <CollateralSelector
                            collateralArray={getCollaterals(networkId, true)}
                            selectedItem={selectedCollateralIndex}
                            onChangeCollateral={() => {}}
                            disabled={isSubmitting || isAllowing}
                            additionalStyles={{
                                color: theme.button.textColor.quaternary,
                                position: !isMultipleContainerRows ? undefined : 'relative',
                            }}
                            isDropDownAbove={isMobile && !isProfileAction}
                        />
                    </CollateralSelectorContainer>
                )}
            </FlexDivCentered>
            {openApprovalModal && (
                <ApprovalModal
                    // add three percent to approval amount to take into account price changes
                    defaultAmount={roundNumberToDecimals(
                        ONE_HUNDRED_AND_THREE_PERCENT * (position.isSpeedMarket ? position.value : position.amount)
                    )}
                    tokenSymbol={position.isSpeedMarket ? defaultCollateral : position.side}
                    isNonStable={!position.isSpeedMarket}
                    isAllowing={isAllowing}
                    onSubmit={handleAllowance}
                    onClose={() => setOpenApprovalModal(false)}
                />
            )}
        </>
    );
};

export const getDefaultButtonProps = (isMobile: boolean) => ({
    height: isMobile ? '24px' : '27px',
    fontSize: isMobile ? '12px' : '13px',
    padding: '0px 5px',
});

const additionalButtonStyle: CSSProperties = {
    minWidth: '180px',
    lineHeight: '100%',
    border: 'none',
};

const PositionValueContainer = styled(FlexDivColumnCentered)`
    font-weight: 400;
    font-size: 12px;
    line-height: 120%;
    white-space: nowrap;
    min-width: 180px;
    text-align: center;
`;

export const ResultsContainer = styled(FlexDivCentered)<{ minWidth?: string }>`
    gap: 4px;
    font-weight: 700;
    font-size: 13px;
    line-height: 100%;
    white-space: nowrap;
    min-width: ${(props) => (props.minWidth ? props.minWidth : '174px')};
`;

export const Label = styled.span<{ color?: string }>`
    color: ${(props) => (props.color ? props.color : props.theme.textColor.secondary)};
`;

export const Value = styled.span<{ color?: string; isUpperCase?: boolean }>`
    color: ${(props) => props.color || props.theme.textColor.primary};
    ${(props) => (props.isUpperCase ? 'text-transform: uppercase;' : '')}
    font-weight: bold;
    line-height: 100%;
`;

const Separator = styled.div`
    min-width: 2px;
    width: 2px;
    height: 14px;
    background: ${(props) => props.theme.background.secondary};
    border-radius: 3px;
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        display: none;
    }
`;

export const CollateralSelectorContainer = styled(FlexDivCentered)`
    line-height: 15px;
    padding-right: 2px;
    text-transform: none;
`;

export const InLabel = styled(Label)`
    font-size: 13px;
    font-weight: 600;
    line-height: 18px;
    margin-left: 5px;
    text-transform: uppercase;
`;

export default MyPositionAction;
