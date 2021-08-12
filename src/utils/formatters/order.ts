import { toJSTimestamp } from './date';
import { bigNumberFormatter } from './ethers';

export function prepSellOrder(record: any) {
    const price = bigNumberFormatter(record.order.takerAmount) / bigNumberFormatter(record.order.makerAmount);
    const amount = bigNumberFormatter(record.order.makerAmount);
    const total = bigNumberFormatter(record.order.takerAmount);
    const timeRemaining = toJSTimestamp(record.order.expiry);
    const fillableAmount = bigNumberFormatter(record.metaData.remainingFillableTakerAmount) / price;
    const fillableTotal = bigNumberFormatter(record.metaData.remainingFillableTakerAmount);
    const filled = (amount - fillableAmount) / amount;
    const orderHash = record.metaData.orderHash;
    const potentialReturn = 1 / price - 1;
    const potentialReturnAmount = fillableAmount - fillableTotal;

    return {
        rawOrder: record.order,
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
    };
}

export function prepBuyOrder(record: any) {
    const price = bigNumberFormatter(record.order.makerAmount) / bigNumberFormatter(record.order.takerAmount);
    const amount = bigNumberFormatter(record.order.takerAmount);
    const total = bigNumberFormatter(record.order.makerAmount);
    const timeRemaining = toJSTimestamp(record.order.expiry);
    const fillableAmount = bigNumberFormatter(record.metaData.remainingFillableTakerAmount);
    const fillableTotal = bigNumberFormatter(record.metaData.remainingFillableTakerAmount) * price;
    const filled = (amount - fillableAmount) / amount;
    const orderHash = record.metaData.orderHash;
    const potentialReturn = 1 / price - 1;
    const potentialReturnAmount = fillableAmount - fillableTotal;

    return {
        rawOrder: record.order,
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
    };
}
