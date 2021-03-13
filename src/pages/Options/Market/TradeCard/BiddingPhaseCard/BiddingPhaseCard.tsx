import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { ReactComponent as WalletIcon } from 'assets/images/wallet.svg';
import { ReactComponent as BlockedIcon } from 'assets/images/blocked.svg';
import QUERY_KEYS from 'constants/queryKeys';
import { SYNTHS_MAP } from 'constants/currency';
import { EMPTY_VALUE } from 'constants/placeholder';
import { APPROVAL_EVENTS } from 'constants/events';
import { getCurrencyKeyBalance, getCurrencyKeyUSDBalanceBN } from 'utils/balances';
import { formatCurrencyWithKey, getAddress } from 'utils/formatters';
import snxJSConnector from 'utils/snxJSConnector';
import TradeSide from './TradeSide';
import { ethers } from 'ethers';
import Tooltip from '@material-ui/core/Tooltip';
import { useLocalStorage } from 'hooks/useLocalStorage';
import { LOCAL_STORAGE_KEYS } from 'constants/storage';
import { RootState } from 'redux/rootReducer';
import { getCurrentWalletAddress, getIsWalletConnected, getNetworkId } from 'redux/modules/wallet/walletDetails';
import { useBOMContractContext } from 'pages/Options/Market/contexts/BOMContractContext';
import { OptionsTransaction, TradeCardPhaseProps } from 'types/options';
import { normalizeGasLimit } from 'utils/transactions';
import { getGasInfo } from 'redux/modules/transaction';
import { GWEI_UNIT } from 'utils/network';
import {
    addOptionsPendingTransaction,
    updateOptionsPendingTransactionStatus,
} from 'redux/modules/options/pendingTransaction';
import { Button, Grid, Header, Menu, Message } from 'semantic-ui-react';
import { QueryClient } from 'react-query';
import TimeRemaining from 'pages/Options/components/TimeRemaining/TimeRemaining';
import useSynthsBalancesQuery from 'queries/walletBalances/useSynthsBalancesQuery';
import { getIsAppReady } from 'redux/modules/app';
import { SLIPPAGE_THRESHOLD } from 'constants/options';
import BidNetworkFees from '../components/BidNetworkFees';

const queryClient = new QueryClient();
const TIMEOUT_DELAY = 2500;

function getPriceDifference(currentPrice: number, newPrice: number) {
    return newPrice - currentPrice;
}

type BiddingPhaseCardProps = TradeCardPhaseProps;

const BiddingPhaseCard: React.FC<BiddingPhaseCardProps> = ({ optionsMarket, accountMarketInfo }) => {
    const dispatch = useDispatch();
    const isWalletConnected = useSelector((state: RootState) => getIsWalletConnected(state));
    const currentWalletAddress = useSelector((state: RootState) => getCurrentWalletAddress(state)) || '';
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));

    const synthsWalletBalancesQuery = useSynthsBalancesQuery(
        currentWalletAddress,
        networkId,
        isAppReady && isWalletConnected
    );

    const walletBalancesMap =
        synthsWalletBalancesQuery.isSuccess && synthsWalletBalancesQuery.data
            ? { synths: synthsWalletBalancesQuery.data }
            : null;

    const gasInfo = useSelector((state: RootState) => getGasInfo(state));
    const { longPrice, shortPrice, fees, isResolved, BN } = optionsMarket;
    const { t } = useTranslation();
    const BOMContract = useBOMContractContext();
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
    const [withdrawalsDisabledTooltipDismissedMarkets, setWithdrawalsDisabledTooltipDismissedMarkets] = useLocalStorage(
        LOCAL_STORAGE_KEYS.BO_WITHDRAWALS_DISABLED_TOOLTIP_DISMISSED,
        []
    );

    const withdrawalsDisabledTooltipDismissed = withdrawalsDisabledTooltipDismissedMarkets.includes(
        optionsMarket.address
    );

    const [side, setSide] = useState<OptionsTransaction['side']>('long');

    const [pricesAfterBidOrRefundTimer, setPricesAfterBidOrRefundTimer] = useState<number | null>(null);
    const [bidOrRefundForPriceTimer, setBidOrRefundForPriceTimer] = useState<number | null>(null);

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

    const transKey = isBid ? 'options.market.trade-card.bidding.bid' : 'options.market.trade-card.bidding.refund';

    const sUSDBalance = getCurrencyKeyBalance(walletBalancesMap, SYNTHS_MAP.sUSD) || 0;
    const sUSDBalanceBN = getCurrencyKeyUSDBalanceBN(walletBalancesMap, SYNTHS_MAP.sUSD) || 0;

    useEffect(() => {
        const fetchGasLimit = async (isShort: boolean, amount: string) => {
            const {
                utils: { parseEther },
            } = snxJSConnector as any;
            try {
                const bidOrRefundAmount = amount === sUSDBalance ? sUSDBalanceBN : parseEther(amount.toString());
                const BOMContractWithSigner = BOMContract.connect((snxJSConnector as any).signer);
                const bidOrRefundFunction = isBid
                    ? BOMContractWithSigner.estimate.bid
                    : BOMContractWithSigner.estimate.refund;
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
            snxJS: { sUSD },
        } = snxJSConnector as any;

        const getAllowance = async () => {
            const allowance = await sUSD.allowance(currentWalletAddress, BOMContract.address);
            setAllowance(!!Number(allowance));
        };

        const registerAllowanceListener = () => {
            sUSD.contract.on(APPROVAL_EVENTS.APPROVAL, (owner: string, spender: string) => {
                if (owner === currentWalletAddress && spender === getAddress(BOMContract.address)) {
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
            sUSD.contract.removeAllListeners(APPROVAL_EVENTS.APPROVAL);
        };
    }, [currentWalletAddress, isWalletConnected]);

    const handleAllowance = async () => {
        const {
            snxJS: { sUSD },
        } = snxJSConnector as any;
        try {
            setIsAllowing(true);
            const maxInt = `0x${'f'.repeat(64)}`;
            const gasEstimate = await sUSD.contract.estimate.approve(BOMContract.address, maxInt);
            await sUSD.approve(BOMContract.address, maxInt, {
                gasLimit: normalizeGasLimit(Number(gasEstimate)),
                gasPrice: gasInfo.gasPrice * GWEI_UNIT,
            });
        } catch (e) {
            console.log(e);
            setIsAllowing(false);
        }
    };

    const handleBidOrRefund = async () => {
        const {
            utils: { parseEther },
        } = snxJSConnector as any;
        const amount = isShort ? shortSideAmount : longSideAmount;
        if (!amount) return;
        try {
            setIsBidding(true);
            const BOMContractWithSigner = BOMContract.connect((snxJSConnector as any).signer);
            const bidOrRefundFunction = isBid ? BOMContractWithSigner.bid : BOMContractWithSigner.refund;
            const bidOrRefundAmount = amount === sUSDBalance ? sUSDBalanceBN : parseEther(amount.toString());
            const tx = (await bidOrRefundFunction(isShort ? 1 : 0, bidOrRefundAmount, {
                gasLimit,
                gasPrice: gasInfo.gasPrice * GWEI_UNIT,
            })) as ethers.ContractTransaction;

            dispatch(
                addOptionsPendingTransaction({
                    optionTransaction: {
                        hash: tx.hash ?? '',
                        market: optionsMarket.address,
                        currencyKey: optionsMarket.currencyKey,
                        account: currentWalletAddress ?? '',
                        type,
                        amount,
                        side,
                    },
                })
            );
            tx.wait().then((txResult) => {
                if (txResult && txResult.transactionHash) {
                    dispatch(
                        updateOptionsPendingTransactionStatus({
                            hash: txResult.transactionHash,
                            status: 'confirmed',
                        })
                    );
                }
            });
            setIsBidding(false);
        } catch (e) {
            console.log(e);
            setIsBidding(false);
        }
    };

    const handleTargetPrice = async (
        targetPrice: string,
        isShort: boolean,
        targetShort: boolean,
        isRefund: boolean
    ) => {
        const {
            utils: { parseEther },
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
                price: parseEther(targetPrice),
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
                        parseEther(targetPrice),
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
            utils: { parseEther },
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
            const bidOrRefundAmount = amount === sUSDBalance ? sUSDBalanceBN : parseEther(amount.toString());

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
                        <Button
                            primary
                            disabled={isBidding || !isWalletConnected || !sUSDBalance || !gasLimit}
                            onClick={handleBidOrRefund}
                        >
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
            <div style={{ display: 'flex', justifyContent: 'center', textTransform: 'uppercase', marginTop: 20 }}>
                <span>
                    {t('options.market.trade-card.bidding.footer.end-label')}{' '}
                    <TimeRemaining
                        end={optionsMarket.timeRemaining}
                        onEnded={() =>
                            queryClient.invalidateQueries(QUERY_KEYS.BinaryOptions.Market(optionsMarket.address))
                        }
                    />
                </span>
            </div>
        </div>
    );
};

export default BiddingPhaseCard;
