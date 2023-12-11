import { ReactComponent as ArrowDown } from 'assets/images/arrow-down-blue.svg';
import ApprovalModal from 'components/ApprovalModal';
import Button from 'components/Button';
import InlineLoader from 'components/InlineLoader';
import NetworkSwitch from 'components/NetworkSwitch';
import {
    getDefaultToastContent,
    getErrorToastOptions,
    getLoadingToastOptions,
    getSuccessToastOptions,
} from 'components/ToastMessage/ToastMessage';
import Tooltip from 'components/Tooltip';
import NumericInput from 'components/fields/NumericInput';
import { generalConfig } from 'config/general';
import { THALES_CURRENCY } from 'constants/currency';
import { BRIDGE_SUPPORTED_NETWORKS } from 'constants/network';
import { BRIDGE_SLIPPAGE_PERCENTAGE } from 'constants/options';
import { EMPTY_VALUE } from 'constants/placeholder';
import { Network } from 'enums/network';
import { ScreenSizeBreakpoint } from 'enums/ui';
import { BigNumber, ethers } from 'ethers';
import useDebouncedEffect from 'hooks/useDebouncedEffect';
import { InputContainer } from 'pages/Token/components/styled-components';
import useCelerBridgeDataQuery from 'queries/token/useCelerBridgeDataQuery';
import useThalesBalanceQuery from 'queries/walletBalances/useThalesBalanceQuery';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import OutsideClickHandler from 'react-outside-click-handler';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { getIsAppReady } from 'redux/modules/app';
import {
    getIsWalletConnected,
    getNetworkId,
    getWalletAddress,
    getWalletConnectModalVisibility,
    setWalletConnectModalVisibility,
} from 'redux/modules/wallet';
import { RootState } from 'redux/rootReducer';
import styled from 'styled-components';
import {
    FlexDiv,
    FlexDivCentered,
    FlexDivColumn,
    FlexDivColumnCentered,
    FlexDivRow,
    FlexDivSpaceBetween,
    FlexDivStart,
} from 'styles/common';
import { bigNumberFormatter, formatCurrencyWithKey, truncToDecimals } from 'thales-utils';
import { WebClient } from 'ts-proto/gateway/GatewayServiceClientPb';
import { EstimateAmtRequest, EstimateAmtResponse } from 'ts-proto/gateway/gateway_pb';
import { SUPPORTED_NETWORK_IDS_MAP, checkAllowance } from 'utils/network';
import { refetchCelerBridgeHistory } from 'utils/queryConnector';
import snxJSConnector from 'utils/snxJSConnector';
import Slippage from '../../Trade/components/AmmTrading/components/Slippage';
import { isSlippageValid as getIsSlippageValid } from '../../Trade/components/AmmTrading/components/Slippage/Slippage';
import History from './History';
import FeeTooltip from './components/FeeTooltip';
import NetworkIcon from './components/NetworkIcon';

const Bridge: React.FC = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();

    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
    const isWalletConnected = useSelector((state: RootState) => getIsWalletConnected(state));
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state)) || '';
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const connectWalletModalVisibility = useSelector((state: RootState) => getWalletConnectModalVisibility(state));

    const [amount, setAmount] = useState<number | string>('');
    const [destNetwork, setDestNetwork] = useState<number>(Network.Arbitrum);
    const [destSupportedNetworks, setDestSupportedNetworks] = useState<number[]>(BRIDGE_SUPPORTED_NETWORKS);
    const [isAmountValid, setIsAmountValid] = useState<boolean>(true);
    const [thalesBalance, setThalesBalance] = useState<number | string>('');
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [hasAllowance, setAllowance] = useState<boolean>(false);
    const [isAllowing, setIsAllowing] = useState<boolean>(false);
    const [openApprovalModal, setOpenApprovalModal] = useState<boolean>(false);
    const [bridgeEstimation, setBridgeEstimation] = useState<EstimateAmtResponse.AsObject | undefined>(undefined);
    const [slippage, setSlippage] = useState<number>(BRIDGE_SLIPPAGE_PERCENTAGE[0]);
    const [isSlippageDropdownOpen, setIsSlippageDropdownOpen] = useState(false);
    const [bridgeError, setBridgeError] = useState<string | undefined>(undefined);
    const [isFetchingEstimation, setIsFetchingEstimation] = useState<boolean>(false);

    const isAmountEntered = Number(amount) > 0;
    const isSlippageValid = getIsSlippageValid(Number(slippage));
    const insufficientBalance = Number(thalesBalance) < Number(amount) || Number(thalesBalance) === 0;

    const isButtonDisabled =
        isSubmitting ||
        !isWalletConnected ||
        !isAmountEntered ||
        insufficientBalance ||
        !hasAllowance ||
        !!bridgeError ||
        !isSlippageValid ||
        isFetchingEstimation;

    const thalesBalanceQuery = useThalesBalanceQuery(walletAddress, networkId, {
        enabled: isAppReady && isWalletConnected,
    });

    useEffect(() => {
        const filteredDestSupportedNetworks = BRIDGE_SUPPORTED_NETWORKS.filter((network) => network !== networkId);
        setDestSupportedNetworks(filteredDestSupportedNetworks);
        if (networkId === destNetwork) {
            setDestNetwork(filteredDestSupportedNetworks[0]);
        }
    }, [networkId, destNetwork]);

    useEffect(() => {
        if (thalesBalanceQuery.isSuccess && thalesBalanceQuery.data) {
            setThalesBalance(Number(thalesBalanceQuery.data.balance));
        }
    }, [thalesBalanceQuery.isSuccess, thalesBalanceQuery.data]);

    const celerBridgeDataQuery = useCelerBridgeDataQuery(networkId, destNetwork, {
        enabled: isAppReady && isWalletConnected,
    });

    const celerBridgeData =
        celerBridgeDataQuery.isSuccess && celerBridgeDataQuery.data ? celerBridgeDataQuery.data : undefined;

    useEffect(() => {
        const { thalesTokenContract, celerBridgeContract } = snxJSConnector as any;

        if (thalesTokenContract && celerBridgeContract) {
            const thalesTokenContractWithSigner = thalesTokenContract.connect((snxJSConnector as any).signer);
            const addressToApprove = celerBridgeContract.address;

            const getAllowance = async () => {
                try {
                    const parsedAmount = ethers.utils.parseEther(Number(amount).toString());
                    const allowance = await checkAllowance(
                        parsedAmount,
                        thalesTokenContractWithSigner,
                        walletAddress,
                        addressToApprove
                    );
                    setAllowance(allowance);
                } catch (e) {
                    console.log(e);
                }
            };
            if (isWalletConnected && thalesTokenContractWithSigner.signer) {
                getAllowance();
            }
        }
    }, [walletAddress, isWalletConnected, hasAllowance, networkId, amount, isAllowing]);

    const handleAllowance = async (approveAmount: BigNumber) => {
        const { thalesTokenContract, celerBridgeContract } = snxJSConnector as any;

        if (thalesTokenContract && celerBridgeContract) {
            const id = toast.loading(getDefaultToastContent(t('common.progress')), getLoadingToastOptions());
            const thalesTokenContractWithSigner = thalesTokenContract.connect((snxJSConnector as any).signer);
            const addressToApprove = celerBridgeContract.address;

            try {
                setIsAllowing(true);
                const tx = (await thalesTokenContractWithSigner.approve(
                    addressToApprove,
                    approveAmount
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
        }
    };

    const fetchEstimation = async () => {
        setIsFetchingEstimation(true);
        let resObject;
        if (Number(amount) > 0 && Number(slippage) > 0) {
            const estimateRequest = new EstimateAmtRequest();

            estimateRequest.setSrcChainId(networkId);
            estimateRequest.setDstChainId(Number(destNetwork));
            estimateRequest.setTokenSymbol(THALES_CURRENCY);
            estimateRequest.setSlippageTolerance(Math.floor(slippage * 1000));
            estimateRequest.setAmt(ethers.utils.parseEther(amount.toString()).toString());

            const client = new WebClient(generalConfig.CELER_BRIDGE_URL, null, null);
            const res: EstimateAmtResponse = await client.estimateAmt(estimateRequest, null);

            resObject = res.toObject();
            setBridgeEstimation(resObject);
            if (resObject.err) {
                setBridgeError(resObject.err.msg);
            } else {
                if (Number(resObject.estimatedReceiveAmt) < 0) {
                    setBridgeError(t('thales-token.bridge.low-amount-error'));
                } else {
                    setBridgeError(undefined);
                }
            }
        } else {
            setBridgeEstimation(undefined);
            setBridgeError(undefined);
        }
        setIsFetchingEstimation(false);
        return resObject;
    };

    useDebouncedEffect(() => {
        fetchEstimation();
    }, [amount, slippage, networkId, destNetwork, walletAddress]);

    const handleSubmit = async () => {
        const { thalesTokenContract, celerBridgeContract } = snxJSConnector as any;

        const estimation = await fetchEstimation();
        if (thalesTokenContract && celerBridgeContract && estimation) {
            setIsSubmitting(true);
            const id = toast.loading(getDefaultToastContent(t('common.progress')), getLoadingToastOptions());

            try {
                const celerBridgeContractWithSigner = celerBridgeContract.connect((snxJSConnector as any).signer);

                const parsedAmount = ethers.utils.parseEther(amount.toString()).toString();
                const tx = await celerBridgeContractWithSigner.send(
                    walletAddress,
                    thalesTokenContract.address,
                    parsedAmount,
                    destNetwork,
                    new Date().getTime(),
                    estimation.maxSlippage
                );
                const txResult = await tx.wait();

                if (txResult && txResult.transactionHash) {
                    toast.update(id, getSuccessToastOptions(t('thales-token.bridge.button.confirmation-message'), id));
                    refetchCelerBridgeHistory(walletAddress);
                    setIsSubmitting(false);
                    setAmount('');
                }
            } catch (e) {
                console.log(e);
                toast.update(id, getErrorToastOptions(t('common.errors.unknown-error-try-again'), id));
                setIsSubmitting(false);
            }
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
        if (bridgeError) {
            return <Button disabled={true}>{t(`thales-token.bridge.button.label`)}</Button>;
        }
        if (insufficientBalance) {
            return <Button disabled={true}>{t(`common.errors.insufficient-balance`)}</Button>;
        }
        if (!isAmountEntered) {
            return <Button disabled={true}>{t(`common.errors.enter-amount`)}</Button>;
        }
        if (!isSlippageValid) {
            return <Button disabled={true}>{t(`common.errors.enter-slippage`)}</Button>;
        }
        if (!hasAllowance) {
            return (
                <Button disabled={isAllowing} onClick={() => setOpenApprovalModal(true)}>
                    {!isAllowing
                        ? t('common.enable-wallet-access.approve-label', { currencyKey: THALES_CURRENCY })
                        : t('common.enable-wallet-access.approve-progress-label', {
                              currencyKey: THALES_CURRENCY,
                          })}
                </Button>
            );
        }
        return (
            <Button disabled={isButtonDisabled} onClick={handleSubmit}>
                {!isSubmitting ? t('thales-token.bridge.button.label') : t('thales-token.bridge.button.progress-label')}
            </Button>
        );
    };

    const onMaxClick = () => {
        setAmount(truncToDecimals(thalesBalance, 8));
    };

    useEffect(() => {
        setIsAmountValid(Number(amount) === 0 || (Number(amount) > 0 && Number(amount) <= Number(thalesBalance)));
    }, [amount, thalesBalance]);

    const getEstimationData = (value: any, isValidValue: boolean, isLoading?: boolean) => (
        <EstimationData>
            {isLoading ? <InlineLoader size={12} thickness={6} /> : isValidValue ? value : EMPTY_VALUE}
        </EstimationData>
    );

    const bridgeRate = bridgeEstimation && bridgeEstimation.bridgeRate ? bridgeEstimation.bridgeRate : 0;
    const estimatedReceiveAmt =
        bridgeEstimation && Number(bridgeEstimation.estimatedReceiveAmt) > 0
            ? bigNumberFormatter(bridgeEstimation.estimatedReceiveAmt)
            : 0;
    const baseFee = bridgeEstimation && bridgeEstimation.baseFee ? bigNumberFormatter(bridgeEstimation.baseFee) : 0;
    const protocolFee = bridgeEstimation && bridgeEstimation.percFee ? bigNumberFormatter(bridgeEstimation.percFee) : 0;
    const totalFee = baseFee + protocolFee;
    const minimumReceivedAmt =
        bridgeEstimation && Number(bridgeEstimation.estimatedReceiveAmt) > 0 && bridgeEstimation.bridgeRate
            ? bigNumberFormatter(bridgeEstimation.estimatedReceiveAmt) -
              (Number(amount) * bridgeEstimation.bridgeRate * slippage) / 100
            : 0;

    return (
        <GridWrapper>
            <Wrapper>
                <Container>
                    <Header>{t('thales-token.bridge.header')}</Header>
                    <InfoSection>{t('thales-token.bridge.info')}</InfoSection>
                    <FlexDivSpaceBetween>
                        <NetworkSwitchConatiner>
                            <NetworkSwitchLabel>{t('thales-token.bridge.from-label')}:</NetworkSwitchLabel>
                            <NetworkSwitchWrapper>
                                <NetworkSwitch
                                    supportedNetworks={BRIDGE_SUPPORTED_NETWORKS}
                                    forceNetworkSwitch={true}
                                />
                            </NetworkSwitchWrapper>
                        </NetworkSwitchConatiner>
                        <SlippageContainer>
                            <OutsideClickHandler
                                onOutsideClick={() => isSlippageDropdownOpen && setIsSlippageDropdownOpen(false)}
                            >
                                <DetailsIcon
                                    className="icon icon--gear"
                                    onClick={() => setIsSlippageDropdownOpen(!isSlippageDropdownOpen)}
                                />
                                {isSlippageDropdownOpen && (
                                    <SlippageDropDown>
                                        <Slippage
                                            fixed={BRIDGE_SLIPPAGE_PERCENTAGE}
                                            defaultValue={slippage}
                                            onChangeHandler={setSlippage}
                                            maxValue={10}
                                            tooltip={t('thales-token.bridge.slippage-tooltip')}
                                        />
                                    </SlippageDropDown>
                                )}
                            </OutsideClickHandler>
                        </SlippageContainer>
                    </FlexDivSpaceBetween>
                    <InputContainer mediaMarginBottom={10}>
                        <NumericInput
                            value={amount}
                            onChange={(_, value) => setAmount(value)}
                            disabled={isSubmitting}
                            currencyLabel={THALES_CURRENCY}
                            placeholder={t('common.enter-amount')}
                            label={t('thales-token.bridge.send-label')}
                            onMaxButton={onMaxClick}
                            showValidation={!isAmountValid || !!bridgeError}
                            validationMessage={
                                bridgeError ||
                                t(`common.errors.insufficient-balance-wallet`, {
                                    currencyKey: THALES_CURRENCY,
                                })
                            }
                            balance={
                                isWalletConnected
                                    ? `${t('common.balance')}: ${formatCurrencyWithKey(THALES_CURRENCY, thalesBalance)}`
                                    : undefined
                            }
                            isBalanceLoading={thalesBalanceQuery.isLoading}
                        />
                    </InputContainer>
                    <ArrowContainer>
                        <ArrowDown />
                    </ArrowContainer>
                    <NetworkSwitchConatiner>
                        <NetworkSwitchLabel>{t('thales-token.bridge.to-label')}:</NetworkSwitchLabel>
                        <NetworkSwitchWrapper>
                            <NetworkSwitch
                                selectedNetworkId={destNetwork}
                                setSelectedNetworkId={setDestNetwork}
                                supportedNetworks={destSupportedNetworks}
                                forceNetworkSwitch={true}
                            />
                        </NetworkSwitchWrapper>
                    </NetworkSwitchConatiner>
                    <InputContainer mediaMarginBottom={10}>
                        <NumericInput
                            value={isFetchingEstimation ? 0 : estimatedReceiveAmt}
                            onChange={() => {}}
                            disabled={true}
                            currencyLabel={THALES_CURRENCY}
                            label={t('thales-token.bridge.estimated-receive-label')}
                            tooltip={t('thales-token.bridge.estimated-receive-tooltip')}
                        />
                    </InputContainer>
                    <EstimationContainer>
                        <EstimationRow>
                            <EstimationDataLabel>{t('thales-token.bridge.bridge-rate-label')}</EstimationDataLabel>
                            {getEstimationData(
                                <FlexDivRow>
                                    <span>{`1 ${THALES_CURRENCY} on `}</span>
                                    <NetworkIcon networkId={networkId} size={14} margin="1px 4px 0px 4px" />
                                    <span>{` ≈ ${bridgeRate} ${THALES_CURRENCY} on `}</span>
                                    <NetworkIcon networkId={destNetwork} size={14} margin="1px 0px 0px 4px" />
                                </FlexDivRow>,
                                bridgeRate > 0,
                                isFetchingEstimation
                            )}
                        </EstimationRow>
                        <EstimationRow>
                            <EstimationDataLabel>
                                {t('thales-token.bridge.fee-label')}
                                <Tooltip
                                    overlay={<FeeTooltip baseFee={baseFee} protocolFee={protocolFee} />}
                                    iconFontSize={12}
                                />
                            </EstimationDataLabel>
                            {getEstimationData(
                                formatCurrencyWithKey(THALES_CURRENCY, totalFee),
                                totalFee > 0,
                                isFetchingEstimation
                            )}
                        </EstimationRow>
                        <EstimationRow>
                            <EstimationDataLabel>
                                {t('thales-token.bridge.minimum-received-label')}
                                <Tooltip
                                    overlay={t('thales-token.bridge.minimum-received-tooltip', {
                                        minimum:
                                            minimumReceivedAmt > 0
                                                ? formatCurrencyWithKey(THALES_CURRENCY, minimumReceivedAmt)
                                                : '-',
                                        network: SUPPORTED_NETWORK_IDS_MAP[destNetwork].name,
                                    })}
                                    iconFontSize={12}
                                />
                            </EstimationDataLabel>
                            {getEstimationData(
                                formatCurrencyWithKey(THALES_CURRENCY, minimumReceivedAmt),
                                minimumReceivedAmt > 0,
                                isFetchingEstimation
                            )}
                        </EstimationRow>
                        <EstimationRow>
                            <EstimationDataLabel>
                                {t('thales-token.bridge.estimated-time-of-arrival-label')}
                            </EstimationDataLabel>
                            {getEstimationData(
                                `${celerBridgeData?.transferLatencyInMinutes} ${t('common.time-remaining.minutes')}`,
                                !!celerBridgeData,
                                celerBridgeDataQuery.isLoading
                            )}
                        </EstimationRow>
                    </EstimationContainer>
                    <SubmitButtonContainer>{getSubmitButton()}</SubmitButtonContainer>
                    {openApprovalModal && (
                        <ApprovalModal
                            defaultAmount={amount}
                            tokenSymbol={THALES_CURRENCY}
                            isNonStable={true}
                            isAllowing={isAllowing}
                            onSubmit={handleAllowance}
                            onClose={() => setOpenApprovalModal(false)}
                        />
                    )}
                </Container>
            </Wrapper>
            <History />
        </GridWrapper>
    );
};

const GridWrapper = styled(FlexDivColumnCentered)`
    align-items: center;
`;

const Wrapper = styled(FlexDivColumnCentered)`
    background: ${(props) => props.theme.borderColor.secondary};
    padding: 1px;
    border-radius: 15px;
    margin: 40px 10px 40px 10px;
    min-width: 600px;
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        margin: 10px 0px;
        min-width: 200px;
    }
`;

const Container = styled(FlexDivColumn)`
    background: ${(props) => props.theme.background.primary};
    border-radius: 15px;
    padding: 30px 60px 40px 60px;
    max-width: 600px;
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        padding: 30px 20px 40px 20px;
    }
`;

const Header = styled(FlexDiv)`
    font-weight: 600;
    font-size: 20px;
    line-height: 32px;
    letter-spacing: 0.5px;
    color: ${(props) => props.theme.textColor.primary};
`;

const InfoSection = styled.span`
    color: ${(props) => props.theme.textColor.primary};
    margin: 30px 0;
    font-size: 15px;
    margin-bottom: 20px;
    text-align: justify;
`;

const NetworkSwitchConatiner = styled(FlexDivStart)`
    margin-top: 10px;
    margin-bottom: 15px;
`;

const NetworkSwitchLabel = styled(FlexDivStart)`
    color: ${(props) => props.theme.textColor.primary};
    font-size: 15px;
    text-transform: uppercase;
    min-width: 50px;
    align-items: center;
`;

const NetworkSwitchWrapper = styled(FlexDivCentered)`
    border: 1px solid ${(props) => props.theme.borderColor.secondary};
    border-radius: 8px;
`;

const ArrowContainer = styled(FlexDivCentered)`
    margin-bottom: 15px;
    margin-top: -5px;
    @media (max-width: 1192px) {
        margin-bottom: 5px;
    }
`;

const EstimationContainer = styled(FlexDivColumnCentered)`
    color: ${(props) => props.theme.textColor.primary};
    font-size: 13px;
    line-height: 18px;
`;

const EstimationRow = styled(FlexDivSpaceBetween)``;

const EstimationDataLabel = styled(FlexDiv)``;

const EstimationData = styled(FlexDiv)`
    font-weight: 700;
`;

const SubmitButtonContainer = styled(FlexDivColumnCentered)`
    margin-top: 40px;
    align-items: center;
`;

const SlippageContainer = styled(FlexDivCentered)`
    position: relative;
`;

const SlippageDropDown = styled(FlexDivCentered)`
    z-index: 9999;
    position: absolute;
    top: 30px;
    right: 0;
    border-radius: 8px;
    border: 2px solid ${(props) => props.theme.borderColor.primary};
    background: ${(props) => props.theme.background.primary};
    width: 280px;
    max-width: 280px;
    padding: 10px 15px;
    user-select: none;
`;

const DetailsIcon = styled.i`
    font-size: 20px;
    color: ${(props) => props.theme.textColor.secondary};
    cursor: pointer;
    margin-bottom: 5px;
`;

export default Bridge;
