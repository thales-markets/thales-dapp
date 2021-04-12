import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Button, Form, Header, Input, Message, Modal, Segment } from 'semantic-ui-react';
import { RootState } from 'redux/rootReducer';
import {
    getCustomGasPrice,
    getGasSpeed,
    getIsWalletConnected,
    getNetworkId,
    getWalletAddress,
} from 'redux/modules/wallet';
import { AccountMarketInfo, OptionSide, OrderItem, OrderSide } from 'types/options';
import snxJSConnector from 'utils/snxJSConnector';
import { Web3Wrapper } from '@0x/web3-wrapper';
import { ethers } from 'ethers';
import { APPROVAL_EVENTS } from 'constants/events';
import useEthGasPriceQuery from 'queries/network/useEthGasPriceQuery';
import erc20Contract from 'utils/contracts/erc20Contract';
import { bigNumberFormatter, getAddress } from 'utils/formatters/ethers';
import { gasPriceInWei, normalizeGasLimit } from 'utils/network';
import { getIs0xReady, getIsAppReady } from 'redux/modules/app';
import { useMarketContext } from 'pages/Options/Market/contexts/MarketContext';
import { getCurrencyKeyBalance } from 'utils/balances';
import useSynthsBalancesQuery from 'queries/walletBalances/useSynthsBalancesQuery';
import { SYNTHS_MAP } from 'constants/currency';
import useBinaryOptionsAccountMarketInfoQuery from 'queries/options/useBinaryOptionsAccountMarketInfoQuery';
import { formatCurrencyWithKey, toBigNumber } from 'utils/formatters/number';
import { EMPTY_VALUE } from 'constants/placeholder';
import { ReactComponent as WalletIcon } from 'assets/images/wallet.svg';
import { Tooltip } from '@material-ui/core';
import NetworkFees from 'pages/Options/components/NetworkFees';
import { IZeroExEvents } from '@0x/contract-wrappers';
import { DEFAULT_TOKEN_DECIMALS } from 'constants/defaults';
import { calculate0xProtocolFee } from 'utils/0x';
import { refetchOrderbook } from 'utils/queryConnector';
import OrderDetails from '../../components/OrderDetails';
import contractWrappers0xConnector from 'utils/contractWrappers0xConnector';
import { getContractAddressesForChainOrThrow } from '@0x/contract-addresses';

type FillOrderModalProps = {
    order: OrderItem;
    optionSide: OptionSide;
    orderSide: OrderSide;
    onClose: () => void;
};

export const FillOrderModal: React.FC<FillOrderModalProps> = ({ onClose, order, orderSide, optionSide }) => {
    const { t } = useTranslation();
    const optionsMarket = useMarketContext();
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const isWalletConnected = useSelector((state: RootState) => getIsWalletConnected(state));
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state)) || '';
    const gasSpeed = useSelector((state: RootState) => getGasSpeed(state));
    const customGasPrice = useSelector((state: RootState) => getCustomGasPrice(state));
    const [amount, setAmount] = useState<number | string>(order.displayOrder.fillableAmount);
    const [isFilling, setIsFilling] = useState<boolean>(false);
    const [txErrorMessage, setTxErrorMessage] = useState<string | null>(null);
    const [hasAllowance, setAllowance] = useState<boolean>(false);
    const [isAllowing, setIsAllowing] = useState<boolean>(false);
    const [gasLimit, setGasLimit] = useState<number | null>(null);
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
    const contractAddresses0x = getContractAddressesForChainOrThrow(networkId);
    const is0xReady = useSelector((state: RootState) => getIs0xReady(state));

    const synthsWalletBalancesQuery = useSynthsBalancesQuery(walletAddress, networkId, {
        enabled: isAppReady && isWalletConnected,
    });
    const walletBalancesMap =
        synthsWalletBalancesQuery.isSuccess && synthsWalletBalancesQuery.data
            ? { synths: synthsWalletBalancesQuery.data }
            : null;
    const sUSDBalance = getCurrencyKeyBalance(walletBalancesMap, SYNTHS_MAP.sUSD) || 0;

    const accountMarketInfoQuery = useBinaryOptionsAccountMarketInfoQuery(optionsMarket.address, walletAddress, {
        enabled: isAppReady && isWalletConnected,
    });
    let optBalances = {
        long: 0,
        short: 0,
    };
    if (isWalletConnected && accountMarketInfoQuery.isSuccess && accountMarketInfoQuery.data) {
        const { balances } = accountMarketInfoQuery.data as AccountMarketInfo;
        optBalances = balances;
    }
    const tokenBalance = optionSide === 'long' ? optBalances.long : optBalances.short;
    const baseToken = optionSide === 'long' ? optionsMarket.longAddress : optionsMarket.shortAddress;

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

    const {
        contracts: { SynthsUSD },
    } = snxJSConnector.snxJS as any;
    const { contractWrappers0x } = contractWrappers0xConnector;

    const isBuy = orderSide === 'buy';

    const isButtonDisabled =
        amount === '' ||
        Number(amount) <= 0 ||
        isFilling ||
        !isWalletConnected ||
        (isBuy ? !tokenBalance : !sUSDBalance) ||
        !is0xReady;

    const takerToken = isBuy ? baseToken : SynthsUSD.address;
    const addressToApprove: string = contractAddresses0x.exchangeProxy;

    useEffect(() => {
        const erc20Instance = new ethers.Contract(takerToken, erc20Contract.abi, snxJSConnector.signer);
        const getAllowance = async () => {
            const allowance = await erc20Instance.allowance(walletAddress, addressToApprove);
            setAllowance(!!bigNumberFormatter(allowance));
        };

        const registerAllowanceListener = () => {
            erc20Instance.on(APPROVAL_EVENTS.APPROVAL, (owner: string, spender: string) => {
                if (owner === walletAddress && spender === getAddress(addressToApprove)) {
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
            erc20Instance.removeAllListeners(APPROVAL_EVENTS.APPROVAL);
        };
    }, [walletAddress, isWalletConnected]);

    useEffect(() => {
        if (is0xReady) {
            const subscriptionToken = contractWrappers0x.exchangeProxy.subscribe(
                IZeroExEvents.LimitOrderFilled,
                { orderHash: order.displayOrder.orderHash },
                (_, log) => {
                    if (log?.log.args.orderHash.toLowerCase() === order.displayOrder.orderHash.toLowerCase()) {
                        refetchOrderbook(baseToken);
                        setIsFilling(false);
                        onClose();
                    }
                }
            );
            return () => {
                contractWrappers0x.exchangeProxy.unsubscribe(subscriptionToken);
            };
        }
    }, [is0xReady]);

    useEffect(() => {
        const fetchGasLimit = async () => {
            if (gasPrice !== null) {
                const targetOrder = order.rawOrder;
                const sOPTAmount = isBuy ? amount : Number(amount) * order.displayOrder.price;

                const protocolFee = calculate0xProtocolFee([targetOrder], gasPriceInWei(gasPrice));
                try {
                    const gasEstimate = await contractWrappers0x.exchangeProxy
                        .fillLimitOrder(
                            targetOrder,
                            order.signature,
                            Web3Wrapper.toBaseUnitAmount(toBigNumber(sOPTAmount), DEFAULT_TOKEN_DECIMALS)
                        )
                        .estimateGasAsync({ from: walletAddress, value: protocolFee });
                    setGasLimit(normalizeGasLimit(Number(gasEstimate)));
                } catch (e) {
                    console.log(e);
                    setGasLimit(null);
                }
            }
        };
        if (isButtonDisabled) return;
        fetchGasLimit();
    }, [isButtonDisabled, gasPrice, amount]);

    const handleAllowance = async () => {
        if (gasPrice !== null) {
            const erc20Instance = new ethers.Contract(takerToken, erc20Contract.abi, snxJSConnector.signer);
            try {
                setIsAllowing(true);
                const gasEstimate = await erc20Instance.estimateGas.approve(
                    addressToApprove,
                    ethers.constants.MaxUint256
                );
                await erc20Instance.approve(addressToApprove, ethers.constants.MaxUint256, {
                    gasLimit: normalizeGasLimit(Number(gasEstimate)),
                    gasPrice: gasPriceInWei(gasPrice),
                });
            } catch (e) {
                console.log(e);
                setIsAllowing(false);
            }
        }
    };

    const handleFillOrder = async () => {
        if (gasPrice !== null) {
            setTxErrorMessage(null);
            setIsFilling(true);

            const targetOrder = order.rawOrder;
            const sOPTAmount = isBuy ? amount : Number(amount) * order.displayOrder.price;
            const protocolFee = calculate0xProtocolFee([targetOrder], gasPriceInWei(gasPrice));

            try {
                await contractWrappers0x.exchangeProxy
                    .fillLimitOrder(
                        targetOrder,
                        order.signature,
                        Web3Wrapper.toBaseUnitAmount(toBigNumber(sOPTAmount), DEFAULT_TOKEN_DECIMALS)
                    )
                    .sendTransactionAsync({
                        from: walletAddress,
                        gas: gasLimit !== null ? gasLimit : undefined,
                        gasPrice: gasPriceInWei(gasPrice),
                        value: protocolFee,
                    });
            } catch (e) {
                console.log(e);
                setTxErrorMessage(t('common.errors.unknown-error-try-again'));
                setIsFilling(false);
            }
        }
    };

    const onMaxClick = () => {
        const maxWalletsOPT = isBuy ? tokenBalance : sUSDBalance / order.displayOrder.price;
        const maxAmount =
            order.displayOrder.fillableAmount < maxWalletsOPT ? order.displayOrder.fillableAmount : maxWalletsOPT;
        setAmount(maxAmount);
    };

    return (
        <Modal open={true} onClose={onClose} centered={false} closeIcon size="mini">
            <Modal.Content>
                <Segment>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Header as="h3">{t(`options.market.trade-options.fill-order.${orderSide}.title`)}</Header>
                        <span>
                            <WalletIcon />
                            {isWalletConnected
                                ? isBuy
                                    ? formatCurrencyWithKey('sOPT', tokenBalance)
                                    : formatCurrencyWithKey(SYNTHS_MAP.sUSD, sUSDBalance)
                                : EMPTY_VALUE}
                        </span>
                    </div>
                    <OrderDetails order={order.displayOrder} />
                    <Form>
                        <Form.Field>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <label style={{ textTransform: 'none', fontWeight: 'bold' }}>
                                    {t('options.market.trade-options.fill-order.amount-label', {
                                        orderSide: isBuy ? t('common.sell') : t('common.buy'),
                                    })}
                                </label>
                                <Tooltip
                                    title={
                                        <span>{t('options.market.trade-options.fill-order.max-button-tooltip')}</span>
                                    }
                                    placement="top"
                                    arrow={true}
                                >
                                    <Button size="mini" primary onClick={onMaxClick}>
                                        {t('common.max')}
                                    </Button>
                                </Tooltip>
                            </div>
                            <Input
                                fluid
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                label="sOPT"
                                id="amount"
                                type="number"
                                min="0"
                                step="any"
                            />
                        </Form.Field>
                    </Form>
                    <NetworkFees gasLimit={gasLimit} />
                    <div style={{ display: 'flex', justifyContent: 'center', marginTop: 30 }}>
                        {hasAllowance ? (
                            <Button primary disabled={isButtonDisabled || !gasLimit} onClick={handleFillOrder}>
                                {!isFilling
                                    ? t('options.market.trade-options.fill-order.confirm-button.label')
                                    : t('options.market.trade-options.fill-order.confirm-button.progress-label')}
                            </Button>
                        ) : (
                            <Button primary disabled={isAllowing || !isWalletConnected} onClick={handleAllowance}>
                                {!isAllowing
                                    ? t('common.enable-wallet-access.label')
                                    : t('common.enable-wallet-access.progress-label')}
                            </Button>
                        )}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center', marginTop: 10 }}>
                        {txErrorMessage && (
                            <Message content={txErrorMessage} onDismiss={() => setTxErrorMessage(null)} />
                        )}
                    </div>
                </Segment>
            </Modal.Content>
        </Modal>
    );
};

export default FillOrderModal;
