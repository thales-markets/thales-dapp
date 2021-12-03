import { toJSTimestamp } from './date';
import { bigNumberFormatter } from './ethers';

export function prepSellOrder(record: any) {
    const hexTimestmap = '0x' + record.data.predicate.split('63592c2b')[1].substr(0, 64);
    const expirationTimestamp = parseInt(hexTimestmap, 16);

    const price = bigNumberFormatter(record.takerAmount) / bigNumberFormatter(record.makerAmount);
    const amount = bigNumberFormatter(record.makerAmount);
    const total = bigNumberFormatter(record.takerAmount);
    const timeRemaining = toJSTimestamp(expirationTimestamp);
    const fillableAmount = bigNumberFormatter(record.metaData.remainingMakerAmount) / price;
    const fillableTotal = bigNumberFormatter(record.metaData.remainingMakerAmount);
    const filled = (amount - fillableAmount) / amount;
    const orderHash = record.orderHash;
    const potentialReturn = 1 / price - 1;
    const potentialReturnAmount = fillableAmount - fillableTotal;

    return {
        rawOrder: {
            maker: record.orderMaker,
            taker: '',
            makerToken: record.data.makerAsset,
            takerToken: record.data.takerAsset,
        },
        signature: record.order.signature,
        displayOrder: {
            amount,
            price,
            total,
            timeRemaining,
            fillableAmount,
            fillableTotal,
            filled,
            orderHash,
            potentialReturn,
            potentialReturnAmount,
        },
        orderData: {
            data: record.data,
        },
    };
}

export function prepBuyOrder(record: any) {
    const hexTimestmap = '0x' + record.data.predicate.split('63592c2b')[1].substr(0, 64);
    const expirationTimestamp = parseInt(hexTimestmap, 16);

    const price = bigNumberFormatter(record.makerAmount) / bigNumberFormatter(record.takerAmount);
    const amount = bigNumberFormatter(record.takerAmount);
    const total = bigNumberFormatter(record.makerAmount);
    const timeRemaining = toJSTimestamp(expirationTimestamp);
    const fillableAmount = bigNumberFormatter(record.remainingMakerAmount);
    const fillableTotal = bigNumberFormatter(record.remainingMakerAmount) * price;
    const filled = (amount - fillableAmount) / amount;
    const orderHash = record.orderHash;
    const potentialReturn = 1 / price - 1;
    const potentialReturnAmount = fillableAmount - fillableTotal;

    return {
        rawOrder: {
            maker: record.orderMaker,
            taker: '',
            makerToken: record.data.makerAsset,
            takerToken: record.data.takerAsset,
        },
        signature: record.signature,
        displayOrder: {
            amount,
            price,
            total,
            timeRemaining,
            fillableAmount,
            fillableTotal,
            filled,
            orderHash,
            potentialReturn,
            potentialReturnAmount,
        },
        orderData: {
            data: record.data,
        },
    };
}
