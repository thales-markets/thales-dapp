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
import Loader from 'components/Loader';

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
            {networkId === 1 ? (
                <Loader hideMainnet={true} />
            ) : (
                <>
                    <BannerCarousel />
                    <ContentWrapper>
                        <LeftSide>
                            <FlexDivRowCentered style={{ gap: 15 }}>
                                <PositionedWrapper>
                                    <InfoWrapper>
                                        <Number>1</Number>
                                        <Info>Choose Asset</Info>
                                    </InfoWrapper>
                                    {allAssets && (
                                        <AssetDropdown
                                            asset={currencyKey}
                                            setAsset={setCurrencyKey}
                                            allAssets={allAssets}
                                        />
                                    )}
                                </PositionedWrapper>
                                <PositionedWrapper>
                                    <InfoWrapper>
                                        <Number>2</Number>
                                        <Info>Choose Date</Info>
                                    </InfoWrapper>
                                    <DatesDropdown
                                        date={maturityDate}
                                        setDate={setMaturityDate}
                                        allDates={allDates}
                                    ></DatesDropdown>
                                </PositionedWrapper>
                            </FlexDivRowCentered>
                            <PriceChart
                                position={positionType}
                                asset={currencyKey}
                                selectedPrice={getSelectedPrice()}
                                selectedRightPrice={getSelectedRightPrice()}
                            ></PriceChart>
                        </LeftSide>
                        <RightSide>
                            <PositionedWrapper>
                                <InfoWrapper marginLeft={45}>
                                    <Number>3</Number>
                                    <Info>Choose Direction</Info>
                                </InfoWrapper>
                                <RadioButtons onChange={setPositionType} selected={positionType} />
                            </PositionedWrapper>

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
                </>
            )}
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
    margin-top: 70px;
    margin-bottom: 35px;
    justify-content: space-between;
`;

const PositionedWrapper = styled.div`
    position: relative;
`;

const InfoWrapper = styled.div<{ marginLeft?: number }>`
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    top: -50px;
    left: 10px;
    margin-left: ${(props) => props.marginLeft}px;
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
`;

const Info = styled.span`
    font-family: 'Titillium Web';
    font-style: normal;
    font-weight: 700;
    font-size: 22px;
    line-height: 100%;
    text-transform: uppercase;
    color: ${(props) => props.theme.textColor.primary};
`;

const Number = styled(Info)`
    border-radius: 50%;
    border: 2px solid ${(props) => props.theme.textColor.primary};
    padding: 3px 8px;
    line-height: 22px;
    margin-right: 20px;
`;

export default TradePage;
