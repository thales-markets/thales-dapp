import AMMv2 from 'pages/Markets/V2/components/AMMv2';
import AssetDropdown from 'pages/Markets/V2/components/AssetDropdown';
import DatesDropdown from 'pages/Markets/V2/components/MaturityDateDropdown';
import PriceChart from 'pages/Markets/V2/components/PriceChart/PriceChart';
import useRangedMarketsQuery from 'queries/options/rangedMarkets/useRangedMarketsQuery';
import React, { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { getIsAppReady } from 'redux/modules/app';
import { getNetworkId } from 'redux/modules/wallet';
import { RootState } from 'redux/rootReducer';
import styled from 'styled-components';
import { HistoricalOptionsMarketInfo, RangedMarket } from 'types/options';
import { sortCurrencies } from 'utils/currency';

const RangeMarkets: React.FC = () => {
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));

    const [asset, setAsset] = useState<string>('ETH');
    const [maturityDate, setMaturityDate] = useState<number>();
    const [market, _setMarket] = useState<HistoricalOptionsMarketInfo>();

    const marketsQuery = useRangedMarketsQuery(networkId, { enabled: isAppReady });

    // hooks
    const optionsMarkets: RangedMarket[] = useMemo(() => {
        if (marketsQuery.isSuccess) {
            return marketsQuery.data;
        }
        return [];
    }, [networkId, marketsQuery]);

    const AssetsAndDates = useMemo(() => {
        const allAssets: Set<string> = new Set();
        const allDates: Set<number> = new Set();
        const markets = new Map();

        optionsMarkets.map((market) => {
            allAssets.add(market.currencyKey);
            if (market.currencyKey === asset) {
                allDates.add(market.maturityDate);
                const rightMarkets = markets.get(market.leftMarket.id);
                if (rightMarkets) {
                    rightMarkets.push({ address: market.rightMarket.id, strikePrice: market.rightPrice });
                    markets.set(market.leftMarket.id, rightMarkets);
                } else {
                    markets.set(market.leftMarket.id, [
                        { address: market.rightMarket.id, strikePrice: market.rightPrice },
                    ]);
                }
            }
        });

        return {
            allAssets: Array.from(allAssets).sort(sortCurrencies),
            allDates: Array.from(allDates).sort((a, b) => a - b),
        };
    }, [optionsMarkets, asset]);

    const Markets = useMemo(() => {
        const markets = new Map();

        optionsMarkets.map((market) => {
            if (maturityDate && market.maturityDate === maturityDate && market.currencyKey === asset) {
                const rightMarkets = markets.get(market.leftMarket.id);
                if (rightMarkets) {
                    rightMarkets.push({ address: market.rightMarket.id, strikePrice: market.rightPrice });
                    markets.set(market.leftMarket.id, rightMarkets);
                } else {
                    markets.set(market.leftMarket.id, [
                        { address: market.rightMarket.id, strikePrice: market.rightPrice },
                    ]);
                }
            }
        });
        return markets;
    }, [optionsMarkets, asset, maturityDate]);
    console.log(Markets);
    return (
        <Wrapper>
            <div style={{ width: '100%' }}>
                <Container>
                    <AssetDropdown asset={asset} setAsset={setAsset} allAssets={AssetsAndDates.allAssets} />
                    {AssetsAndDates && (
                        <DatesDropdown
                            date={maturityDate}
                            setDate={setMaturityDate}
                            allDates={AssetsAndDates.allDates}
                        ></DatesDropdown>
                    )}
                </Container>
                <Container>
                    <PriceChart asset={asset} />
                </Container>
                <Container></Container>
            </div>
            <AMMWrapper>
                <AMMv2 market={market}></AMMv2>
            </AMMWrapper>
        </Wrapper>
    );
};

const Wrapper = styled.div`
    display: flex;
    align-items: flex-start;
    justify-content: center;
    gap: 40px;
    width: 100%;
`;

const Container = styled.div`
    display: flex;
    width: 100%;
    justify-content: space-between;
`;

const AMMWrapper = styled.div`
    max-width: 380px;
    min-width: 380px;
`;

export default RangeMarkets;
