import PageLinkBanner from 'components/PageLinkBanner';
import Tooltip from 'components/Tooltip/Tooltip';
import TourStep from 'components/TourStep';
import { CRYPTO_CURRENCY_MAP } from 'constants/currency';
import ROUTES from 'constants/routes';
import { LOCAL_STORAGE_KEYS } from 'constants/storage';
import { tradePageSteps } from 'constants/tour';
import { Positions } from 'enums/options';
import { ScreenSizeBreakpoint } from 'enums/ui';
import useAvailableAssetsQuery from 'queries/options/useAvailableAssetsQuery';
import useMarketsByAssetAndDateQuery from 'queries/options/useMarketsByAssetAndDateQuery';
import useMaturityDatesByAssetQueryQuery from 'queries/options/useMaturityDatesByAssetQuery';
import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import Tour, { ReactourStep } from 'reactour';
import { getIsAppReady } from 'redux/modules/app';
import { getIsMobile, getShowTour, setShowTour } from 'redux/modules/ui';
import { getNetworkId } from 'redux/modules/wallet';
import styled, { useTheme } from 'styled-components';
import { FlexDivColumnCentered, FlexDivRowCentered } from 'styles/common';
import { MarketInfo, RangedMarketPerPosition } from 'types/options';
import { Step } from 'types/tour';
import { RootState, ThemeInterface } from 'types/ui';
import AmmTrading from './components/AmmTrading';
import AssetDropdown from './components/AssetDropdown';
import BannerCarousel from './components/BannerCarousel/BannerCarousel';
import DatesDropdown from './components/MaturityDateDropdown';
import OpenPositions from './components/OpenPositions';
import LightweightChart from './components/PriceChart/LightweightChart';
import RadioButtons from './components/RadioButtons/RadioButtons';
import AssetTable from './components/Table';

const TradePage: React.FC<RouteComponentProps> = (props) => {
    const { t } = useTranslation();
    const theme: ThemeInterface = useTheme();
    const dispatch = useDispatch();

    // selectors
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
    const showTour = useSelector((state: RootState) => getShowTour(state));
    const isMobile = useSelector((state: RootState) => getIsMobile(state));

    const isRangedMarkets = props.location?.pathname.includes(ROUTES.Options.RangeMarkets);

    // states
    const [currencyKey, setCurrencyKey] = useState(CRYPTO_CURRENCY_MAP.BTC);
    const [maturityDate, setMaturityDate] = useState<number | undefined>();
    const [positionType, setPositionType] = useState(isRangedMarkets ? Positions.IN : Positions.UP);
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

    useEffect(() => setCurrencyKey(CRYPTO_CURRENCY_MAP.BTC), [networkId]);

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

    const startTourForNewUser = localStorage.getItem(LOCAL_STORAGE_KEYS.NEW_USER_TOUR);

    useEffect(() => {
        if (startTourForNewUser == null && !isMobile) {
            dispatch(setShowTour(true));
        }
    }, [dispatch, isMobile, startTourForNewUser]);

    useEffect(() => {
        if (showTour) {
            document.documentElement.style.overflowX = 'inherit';
            document.documentElement.style.scrollBehavior = 'inherit';
        } else {
            document.documentElement.style.overflowX = 'hidden';
            document.documentElement.style.scrollBehavior = 'smooth';
        }
    }, [isMobile, showTour]);

    return (
        <Wrapper>
            {showTour && (
                <Tour
                    steps={getSteps(tradePageSteps, theme, isMobile)}
                    isOpen={showTour}
                    onRequestClose={() => {
                        dispatch(setShowTour(false));
                        localStorage.setItem(LOCAL_STORAGE_KEYS.NEW_USER_TOUR, 'false');
                    }}
                    showNumber={false}
                    disableDotsNavigation={true}
                    closeWithMask={false}
                    showButtons={false}
                    showNavigation={false}
                    disableFocusLock={true}
                    onAfterOpen={() => (document.body.style.overflowY = 'hidden')}
                    onBeforeClose={() => (document.body.style.overflowY = 'auto')}
                />
            )}
            <BannerCarousel />
            <ContentWrapper>
                <LeftSide>
                    <DropdownsWrapper>
                        <AssetWrapper className="step-1">
                            <Tooltip overlay={t('markets.steps.tooltip.choose-asset')}>
                                <Info>{t('markets.steps.choose-asset')}</Info>
                            </Tooltip>
                            {allAssets && (
                                <AssetDropdown asset={currencyKey} setAsset={setCurrencyKey} allAssets={allAssets} />
                            )}
                        </AssetWrapper>
                        <DatesWrapper className="step-2">
                            <Tooltip overlay={t('markets.steps.tooltip.choose-date')}>
                                <Info>{t('markets.steps.choose-date')}</Info>
                            </Tooltip>
                            <DatesDropdown
                                date={maturityDate}
                                setDate={setMaturityDate}
                                allDates={allDates}
                                currencyKey={currencyKey}
                            ></DatesDropdown>
                        </DatesWrapper>
                    </DropdownsWrapper>
                    <LightweightChart
                        isSpeedMarkets={false}
                        position={positionType}
                        asset={currencyKey}
                        selectedPrice={getSelectedPrice()}
                        selectedRightPrice={getSelectedRightPrice()}
                        selectedDate={maturityDate}
                    ></LightweightChart>
                </LeftSide>
                <RightSide className="step-3">
                    <PositionedWrapper>
                        <Info>{t('markets.steps.choose-direction')}</Info>
                        <RadioButtons
                            onChange={setPositionType}
                            selected={positionType}
                            currencyKey={currencyKey}
                            date={maturityDate}
                        />
                    </PositionedWrapper>

                    <AssetTable
                        setMarket={setMarket}
                        markets={allMarkets}
                        position={positionType}
                        isLoading={marketsQuery.isLoading}
                    />
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
                        roi: 0,
                        strikePrice: 0,
                        leftPrice: 0,
                        rightPrice: 0,
                        discount: 0,
                        positionType: Positions.UP,
                    }
                }
                showBuyLiquidity
            />
            <BannerWrapper>
                <PageLinkBanner rout={ROUTES.Options.SpeedMarkets} />
            </BannerWrapper>
            <OpenPositions />
        </Wrapper>
    );
};

const Wrapper = styled.div`
    width: 100%;
    max-width: 974px;
`;

const ContentWrapper = styled.div`
    width: 100%;
    display: flex;
    gap: 20px;
    margin-top: 20px;
    margin-bottom: 30px;
    justify-content: space-between;
    height: 400px;
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        flex-direction: column;
        gap: 10px;
        margin-top: 0;
        height: auto;
    }
`;

const AssetWrapper = styled(FlexDivColumnCentered)`
    display: block;
    position: relative;
    text-align: center;
    z-index: 2;
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        width: 100%;
        z-index: 10000;
    }
`;

const DatesWrapper = styled(FlexDivColumnCentered)`
    position: relative;
    text-align: center;
    z-index: 2;
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        width: 100%;
    }
`;

const PositionedWrapper = styled(FlexDivColumnCentered)`
    position: relative;
    text-align: center;
    z-index: 9999;
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        width: 100%;
    }
`;

const LeftSide = styled.div`
    height: 100%;
    width: 100%;
    max-width: 600px;
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        display: grid;
        max-width: initial;
        height: fit-content;
    }
`;
const RightSide = styled.div`
    width: 100%;
    height: 100%;
    max-width: 350px;
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        max-width: initial;
    }
`;

const Info = styled(FlexDivColumnCentered)`
    font-weight: 700;
    font-size: 15px;
    line-height: 100%;
    text-transform: uppercase;
    margin-bottom: 5px;
    color: ${(props) => props.theme.textColor.primary};
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        display: none;
    }
`;

const DropdownsWrapper = styled(FlexDivRowCentered)`
    gap: 15px;
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        flex-direction: column;
        height: 56px;
        gap: 10px;
        order: 2;
        margin-top: 10px;
        z-index: 10000;
    }
`;

const BannerWrapper = styled.div`
    margin-top: 20px;
`;

const getSteps = (steps: Step[], theme: ThemeInterface, isMobile: boolean): ReactourStep[] => {
    return steps.map((item, index) => {
        return {
            selector: item.selector,
            content: ({ goTo }) => (
                <TourStep
                    heading={item.heading}
                    content={item.content}
                    currentStep={index}
                    stepsCount={steps.length}
                    goTo={goTo}
                    key={`tour-${index}`}
                />
            ),
            highlightedSelectors: item.highlightedSelectors,
            mutationObservables: item.highlightedSelectors,
            position: isMobile ? (index > 2 ? 'top' : 'bottom') : undefined,
            style: {
                borderRadius: '8px',
                minWidth: isMobile ? '100%' : '450px',
                backgroundColor: theme.tour.background.primary,
            },
        };
    });
};

export default TradePage;
