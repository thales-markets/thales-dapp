import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Button, Form, Header, Input, Message, Modal, Segment, Card } from 'semantic-ui-react';
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
import { isV4 } from 'utils/0x';
import { Web3Wrapper } from '@0x/web3-wrapper';
import BigNumber from 'bignumber.js';
import { DECIMALS } from 'constants/0x';
import { ethers } from 'ethers';
import { APPROVAL_EVENTS } from 'constants/events';
import useEthGasPriceQuery from 'queries/network/useEthGasPriceQuery';
import erc20Contract from 'utils/contracts/erc20Contract';
import { bigNumberFormatter, getAddress } from 'utils/formatters/ethers';
import { MaxUint256 } from 'ethers/constants';
import { gasPriceInWei, normalizeGasLimit } from 'utils/network';
import { getIsAppReady } from 'redux/modules/app';
import { useMarketContext } from 'pages/Options/Market/contexts/MarketContext';
import { getCurrencyKeyBalance } from 'utils/balances';
import useSynthsBalancesQuery from 'queries/walletBalances/useSynthsBalancesQuery';
import { SYNTHS_MAP } from 'constants/currency';
import useBinaryOptionsAccountMarketInfoQuery from 'queries/options/useBinaryOptionsAccountMarketInfoQuery';
import { formatCurrencyWithKey, formatPercentage } from 'utils/formatters/number';
import { EMPTY_VALUE } from 'constants/placeholder';
import { ReactComponent as WalletIcon } from 'assets/images/wallet.svg';
import { Tooltip } from '@material-ui/core';

type FillOrderModalProps = {
    order: OrderItem;
    optionSide: OptionSide;
    orderSide: OrderSide;
    onClose: () => void;
};
declare const window: any;

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
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));

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
        snxJS: { sUSD },
        contractWrappers0x,
    } = snxJSConnector as any;
    const isBuy = orderSide === 'buy';

    const isButtonDisabled =
        amount === '' ||
        Number(amount) <= 0 ||
        isFilling ||
        !isWalletConnected ||
        (isBuy ? !tokenBalance : !sUSDBalance);

    const takerToken = isBuy ? baseToken : sUSD.contract.address;
    const addressToApprove: string = isV4(networkId)
        ? contractWrappers0x.exchangeProxy.address
        : '0xf1ec01d6236d3cd881a0bf0130ea25fe4234003e';

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

    const handleAllowance = async () => {
        if (gasPrice !== null) {
            const erc20Instance = new ethers.Contract(takerToken, erc20Contract.abi, snxJSConnector.signer);
            try {
                setIsAllowing(true);
                const gasEstimate = await erc20Instance.estimate.approve(addressToApprove, MaxUint256);
                await erc20Instance.approve(addressToApprove, MaxUint256, {
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
        setTxErrorMessage(null);
        setIsFilling(true);
        const { contractWrappers0x } = snxJSConnector as any;

        const targetOrder = order.rawSignedOrder;
        const sOPTAmount = isBuy ? amount : Number(amount) * order.displayOrder.price;

        const PROTOCOL_FEE_MULTIPLIER = new BigNumber(150000);
        const calculateProtocolFee = (orders: Array<any>, gasPrice: BigNumber | number): BigNumber => {
            return new BigNumber(PROTOCOL_FEE_MULTIPLIER).times(gasPrice).times(orders.length);
        };

        const gasp = (await window.web3.eth) ? window.web3.eth.getGasPrice() : 1e9;
        const valueP = calculateProtocolFee([targetOrder], gasp);

        if (isV4(networkId)) {
            await contractWrappers0x.exchangeProxy
                .fillLimitOrder(
                    targetOrder,
                    targetOrder.signature,
                    Web3Wrapper.toBaseUnitAmount(new BigNumber(sOPTAmount), DECIMALS)
                )
                .awaitTransactionSuccessAsync({ from: walletAddress, value: valueP });
        } else {
            // contractWrappers.exchange
            //     .fillOrder(targetOrder, Web3Wrapper.toBaseUnitAmount(new BigNumber(1), 18), targetOrder.signature)
            //     .sendTransactionAsync({
            //         from: window.web3.currentProvider.selectedAddress,
            //         value: valueP,
            //     })
            //     .catch((e) => {
            //         console.log(e);
            //     });

            const contract = new ethers.Contract(
                '0x4eacd0af335451709e1e7b570b8ea68edec8bc97',
                contractWrappers0x.exchange.abi,
                snxJSConnector.signer
            );
            const overrides = {
                // To convert Ether to Wei:
                value: ethers.utils.parseEther('0.1'), // ether in this case MUST be a string
            };

            try {
                const newAmount = new BigNumber(10).pow(18).multipliedBy(sOPTAmount);
                await contract.fillOrder(targetOrder, newAmount.toFixed(), targetOrder.signature, overrides);
            } catch (e) {
                console.log(e);
            }
        }
        setIsFilling(false);
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
                    <Card fluid>
                        <Card.Content>
                            <Card.Header>
                                {t('options.market.trade-options.fill-order.order-details.title')}
                            </Card.Header>
                            <Card.Description>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span>
                                        {t('options.market.trade-options.fill-order.order-details.price-label')}
                                    </span>
                                    <span>{formatCurrencyWithKey(SYNTHS_MAP.sUSD, order.displayOrder.price)}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span>
                                        {t('options.market.trade-options.fill-order.order-details.amount-label')}
                                    </span>
                                    <span>{formatCurrencyWithKey('sOPT', order.displayOrder.amount)}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span>
                                        {t('options.market.trade-options.fill-order.order-details.total-label')}
                                    </span>
                                    <span>{formatCurrencyWithKey(SYNTHS_MAP.sUSD, order.displayOrder.total)}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span>
                                        {t('options.market.trade-options.fill-order.order-details.filled-label')}
                                    </span>
                                    <span>{formatPercentage(order.displayOrder.filled)}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span>
                                        {t(
                                            'options.market.trade-options.fill-order.order-details.remaining-amount-label'
                                        )}
                                    </span>
                                    <span>
                                        <strong>
                                            {formatCurrencyWithKey('sOPT', order.displayOrder.fillableAmount)}
                                        </strong>
                                    </span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span>
                                        {t(
                                            'options.market.trade-options.fill-order.order-details.remaining-amount-susd-label'
                                        )}
                                    </span>
                                    <span>
                                        <strong>
                                            {formatCurrencyWithKey(
                                                SYNTHS_MAP.sUSD,
                                                order.displayOrder.fillableAmount * order.displayOrder.price
                                            )}
                                        </strong>
                                    </span>
                                </div>
                            </Card.Description>
                        </Card.Content>
                    </Card>
                    <div></div>
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
                    <div style={{ display: 'flex', justifyContent: 'center', marginTop: 30 }}>
                        {hasAllowance ? (
                            <Button primary disabled={isButtonDisabled /* || !gasLimit*/} onClick={handleFillOrder}>
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
