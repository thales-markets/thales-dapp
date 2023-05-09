import { Positions } from 'constants/options';
import AmmTrading from './components/AmmTrading/AmmTrading';
import useAvailableAssetsQuery from 'queries/options/useAvailableAssetsQuery';
import useMaturityDatesByAssetQueryQuery from 'queries/options/useMaturityDatesByAssetQuery';
import React, { useMemo, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { getIsAppReady } from 'redux/modules/app';
import { getNetworkId } from 'redux/modules/wallet';
import { RootState } from 'redux/rootReducer';
import useMarketsByAssetAndDateQuery from 'queries/options/useMarketsByAssetAndDateQuery';
import styled from 'styled-components';
import { MarketInfo, RangedMarketPerPosition } from 'types/options';
import AssetTable from './components/Table/AssetTable';
import AssetDropdown from './components/AssetDropdown';
import DatesDropdown from './components/MaturityDateDropdown';
import { FlexDivRowCentered } from 'theme/common';
import PriceChart from './components/PriceChart/PriceChart';
import RadioButtons from './components/RadioButtons/RadioButtons';
import BannerCarousel from './components/BannerCarousel/BannerCarousel';
import OpenPositions from './components/OpenPositions/OpenPositions';

const TradePage: React.FC = () => {
    // selectors
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));

    // states
    const [currencyKey, setCurrencyKey] = useState('ETH');
    const [maturityDate, setMaturityDate] = useState<number | undefined>();
    const [positionType, setPositionType] = useState(Positions.UP);
    const [market, setMarket] = useState<MarketInfo | RangedMarketPerPosition | undefined>(undefined);

    // queries
    const assetsQuery = useAvailableAssetsQuery({
        enabled: isAppReady,
    });
    const maturityQuery = useMaturityDatesByAssetQueryQuery(currencyKey, {
        enabled: isAppReady,
    });
    const marketsQuery = useMarketsByAssetAndDateQuery(networkId, currencyKey, maturityDate as number, positionType, {
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

    const getSelectedPrice = () => {
        if (market) {
            if (positionType === Positions.UP || positionType === Positions.DOWN) {
                return (market as MarketInfo).strikePrice;
            } else {
                return (market as RangedMarketPerPosition).leftPrice;
            }
        }
    };
    const getSelectedRightPrice = () => {
        if (market) {
            if (positionType === Positions.UP || positionType === Positions.DOWN) {
                return undefined;
            } else {
                return (market as RangedMarketPerPosition).rightPrice;
            }
        }
    };

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
                        selectedPrice={getSelectedPrice()}
                        selectedRightPrice={getSelectedRightPrice()}
                    ></PriceChart>
                </LeftSide>
                <RightSide>
                    <RadioButtons onChange={setPositionType} selected={positionType} />
                    <AssetTable setMarket={setMarket} markets={allMarkets} position={positionType} />
                </RightSide>
            </ContentWrapper>

            <AmmTrading
                currencyKey={currencyKey}
                maturityDate={maturityDate || 0}
                market={
                    market || {
                        currencyKey: '',
                        address: '',
                        liquidity: 0,
                        price: 0,
                        strikePrice: 0,
                        leftPrice: 0,
                        rightPrice: 0,
                        discount: 0,
                        positionType: Positions.UP,
                    }
                }
            />
            <OpenPositions />
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
