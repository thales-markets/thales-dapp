import { useQuery, UseQueryOptions } from 'react-query';
import QUERY_KEYS from 'constants/queryKeys';
import { TokenInfo } from 'types/token';
import snxJSConnector from '../../utils/snxJSConnector';
import circulatingSupplyList from 'utils/json/circulating-supply.json';
import { DAO_TREASURY_AMOUNT, DODO_LP_CONTRACT_ADDRESS, TOTAL_SUPPLY } from 'constants/token';
import dodoLpContract from 'utils/contracts/dodoLpContract';
import { ethers } from 'ethers';
import { bigNumberFormatter } from 'utils/formatters/ethers';

const useTokenInfoQuery = (options?: UseQueryOptions<TokenInfo | undefined>) => {
    const { ongoingAirdropContract } = snxJSConnector;
    return useQuery<TokenInfo | undefined>(
        QUERY_KEYS.Token.Info(),
        async () => {
            try {
                const dodoLpContractInstance = new ethers.Contract(
                    DODO_LP_CONTRACT_ADDRESS,
                    dodoLpContract.abi,
                    (snxJSConnector as any).provider
                );

                const period = ongoingAirdropContract ? await ongoingAirdropContract.period() : 1;
                const price = await dodoLpContractInstance.getMidPrice();

                const circulatingSupply = (circulatingSupplyList as any)[period] - DAO_TREASURY_AMOUNT;
                const tokenInfo: TokenInfo = {
                    circulatingSupply,
                    totalSupply: TOTAL_SUPPLY,
                    price: bigNumberFormatter(price),
                };

                return tokenInfo;
            } catch (e) {
                console.log(e);
            }

            return undefined;
        },
        {
            refetchInterval: 5000,
            ...options,
        }
    );
};

export default useTokenInfoQuery;
