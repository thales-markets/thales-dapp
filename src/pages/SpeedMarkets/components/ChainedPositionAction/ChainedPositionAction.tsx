import { EvmPriceServiceConnection } from '@pythnetwork/pyth-evm-js';
import PythInterfaceAbi from '@pythnetwork/pyth-sdk-solidity/abis/IPyth.json';
import ApprovalModal from 'components/ApprovalModal';
import Button from 'components/Button';
import CollateralSelector from 'components/CollateralSelector';
import TimeRemaining from 'components/TimeRemaining';
import {
    getDefaultToastContent,
    getErrorToastOptions,
    getLoadingToastOptions,
    getSuccessToastOptions,
} from 'components/ToastMessage/ToastMessage';
import Tooltip from 'components/Tooltip';
import { USD_SIGN } from 'constants/currency';
import { ZERO_ADDRESS } from 'constants/network';
import { ONE_HUNDRED_AND_THREE_PERCENT } from 'constants/options';
import { CONNECTION_TIMEOUT_MS, PYTH_CONTRACT_ADDRESS } from 'constants/pyth';
import { differenceInSeconds, millisecondsToSeconds, secondsToMilliseconds } from 'date-fns';
import { BigNumber, ethers } from 'ethers';
import {
    CollateralSelectorContainer,
    InLabel,
    Label,
    ResultsContainer,
    Value,
    getDefaultButtonProps,
} from 'pages/Profile/components/MyPositionAction/MyPositionAction';
import { CSSProperties, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { getIsMobile } from 'redux/modules/ui';
import { getIsWalletConnected, getNetworkId, getSelectedCollateralIndex, getWalletAddress } from 'redux/modules/wallet';
import { RootState } from 'types/ui';
import { useTheme } from 'styled-components';
import { FlexDivCentered } from 'styles/common';
import { coinParser, formatCurrencyWithSign, roundNumberToDecimals } from 'thales-utils';
import { ChainedSpeedMarket } from 'types/options';
import { ThemeInterface } from 'types/ui';
import erc20Contract from 'utils/contracts/erc20Contract';
import { getCollateral, getCollaterals, getDefaultCollateral } from 'utils/currency';
import { checkAllowance, getIsMultiCollateralSupported } from 'utils/network';
import { getPriceId, getPriceServiceEndpoint, priceParser } from 'utils/pyth';
import {
    refetchActiveSpeedMarkets,
    refetchUserResolvedSpeedMarkets,
    refetchUserSpeedMarkets,
} from 'utils/queryConnector';
import snxJSConnector from 'utils/snxJSConnector';
import { getUserLostAtSideIndex } from 'utils/speedAmm';
import { delay } from 'utils/timer';

type ChainedPositionActionProps = {
    position: ChainedSpeedMarket;
    maxPriceDelayForResolvingSec?: number;
    isOverview?: boolean;
    isAdmin?: boolean;
    isSubmittingBatch?: boolean;
    isProfileAction?: boolean;
    isMultipleContainerRows?: boolean;
};

const ChainedPositionAction: React.FC<ChainedPositionActionProps> = ({
    position,
    maxPriceDelayForResolvingSec,
    isOverview,
    isAdmin,
    isSubmittingBatch,
    isProfileAction,
    isMultipleContainerRows,
}) => {
    const { t } = useTranslation();
    const theme: ThemeInterface = useTheme();

    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const isWalletConnected = useSelector((state: RootState) => getIsWalletConnected(state));
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state)) || '';
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
        isSubmittingBatch !== undefined && setIsSubmitting(isSubmittingBatch);
    }, [isSubmittingBatch]);

    useEffect(() => {
        if (!position.claimable || isDefaultCollateral || isOverview) {
            return;
        }

        const { chainedSpeedMarketsAMMContract, collateral } = snxJSConnector;
        const erc20Instance = new ethers.Contract(
            collateral?.address || '',
            erc20Contract.abi,
            snxJSConnector.provider
        );
        const addressToApprove = chainedSpeedMarketsAMMContract?.address || '';

        const getAllowance = async () => {
            try {
                const parsedAmount = coinParser(position.amount.toString(), networkId);

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
        position.amount,
        position.isOpen,
        position.claimable,
        networkId,
        walletAddress,
        isWalletConnected,
        hasAllowance,
        isAllowing,
        isDefaultCollateral,
        isOverview,
        selectedCollateral,
    ]);

    const handleAllowance = async (approveAmount: BigNumber) => {
        const { chainedSpeedMarketsAMMContract, collateral } = snxJSConnector;
        const erc20Instance = new ethers.Contract(collateral?.address || '', erc20Contract.abi, snxJSConnector.signer);
        const addressToApprove = chainedSpeedMarketsAMMContract?.address || '';

        const id = toast.loading(getDefaultToastContent(t('common.progress')), getLoadingToastOptions());
        try {
            setIsAllowing(true);

            const tx = (await erc20Instance.approve(addressToApprove, approveAmount)) as ethers.ContractTransaction;
            setOpenApprovalModal(false);
            const txResult = await tx.wait();
            if (txResult && txResult.transactionHash) {
                toast.update(id, getSuccessToastOptions(t(`common.transaction.successful`), id));
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

    const handleResolve = async () => {
        const priceConnection = new EvmPriceServiceConnection(getPriceServiceEndpoint(networkId), {
            timeout: CONNECTION_TIMEOUT_MS,
        });

        const { chainedSpeedMarketsAMMContract, signer } = snxJSConnector as any;
        if (chainedSpeedMarketsAMMContract) {
            setIsSubmitting(true);
            const id = toast.loading(getDefaultToastContent(t('common.progress')), getLoadingToastOptions());

            const chainedSpeedMarketsAMMContractWithSigner = chainedSpeedMarketsAMMContract.connect(signer);
            try {
                let tx: ethers.ContractTransaction;
                const fetchUntilFinalPriceEndIndex = getUserLostAtSideIndex(position) + 1;
                if (isAdmin) {
                    const manualFinalPrices: number[] = position.finalPrices
                        .slice(0, fetchUntilFinalPriceEndIndex)
                        .map((finalPrice) => Number(priceParser(finalPrice)));

                    tx = await chainedSpeedMarketsAMMContractWithSigner.resolveMarketManually(
                        position.address,
                        manualFinalPrices
                    );
                } else {
                    const pythContract = new ethers.Contract(
                        PYTH_CONTRACT_ADDRESS[networkId],
                        PythInterfaceAbi as any,
                        (snxJSConnector as any).provider
                    );

                    let promises = [];
                    const pythPriceId = getPriceId(networkId, position.currencyKey);
                    const strikeTimesToFetchPrice = position.strikeTimes.slice(0, fetchUntilFinalPriceEndIndex);
                    for (let i = 0; i < strikeTimesToFetchPrice.length; i++) {
                        promises.push(
                            priceConnection.getVaa(pythPriceId, millisecondsToSeconds(position.strikeTimes[i]))
                        );
                    }
                    const priceFeedUpdateVaas = await Promise.all(promises);

                    const priceUpdateDataArray: string[][] = [];
                    promises = [];
                    for (let i = 0; i < strikeTimesToFetchPrice.length; i++) {
                        const [priceFeedUpdateVaa, publishTime] = priceFeedUpdateVaas[i];

                        // check if price feed is not too late
                        if (
                            maxPriceDelayForResolvingSec &&
                            differenceInSeconds(secondsToMilliseconds(publishTime), position.strikeTimes[i]) >
                                maxPriceDelayForResolvingSec
                        ) {
                            await delay(800);
                            toast.update(
                                id,
                                getErrorToastOptions(t('speed-markets.user-positions.errors.price-stale'), id)
                            );
                            setIsSubmitting(false);
                            return;
                        }

                        const priceUpdateData = ['0x' + Buffer.from(priceFeedUpdateVaa, 'base64').toString('hex')];
                        priceUpdateDataArray.push(priceUpdateData);
                        promises.push(pythContract.getUpdateFee(priceUpdateData));
                    }

                    const updateFees = await Promise.all(promises);
                    const totalUpdateFee = updateFees.reduce(
                        (a: BigNumber, b: BigNumber) => a.add(b),
                        BigNumber.from(0)
                    );

                    const isEth = collateralAddress === ZERO_ADDRESS;

                    tx = isDefaultCollateral
                        ? await chainedSpeedMarketsAMMContractWithSigner.resolveMarket(
                              position.address,
                              priceUpdateDataArray,
                              {
                                  value: totalUpdateFee,
                              }
                          )
                        : await chainedSpeedMarketsAMMContractWithSigner.resolveMarketWithOfframp(
                              position.address,
                              priceUpdateDataArray,
                              collateralAddress,
                              isEth,
                              { value: totalUpdateFee }
                          );
                }

                const txResult = await tx.wait();

                if (txResult && txResult.transactionHash) {
                    toast.update(
                        id,
                        getSuccessToastOptions(t(`speed-markets.user-positions.confirmation-message`), id)
                    );
                    if (isOverview) {
                        refetchActiveSpeedMarkets(true, networkId);
                    } else {
                        refetchUserSpeedMarkets(true, networkId, walletAddress);
                        refetchUserResolvedSpeedMarkets(true, networkId, walletAddress);
                    }
                }
            } catch (e) {
                console.log(e);
                await delay(800);
                toast.update(id, getErrorToastOptions(t('common.errors.unknown-error-try-again'), id));
            }
            setIsSubmitting(false);
        }
    };

    const getResolveButton = () => {
        const additionalButtonStyle: CSSProperties = {
            minWidth: isOverview || isProfileAction ? '180px' : '152px',
            lineHeight: '100%',
            border: 'none',
        };

        return (
            <Button
                {...getDefaultButtonProps(isMobile)}
                disabled={isSubmitting || (isOverview && !position.canResolve)}
                additionalStyles={additionalButtonStyle}
                backgroundColor={!isOverview ? theme.button.textColor.quaternary : undefined}
                onClick={() =>
                    hasAllowance || isDefaultCollateral || isOverview ? handleResolve() : setOpenApprovalModal(true)
                }
            >
                {hasAllowance || isDefaultCollateral || isOverview
                    ? `${
                          isSubmitting
                              ? isOverview
                                  ? isSubmittingBatch
                                      ? t('speed-markets.overview.resolve')
                                      : t(`speed-markets.overview.resolve-progress`)
                                  : t('markets.user-positions.claim-win-progress')
                              : isOverview
                              ? isAdmin
                                  ? `${t('common.admin')} ${t('speed-markets.overview.resolve')}`
                                  : t('speed-markets.overview.resolve')
                              : t('markets.user-positions.claim-win')
                      } ${formatCurrencyWithSign(USD_SIGN, position.amount, 2)}`
                    : isAllowing
                    ? `${t('common.enable-wallet-access.approve-progress')} ${defaultCollateral}...`
                    : t('common.enable-wallet-access.approve-swap', {
                          currencyKey: selectedCollateral,
                          defaultCurrency: defaultCollateral,
                      })}{' '}
            </Button>
        );
    };

    const getButton = () => {
        if (position.isOpen) {
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
            } else if (position.canResolve) {
                return isOverview ? (
                    getResolveButton()
                ) : (
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
        } else {
            return (
                <ResultsContainer>
                    <Label>{t('common.result')}</Label>
                    <Value
                        isUpperCase
                        color={position.isUserWinner ? theme.textColor.quaternary : theme.error.textColor.primary}
                    >
                        {position.isUserWinner ? t('common.won') : t('common.loss')}
                    </Value>
                </ResultsContainer>
            );
        }
    };

    return (
        <>
            <FlexDivCentered>
                {getButton()}
                {!isOverview && isMultiCollateralSupported && position.claimable && (
                    <CollateralSelectorContainer>
                        <InLabel color={theme.button.textColor.quaternary}>{t('common.in')}</InLabel>
                        <CollateralSelector
                            collateralArray={getCollaterals(networkId, true)}
                            selectedItem={selectedCollateralIndex}
                            onChangeCollateral={() => {}}
                            disabled={isSubmitting || isAllowing}
                            additionalStyles={{
                                position: isProfileAction || !isMultipleContainerRows ? undefined : 'relative',
                                margin: '0 0 0 7px',
                                color: theme.button.textColor.quaternary,
                            }}
                            isDropDownAbove={isMobile && !isProfileAction}
                        />
                    </CollateralSelectorContainer>
                )}
            </FlexDivCentered>
            {openApprovalModal && (
                <ApprovalModal
                    // add three percent to approval amount to take into account price changes
                    defaultAmount={roundNumberToDecimals(ONE_HUNDRED_AND_THREE_PERCENT * position.amount)}
                    tokenSymbol={defaultCollateral}
                    isNonStable={false}
                    isAllowing={isAllowing}
                    onSubmit={handleAllowance}
                    onClose={() => setOpenApprovalModal(false)}
                />
            )}
        </>
    );
};

export default ChainedPositionAction;
