import Button from 'components/Button';
import {
    COLLATERALS,
    MIN_SCEW_IMPACT,
    POSITIONS,
    POSITIONS_TO_SIDE_MAP,
    SLIPPAGE_PERCENTAGE,
    TradeSide,
    getMaxGasLimitForNetwork,
} from 'constants/options';
import { BigNumber, ethers } from 'ethers';
import useDebouncedEffect from 'hooks/useDebouncedEffect';
import useInterval from 'hooks/useInterval';
import Input from 'pages/AMMTrading/components/AMM/components/Input';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { getNetworkId, getSelectedCollateral, getWalletAddress } from 'redux/modules/wallet';
import { RootState } from 'redux/rootReducer';
import styled from 'styled-components';
import { FlexDivCentered, FlexDivColumnCentered, FlexDivRow } from 'theme/common';
import { getEstimatedGasFees, getQuoteFromAMM, preparePopulateTransactionForAMM } from 'utils/amm';
import { getStableCoinForNetwork } from 'utils/currency';
import { bigNumberFormatter, stableCoinFormatter } from 'utils/formatters/ethers';
import { formatCurrency, formatCurrencyWithKey, formatPercentage } from 'utils/formatters/number';
import {
    getIsArbitrum,
    getIsBSC,
    getIsMultiCollateralSupported,
    getIsOVM,
    getIsPolygon,
    getL1FeeInWei,
} from 'utils/network';
import { getReferralWallet } from 'utils/referral';
import snxJSConnector from 'utils/snxJSConnector';

type TradingProps = {
    currencyKey: string;
    maturityDate: Date;
    positionType: POSITIONS;
    strikePrice: number;
    marketAddress: string;
    positionAddress: string; // long or short address
};

const Trading: React.FC<TradingProps> = ({
    currencyKey,
    maturityDate,
    positionType,
    strikePrice,
    marketAddress,
    positionAddress,
}) => {
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state)) || '';
    const userSelectedCollateral = useSelector((state: RootState) => getSelectedCollateral(state));

    const [tradeSide, _setTradeSide] = useState(TradeSide.BUY);
    const [amount, setAmount] = useState<number | string>(''); // position amount
    const [price, setPrice] = useState<number | string>(''); // position price
    const [basePrice, _setBasePrice] = useState<number | string>('');
    const [total, setTotal] = useState<number | string>(''); // total to pay
    const [potentialReturn, setPotentialReturn] = useState<number | string>(''); // profit
    const [isPotentialReturnAvailable, setIsPotentialReturnAvailable] = useState<boolean>(true); // profit available
    const [priceImpact, setPriceImpact] = useState<number | string>(''); // discount if negative otherwise skew
    const [basePriceImpact, _setBasePriceImpact] = useState<number | string>(''); // discount if negative otherwise skew
    const [_gasLimit, setGasLimit] = useState<number | null>(null);
    const [slippage, _setSlippage] = useState<number | string>(SLIPPAGE_PERCENTAGE[2]);
    const [_l1Fee, setL1Fee] = useState<number | null>(null);
    const [hasAllowance, _setAllowance] = useState(false);

    const [isSlippageValid, setIsSlippageValid] = useState(true);
    const [isGettingQuote, setIsGettingQuote] = useState(false);

    const isOVM = getIsOVM(networkId);
    const isPolygon = getIsPolygon(networkId);
    const isBSC = getIsBSC(networkId);
    const isArbitrum = getIsArbitrum(networkId);

    const isAmountEntered = Number(amount) > 0;
    const isBuy = tradeSide === TradeSide.BUY;

    const [selectedStableIndex, _setStableIndex] = useState<number>(userSelectedCollateral);
    const isMultiCollateralSupported = getIsMultiCollateralSupported(networkId);
    const isNonDefaultStable = isBuy && selectedStableIndex !== 0 && isMultiCollateralSupported;

    const collateralAddress = isNonDefaultStable
        ? snxJSConnector.multipleCollateral
            ? snxJSConnector.multipleCollateral[selectedStableIndex]?.address
            : undefined
        : isBuy
        ? snxJSConnector.collateral?.address
        : positionAddress;

    const referral =
        walletAddress && getReferralWallet()?.toLowerCase() !== walletAddress?.toLowerCase()
            ? getReferralWallet()
            : null;

    const resetData = () => {
        setPrice('');
        setTotal('');
        setPriceImpact('');
        setPotentialReturn('');
        setGasLimit(null);
        setIsPotentialReturnAvailable(isBuy);
    };

    const fetchGasLimit = async (
        marketAddress: string,
        side: any,
        parsedAmount: any,
        parsedTotal: any,
        parsedSlippage: any
    ) => {
        const fetchL1Fee = async (
            ammContractWithSigner: any,
            marketAddress: string,
            side: any,
            parsedAmount: any,
            parsedTotal: any,
            parsedSlippage: any
        ) => {
            const txRequest: any = await preparePopulateTransactionForAMM(
                isNonDefaultStable,
                isBuy,
                ammContractWithSigner,
                marketAddress,
                side,
                parsedAmount,
                parsedTotal,
                parsedSlippage,
                collateralAddress,
                referral
            );

            return getL1FeeInWei(txRequest, snxJSConnector);
        };

        try {
            const { ammContract, signer } = snxJSConnector as any;
            const ammContractWithSigner = ammContract.connect(signer);

            if (isOVM) {
                const l1FeeInWei = await fetchL1Fee(
                    ammContractWithSigner,
                    marketAddress,
                    side,
                    parsedAmount,
                    parsedTotal,
                    parsedSlippage
                );
                setL1Fee(l1FeeInWei ? l1FeeInWei : 0);

                const maxGasLimitForNetwork = getMaxGasLimitForNetwork(networkId);
                setGasLimit(maxGasLimitForNetwork);

                return maxGasLimitForNetwork;
            } else if (isBSC || isPolygon || isArbitrum) {
                const gasLimit = await getEstimatedGasFees(
                    isNonDefaultStable,
                    isBuy,
                    ammContractWithSigner,
                    marketAddress,
                    side,
                    parsedAmount,
                    parsedTotal,
                    parsedSlippage,
                    collateralAddress,
                    referral
                );

                const safeGasLimit = Math.round(Number(+gasLimit + 0.1 * +gasLimit));
                setGasLimit(safeGasLimit);

                return safeGasLimit;
            } else {
                const maxGasLimitForNetwork = getMaxGasLimitForNetwork(networkId);
                setGasLimit(maxGasLimitForNetwork);

                return maxGasLimitForNetwork;
            }
        } catch (e) {
            console.log(e);
            setGasLimit(null);
            return null;
        }
    };

    const fetchAmmPriceData = async (isRefresh: boolean, isSubmit = false) => {
        let priceChanged = false;
        let latestGasLimit = null;
        if (!isRefresh && !isSubmit) {
            setIsGettingQuote(true);
        }
        if (isAmountEntered) {
            try {
                const { ammContract, signer } = snxJSConnector as any;
                const ammContractWithSigner = ammContract.connect(signer);

                const parsedAmount = ethers.utils.parseEther(amount.toString());
                const promises = getQuoteFromAMM(
                    isNonDefaultStable,
                    isBuy,
                    ammContractWithSigner,
                    parsedAmount,
                    marketAddress,
                    POSITIONS_TO_SIDE_MAP[positionType],
                    collateralAddress
                );

                const [ammQuotes, ammPriceImpact]: Array<BigNumber> = await Promise.all(promises);
                const ammQuote = isNonDefaultStable ? (ammQuotes as any)[0] : ammQuotes;

                const ammPrice =
                    stableCoinFormatter(
                        ammQuote,
                        networkId,
                        isNonDefaultStable ? COLLATERALS[selectedStableIndex] : undefined
                    ) / Number(amount);

                setPrice(ammPrice);
                setTotal(
                    stableCoinFormatter(
                        ammQuote,
                        networkId,
                        isNonDefaultStable ? COLLATERALS[selectedStableIndex] : undefined
                    )
                );
                setPriceImpact(ammPrice > 0 ? bigNumberFormatter(ammPriceImpact) - MIN_SCEW_IMPACT : 0);
                setPotentialReturn(ammPrice > 0 && isBuy ? 1 / ammPrice - 1 : 0);
                setIsPotentialReturnAvailable(isBuy);

                const parsedSlippage = ethers.utils.parseEther((Number(slippage) / 100).toString());
                const isQuoteChanged =
                    ammPrice !== price ||
                    total !==
                        stableCoinFormatter(
                            ammQuote,
                            networkId,
                            isNonDefaultStable ? COLLATERALS[selectedStableIndex] : undefined
                        );

                if (isSubmit) {
                    latestGasLimit = await fetchGasLimit(
                        marketAddress,
                        POSITIONS_TO_SIDE_MAP[positionType],
                        parsedAmount,
                        ammQuote,
                        parsedSlippage
                    );
                } else {
                    if (
                        ammPrice > 0 &&
                        stableCoinFormatter(
                            ammQuote,
                            networkId,
                            isNonDefaultStable ? COLLATERALS[selectedStableIndex] : undefined
                        ) > 0 &&
                        isSlippageValid &&
                        isQuoteChanged &&
                        hasAllowance
                    ) {
                        fetchGasLimit(
                            marketAddress,
                            POSITIONS_TO_SIDE_MAP[positionType],
                            parsedAmount,
                            ammQuote,
                            parsedSlippage
                        );
                    }
                }
                priceChanged = ammPrice !== price;
            } catch (e) {
                console.log(e);
                resetData();
                priceChanged = true;
            }
        } else {
            resetData();
        }
        if (!isRefresh && !isSubmit) {
            setIsGettingQuote(false);
        }
        return { priceChanged, latestGasLimit };
    };

    useEffect(() => {
        setIsSlippageValid(Number(slippage) > 0 && Number(slippage) <= 100);
    }, [slippage]);

    useDebouncedEffect(() => {
        fetchAmmPriceData(false);
    }, [amount, isBuy, walletAddress, isAmountEntered, selectedStableIndex]);

    useInterval(async () => {
        fetchAmmPriceData(true);
    }, 5000);

    const getSubmitButton = () => {
        return (
            <Button width="320px" height="34px" active={true}>
                buy
            </Button>
        );
    };

    const potentialProfitFormatted = isGettingQuote
        ? '...'
        : Number(price) > 0
        ? isPotentialReturnAvailable
            ? `${formatCurrencyWithKey(getStableCoinForNetwork(networkId), Number(potentialReturn) * Number(total))}`
            : '-'
        : '-';

    return (
        <Container>
            <MarketInfo>
                <FlexDivColumnCentered>
                    <span>{`${currencyKey} ${positionType} > ${strikePrice}`}</span>
                    <span>{`End Date ${maturityDate.toLocaleDateString()}`}</span>
                </FlexDivColumnCentered>
                <FlexDivColumnCentered>
                    <span>{`Price per position ${
                        isGettingQuote
                            ? '...'
                            : Number(price) > 0 || Number(basePrice) > 0
                            ? formatCurrency(Number(price) > 0 ? price : basePrice, 4)
                            : '-'
                    }`}</span>
                    <span>{`Bonus per position ${
                        isGettingQuote
                            ? '-'
                            : Number(price) > 0 || Number(basePrice) > 0
                            ? formatPercentage(Number(price) > 0 ? -priceImpact : basePriceImpact)
                            : '-'
                    }`}</span>
                </FlexDivColumnCentered>
            </MarketInfo>
            <Input
                value={amount}
                valueType={'number'}
                subValue={positionType}
                valueChange={(value) => setAmount(value)}
                container={{ width: '320px', height: '70px' }}
            />
            <Finalize>
                <Column>
                    <FlexDivColumnCentered>
                        <span style={{ textAlign: 'center' }}>{`If bitcoin stays ABOVE ${strikePrice}`}</span>
                        <span
                            style={{ textAlign: 'center' }}
                        >{`@${maturityDate.toLocaleDateString()} you will earn ${potentialProfitFormatted}`}</span>
                    </FlexDivColumnCentered>
                    {getSubmitButton()}
                </Column>
            </Finalize>
        </Container>
    );
};

const Container = styled(FlexDivRow)`
    min-width: 980px;
    height: 70px;
`;

const MarketInfo = styled(FlexDivCentered)`
    width: 320px;
    background: #2b3139;
    border-radius: 8px;
    padding: 10px;
    color: #ffffff;
    font-size: 13px;
`;

const Finalize = styled(FlexDivCentered)`
    width: 320px;
    color: #ffffff;
    font-size: 13px;
`;

const Column = styled.div`
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
`;

export default Trading;
