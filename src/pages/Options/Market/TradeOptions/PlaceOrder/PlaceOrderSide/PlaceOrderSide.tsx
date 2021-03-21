import {
    generatePseudoRandomSalt,
    NULL_ADDRESS,
    NULL_BYTES,
    Order,
    signatureUtils,
    ZERO_AMOUNT,
} from '@0x/order-utils';
import { LimitOrder, SignatureType, ZERO } from '@0x/protocol-utils';
import { Web3Wrapper } from '@0x/web3-wrapper';
import axios from 'axios';
import BigNumber from 'bignumber.js';
import DatePicker from 'components/Input/DatePicker';
import { DECIMALS } from 'constants/0x';
import { SYNTHS_MAP } from 'constants/currency';
// import useSynthsBalancesQuery from 'queries/walletBalances/useSynthsBalancesQuery';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
// import { getIsAppReady } from 'redux/modules/app';
import { getIsWalletConnected, getNetworkId, getWalletAddress } from 'redux/modules/wallet';
import { RootState } from 'redux/rootReducer';
import { Form, Input, Segment, Button, Message } from 'semantic-ui-react';
import { OrderSide } from 'types/options';
import { get0xBaseURL, isV4 } from 'utils/0x';
// import { getCurrencyKeyBalance } from 'utils/balances';
import snxJSConnector from 'utils/snxJSConnector';

declare const window: any;

type PlaceOrderSideProps = {
    baseToken: string;
    side: OrderSide;
};

const PlaceOrderSide: React.FC<PlaceOrderSideProps> = ({ baseToken, side }) => {
    const { t } = useTranslation();
    const [price, setPrice] = useState<number | string>('');
    const [quantity, setQuantity] = useState<number | string>('');
    const [duration, setDuration] = useState<Date | null | undefined>(null);
    const [hasAllowance] = useState<boolean>(true);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [isAllowing] = useState<boolean>(false);
    const isWalletConnected = useSelector((state: RootState) => getIsWalletConnected(state));
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state)) || '';
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    // const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
    const [txErrorMessage, setTxErrorMessage] = useState<string | null>(null);

    // const synthsWalletBalancesQuery = useSynthsBalancesQuery(walletAddress, networkId, {
    //     enabled: isAppReady && isWalletConnected,
    // });

    // const walletBalancesMap =
    //     synthsWalletBalancesQuery.isSuccess && synthsWalletBalancesQuery.data
    //         ? { synths: synthsWalletBalancesQuery.data }
    //         : null;
    // const sUSDBalance = getCurrencyKeyBalance(walletBalancesMap, SYNTHS_MAP.sUSD) || 0;

    const handleAllowance = () => {};
    const handleSubmitOrder = async () => {
        setTxErrorMessage(null);
        setIsSubmitting(true);
        const {
            snxJS: { sUSD },
            contractWrappers0x,
        } = snxJSConnector as any;

        const baseUrl = get0xBaseURL(networkId);
        const placeOrderUrl = `${baseUrl}order`;

        const makerToken = side === 'buy' ? sUSD.contract.address : baseToken;
        const takerToken = side === 'buy' ? baseToken : sUSD.contract.address;
        const makerAmount = Web3Wrapper.toBaseUnitAmount(
            new BigNumber(side === 'buy' ? Number(quantity) * Number(price) : quantity),
            DECIMALS
        );
        const takerAmount = Web3Wrapper.toBaseUnitAmount(
            new BigNumber(side === 'buy' ? quantity : Number(quantity) * Number(price)),
            DECIMALS
        );
        const expiry = new BigNumber(Math.round((duration as Date).getTime() / 1000));
        const salt = generatePseudoRandomSalt();

        if (isV4(networkId)) {
            const createSignedOrderV4Async = async () => {
                const order = new LimitOrder({
                    makerToken,
                    takerToken,
                    makerAmount,
                    takerAmount,
                    maker: walletAddress,
                    sender: NULL_ADDRESS,
                    expiry,
                    salt,
                    chainId: networkId,
                    verifyingContract: '0xDef1C0ded9bec7F1a1670819833240f027b25EfF',
                });

                const signature = await order.getSignatureWithProviderAsync(window.ethereum, SignatureType.EIP712);
                return { ...order, signature };
            };

            const signedOrder = await createSignedOrderV4Async();

            try {
                await axios({
                    method: 'POST',
                    url: placeOrderUrl,
                    data: signedOrder,
                });
            } catch (err) {
                console.error(JSON.stringify(err.response.data));
                setTxErrorMessage(JSON.stringify(err.response.data));
            } finally {
                setIsSubmitting(false);
            }
        } else {
            const makerAssetData = await contractWrappers0x.devUtils.encodeERC20AssetData(makerToken).callAsync();
            const takerAssetData = await contractWrappers0x.devUtils.encodeERC20AssetData(takerToken).callAsync();

            const order: Order = {
                chainId: networkId,
                exchangeAddress: '0x4eacd0af335451709e1e7b570b8ea68edec8bc97',
                makerAddress: walletAddress,
                takerAddress: NULL_ADDRESS,
                senderAddress: NULL_ADDRESS,
                feeRecipientAddress: NULL_ADDRESS,
                expirationTimeSeconds: expiry,
                salt,
                makerAssetAmount: makerAmount,
                takerAssetAmount: takerAmount,
                makerAssetData,
                takerAssetData,
                makerFeeAssetData: NULL_BYTES,
                takerFeeAssetData: NULL_BYTES,
                makerFee: ZERO,
                takerFee: ZERO_AMOUNT,
            };

            const signedOrder = await signatureUtils.ecSignOrderAsync(
                window.web3.currentProvider,
                order,
                walletAddress
            );

            try {
                await axios({
                    method: 'POST',
                    url: placeOrderUrl,
                    data: signedOrder,
                });
            } catch (err) {
                console.error(JSON.stringify(err.response.data));
                setTxErrorMessage(JSON.stringify(err.response.data));
            } finally {
                setIsSubmitting(false);
            }
        }
    };

    return (
        <Segment>
            <Form>
                <Form.Field>
                    <label>Quantity</label>
                    <Input
                        fluid
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        id="quantity"
                        type="number"
                        min="0"
                    />
                </Form.Field>
                <Form.Field>
                    <label>Price</label>
                    <Input
                        fluid
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        label={SYNTHS_MAP.sUSD}
                        id="order-price"
                        type="number"
                        min="0"
                    />
                </Form.Field>
                <Form.Field>
                    <label>Duration</label>
                    <DatePicker
                        id="end-of-order"
                        dateFormat="MMM d, yyyy h:mm aa"
                        selected={duration}
                        showTimeSelect={true}
                        onChange={(d: Date) => setDuration(d)}
                        minDate={new Date()}
                    />
                </Form.Field>
            </Form>
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: 30 }}>
                {hasAllowance ? (
                    <Button
                        primary
                        disabled={isSubmitting || !isWalletConnected /*||!sUSDBalance || !gasLimit*/}
                        onClick={handleSubmitOrder}
                    >
                        {!isSubmitting ? 'Submit' : 'Submitting in progress...'}
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
                {txErrorMessage && <Message content={txErrorMessage} onDismiss={() => setTxErrorMessage(null)} />}
            </div>
        </Segment>
    );
};

export default PlaceOrderSide;
