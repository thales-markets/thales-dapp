import { useQuery, UseQueryOptions } from 'react-query';
import QUERY_KEYS from 'constants/queryKeys';
import { TransferHistoryRequest } from 'ts-proto/gateway/gateway_pb';
import { WebClient } from 'ts-proto/gateway/GatewayServiceClientPb';
import { generalConfig } from 'config/general';
import { CelerBridgeHistory, CelerBridgeTransaction } from 'types/token';
import { bigNumberFormatter } from '../../utils/formatters/ethers';

const useCelerBridgeUserHistoryQuery = (
    walletAddress: string,
    options?: UseQueryOptions<CelerBridgeHistory | undefined>
) => {
    return useQuery<CelerBridgeHistory | undefined>(
        QUERY_KEYS.Token.CelerBridgeHistory(walletAddress),
        async () => {
            try {
                const request = new TransferHistoryRequest();
                request.setAddr(walletAddress);
                request.setPageSize(50);
                const client = new WebClient(generalConfig.CELER_BRIDGE_URL, null, null);
                const response = await client.transferHistory(request, null);
                const historyList = response.toObject().historyList;

                const history: CelerBridgeHistory = historyList.map((historyItem) => {
                    const mappedItem: CelerBridgeTransaction = {
                        timestamp: historyItem.ts,
                        srcChainId:
                            historyItem.srcSendInfo && historyItem.srcSendInfo.chain
                                ? historyItem.srcSendInfo.chain.id
                                : undefined,
                        srcAmount: historyItem.srcSendInfo
                            ? bigNumberFormatter(historyItem.srcSendInfo.amount)
                            : undefined,
                        srcTx: historyItem.srcBlockTxLink,
                        dstChainId:
                            historyItem.dstReceivedInfo && historyItem.dstReceivedInfo.chain
                                ? historyItem.dstReceivedInfo.chain.id
                                : undefined,
                        dstAmount: historyItem.dstReceivedInfo
                            ? bigNumberFormatter(historyItem.dstReceivedInfo.amount)
                            : undefined,
                        dstTx: historyItem.dstBlockTxLink,
                        status: historyItem.status,
                    };

                    return mappedItem;
                });
                console.log(history);
                return history;
            } catch (e) {
                console.log(e);
            }

            return undefined;
        },
        {
            ...options,
        }
    );
};

export default useCelerBridgeUserHistoryQuery;
