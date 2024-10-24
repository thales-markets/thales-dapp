import axios from 'axios';
import { generalConfig } from 'config/general';
import QUERY_KEYS from 'constants/queryKeys';
import { API_ROUTES } from 'constants/routes';
import { Network } from 'enums/network';
import { orderBy } from 'lodash';
import { useQuery, UseQueryOptions } from 'react-query';
import { LiquidityPoolPnls } from 'types/liquidityPool';

const useLiquidityPoolPnlsQuery = (
    networkId: Network,
    liquidityPoolAddress: string,
    options?: UseQueryOptions<LiquidityPoolPnls>
) => {
    return useQuery<LiquidityPoolPnls>(
        QUERY_KEYS.LiquidityPool.PnL(networkId, liquidityPoolAddress),
        async () => {
            try {
                const liquidityPoolPnlsResponse = await axios.get(
                    `${generalConfig.API_URL}/${API_ROUTES.LPPnls}/${networkId}?liquidityPool=${liquidityPoolAddress}`
                );

                if (!liquidityPoolPnlsResponse?.data) return [];

                let cumulativePnl = 1;
                return orderBy(liquidityPoolPnlsResponse?.data, ['round'], ['asc']).map((item: any) => {
                    cumulativePnl = cumulativePnl * item.pnl;
                    return {
                        round: `R${item.round}`,
                        pnlPerRound: item.pnl - 1,
                        cumulativePnl: cumulativePnl - 1,
                    };
                });
            } catch (e) {
                console.log(e);
                return [];
            }
        },
        {
            ...options,
        }
    );
};

export default useLiquidityPoolPnlsQuery;
