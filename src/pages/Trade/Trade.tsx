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
import { FlexDivColumnCentered, FlexDivRowCentered } from 'theme/common';
import PriceChart from './components/PriceChart/PriceChart';
import RadioButtons from './components/RadioButtons/RadioButtons';
import BannerCarousel from './components/BannerCarousel/BannerCarousel';
import OpenPositions from './components/OpenPositions/OpenPositions';
import Loader from 'components/Loader';
import { useTranslation } from 'react-i18next';

const TradePage: React.FC = () => {
    // selectors
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
    const { t } = useTranslation();

    // states
    const [currencyKey, setCurrencyKey] = useState('ETH');
    const [maturityDate, setMaturityDate] = useState<number | undefined>();
    const [positionType, setPositionType] = useState(Positions.UP);
    const [market, setMarket] = useState<MarketInfo | RangedMarketPerPosition | undefined>(undefined);

    // queries
    const assetsQuery = useAvailableAssetsQuery(networkId, {
        enabled: isAppReady,
    });
    const maturityQuery = useMaturityDatesByAssetQueryQuery(currencyKey, networkId, {
        enabled: isAppReady,
    });
    const marketsQuery = useMarketsByAssetAndDateQuery(currencyKey, Number(maturityDate), positionType, networkId, {
        enabled: !!maturityDate,
    });

    // hooks
    const allAssets = useMemo(() => {
        if (assetsQuery.isSuccess && assetsQuery.data) {
            return assetsQuery.data;
        }
        return [];
    }, [assetsQuery.isSuccess, assetsQuery.data]);

    const allDates = useMemo(() => {
        if (maturityQuery.isSuccess && maturityQuery.data) {
            return maturityQuery.data;
        }
        return [];
    }, [maturityQuery.isSuccess, maturityQuery.data]);

    const allMarkets = useMemo(() => {
        if (marketsQuery.isSuccess && marketsQuery.data) {
            return marketsQuery.data;
        }
        return [];
    }, [marketsQuery.isSuccess, marketsQuery.data]);

    useEffect(() => {
        if (allDates.length) {
            setMaturityDate(allDates[0]);
        }
    }, [allDates]);

    useEffect(() => setCurrencyKey('ETH'), [networkId]);

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
                            <DropdownsWrapper>
                                <PositionedWrapper>
                                    <Info>{t('options.trade.steps.choose-asset')}</Info>
                                    {allAssets && (
                                        <AssetDropdown
                                            asset={currencyKey}
                                            setAsset={setCurrencyKey}
                                            allAssets={allAssets}
                                        />
                                    )}
                                </PositionedWrapper>
                                <PositionedWrapper>
                                    <Info>{t('options.trade.steps.choose-date')}</Info>
                                    <DatesDropdown
                                        date={maturityDate}
                                        setDate={setMaturityDate}
                                        allDates={allDates}
                                    ></DatesDropdown>
                                </PositionedWrapper>
                            </DropdownsWrapper>
                            <PriceChart
                                position={positionType}
                                asset={currencyKey}
                                selectedPrice={getSelectedPrice()}
                                selectedRightPrice={getSelectedRightPrice()}
                            ></PriceChart>
                        </LeftSide>
                        <RightSide>
                            <PositionedWrapper>
                                <Info>{t('options.trade.steps.choose-direction')}</Info>
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
    max-width: 974px;
    margin-bottom: 30px;
`;

const ContentWrapper = styled.div`
    width: 100%;
    display: flex;
    gap: 30px;
    margin-top: 20px;
    margin-bottom: 30px;
    justify-content: space-between;
    height: 400px;
    @media (max-width: 767px) {
        flex-direction: column;
        gap: 10px;
    }
`;

const PositionedWrapper = styled(FlexDivColumnCentered)`
    position: relative;
    text-align: center;
    @media (max-width: 767px) {
        width: 100%;
    }
`;

const LeftSide = styled.div`
    height: 100%;
    width: 100%;
    max-width: 600px;
    @media (max-width: 767px) {
        max-width: initial;
        height: 60px;
    }
`;
const RightSide = styled.div`
    width: 100%;
    height: 100%;
    max-width: 350px;
    @media (max-width: 767px) {
        max-width: initial;
    }
`;

const Info = styled(FlexDivColumnCentered)`
    font-weight: 700;
    font-size: 18px;
    line-height: 100%;
    text-transform: uppercase;
    margin-bottom: 5px;
    color: ${(props) => props.theme.textColor.primary};
    @media (max-width: 767px) {
        display: none;
    }
`;

const DropdownsWrapper = styled(FlexDivRowCentered)`
    gap: 15px;
    @media (max-width: 767px) {
        flex-direction: column;
        gap: 10px;
    }
`;

export default TradePage;
