import { USD_SIGN } from 'constants/currency';
import ROUTES from 'constants/routes';
import useBinaryOptionsAllTradesQuery from 'queries/options/useBinaryOptionsAllTradesQuery';
import React, { useMemo, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { getIsAppReady } from 'redux/modules/app';
import { getNetworkId } from 'redux/modules/wallet';
import { RootState } from 'redux/rootReducer';
import styled from 'styled-components';
import { Background, FlexDivColumn, Text, Wrapper } from 'theme/common';
import { ExtendedTrade } from 'types/options';
import { formatCurrencyWithSign } from 'utils/formatters/number';
import snxJSConnector from 'utils/snxJSConnector';
import { OrderDirection } from '../Home/ExploreMarkets/ExploreMarketsDesktop';
import MarketHeader from '../Home/MarketHeader';
import AmmTable from './AmmTable';

const DEFAULT_ORDER_BY = 2;

export type Round2Trades = { long: number; short: number };

const AmmMining: React.FC = () => {
    const { t } = useTranslation();
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
    const [orderBy, setOrderBy] = useState(DEFAULT_ORDER_BY);
    const [orderDirection, setOrderDirection] = useState(OrderDirection.DESC);
    const [selectedRound, setSelectedRound] = useState<number>(2);

    const { ammContract } = snxJSConnector;
    const ammContractAddress = ammContract ? ammContract.address : '';

    const tradesQuery = useBinaryOptionsAllTradesQuery(networkId, {
        enabled: isAppReady,
    });
    const trades: ExtendedTrade[] = tradesQuery.isSuccess && tradesQuery.data ? tradesQuery.data : [];

    const { dataForUI, volumePerRound, volumeByOptionSide, totalVolume, uniqueTraders } = useMemo(() => {
        const map = new Map<string, number | Round2Trades>();
        const uniqueTradersMap = new Map<string, boolean>();
        let totalVolume = 0;
        let volume = 0;
        const volumeByOptionSide = { long: 0, short: 0 };
        const activeTrades = trades.filter((trade) => {
            if (trade.orderSide === 'buy' && trade.maker.toLowerCase() === ammContractAddress.toLowerCase()) {
                totalVolume += trade.takerAmount;
                uniqueTradersMap.set(trade.taker.toLowerCase(), true);
            }
            if (selectedRound === 1) {
                return 1641730030000 > trade.marketItem.timestamp;
            }
            if (selectedRound === 2) {
                return 1641730030000 < trade.marketItem.timestamp && 1643184000000 > trade.marketItem.timestamp;
            }
        });
        if (activeTrades.length > 0) {
            activeTrades.map((trade) => {
                if (trade.orderSide === 'buy' && trade.maker.toLowerCase() === ammContractAddress.toLowerCase()) {
                    if (selectedRound === 1) {
                        if (!map.has(trade.taker.toLowerCase())) {
                            map.set(trade.taker.toLowerCase(), 0);
                        }
                        const userVolume = map.get(trade.taker.toLowerCase());

                        map.set(trade.taker.toLowerCase(), (userVolume as any) + trade.takerAmount);
                        volume += trade.takerAmount;
                        return trade;
                    } else if (selectedRound === 2) {
                        if (!map.has(trade.taker.toLowerCase())) {
                            map.set(trade.taker.toLowerCase(), { long: 0, short: 0 });
                        }
                        const userVolume = map.get(trade.taker.toLowerCase());

                        map.set(trade.taker.toLowerCase(), {
                            ...(userVolume as Round2Trades),
                            [trade.optionSide]: (userVolume as Round2Trades)[trade.optionSide] + trade.takerAmount,
                        });
                        volumeByOptionSide[trade.optionSide] = volumeByOptionSide[trade.optionSide] + trade.takerAmount;
                        volume += trade.takerAmount;
                        return trade;
                    }
                }
            });
        }

        return {
            dataForUI: Array.from(map),
            volumePerRound: volume,
            volumeByOptionSide,
            totalVolume,
            uniqueTraders: Array.from(uniqueTradersMap).length,
        };
    }, [trades, selectedRound]);

    return (
        <Background>
            <Wrapper>
                <MarketHeader route={ROUTES.Options.AmmMining} />
                <Text
                    className="text-xxxl pale-grey"
                    style={{ alignSelf: 'flex-start', marginBottom: 20, marginTop: 20 }}
                >
                    {t('common.sidebar.amm-mining-label')}
                </Text>
                <FlexDivColumn style={{ flex: 0 }}>
                    <Text className="text-sm lh24 ls5 pale-grey" style={{ marginBottom: 12 }}>
                        <Trans i18nKey="options.amm-mining.subtitle1" />
                    </Text>
                    <Text className="text-sm lh24 ls5 pale-grey" style={{ marginBottom: 12 }}>
                        <Trans
                            i18nKey="options.amm-mining.subtitle1a"
                            components={{
                                b: <strong />,
                            }}
                        />
                    </Text>
                    <Text className="text-sm lh24 ls5 pale-grey" style={{ marginBottom: 12 }}>
                        <Trans
                            i18nKey="options.amm-mining.subtitle2"
                            components={{
                                b: (
                                    <a
                                        style={{ color: 'white', fontWeight: 'bold' }}
                                        href="https://thalesmarket.medium.com/round-2-of-thales-amm-markets-are-now-live-d09740d4ff22"
                                        target="_blank"
                                        rel="noreferrer"
                                    />
                                ),
                            }}
                        />
                    </Text>
                    <Text className="text-sm lh24 ls5 pale-grey" style={{ marginBottom: 12 }}>
                        {t('options.amm-mining.subtitle3')}
                    </Text>
                    <Text className="text-sm lh24 ls5 pale-grey italic" style={{ marginBottom: 12 }}>
                        {t('options.amm-mining.subtitle4')}
                    </Text>
                </FlexDivColumn>

                <InfoContainer>
                    <Text className="text-sm pale-grey bold" style={{ marginRight: 20 }}>
                        {`${t('options.leaderboard.trades.unique-traders')}: ${uniqueTraders}`}
                    </Text>
                    <Text className="text-sm pale-grey bold ">
                        {`${t('options.leaderboard.trades.volume')}: ${formatCurrencyWithSign(USD_SIGN, totalVolume)}`}
                    </Text>
                </InfoContainer>
                <AmmTable
                    dataForUi={dataForUI}
                    volume={volumePerRound}
                    volumeByOptionSide={volumeByOptionSide}
                    orderBy={orderBy}
                    orderDirection={orderDirection}
                    setOrderBy={setOrderBy}
                    setOrderDirection={setOrderDirection}
                    isLoading={tradesQuery.isLoading}
                    selectedRound={selectedRound}
                    setSelectedRound={setSelectedRound}
                    deps={[orderBy, dataForUI, volumePerRound, orderDirection]}
                />
            </Wrapper>
        </Background>
    );
};

const InfoContainer = styled.div`
    display: flex;
    justify-content: flex-start;
    width: 100%;
    margin-left: 22px;
    margin-bottom: 20px;
    margin-top: 40px;
`;

export default AmmMining;
