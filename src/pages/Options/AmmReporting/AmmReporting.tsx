import React, { useEffect, useMemo, useState } from 'react';
import { Background, Wrapper } from '../../../theme/common';
import MarketHeader from '../Home/MarketHeader';
import ROUTES from '../../../constants/routes';
import { useTranslation } from 'react-i18next';
import AmmReportingTable from './AmmReportingTable';
import { OrderDirection } from '../Home/ExploreMarkets/ExploreMarketsDesktop';
import styled from 'styled-components';
import useBinaryOptionsMarketsQuery from '../../../queries/options/useBinaryOptionsMarketsQuery';
import { sortOptionsMarkets } from '../../../utils/options';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/rootReducer';
import { getNetworkId } from '../../../redux/modules/wallet';
import useBinaryOptionsAllTradesQuery from '../../../queries/options/useBinaryOptionsAllTradesQuery';
import { ExtendedTrade } from '../../../types/options';
import { getIsAppReady } from '../../../redux/modules/app';
import snxJSConnector from '../../../utils/snxJSConnector';
import { bigNumberFormatter } from '../../../utils/formatters/ethers';
import { SIDE } from '../../../constants/options';
import useAssetsBalanceQuery from '../../../queries/user/useUserAssetsBalanceQuery';

const DEFAULT_ORDER_BY = 2;

const AmmReporting: React.FC = () => {
    const { t } = useTranslation();

    const { ammContract } = snxJSConnector;
    const ammContractAddress = ammContract ? ammContract.address : '';

    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));

    const [orderBy, setOrderBy] = useState(DEFAULT_ORDER_BY);
    const [orderDirection, setOrderDirection] = useState(OrderDirection.DESC);
    const [marketContractsInfoMap, setMarketContractsInfoMap] = useState<Record<string, any>>({});

    const marketsQuery = useBinaryOptionsMarketsQuery(networkId, {
        enabled: isAppReady,
    });

    const tradesQuery = useBinaryOptionsAllTradesQuery(networkId, {
        enabled: isAppReady,
    });

    const userAssetsQuery = useAssetsBalanceQuery(networkId, marketsQuery.data || [], ammContractAddress, {
        enabled: isAppReady,
    });

    const ammAssetsMap = useMemo(
        () =>
            userAssetsQuery.isSuccess && Array.isArray(userAssetsQuery.data)
                ? userAssetsQuery.data.reduce((prev, curr) => {
                      prev[curr.market.address] = curr.balances;
                      return prev;
                  }, {} as any)
                : [],
        [userAssetsQuery.data]
    );

    const trades: ExtendedTrade[] = tradesQuery.isSuccess && tradesQuery.data ? tradesQuery.data : [];

    const volumeByMarketMap = useMemo(() => {
        const map = {} as any;
        trades.forEach((trade) => {
            if (trade.maker.toLowerCase() === ammContractAddress.toLowerCase()) {
                const isBuy = trade.orderSide === 'buy';
                const isLong = trade.optionSide === 'long';
                const volume = isBuy ? trade.takerAmount : trade.makerAmount;

                if (!map[trade.market]) {
                    map[trade.market] = {
                        shortBuyTotal: 0,
                        longBuyTotal: 0,
                        shortSellTotal: 0,
                        longSellTotal: 0,
                        total: 0,
                    };
                }

                if (isBuy) {
                    map[trade.market] = {
                        ...map[trade.market],
                        shortBuyTotal: isLong
                            ? map[trade.market].shortBuyTotal
                            : map[trade.market].shortBuyTotal + volume,
                        longBuyTotal: isLong ? map[trade.market].longBuyTotal + volume : map[trade.market].longBuyTotal,
                    };
                } else {
                    map[trade.market] = {
                        ...map[trade.market],
                        shortSellTotal: isLong
                            ? map[trade.market].shortSellTotal
                            : map[trade.market].shortSellTotal + volume,
                        longSellTotal: isLong
                            ? map[trade.market].longSellTotal + volume
                            : map[trade.market].longSellTotal,
                    };
                }

                map[trade.market].total += volume;
            }
        });
        return map;
    }, [trades]);

    useEffect(() => {
        if (marketsQuery.isSuccess && Array.isArray(marketsQuery.data) && ammContract) {
            (async () => {
                const ammContractWithSigner = ammContract.connect((snxJSConnector as any).signer);
                const map = {} as any;
                await Promise.all(
                    marketsQuery.data.map(async (market) => {
                        map[market.address] = {
                            spentOnMarket: bigNumberFormatter(
                                await ammContractWithSigner.spentOnMarket(market.address)
                            ),
                            longPrice: bigNumberFormatter(await ammContractWithSigner.price(market.address, SIDE.long)),
                            shortPrice: bigNumberFormatter(
                                await ammContractWithSigner.price(market.address, SIDE.short)
                            ),
                            availableToBuyLong: bigNumberFormatter(
                                await ammContractWithSigner.availableToBuyFromAMM(market.address, SIDE.long)
                            ),
                            availableToBuyShort: bigNumberFormatter(
                                await ammContractWithSigner.availableToBuyFromAMM(market.address, SIDE.short)
                            ),
                            availableToSellLong: bigNumberFormatter(
                                await ammContractWithSigner.availableToSellToAMM(market.address, SIDE.long)
                            ),
                            availableToSellShort: bigNumberFormatter(
                                await ammContractWithSigner.availableToSellToAMM(market.address, SIDE.short)
                            ),
                        };
                    })
                );
                setMarketContractsInfoMap(map);
            })();
        }
    }, [marketsQuery.data, setMarketContractsInfoMap]);

    const optionsMarkets = useMemo(() => {
        if (marketsQuery.isSuccess && Array.isArray(marketsQuery.data)) {
            const market = marketsQuery.data.map((market) => {
                return {
                    ...market,
                    volume: volumeByMarketMap[market.address] || 'N/A',
                    ...marketContractsInfoMap[market.address],
                    longsHeld: ammAssetsMap?.[market.address]?.long,
                    shortsHeld: ammAssetsMap?.[market.address]?.short,
                };
            });
            return sortOptionsMarkets(market);
        }
        return [];
    }, [marketsQuery.data, volumeByMarketMap, marketContractsInfoMap, ammAssetsMap]);

    return (
        <Background>
            <Wrapper>
                <MarketHeader route={ROUTES.Options.AmmReporting} />
                <Title className="pale-grey">{t('common.sidebar.amm-reporting-label')}</Title>
                <AmmReportingTable
                    dataForUi={optionsMarkets}
                    orderBy={orderBy}
                    orderDirection={orderDirection}
                    setOrderBy={setOrderBy}
                    setOrderDirection={setOrderDirection}
                    isLoading={false}
                />
            </Wrapper>
        </Background>
    );
};

const Title = styled.p`
    align-self: start;
    font-weight: bold;
    line-height: 64px;
    letter-spacing: -1px;
    font-size: 39px;
    padding-bottom: 30px;
    color: #f6f6fe;
    @media (max-width: 1024px) {
        font-size: 31px;
        padding-top: 30px;
        padding-bottom: 0;
    }
`;

export default AmmReporting;
