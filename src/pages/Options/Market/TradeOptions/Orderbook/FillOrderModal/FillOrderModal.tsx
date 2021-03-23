import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Button, Form, Input, Message, Modal, Segment } from 'semantic-ui-react';
import { RootState } from 'redux/rootReducer';
import { getIsWalletConnected, getNetworkId, getWalletAddress } from 'redux/modules/wallet';
import { OrderItem } from 'types/options';
import snxJSConnector from 'utils/snxJSConnector';
import { isV4 } from 'utils/0x';
import { Web3Wrapper } from '@0x/web3-wrapper';
import BigNumber from 'bignumber.js';
import { DECIMALS } from 'constants/0x';
import { ethers } from 'ethers';

type FillOrderModalProps = {
    order: OrderItem;
    onClose: () => void;
};
declare const window: any;

export const FillOrderModal: React.FC<FillOrderModalProps> = ({ onClose, order }) => {
    const { t } = useTranslation();
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const [amount, setAmount] = useState<number | string>('');
    const [hasAllowance] = useState<boolean>(true);
    const [isFilling, setIsFilling] = useState<boolean>(false);
    const [isAllowing] = useState<boolean>(false);
    const isWalletConnected = useSelector((state: RootState) => getIsWalletConnected(state));
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state)) || '';
    // const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
    const [txErrorMessage, setTxErrorMessage] = useState<string | null>(null);

    const handleAllowance = () => {};

    const handleFillOrder = async () => {
        setTxErrorMessage(null);
        setIsFilling(true);
        const { contractWrappers0x } = snxJSConnector as any;

        const targetOrder = order.rawSignedOrder;

        const PROTOCOL_FEE_MULTIPLIER = new BigNumber(70000);
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
                    Web3Wrapper.toBaseUnitAmount(new BigNumber(1), DECIMALS)
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
                const newAmount = new BigNumber(10).pow(18).multipliedBy(amount);
                await contract.fillOrder(targetOrder, newAmount.toFixed(), targetOrder.signature, overrides);
            } catch (e) {
                console.log(e);
            }
        }
        setIsFilling(false);
    };

    return (
        <Modal open={true} onClose={onClose} centered={false} closeIcon>
            <Modal.Content>
                <Segment>
                    <Form>
                        <Form.Field>
                            <label>Amount</label>
                            <Input
                                fluid
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                id="amount"
                                type="number"
                                min="0"
                            />
                        </Form.Field>
                    </Form>
                    <div style={{ display: 'flex', justifyContent: 'center', marginTop: 30 }}>
                        {hasAllowance ? (
                            <Button
                                primary
                                disabled={isFilling || !isWalletConnected /*||!sUSDBalance || !gasLimit*/}
                                onClick={handleFillOrder}
                            >
                                {!isFilling ? 'Fill order' : 'Filling order in progress...'}
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
