import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { ReactComponent as WalletIcon } from 'assets/images/wallet.svg';
import { ReactComponent as BlockedIcon } from 'assets/images/blocked.svg';
import QUERY_KEYS from 'constants/queryKeys';
import { SYNTHS_MAP } from 'constants/currency';
import { EMPTY_VALUE } from 'constants/placeholder';
import { APPROVAL_EVENTS, BINARY_OPTIONS_EVENTS } from 'constants/events';
import { getCurrencyKeyBalance, getCurrencyKeyUSDBalanceBN } from 'utils/balances';
import { formatCurrencyWithKey } from 'utils/formatters/number';
import { bigNumberFormatter, getAddress } from 'utils/formatters/ethers';
import snxJSConnector from 'utils/snxJSConnector';
import TradeSide from './TradeSide';
import { ethers } from 'ethers';
import Tooltip from '@material-ui/core/Tooltip';
import { useLocalStorage } from 'hooks/useLocalStorage';
import { LOCAL_STORAGE_KEYS } from 'constants/storage';
import { RootState } from 'redux/rootReducer';
import {
    getWalletAddress,
    getCustomGasPrice,
    getGasSpeed,
    getIsWalletConnected,
    getNetworkId,
} from 'redux/modules/wallet';
import { useBOMContractContext } from 'pages/Options/Market/contexts/BOMContractContext';
import { OptionsTransaction, TradeCardPhaseProps } from 'types/options';
import { gasPriceInWei, normalizeGasLimit } from 'utils/network';
import { addOptionsPendingTransaction, updateOptionsPendingTransactionStatus } from 'redux/modules/options';
import { Button, Grid, Header, Menu, Message } from 'semantic-ui-react';
import TimeRemaining from 'pages/Options/components/TimeRemaining/TimeRemaining';
import useSynthsBalancesQuery from 'queries/walletBalances/useSynthsBalancesQuery';
import { getIsAppReady } from 'redux/modules/app';
import { SLIPPAGE_THRESHOLD } from 'constants/options';
import BidNetworkFees from '../components/BidNetworkFees';
import useEthGasPriceQuery from 'queries/network/useEthGasPriceQuery';
import queryConnector, { refetchMarketQueries } from 'utils/queryConnector';

const TIMEOUT_DELAY = 2500;

function getPriceDifference(currentPrice: number, newPrice: number) {
    return newPrice - currentPrice;
}

type BiddingPhaseCardProps = TradeCardPhaseProps;

const BiddingPhaseCard: React.FC<BiddingPhaseCardProps> = ({ optionsMarket, accountMarketInfo }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const BOMContract = useBOMContractContext();
    const isWalletConnected = useSelector((state: RootState) => getIsWalletConnected(state));
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state)) || '';
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
    const gasSpeed = useSelector((state: RootState) => getGasSpeed(state));
    const customGasPrice = useSelector((state: RootState) => getCustomGasPrice(state));
    const [side, setSide] = useState<OptionsTransaction['side']>('long');
    const [pricesAfterBidOrRefundTimer, setPricesAfterBidOrRefundTimer] = useState<number | null>(null);
    const [bidOrRefundForPriceTimer, setBidOrRefundForPriceTimer] = useState<number | null>(null);
    const [gasLimit, setGasLimit] = useState<number | null>(null);
    const [hasAllowance, setAllowance] = useState<boolean>(false);
    const [isAllowing, setIsAllowing] = useState<boolean>(false);
    const [type, setType] = useState<OptionsTransaction['type']>('bid');
    const [isBidding, setIsBidding] = useState<boolean>(false);
    const [priceShift, setPriceShift] = useState<number>(0);
    const [longSideAmount, setLongSideAmount] = useState<OptionsTransaction['amount'] | string>('');
    const [shortSideAmount, setShortSideAmount] = useState<OptionsTransaction['amount'] | string>('');
    const [longPriceAmount, setLongPriceAmount] = useState<string | number>('');
    const [shortPriceAmount, setShortPriceAmount] = useState<string | number>('');
    const [txErrorMessage, setTxErrorMessage] = useState<string | null>(null);
    const [withdrawalsDisabledTooltipDismissedMarkets, setWithdrawalsDisabledTooltipDismissedMarkets] = useLocalStorage(
        LOCAL_STORAGE_KEYS.BO_WITHDRAWALS_DISABLED_TOOLTIP_DISMISSED,
        []
    );
    const withdrawalsDisabledTooltipDismissed = withdrawalsDisabledTooltipDismissedMarkets.includes(
        optionsMarket.address
    );

    const synthsWalletBalancesQuery = useSynthsBalancesQuery(walletAddress, networkId, {
        enabled: isAppReady && isWalletConnected,
    });
    const walletBalancesMap =
        synthsWalletBalancesQuery.isSuccess && synthsWalletBalancesQuery.data
            ? { synths: synthsWalletBalancesQuery.data }
            : null;

    const ethGasPriceQuery = useEthGasPriceQuery();
    const gasPrice = useMemo(
        () =>
            customGasPrice !== null
                ? customGasPrice
                : ethGasPriceQuery.data != null
                ? ethGasPriceQuery.data[gasSpeed]
                : null,
        [customGasPrice, ethGasPriceQuery.data, gasSpeed]
    );

    const { longPrice, shortPrice, fees, isResolved, BN } = optionsMarket;
    const { bids, claimable } = accountMarketInfo;
    const longPosition = {
        bid: bids.long,
        payout: claimable.long,
    };
    const shortPosition = {
        bid: bids.short,
        payout: claimable.short,
    };
    const isRefund = type === 'refund';
    const isBid = type === 'bid';
    const isLong = side === 'long';
    const isShort = side === 'short';
    const transKey = isBid ? 'options.market.trade-card.bidding.bid' : 'options.market.trade-card.bidding.refund';
    const sUSDBalance = getCurrencyKeyBalance(walletBalancesMap, SYNTHS_MAP.sUSD) || 0;
    const sUSDBalanceBN = getCurrencyKeyUSDBalanceBN(walletBalancesMap, SYNTHS_MAP.sUSD) || 0;
    const isButtonDisabled = isBidding || !isWalletConnected || !sUSDBalance || !gasLimit;

    useEffect(() => {
        return () => {
            if (pricesAfterBidOrRefundTimer) {
                clearTimeout(pricesAfterBidOrRefundTimer);
            }
            if (bidOrRefundForPriceTimer) {
                clearTimeout(bidOrRefundForPriceTimer);
            }
        };
    }, []);

    useEffect(() => {
        BOMContract.on(BINARY_OPTIONS_EVENTS.BID, (_, account: string) => {
            refetchMarketQueries(walletAddress, BOMContract.address, optionsMarket.address);
            if (walletAddress === account) {
                setIsBidding(false);
            }
        });
        BOMContract.on(BINARY_OPTIONS_EVENTS.REFUND, (_, account: string) => {
            refetchMarketQueries(walletAddress, BOMContract.address, optionsMarket.address);
            if (walletAddress === account) {
                setIsBidding(false);
            }
        });
        return () => {
            BOMContract.removeAllListeners(BINARY_OPTIONS_EVENTS.BID);
            BOMContract.removeAllListeners(BINARY_OPTIONS_EVENTS.REFUND);
        };
    }, [walletAddress]);

    useEffect(() => {
        const fetchGasLimit = async (isShort: boolean, amount: string) => {
            try {
                const bidOrRefundAmount =
                    amount === sUSDBalance ? sUSDBalanceBN : ethers.utils.parseEther(amount.toString());
                const BOMContractWithSigner = BOMContract.connect((snxJSConnector as any).signer);
                const bidOrRefundFunction = isBid
                    ? BOMContractWithSigner.estimateGas.bid
                    : BOMContractWithSigner.estimateGas.refund;
                const gasEstimate = await bidOrRefundFunction(isShort ? 1 : 0, bidOrRefundAmount);
                setGasLimit(normalizeGasLimit(Number(gasEstimate)));
            } catch (e) {
                console.log(e);
                setGasLimit(null);
            }
        };
        if (!hasAllowance || !isWalletConnected || (!shortSideAmount && !longSideAmount)) return;
        const amount = isShort ? shortSideAmount : longSideAmount;
        fetchGasLimit(isShort, amount as string);
    }, [isWalletConnected, shortSideAmount, longSideAmount, hasAllowance]);

    useEffect(() => {
        const {
            contracts: { SynthsUSD },
        } = snxJSConnector.snxJS as any;

        const getAllowance = async () => {
            const allowance = await SynthsUSD.allowance(walletAddress, BOMContract.address);
            setAllowance(!!bigNumberFormatter(allowance));
        };

        const registerAllowanceListener = () => {
            SynthsUSD.on(APPROVAL_EVENTS.APPROVAL, (owner: string, spender: string) => {
                if (owner === walletAddress && spender === getAddress(BOMContract.address)) {
                    setAllowance(true);
                    setIsAllowing(false);
                }
            });
        };
        if (isWalletConnected) {
            getAllowance();
            registerAllowanceListener();
        }
        return () => {
            SynthsUSD.removeAllListeners(APPROVAL_EVENTS.APPROVAL);
        };
    }, [walletAddress, isWalletConnected]);

    const handleAllowance = async () => {
        if (gasPrice !== null) {
            const {
                contracts: { SynthsUSD },
            } = snxJSConnector.snxJS as any;
            try {
                setIsAllowing(true);
                const gasEstimate = await SynthsUSD.estimateGas.approve(
                    BOMContract.address,
                    ethers.constants.MaxUint256
                );
                await SynthsUSD.approve(BOMContract.address, ethers.constants.MaxUint256, {
                    gasLimit: normalizeGasLimit(Number(gasEstimate)),
                    gasPrice: gasPriceInWei(gasPrice),
                });
            } catch (e) {
                console.log(e);
                setIsAllowing(false);
            }
        }
    };

    const handleBidOrRefund = async () => {
        if (gasPrice !== null) {
            const amount = isShort ? shortSideAmount : longSideAmount;
            if (!amount) return;
            try {
                setTxErrorMessage(null);
                setIsBidding(true);
                const BOMContractWithSigner = BOMContract.connect((snxJSConnector as any).signer);
                const bidOrRefundFunction = isBid ? BOMContractWithSigner.bid : BOMContractWithSigner.refund;
                const bidOrRefundAmount =
                    amount === sUSDBalance ? sUSDBalanceBN : ethers.utils.parseEther(amount.toString());
                const tx = (await bidOrRefundFunction(isShort ? 1 : 0, bidOrRefundAmount, {
                    gasLimit,
                    gasPrice: gasPriceInWei(gasPrice),
                })) as ethers.ContractTransaction;

                dispatch(
                    addOptionsPendingTransaction({
                        optionTransaction: {
                            hash: tx.hash ?? '',
                            market: optionsMarket.address,
                            currencyKey: optionsMarket.currencyKey,
                            account: walletAddress ?? '',
                            type,
                            amount,
                            side,
                        },
                    })
                );
                const txResult = await tx.wait();
                if (txResult && txResult.transactionHash) {
                    dispatch(
                        updateOptionsPendingTransactionStatus({
                            hash: txResult.transactionHash,
                            status: 'confirmed',
                        })
                    );
                }
            } catch (e) {
                console.log(e);
                setTxErrorMessage(t('common.errors.unknown-error-try-again'));
                setIsBidding(false);
            }
        }
    };

    const handleTargetPrice = async (
        targetPrice: string,
        isShort: boolean,
        targetShort: boolean,
        isRefund: boolean
    ) => {
        const {
            binaryOptionsUtils: { bidOrRefundForPrice },
        } = snxJSConnector as any;
        const setPriceAmountFunction = isShort ? setShortPriceAmount : setLongPriceAmount;
        const setSideAmountFunction = isShort ? setShortSideAmount : setLongSideAmount;
        const bidPrice = isShort ? shortPrice : longPrice;
        try {
            if (!targetPrice || Number(targetPrice) > 1) {
                setPriceAmountFunction('');
                setPriceShift(0);
                if (bidOrRefundForPriceTimer) clearTimeout(bidOrRefundForPriceTimer);
                return;
            }
            setPriceAmountFunction(targetPrice);

            const estimatedAmountNeeded = bidOrRefundForPrice({
                bidSide: isShort ? 1 : 0,
                priceSide: targetShort ? 1 : 0,
                price: ethers.utils.parseEther(targetPrice),
                refund: isRefund,
                fee: BN.feeBN,
                refundFee: BN.refundFeeBN,
                longBids: BN.totalLongBN,
                shortBids: BN.totalShortBN,
                deposited: BN.depositedBN,
            });

            setSideAmountFunction(estimatedAmountNeeded / 1e18);
            setPriceShift(getPriceDifference(bidPrice, Number(targetPrice)));

            if (bidOrRefundForPriceTimer) {
                clearTimeout(bidOrRefundForPriceTimer);
            }

            const timeout = setTimeout(async () => {
                try {
                    const amountNeeded = await BOMContract.bidOrRefundForPrice(
                        isShort ? 1 : 0,
                        targetShort ? 1 : 0,
                        ethers.utils.parseEther(targetPrice),
                        isRefund
                    );
                    setSideAmountFunction(amountNeeded / 1e18);
                } catch (e) {
                    console.log(e);
                    setSideAmountFunction('');
                }
            }, TIMEOUT_DELAY);
            setBidOrRefundForPriceTimer(timeout as any);
        } catch (e) {
            console.log(e);
            setPriceAmountFunction('');
        }
    };

    const setBidPriceAmount = (newPrice: number) => {
        const bidPrice = isShort ? shortPrice : longPrice;
        const setBidPriceFunction = isShort ? setShortPriceAmount : setLongPriceAmount;
        setBidPriceFunction(newPrice);
        setPriceShift(getPriceDifference(bidPrice, newPrice));
    };

    const handleBidAmount = async (amount: string) => {
        isShort ? setShortSideAmount(amount) : setLongSideAmount(amount);
        const {
            binaryOptionsUtils: { pricesAfterBidOrRefund },
        } = snxJSConnector as any;
        if (!amount) {
            setLongPriceAmount('');
            setShortPriceAmount('');
            if (pricesAfterBidOrRefundTimer) {
                clearTimeout(pricesAfterBidOrRefundTimer);
            }
            return;
        }
        try {
            const bidOrRefundAmount =
                amount === sUSDBalance ? sUSDBalanceBN : ethers.utils.parseEther(amount.toString());

            const estimatedPrice = pricesAfterBidOrRefund({
                side: isShort ? 1 : 0,
                value: bidOrRefundAmount,
                refund: isRefund,
                longBids: BN.totalLongBN,
                shortBids: BN.totalShortBN,
                fee: BN.feeBN,
                refundFee: BN.refundFeeBN,
                resolved: isResolved,
                deposited: BN.depositedBN,
            });
            setBidPriceAmount(estimatedPrice[side] / 1e18);

            if (pricesAfterBidOrRefundTimer) {
                clearTimeout(pricesAfterBidOrRefundTimer);
            }
            const timeout = setTimeout(async () => {
                try {
                    const truePrice = await BOMContract.pricesAfterBidOrRefund(
                        isShort ? 1 : 0,
                        bidOrRefundAmount,
                        isRefund
                    );
                    setBidPriceAmount(truePrice[side] / 1e18);
                } catch (e) {
                    console.log(e);
                }
            }, TIMEOUT_DELAY);
            setPricesAfterBidOrRefundTimer(timeout as any);
        } catch (e) {
            console.log(e);
        }
    };

    const handleTypeChange = (selectedType: OptionsTransaction['type']) => {
        setType(selectedType);
        setLongPriceAmount('');
        setShortPriceAmount('');
        setLongSideAmount('');
        setShortSideAmount('');
        setPriceShift(0);
    };

    const handleSideChange = (selectedSide: OptionsTransaction['side']) => {
        if (side !== selectedSide) {
            setSide(selectedSide);
            setPriceShift(0);
        }
    };

    const handleDismissWithdrawalsTooltip = () => {
        setWithdrawalsDisabledTooltipDismissedMarkets([
            ...withdrawalsDisabledTooltipDismissedMarkets,
            optionsMarket.address,
        ]);
    };

    return (
        <div>
            <div>
                <Menu tabular>
                    <Menu.Item name="bid" active={isBid} onClick={() => handleTypeChange('bid')}>
                        {t('options.market.trade-card.bidding.bid.title')}
                    </Menu.Item>
                    {optionsMarket.withdrawalsEnabled ? (
                        <Menu.Item name="refund" active={isRefund} onClick={() => handleTypeChange('refund')}>
                            {t('options.market.trade-card.bidding.refund.title')}
                        </Menu.Item>
                    ) : (
                        <Tooltip
                            title={<span>{t('options.market.trade-card.bidding.refund.disabled.tooltip')}</span>}
                            placement="top"
                            arrow={true}
                        >
                            <Menu.Item
                                name="refund"
                                active={isRefund}
                                disabled={true}
                                style={{ textTransform: 'uppercase' }}
                            >
                                {t('options.market.trade-card.bidding.refund.title')} <BlockedIcon />
                            </Menu.Item>
                        </Tooltip>
                    )}
                </Menu>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 30 }}>
                <Header as="h3">{t(`${transKey}.subtitle`)}</Header>
                <span>
                    <WalletIcon />
                    {isWalletConnected ? formatCurrencyWithKey(SYNTHS_MAP.sUSD, sUSDBalance) : EMPTY_VALUE}
                </span>
            </div>
            <Grid centered>
                <Grid.Column width={8}>
                    <TradeSide
                        side="long"
                        type={type}
                        isActive={isLong}
                        amount={longSideAmount}
                        onAmountChange={(e) => handleBidAmount(e.target.value)}
                        onMaxClick={() => handleBidAmount(isRefund ? longPosition.bid : sUSDBalance)}
                        price={longPriceAmount}
                        onPriceChange={(e) => handleTargetPrice(e.target.value, false, false, isRefund)}
                        onClick={() => handleSideChange('long')}
                        transKey={transKey}
                        currentPosition={longPosition}
                        priceShift={isLong ? priceShift : 0}
                    />
                </Grid.Column>
                <Grid.Column width={8}>
                    <TradeSide
                        side="short"
                        type={type}
                        isActive={isShort}
                        amount={shortSideAmount}
                        onAmountChange={(e) => handleBidAmount(e.target.value)}
                        onMaxClick={() => handleBidAmount(isRefund ? shortPosition.bid : sUSDBalance)}
                        price={shortPriceAmount}
                        onPriceChange={(e) => handleTargetPrice(e.target.value, true, true, isRefund)}
                        onClick={() => handleSideChange('short')}
                        transKey={transKey}
                        currentPosition={shortPosition}
                        priceShift={isShort ? priceShift : 0}
                    />
                </Grid.Column>
            </Grid>
            <BidNetworkFees
                gasLimit={gasLimit}
                type={type}
                fees={fees}
                amount={isLong ? longSideAmount : shortSideAmount}
            />
            {optionsMarket.withdrawalsEnabled
                ? false
                : !withdrawalsDisabledTooltipDismissed && (
                      <Message onDismiss={handleDismissWithdrawalsTooltip}>
                          {t('options.market.trade-card.bidding.refund.disabled.first-time-tooltip')}
                      </Message>
                  )}
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: 30 }}>
                {hasAllowance ? (
                    <Tooltip
                        open={isBid && Math.abs(priceShift) > SLIPPAGE_THRESHOLD}
                        title={<span>{t(`${transKey}.confirm-button.high-slippage`)}</span>}
                        arrow={true}
                        placement="bottom"
                    >
                        <Button primary disabled={isButtonDisabled} onClick={handleBidOrRefund}>
                            {!isBidding
                                ? t(`${transKey}.confirm-button.label`)
                                : t(`${transKey}.confirm-button.progress-label`)}
                        </Button>
                    </Tooltip>
                ) : (
                    <Button primary disabled={isAllowing || !isWalletConnected} onClick={handleAllowance}>
                        {!isAllowing
                            ? t('common.enable-wallet-access.label')
                            : t('common.enable-wallet-access.progress-label')}
                    </Button>
                )}
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: 10 }}>
                {txErrorMessage && <Message content={txErrorMessage} onDismiss={() => setTxErrorMessage(null)} />}
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', textTransform: 'uppercase', marginTop: 20 }}>
                <span>
                    {t('options.market.trade-card.bidding.footer.end-label')}{' '}
                    <TimeRemaining
                        end={optionsMarket.timeRemaining}
                        onEnded={() =>
                            queryConnector.queryClient.invalidateQueries(
                                QUERY_KEYS.BinaryOptions.Market(optionsMarket.address)
                            )
                        }
                    />
                </span>
            </div>
        </div>
    );
};

export default BiddingPhaseCard;
