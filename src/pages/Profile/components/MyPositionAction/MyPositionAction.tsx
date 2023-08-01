import { useMatomo } from '@datapunt/matomo-tracker-react';
import { EvmPriceServiceConnection } from '@pythnetwork/pyth-evm-js';
import PythInterfaceAbi from '@pythnetwork/pyth-sdk-solidity/abis/IPyth.json';
import ApprovalModal from 'components/ApprovalModal/ApprovalModal';
import Button from 'components/Button/Button';
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
import React, { useEffect, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { getIsMobile } from 'redux/modules/ui';
import { getIsWalletConnected, getNetworkId, getWalletAddress } from 'redux/modules/wallet';
import { RootState } from 'redux/rootReducer';
import styled, { CSSProperties, useTheme } from 'styled-components';
import { FlexDivCentered, FlexDivColumnCentered } from 'styles/common';
import { UserLivePositions } from 'types/options';
import { UserPosition } from 'types/profile';
import { ThemeInterface } from 'types/ui';
import { getQuoteFromAMM, getQuoteFromRangedAMM, prepareTransactionForAMM } from 'utils/amm';
import binaryOptionMarketContract from 'utils/contracts/binaryOptionsMarketContract';
import erc20Contract from 'utils/contracts/erc20Contract';
import rangedMarketContract from 'utils/contracts/rangedMarketContract';
import { stableCoinFormatter, stableCoinParser } from 'utils/formatters/ethers';
import { formatCurrencyWithSign, roundNumberToDecimals } from 'utils/formatters/number';
import { checkAllowance } from 'utils/network';
import { getPriceId, getPriceServiceEndpoint } from 'utils/pyth';
import {
    refetchBalances,
    refetchUserNotifications,
    refetchUserOpenPositions,
    refetchUserProfileQueries,
    refetchUserSpeedMarkets,
} from 'utils/queryConnector';
import snxJSConnector from 'utils/snxJSConnector';
import { delay } from 'utils/timer';
import { UsingAmmLink } from '../styled-components';

const ONE_HUNDRED_AND_THREE_PERCENT = 1.03;

type MyPositionActionProps = {
    position: UserPosition | UserLivePositions;
    isProfileAction?: boolean;
    isSpeedMarkets?: boolean;
    maxPriceDelaySec?: number;
};

const MyPositionAction: React.FC<MyPositionActionProps> = ({
    position,
    isProfileAction,
    isSpeedMarkets,
    maxPriceDelaySec,
}) => {
    const { t } = useTranslation();
    const { trackEvent } = useMatomo();
    const theme: ThemeInterface = useTheme();
    const isRangedMarket = [Positions.IN, Positions.OUT].includes(position.side);

    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state)) || '';
    const isWalletConnected = useSelector((state: RootState) => getIsWalletConnected(state));
    const isMobile = useSelector((state: RootState) => getIsMobile(state));
    const [openApprovalModal, setOpenApprovalModal] = useState(false);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [hasAllowance, setAllowance] = useState(false);
    const [isAllowing, setIsAllowing] = useState(false);

    useEffect(() => {
        if (position.positionAddress === ZERO_ADDRESS) {
            return;
        }
        const erc20Instance = new ethers.Contract(position.positionAddress, erc20Contract.abi, snxJSConnector.provider);
        const { ammContract, rangedMarketAMMContract } = snxJSConnector;
        const addressToApprove = (isRangedMarket ? rangedMarketAMMContract?.address : ammContract?.address) || '';

        const getAllowance = async () => {
            try {
                const allowance = await checkAllowance(
                    position.amountBigNumber,
                    erc20Instance,
                    walletAddress,
                    addressToApprove
                );
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
        networkId,
        walletAddress,
        isWalletConnected,
        hasAllowance,
        isAllowing,
        isRangedMarket,
    ]);

    const handleAllowance = async (approveAmount: BigNumber) => {
        const erc20Instance = new ethers.Contract(position.positionAddress, erc20Contract.abi, snxJSConnector.signer);
        const { ammContract, rangedMarketAMMContract } = snxJSConnector;
        const addressToApprove = (isRangedMarket ? rangedMarketAMMContract?.address : ammContract?.address) || '';

        const id = toast.loading(getDefaultToastContent(t('common.progress')), getLoadingToastOptions());
        try {
            setIsAllowing(true);

            const tx = (await erc20Instance.approve(addressToApprove, approveAmount)) as ethers.ContractTransaction;
            setOpenApprovalModal(false);
            const txResult = await tx.wait();
            if (txResult && txResult.transactionHash) {
                toast.update(id, getSuccessToastOptions(t(`common.transaction.successful`), id));
                handleCashout();
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

                    const ammPrice = stableCoinFormatter(ammQuotes, networkId) / position.amount;
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

            const parsedTotal = stableCoinParser(position.value.toString(), networkId);
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
                    maxPriceDelaySec &&
                    differenceInSeconds(secondsToMilliseconds(publishTime), position.maturityDate) > maxPriceDelaySec
                ) {
                    await delay(800);
                    toast.update(id, getErrorToastOptions(t('speed-markets.user-positions.errors.price-stale'), id));
                    setIsSubmitting(false);
                    return;
                }

                const priceUpdateData = ['0x' + Buffer.from(priceFeedUpdateVaa, 'base64').toString('hex')];
                const updateFee = await pythContract.getUpdateFee(priceUpdateData);

                const tx: ethers.ContractTransaction = await speedMarketsAMMContractWithSigner.resolveMarket(
                    position.market,
                    priceUpdateData,
                    { value: updateFee }
                );

                const txResult = await tx.wait();

                if (txResult && txResult.transactionHash) {
                    toast.update(
                        id,
                        getSuccessToastOptions(t(`speed-markets.user-positions.confirmation-message`), id)
                    );
                    refetchUserSpeedMarkets(networkId, walletAddress);
                }
            } catch (e) {
                console.log(e);
                await delay(800);
                toast.update(id, getErrorToastOptions(t('common.errors.unknown-error-try-again'), id));
            }
            setIsSubmitting(false);
        }
    };

    const getButton = () => {
        if (isSpeedMarkets) {
            const isSpeedMarketMatured = Date.now() > position.maturityDate;
            if (position.claimable) {
                return (
                    <Button
                        {...getDefaultButtonProps(isMobile)}
                        disabled={isSubmitting}
                        additionalStyles={additionalButtonStyle}
                        backgroundColor={theme.button.textColor.quaternary}
                        onClick={() => handleResolve()}
                    >
                        {`${
                            isSubmitting
                                ? t(`markets.user-positions.claim-win-progress`)
                                : t('markets.user-positions.claim-win')
                        } ${formatCurrencyWithSign(USD_SIGN, position.value, 2)}`}
                    </Button>
                );
            } else if (isSpeedMarketMatured && !position.finalPrice) {
                return (
                    <>
                        <Separator />
                        <ResultsContainer>
                            <Label>{t('speed-markets.user-positions.wait-price')}</Label>
                        </ResultsContainer>
                    </>
                );
            } else {
                return (
                    <>
                        <Separator />
                        <ResultsContainer>
                            <Label>{t('markets.user-positions.results')}</Label>
                            <TimeRemaining fontSize={13} end={position.maturityDate} showFullCounter />
                        </ResultsContainer>
                    </>
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
            {getButton()}
            {openApprovalModal && (
                <ApprovalModal
                    // add three percent to approval amount to take into account price changes
                    defaultAmount={roundNumberToDecimals(ONE_HUNDRED_AND_THREE_PERCENT * position.amount)}
                    tokenSymbol={position.side}
                    isNonStable={true}
                    isAllowing={isAllowing}
                    onSubmit={handleAllowance}
                    onClose={() => setOpenApprovalModal(false)}
                />
            )}
        </>
    );
};

const getDefaultButtonProps = (isMobile: boolean) => ({
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

const ResultsContainer = styled(FlexDivCentered)`
    gap: 4px;
    font-weight: 700;
    font-size: 13px;
    line-height: 100%;
    white-space: nowrap;
    min-width: 174px;
`;

const Label = styled.span`
    color: ${(props) => props.theme.textColor.secondary};
`;

const Value = styled.span`
    color: ${(props) => props.theme.textColor.primary};
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

export default MyPositionAction;
