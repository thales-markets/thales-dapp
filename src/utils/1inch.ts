import {
    LimitOrderBuilder,
    LimitOrderPredicateBuilder,
    LimitOrderPredicateCallData,
    LimitOrderProtocolFacade,
    Web3ProviderConnector,
} from '@1inch/limit-order-protocol';
import { NetworkId } from '@synthetixio/contracts-interface';
import axios from 'axios';
import { OrderPeriod, ORDER_PERIOD_IN_SECONDS } from 'constants/options';
import { ethers } from 'ethers';
import qs from 'query-string';
import Web3 from 'web3';

export const ONE_INCH_BASE_URL = 'https://limit-orders.1inch.io/v1.0/';
export const ONE_INCH_LIMT_URL_ALL = '/limit-order/all?';
export const ONE_INCH_LIMT_URL = '/limit-order/';
export const ONE_INCH_CONTRACTS: Record<NetworkId, string | null> = {
    1: '0x3ef51736315f52d568d6d2cf289419b9cfffe782',
    10: '0xb707d89d29c189421163515c59e42147371d6857',
    3: '',
    4: '',
    5: '',
    42: '',
    69: '',
};

export const createOneInchLimitOrder = async (
    walletAddress: string,
    network: NetworkId,
    makerAssetAddress: string,
    takerAssetAddress: string,
    makerAmount: number | string,
    takerAmount: number | string,
    expiration?: OrderPeriod
) => {
    const contractAddress = ONE_INCH_CONTRACTS[network];
    if (walletAddress && contractAddress) {
        const web3 = new Web3(Web3.givenProvider) as any;
        const connector = new Web3ProviderConnector(web3);
        const placeOrder = async () => {
            const limitOrderBuilder = new LimitOrderBuilder(contractAddress, network as any, connector);
            const limitOrderProtocolFacade = new LimitOrderProtocolFacade(contractAddress, connector);
            const limitOrderPredicateBuilder = new LimitOrderPredicateBuilder(limitOrderProtocolFacade);
            const { and, timestampBelow } = limitOrderPredicateBuilder;

            const simplePredicate: LimitOrderPredicateCallData = and(
                timestampBelow(
                    Math.round(Date.now() / 1000) + ORDER_PERIOD_IN_SECONDS[expiration ?? OrderPeriod.ONE_DAY]
                )
            );

            const limitOrder = limitOrderBuilder.buildLimitOrder({
                makerAssetAddress,
                takerAssetAddress,
                makerAddress: walletAddress,
                makerAmount: ethers.utils.parseUnits('' + makerAmount, 18).toString(),
                takerAmount: ethers.utils.parseUnits('' + takerAmount, 18).toString(),
                predicate: simplePredicate,
                permit: '0x',
                interaction: '0x',
            });

            const limitOrderTypedData = limitOrderBuilder.buildLimitOrderTypedData(limitOrder);

            try {
                const limitOrderSignature = await limitOrderBuilder.buildOrderSignature(
                    walletAddress,
                    limitOrderTypedData
                );
                const limitOrderHash = limitOrderBuilder.buildLimitOrderHash(limitOrderTypedData);

                const data = {
                    orderHash: limitOrderHash,
                    orderMaker: walletAddress,
                    signature: limitOrderSignature,
                    makerAmount: ethers.utils.parseUnits('' + makerAmount, 18).toString(),
                    takerAmount: ethers.utils.parseUnits('' + takerAmount, 18).toString(),
                    createDateTime: new Date(),
                    data: limitOrder,
                };

                await axios.post(ONE_INCH_BASE_URL + network + ONE_INCH_LIMT_URL, data);
            } catch (e) {
                console.log('REJECTED: ', e);
            }
        };
        await placeOrder();
    }
};

export const getAllSellOrdersForToken = async (network: NetworkId, token: string) => {
    const url = ONE_INCH_BASE_URL + network + ONE_INCH_LIMT_URL_ALL;
    const params = {
        makerAsset: token,
    };
    const response = await fetch(url + qs.stringify(params));
    return response.json();
};

export const getAllBuyOrdersForToken = async (network: NetworkId, token: string) => {
    const url = ONE_INCH_BASE_URL + network + ONE_INCH_LIMT_URL_ALL;
    const params = {
        takerAsset: token,
    };
    const response = await fetch(url + qs.stringify(params));
    return response.json();
};

// const validateOrder = async (network: NetworkId, order: any) => {
//     const contractAddress = ONE_INCH_CONTRACTS[network];
//     if (contractAddress) {
//         const web3 = new Web3(Web3.givenProvider) as any;
//         const connector = new Web3ProviderConnector(web3);
//         const limitOrderProtocolFacade = new LimitOrderProtocolFacade(contractAddress, connector);
//         const addresses = [contractAddress];
//         const callDatas = [order.data.predicate];

//         try {
//             const result: any = await limitOrderProtocolFacade.simulateCalls(addresses, callDatas);

//             console.log('Order validity: ', result);
//         } catch (error) {
//             console.log('what what');
//             console.error(error);
//         }
//     }
// };

export const fillLimitOrder = async (
    network: NetworkId,
    walletAddress: any,
    order: any,
    amount: number | string,
    gasLimit: any,
    isBuy: boolean
) => {
    const contractAddress = ONE_INCH_CONTRACTS[network];
    if (contractAddress) {
        try {
            const web3 = new Web3(Web3.givenProvider) as any;
            const connector = new Web3ProviderConnector(web3);
            let makerAmount, takerAmount, threshold;

            if (isBuy) {
                makerAmount = Number(amount) * order.displayOrder.price;
                takerAmount = '0';
                threshold = Number(amount);
            } else {
                makerAmount = Number(amount);
                takerAmount = '0';
                threshold = Number(amount) * order.displayOrder.price;
            }

            makerAmount = ethers.utils.parseUnits('' + makerAmount, 18).toString();
            takerAmount = ethers.utils.parseUnits('' + takerAmount, 18).toString();
            threshold = ethers.utils.parseUnits('' + threshold, 18).toString();

            const limitOrderProtocolFacade = new LimitOrderProtocolFacade(contractAddress, connector);

            const callData = limitOrderProtocolFacade.fillLimitOrder(
                {
                    ...order.orderData.data,
                    permit: '0x',
                    interaction: '0x',
                },
                order.signature,
                makerAmount,
                takerAmount,
                threshold
            );

            await web3.eth.sendTransaction({
                from: walletAddress,
                gasPrice: gasLimit,
                to: contractAddress,
                data: callData,
            });
        } catch (e) {
            console.log(e);
        }
    }
};

export const cancelOrder = async (network: NetworkId, walletAddress: any, order: any, gasLimit: any) => {
    const contractAddress = ONE_INCH_CONTRACTS[network];
    if (contractAddress) {
        const web3 = new Web3(Web3.givenProvider) as any;
        const connector = new Web3ProviderConnector(web3);
        const limitOrderProtocolFacade = new LimitOrderProtocolFacade(contractAddress, connector);

        try {
            const callData = limitOrderProtocolFacade.cancelLimitOrder({
                ...order.data,
                permit: '0x',
                interaction: '0x',
            });
            await web3.eth.sendTransaction({
                from: walletAddress,
                gasPrice: gasLimit,
                to: contractAddress,
                data: callData,
            });
        } catch (e) {
            console.log(e);
        }
    }
};
