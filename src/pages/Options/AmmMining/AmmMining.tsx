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

const AmmMining: React.FC = () => {
    const { t } = useTranslation();
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
    const [orderBy, setOrderBy] = useState(DEFAULT_ORDER_BY);
    const [orderDirection, setOrderDirection] = useState(OrderDirection.DESC);
    const { ammContract } = snxJSConnector;
    const ammContractAddress = ammContract ? ammContract.address : '';

    const tradesQuery = useBinaryOptionsAllTradesQuery(networkId, {
        enabled: isAppReady,
    });
    const trades: ExtendedTrade[] = tradesQuery.isSuccess && tradesQuery.data ? tradesQuery.data : [];

    const { dataForUI, volume } = useMemo(() => {
        const map = new Map<string, number>();
        let volume = 0;
        if (trades.length > 0) {
            trades.map((trade) => {
                if (trade.orderSide === 'buy' && trade.maker.toLowerCase() === ammContractAddress.toLowerCase()) {
                    if (!map.has(trade.taker.toLowerCase())) {
                        map.set(trade.taker.toLowerCase(), 0);
                    }
                    const userVolume = map.get(trade.taker.toLowerCase());

                    map.set(trade.taker.toLowerCase(), (userVolume as any) + trade.takerAmount);
                    volume += trade.takerAmount;
                    return trade;
                }
            });
        }

        return { dataForUI: Array.from(map), volume };
    }, [trades]);

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
                        <Trans
                            i18nKey="options.amm-mining.subtitle1"
                            components={{
                                a: (
                                    <a
                                        style={{ color: 'white', fontWeight: 'bold' }}
                                        href="https://thalesmarket.io/markets"
                                    />
                                ),
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
                                        href="https://thalesmarket.medium.com/thales-l2-deployment-2021-in-review-and-next-steps-975d2374d676"
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
                        {`${t('options.leaderboard.trades.unique-traders')}: ${dataForUI.length}`}
                    </Text>
                    <Text className="text-sm pale-grey bold ">
                        {`${t('options.leaderboard.trades.volume')}: ${formatCurrencyWithSign(USD_SIGN, volume)}`}
                    </Text>
                </InfoContainer>
                <AmmTable
                    dataForUi={dataForUI}
                    volume={volume}
                    orderBy={orderBy}
                    orderDirection={orderDirection}
                    setOrderBy={setOrderBy}
                    setOrderDirection={setOrderDirection}
                    isLoading={tradesQuery.isLoading}
                    deps={[orderBy, dataForUI, volume, orderDirection]}
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
