import { useQuery, UseQueryOptions } from 'react-query';
import QUERY_KEYS from 'constants/queryKeys';
import { TokenInfo } from 'types/token';
import snxJSConnector from '../../utils/snxJSConnector';
import circulatingSupplyList from 'utils/json/circulating-supply.json';
import { DAO_TREASURY_AMOUNT, TOTAL_SUPPLY } from 'constants/token';
import dodoLpContract from 'utils/contracts/dodoLpContract';
import { ethers } from 'ethers';
import { bigNumberFormatter } from 'utils/formatters/ethers';
import { NetworkId } from 'utils/network';

const useTokenInfoQuery = (networkId: NetworkId, options?: UseQueryOptions<TokenInfo | undefined>) => {
    const { ongoingAirdropContract } = snxJSConnector;
    return useQuery<TokenInfo | undefined>(
        QUERY_KEYS.Token.Info(networkId),
        async () => {
            try {
                const period = ongoingAirdropContract ? await ongoingAirdropContract.period() : 1;

                const circulatingSupply = (circulatingSupplyList as any)[period] - DAO_TREASURY_AMOUNT;
                const tokenInfo: TokenInfo = {
                    circulatingSupply,
                    totalSupply: TOTAL_SUPPLY,
                };

                if (networkId === 1) {
                    const dodoLpContractInstance = new ethers.Contract(
                        dodoLpContract.address,
                        dodoLpContract.abi,
                        (snxJSConnector as any).provider
                    );
                    const price = await dodoLpContractInstance.getMidPrice();
                    tokenInfo.price = bigNumberFormatter(price);
                }

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
