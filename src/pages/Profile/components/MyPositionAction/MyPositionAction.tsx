import { useMatomo } from '@datapunt/matomo-tracker-react';
import Button from 'components/Button/Button';
import TimeRemaining from 'components/TimeRemaining/TimeRemaining';
import { USD_SIGN } from 'constants/currency';
import { POSITIONS_TO_SIDE_MAP, SLIPPAGE_PERCENTAGE, getMaxGasLimitForNetwork } from 'constants/options';
import {
    getDefaultToastContent,
    getLoadingToastOptions,
    getErrorToastOptions,
    getSuccessToastOptions,
} from 'components/ToastMessage/ToastMessage';
import { Positions } from 'enums/options';
import { ScreenSizeBreakpoint } from 'enums/ui';
import { BigNumber, ethers } from 'ethers';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { getIsWalletConnected, getNetworkId, getWalletAddress } from 'redux/modules/wallet';
import { RootState } from 'redux/rootReducer';
import styled, { CSSProperties, useTheme } from 'styled-components';
import { UserLivePositions, UserPosition } from 'types/options';
import { ThemeInterface } from 'types/ui';
import { getQuoteFromAMM, getQuoteFromRangedAMM, prepareTransactionForAMM } from 'utils/amm';
import binaryOptionMarketContract from 'utils/contracts/binaryOptionsMarketContract';
import rangedMarketContract from 'utils/contracts/rangedMarketContract';
import { stableCoinFormatter, stableCoinParser } from 'utils/formatters/ethers';
import { formatCurrencyWithSign, roundNumberToDecimals } from 'utils/formatters/number';
import { refetchAmmData, refetchBalances, refetchRangedAmmData, refetchUserOpenPositions } from 'utils/queryConnector';
import snxJSConnector from 'utils/snxJSConnector';
import erc20Contract from 'utils/contracts/erc20Contract';
import { checkAllowance } from 'utils/network';
import ApprovalModal from 'components/ApprovalModal/ApprovalModal';

const ONE_HUNDRED_AND_THREE_PERCENT = 1.03;

type MyPositionActionProps = {
    position: UserPosition | UserLivePositions;
};

const MyPositionAction: React.FC<MyPositionActionProps> = ({ position }) => {
    const { t } = useTranslation();
    const { trackEvent } = useMatomo();
    const theme: ThemeInterface = useTheme();
    const isRangedMarket = [Positions.IN, Positions.OUT].includes(position.side);

    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state)) || '';
    const isWalletConnected = useSelector((state: RootState) => getIsWalletConnected(state));
    const [openApprovalModal, setOpenApprovalModal] = useState(false);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [hasAllowance, setAllowance] = useState(false);
    const [isAllowing, setIsAllowing] = useState(false);

    useEffect(() => {
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
    ]);

    const handleAllowance = async (approveAmount: BigNumber) => {
        const erc20Instance = new ethers.Contract(position.positionAddress, erc20Contract.abi, snxJSConnector.signer);
        const { ammContract, rangedMarketAMMContract } = snxJSConnector;
        const addressToApprove = (isRangedMarket ? rangedMarketAMMContract?.address : ammContract?.address) || '';

        const id = toast.loading(getDefaultToastContent(t('amm.progress')), getLoadingToastOptions());
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
                toast.update(id, getSuccessToastOptions(t(`amm.transaction-successful`), id));
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

                    const ammPrice = stableCoinFormatter(ammQuotes, networkId, undefined) / position.amount;
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
        const id = toast.loading(getDefaultToastContent(t('amm.progress')), getLoadingToastOptions());

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

            const providerOptions = {
                gasLimit: getMaxGasLimitForNetwork(networkId),
            };

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
                providerOptions
            );

            const txResult = await tx.wait();

            if (txResult && txResult.transactionHash) {
                toast.update(
                    id,
                    getSuccessToastOptions(
                        t(`options.market.trade-options.place-order.swap-confirm-button.sell.confirmation-message`),
                        id
                    )
                );

                refetchBalances(walletAddress, networkId);
                isRangedMarket
                    ? refetchRangedAmmData(walletAddress, position.market, networkId)
                    : refetchAmmData(walletAddress, position.market);
                refetchUserOpenPositions(walletAddress, networkId);

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
            const id = toast.loading(getDefaultToastContent(t('amm.progress')), getLoadingToastOptions());

            try {
                const providerOptions = {
                    gasLimit: getMaxGasLimitForNetwork(networkId),
                };
                const tx = (isRangedMarket
                    ? await marketContractWithSigner.exercisePositions(providerOptions)
                    : await marketContractWithSigner.exerciseOptions(providerOptions)) as ethers.ContractTransaction;

                const txResult = await tx.wait();
                if (txResult && txResult.transactionHash) {
                    toast.update(
                        id,
                        getSuccessToastOptions(
                            t(`options.market.trade-card.maturity.confirm-button.confirmation-message`),
                            id
                        )
                    );
                    refetchBalances(walletAddress, networkId);
                    refetchUserOpenPositions(walletAddress, networkId);
                    setIsSubmitting(false);
                }
            } catch (e) {
                console.log(e);
                toast.update(id, getErrorToastOptions(t('common.errors.unknown-error-try-again'), id));
                setIsSubmitting(false);
            }
        }
    };

    const getButton = () => {
        if (position.claimable && position.amount > 0) {
            return (
                <Button
                    {...defaultButtonProps}
                    disabled={isSubmitting}
                    additionalStyles={additionalButtonStyle}
                    backgroundColor={theme.button.textColor.quaternary}
                    onClick={() => handleExercise()}
                >
                    {`${
                        isSubmitting
                            ? t(`options.trade.user-positions.claim-win-progress`)
                            : t('options.trade.user-positions.claim-win')
                    } ${formatCurrencyWithSign(USD_SIGN, position.value, 2)}`}
                </Button>
            );
        }
        const today = new Date();
        if (position.maturityDate > today.getTime() / 1000 && position.value > 0) {
            return (
                <Button
                    {...defaultButtonProps}
                    disabled={isAllowing || isSubmitting}
                    additionalStyles={additionalButtonStyle}
                    onClick={() => (hasAllowance ? handleCashout() : setOpenApprovalModal(true))}
                >
                    {isAllowing
                        ? `${t('common.enable-wallet-access.approve-progress')} ${position.side}...`
                        : `${
                              isSubmitting
                                  ? t(`options.trade.user-positions.cash-out-progress`)
                                  : t('options.trade.user-positions.cash-out')
                          } ${formatCurrencyWithSign(USD_SIGN, position.value, 2)}`}
                </Button>
            );
        }
        if (position.maturityDate > today.getTime() / 1000 && position.value === 0) {
            return (
                <>
                    <FlexContainer style={{ minWidth: 180 }}>
                        <Label>{t('options.trade.user-positions.results')}</Label>
                        <TimeRemaining fontSize={13} end={position.maturityDate} showFullCounter />
                    </FlexContainer>
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

const defaultButtonProps = {
    height: '27px',
    fontSize: '13px',
    padding: '0px 10px',
};

const additionalButtonStyle: CSSProperties = {
    minWidth: '180px',
    lineHeight: '100%',
    border: 'none',
};

const AlignedFlex = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
    justify-content: flex-end;
    width: 100%;
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        flex-direction: column;
        gap: 6px;
    }
`;

const FlexContainer = styled(AlignedFlex)`
    gap: 4px;
    flex: 1;
    justify-content: center;
    &:first-child {
        min-width: 195px;
        max-width: 195px;
    }
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        flex-direction: row;
        gap: 4px;
    }
`;

const Label = styled.span`
    font-style: normal;
    font-weight: 700;
    font-size: 13px;
    line-height: 100%;
    color: ${(props) => props.theme.textColor.secondary};
    white-space: nowrap;
`;

// const Separator = styled.div`
//     min-width: 2px;
//     width: 2px;
//     height: 14px;
//     background: ${(props) => props.theme.background.secondary};
//     border-radius: 3px;
//     @media (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
//         display: none;
//     }
// `;

export default MyPositionAction;
