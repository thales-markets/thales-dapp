import { Positions } from 'constants/options';
import Trading from './components/Trading/Trading';
import useAvailableAssetsQuery from 'queries/options/useAvailableAssetsQuery';
import useMaturityDatesByAssetQueryQuery from 'queries/options/useMaturityDatesByAssetQuery';
import React, { useMemo, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { getIsAppReady } from 'redux/modules/app';
import { getNetworkId } from 'redux/modules/wallet';
import { RootState } from 'redux/rootReducer';
import useMarketsByAssetAndDateQuery from 'queries/options/useMarketsByAssetAndDateQuery';
import styled from 'styled-components';
import { MarketInfo } from 'types/options';
import AssetTable from './components/Table/AssetTable';
import AssetDropdown from 'pages/Markets/V2/components/AssetDropdown';
import DatesDropdown from 'pages/Markets/V2/components/MaturityDateDropdown';
import { FlexDivRowCentered } from 'theme/common';
import PriceChart from 'pages/Markets/V2/components/PriceChart/PriceChart';
import RadioButtons from './components/RadioButtons/RadioButtons';
import BannerCarousel from './components/BannerCarousel/BannerCarousel';

const TradePage: React.FC = () => {
    // selectors
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));

    // states
    const [currencyKey, setCurrencyKey] = useState('ETH');
    const [maturityDate, setMaturityDate] = useState<number | undefined>();
    const [positionType, setPositionType] = useState(Positions.UP);
    const [market, setMarket] = useState<MarketInfo | undefined>(undefined);

    // queries
    const assetsQuery = useAvailableAssetsQuery({
        enabled: isAppReady,
    });
    const maturityQuery = useMaturityDatesByAssetQueryQuery(currencyKey, {
        enabled: isAppReady,
    });
    const marketsQuery = useMarketsByAssetAndDateQuery(currencyKey, maturityDate as number, positionType, {
        enabled: maturityDate !== undefined,
    });

    // hooks
    const allAssets = useMemo(() => {
        if (assetsQuery.isSuccess) return assetsQuery.data;
        return [];
    }, [assetsQuery, networkId]);

    const allDates = useMemo(() => {
        if (maturityQuery.isSuccess) return maturityQuery.data;
        return [];
    }, [networkId, maturityQuery]);

    const allMarkets = useMemo(() => {
        if (marketsQuery.isSuccess) return marketsQuery.data;
        return [];
    }, [networkId, marketsQuery]);

    useEffect(() => {
        if (allDates.length) {
            setMaturityDate(allDates[0]);
        }
    }, [allDates]);

    return (
        <Wrapper>
            <BannerCarousel />
            <ContentWrapper>
                <LeftSide>
                    <FlexDivRowCentered style={{ gap: 15 }}>
                        <div>
                            {allAssets && (
                                <AssetDropdown asset={currencyKey} setAsset={setCurrencyKey} allAssets={allAssets} />
                            )}
                        </div>
                        <div>
                            <DatesDropdown
                                date={maturityDate}
                                setDate={setMaturityDate}
                                allDates={allDates}
                            ></DatesDropdown>
                        </div>
                    </FlexDivRowCentered>
                    <PriceChart
                        position={positionType}
                        asset={currencyKey}
                        selectedPrice={market?.strikePrice}
                    ></PriceChart>
                </LeftSide>
                <RightSide>
                    <RadioButtons onChange={setPositionType} selected={positionType} />
                    <AssetTable setMarket={setMarket} markets={allMarkets} />
                </RightSide>
            </ContentWrapper>

            <Trading
                currencyKey={currencyKey}
                maturityDate={maturityDate || 0}
                positionType={positionType}
                market={market || { currencyKey: '', address: '', liquidity: 0, price: 0, strikePrice: 0, discount: 0 }}
            />
        </Wrapper>
    );
};

const Wrapper = styled.div`
    width: 100%;
    max-width: 1000px;
`;

const ContentWrapper = styled.div`
    width: 100%;
    display: flex;
    gap: 30px;
    height: 400px;
    margin-top: 20px;
    margin-bottom: 35px;
    justify-content: space-between;
`;
const LeftSide = styled.div`
    height: 100%;
    width: 100%;
    max-width: 600px;
`;
const RightSide = styled.div`
    width: 100%;
    height: 100%;
    max-width: 350px;
    gap: 20px;
`;

export default TradePage;
