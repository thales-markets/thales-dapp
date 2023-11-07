import { useQuery, UseQueryOptions } from 'react-query';
import QUERY_KEYS from 'constants/queryKeys';
import { TransferHistoryRequest } from 'ts-proto/gateway/gateway_pb';
import { WebClient } from 'ts-proto/gateway/GatewayServiceClientPb';
import { generalConfig } from 'config/general';
import { CelerBridgeHistory, CelerBridgeTransaction } from 'types/token';
import { bigNumberFormatter } from 'thales-utils';
import { THALES_CURRENCY } from 'constants/currency';
import { orderBy } from 'lodash';

const HISTORY_PAGE_SIZE = 100;

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
                request.setPageSize(HISTORY_PAGE_SIZE);
                const client = new WebClient(generalConfig.CELER_BRIDGE_URL, null, null);
                const response = await client.transferHistory(request, null);
                const historyList = response.toObject().historyList;

                const history: CelerBridgeHistory = historyList
                    .filter(
                        (historyItem) =>
                            historyItem.srcSendInfo &&
                            historyItem.srcSendInfo.token &&
                            historyItem.srcSendInfo.token.symbol === THALES_CURRENCY
                    )
                    .map((historyItem) => {
                        const mappedItem: CelerBridgeTransaction = {
                            transferId: historyItem.transferId,
                            timestamp: historyItem.ts,
                            srcChainId:
                                historyItem.srcSendInfo && historyItem.srcSendInfo.chain
                                    ? historyItem.srcSendInfo.chain.id
                                    : undefined,
                            srcAmount: historyItem.srcSendInfo
                                ? bigNumberFormatter(historyItem.srcSendInfo.amount)
                                : undefined,
                            srcTx:
                                historyItem.srcBlockTxLink !== ' '
                                    ? // fix bug on Celer side with Base TX links
                                      historyItem.srcBlockTxLink.replace('tx.', 'tx/')
                                    : undefined,
                            dstChainId:
                                historyItem.dstReceivedInfo && historyItem.dstReceivedInfo.chain
                                    ? historyItem.dstReceivedInfo.chain.id
                                    : undefined,
                            dstAmount: historyItem.dstReceivedInfo
                                ? bigNumberFormatter(historyItem.dstReceivedInfo.amount)
                                : undefined,
                            dstTx:
                                historyItem.dstBlockTxLink !== ''
                                    ? // fix bug on Celer side with Base TX links
                                      historyItem.dstBlockTxLink.replace('tx.', 'tx/')
                                    : undefined,
                            status: historyItem.status,
                        };

                        return mappedItem;
                    });

                return orderBy(history, ['timestamp'], ['desc']);
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
