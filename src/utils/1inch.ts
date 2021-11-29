import {
    LimitOrder,
    LimitOrderBuilder,
    LimitOrderPredicateBuilder,
    LimitOrderPredicateCallData,
    LimitOrderProtocolFacade,
    Web3ProviderConnector,
} from '@1inch/limit-order-protocol';
import { NetworkId } from '@synthetixio/contracts-interface';
import axios from 'axios';
import { ethers } from 'ethers';
import qs from 'query-string';
import Web3 from 'web3';
import erc20Contract from 'utils/contracts/erc20Contract';

export const createOneInchLimitOrder = async (
    walletAddress: string,
    network: NetworkId,
    makerAssetAddress: string,
    takerAssetAddress: string,
    makerAmount: number | string,
    takerAmount: number | string
) => {
    console.log(walletAddress);
    const contractAddress = ONE_INCH_CONTRACTS[network];
    if (walletAddress && contractAddress) {
        const web3 = new Web3(Web3.givenProvider) as any;
        // You can create and use a custom provider connector (for example: ethers)
        const connector = new Web3ProviderConnector(web3);

        const provider = new ethers.providers.Web3Provider((window as any).ethereum);
        const signer = provider.getSigner();

        const erc20Instance = new ethers.Contract(makerAssetAddress, erc20Contract.abi, signer);
        erc20Instance.allowance(walletAddress, contractAddress).then(async (data: any) => {
            if (Number(ethers.utils.formatUnits(data, 18)) <= 0) {
                erc20Instance.approve(contractAddress, ethers.constants.MaxUint256).then(async () => {
                    await placeOrder();
                });
            } else {
                await placeOrder();
            }
        });

        const placeOrder = async () => {
            const limitOrderBuilder = new LimitOrderBuilder(contractAddress, network as any, connector);
            const limitOrderProtocolFacade = new LimitOrderProtocolFacade(contractAddress, connector);
            const limitOrderPredicateBuilder = new LimitOrderPredicateBuilder(limitOrderProtocolFacade);
            const { and, timestampBelow } = limitOrderPredicateBuilder;

            const simplePredicate: LimitOrderPredicateCallData = and(
                timestampBelow(Math.round(Date.now() / 1000) + 60_000) // a limit order is valid only for 1 minute
            );
            // Create a limit order and it's signature
            const limitOrder = limitOrderBuilder.buildLimitOrder({
                makerAssetAddress,
                takerAssetAddress,
                makerAddress: walletAddress,
                makerAmount: ethers.utils.parseUnits('' + makerAmount, 18).toString(),
                takerAmount: ethers.utils.parseUnits('' + takerAmount, 18).toString(),
                predicate: simplePredicate,
                permit: '0x0',
                interaction: '0x0',
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
                console.log('order added');
            } catch (e) {
                console.log('REJECTED: ', e);
            }
        };
    }
};

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

export const getAllSellOrdersForToken = async (network: NetworkId, token: string) => {
    const url = ONE_INCH_BASE_URL + network + ONE_INCH_LIMT_URL_ALL;
    const params = {
        makerAsset: token,
    };
    const response = await fetch(url + qs.stringify(params));
    const orders = await response.json();
    if (orders) {
        orders.map((order: LimitOrder) => {
            validateOrder(network, order);
        });
    }
};

export const getAllBuyOrdersForToken = async (network: NetworkId, token: string) => {
    const url = ONE_INCH_BASE_URL + network + ONE_INCH_LIMT_URL_ALL;
    const params = {
        takerAsset: token,
    };
    const response = await fetch(url + qs.stringify(params));
    const orders = await response.json();

    if (orders) {
        orders.map((order: LimitOrder) => {
            validateOrder(network, order);
        });
    }
};

const validateOrder = async (network: NetworkId, order: any) => {
    const contractAddress = ONE_INCH_CONTRACTS[network];
    if (contractAddress) {
        const web3 = new Web3(Web3.givenProvider) as any;
        const connector = new Web3ProviderConnector(web3);
        const limitOrderProtocolFacade = new LimitOrderProtocolFacade(contractAddress, connector);
        const addresses = [contractAddress];
        const callDatas = [order.data.predicate];

        try {
            const result: any = await limitOrderProtocolFacade.simulateCalls(addresses, callDatas);

            console.log('Order validity: ', result);
        } catch (error) {
            console.log('what what');
            console.error(error);
        }
    }
};
