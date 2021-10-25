import dotenv from 'dotenv';
import qs from 'query-string';
import { ethers } from 'ethers';

dotenv.config();

interface Preview {
    sellAmount: string;
    buyAmount: string;
    gasPrice: string;
    protocols: [];
}

const baseUrl = 'https://api.0x.org/swap/v1';
const suffix = '/quote?';

export const fetchQuote = async (
    buyToken: string,
    buyDecimals: number,
    sellToken: string,
    amount: string,
    sellDecimals: number
) => {
    const url = baseUrl + suffix;
    const params = {
        buyToken,
        sellToken,
        sellAmount: ethers.utils.parseUnits(amount, sellDecimals),
    };
    const response = await fetch(url + qs.stringify(params));

    const result = JSON.parse(await response.text());
    result.buyAmount = ethers.utils.formatUnits(result.buyAmount, buyDecimals);
    result.sellAmount = ethers.utils.formatUnits(result.sellAmount, sellDecimals);
    result.gasPrice = ethers.utils.formatUnits(Number(result.gasPrice), 'gwei');

    return result as Preview;
};

export const getTxForSwap = async (buyToken: string, sellToken: string, amount: string, decimals: number) => {
    const url = baseUrl + suffix;
    const params = {
        buyToken,
        sellToken,
        sellAmount: ethers.utils.parseUnits(amount, decimals),
    };

    const response = await fetch(url + qs.stringify(params));
    const result = JSON.parse(await response.text());
    return {
        to: result.to,
        data: result.data,
        value: sellToken === 'ETH' ? ethers.utils.parseEther(amount) : undefined,
    };
};
