import { POSITIONS } from 'constants/options';
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

const TradePage: React.FC = () => {
    // selectors
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));

    // states
    const [_currencyKey, _setCurrencyKey] = useState('ETH');
    const [_maturityDate, _setMaturityDate] = useState<number | undefined>();
    const [_positionType, _setPositionType] = useState(POSITIONS.UP);
    const [_market, setMarket] = useState<MarketInfo | undefined>(undefined);

    // queries
    const assetsQuery = useAvailableAssetsQuery({
        enabled: isAppReady,
        refetchInterval: false,
    });
    const maturityQuery = useMaturityDatesByAssetQueryQuery(_currencyKey, {
        enabled: isAppReady,
        refetchInterval: false,
    });
    const marketsQuery = useMarketsByAssetAndDateQuery(_currencyKey, _maturityDate as number, _positionType, {
        enabled: _maturityDate !== undefined,
        refetchInterval: false,
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
            _setMaturityDate(allDates[0]);
        }
    }, [allDates]);

    return (
        <Wrapper>
            <Banners />
            <ContentWrapper>
                <LeftSide>
                    <FlexDivRowCentered>
                        <div>
                            {allAssets && (
                                <AssetDropdown asset={_currencyKey} setAsset={_setCurrencyKey} allAssets={allAssets} />
                            )}
                        </div>
                        <div>
                            {allDates}
                            <DatesDropdown
                                date={_maturityDate}
                                setDate={_setMaturityDate}
                                allDates={allDates}
                            ></DatesDropdown>
                        </div>
                    </FlexDivRowCentered>
                    <PriceChart asset={_currencyKey} selectedPrice={_market?.strikePrice}></PriceChart>
                </LeftSide>
                <RightSide>
                    <AssetTable setMarket={setMarket} markets={allMarkets} />
                </RightSide>
            </ContentWrapper>

            <Trading
                currencyKey={_currencyKey}
                maturityDate={new Date(new Date().setDate(new Date().getDate() + 10))}
                positionType={_positionType}
                strikePrice={20900}
                marketAddress="0x7eed10dfc2c636fd6e8100c38769813ed3771cbe"
            />
        </Wrapper>
    );
};

const Banners = styled.div`
    width: 100%;
    height: 120px;
    border: 1px solid var(--color-white);
    border-radius: 12px;
`;

const Wrapper = styled.div`
    width: 100%;
    max-width: 1000px;
`;

const ContentWrapper = styled.div`
    width: 100%;
    display: flex;
    gap: 30px;
    height: 400px;
`;
const LeftSide = styled.div`
    height: 100%;
`;
const RightSide = styled.div`
    width: 100%;
    height: 100%;
`;

export default TradePage;
