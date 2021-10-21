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

export const fetchQuote = async (buyToken: string, sellToken: string, amount: string, decimals: number) => {
    const url = baseUrl + suffix;
    const params = {
        buyToken,
        sellToken,
        sellAmount: ethers.utils.parseUnits(amount, decimals),
    };
    const response = await fetch(url + qs.stringify(params));

    const result = JSON.parse(await response.text());
    result.buyAmount = ethers.utils.formatEther(result.buyAmount);
    result.sellAmount = ethers.utils.formatUnits(result.sellAmount, decimals);
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
        value: result.value > 0 ? Number(result.value) : undefined,
    };
};
