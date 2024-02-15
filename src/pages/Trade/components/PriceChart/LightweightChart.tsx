import TooltipInfo from 'components/Tooltip';
import { USD_SIGN } from 'constants/currency';
import { LINKS } from 'constants/links';
import { Positions } from 'enums/options';
import { ScreenSizeBreakpoint } from 'enums/ui';

import usePythCandlestickQuery from 'queries/prices/usePythCandlestickQuery';
import useExchangeRatesQuery from 'queries/rates/useExchangeRatesQuery';
import React, { useEffect, useMemo, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { getIsAppReady } from 'redux/modules/app';
import { getNetworkId } from 'redux/modules/wallet';
import { RootState } from 'redux/rootReducer';
import styled from 'styled-components';
import { FlexDiv, FlexDivRowCentered, FlexDivSpaceBetween } from 'styles/common';
import { bigNumberFormatter, bytesFormatter, formatCurrencyWithSign } from 'thales-utils';
import { Risk, RiskPerAsset, RiskPerAssetAndPosition } from 'types/options';

import { formatPricePercentageGrowth } from 'utils/formatters/number';
import snxJSConnector from 'utils/snxJSConnector';
import CurrentPrice from './components/CurrentPrice';
import Toggle from './components/DateToggle';
import { ChartComponent } from './ChartContext';

type LightweightChartProps = {
    asset: string;
    position: Positions | undefined;
    isSpeedMarkets: boolean;
    selectedPrice?: number;
    selectedDate?: number;
    selectedRightPrice?: number;
    explicitCurrentPrice?: number;
    prevExplicitPrice?: number;
    chainedRisk?: Risk;
    risksPerAsset?: RiskPerAsset[];
    risksPerAssetAndDirection?: RiskPerAssetAndPosition[];
};

const ToggleButtons = [
    { label: '15m', resolution: '15', value: 2 },
    { label: '30m', resolution: '30', value: 4 },
    { label: '1H', resolution: '60', value: 14 },
    { label: '4H', resolution: '240', value: 28 },
    { label: '1D', resolution: '1D', value: 120 },
    { label: '1W', resolution: '1W', value: 730 },
];
const DEFAULT_TOGGLE_BUTTON_INDEX = 2;
const DEFAULT_TOGGLE_BUTTON_INDEX_SPEED_MARKETS = 0;

const LightweightChart: React.FC<LightweightChartProps> = ({
    asset,
    selectedPrice,
    position,
    selectedDate,
    isSpeedMarkets,
    explicitCurrentPrice,
    prevExplicitPrice,
    chainedRisk,
    risksPerAsset,
    risksPerAssetAndDirection,
}) => {
    const { t } = useTranslation();

    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
    const networkId = useSelector((state: RootState) => getNetworkId(state));

    const [processedPriceData] = useState<number>(0);
    const [dateRange, setDateRange] = useState(
        !isSpeedMarkets
            ? ToggleButtons[DEFAULT_TOGGLE_BUTTON_INDEX]
            : ToggleButtons[DEFAULT_TOGGLE_BUTTON_INDEX_SPEED_MARKETS]
    );

    const [candleData, setCandleData] = useState<any>();
    const [areaData, setAreaData] = useState<any>();

    const [iv, setIV] = useState(0);

    const exchangeRatesMarketDataQuery = useExchangeRatesQuery(networkId, {
        enabled: isAppReady,
    });

    const pythQuery = usePythCandlestickQuery(asset, dateRange.value, dateRange.resolution, {
        enabled: isAppReady,
        refetchInterval: 5000,
    });

    const candleStickData = useMemo(() => {
        if (pythQuery.isSuccess && pythQuery.data) {
            return pythQuery.data;
        }
    }, [pythQuery.isSuccess, pythQuery.data]);

    const currentPrice = useMemo(() => {
        if (explicitCurrentPrice) {
            return explicitCurrentPrice;
        } else if (exchangeRatesMarketDataQuery.isSuccess && exchangeRatesMarketDataQuery.data) {
            return exchangeRatesMarketDataQuery.data[asset];
        }
    }, [exchangeRatesMarketDataQuery.isSuccess, exchangeRatesMarketDataQuery.data, asset, explicitCurrentPrice]);

    useEffect(() => {
        if (currentPrice && candleStickData) {
            const cloneData = [...candleStickData];
            cloneData[cloneData.length - 1].close = currentPrice;
            setCandleData(cloneData);
        }
    }, [currentPrice, candleStickData]);

    useEffect(() => {
        if (selectedPrice && selectedDate && position && candleStickData) {
            const lineDataSelected = candleStickData.map((datapoint) => ({
                time: datapoint.time,
                value: selectedPrice,
            }));
            const deltaTime = candleStickData[1].time - candleStickData[0].time;
            while (lineDataSelected[lineDataSelected.length - 1].time + deltaTime < selectedDate / 1000) {
                lineDataSelected.push({
                    time: lineDataSelected[lineDataSelected.length - 1].time + deltaTime,
                    value: selectedPrice,
                });
            }
            lineDataSelected.push({
                time: selectedDate / 1000,
                value: selectedPrice,
            });
            setAreaData(lineDataSelected);
        }
    }, [selectedPrice, selectedDate, position, candleStickData]);

    const handleDateRangeChange = (value: number) => {
        setDateRange(ToggleButtons[value]);
    };

    useEffect(() => {
        const { ammContract } = snxJSConnector;
        const getImpliedVolatility = async () => {
            try {
                const impliedVolatility = await ammContract?.impliedVolatilityPerAsset(bytesFormatter(asset));
                setIV(bigNumberFormatter(impliedVolatility));
            } catch (e) {
                console.log(e);
            }
        };

        if (!isSpeedMarkets) {
            getImpliedVolatility();
        }
    }, [asset, isSpeedMarkets]);

    const risk = chainedRisk
        ? chainedRisk
        : risksPerAsset?.filter((riskPerAsset) => riskPerAsset.currency === asset)[0];
    const liquidity = risk ? formatCurrencyWithSign(USD_SIGN, risk.max - risk.current) : 0;

    const riskPerDirectionUp = risksPerAssetAndDirection?.filter(
        (risk) => risk.currency === asset && risk.position === Positions.UP
    )[0];
    const liquidityPerUp = riskPerDirectionUp
        ? formatCurrencyWithSign(USD_SIGN, riskPerDirectionUp.max - riskPerDirectionUp.current)
        : 0;
    const riskPerDirectionDown = risksPerAssetAndDirection?.filter(
        (risk) => risk.currency === asset && risk.position === Positions.DOWN
    )[0];
    const liquidityPerDown = riskPerDirectionDown
        ? formatCurrencyWithSign(USD_SIGN, riskPerDirectionDown.max - riskPerDirectionDown.current)
        : 0;

    return (
        <Wrapper>
            <FlexDivSpaceBetween margin="15px 0px">
                <FlexDivRowCentered>
                    <CurrentPrice
                        asset={asset}
                        currentPrice={currentPrice}
                        animatePrice={isSpeedMarkets}
                        isPriceUp={isSpeedMarkets ? (explicitCurrentPrice || 0) > (prevExplicitPrice || 0) : undefined}
                    />
                    {isSpeedMarkets && (
                        <TooltipInfo
                            overlay={t('speed-markets.tooltips.current-price')}
                            customIconStyling={{ marginTop: '1px' }}
                        />
                    )}
                    {!!iv && (
                        <FlexDiv>
                            <Value margin="0 0 0 20px">{`IV ${iv}%`}</Value>
                            <TooltipInfo
                                overlay={t('markets.amm-trading.iv-tooltip')}
                                customIconStyling={{ marginTop: '1px' }}
                            />
                        </FlexDiv>
                    )}
                </FlexDivRowCentered>
                {isSpeedMarkets ? (
                    !!liquidity && (
                        <FlexDiv>
                            <Value>{`${t('common.liquidity')} ${liquidity}`}</Value>
                            <TooltipInfo
                                overlay={
                                    <Trans
                                        i18nKey={
                                            chainedRisk
                                                ? 'speed-markets.chained.tooltips.liquidity'
                                                : 'speed-markets.tooltips.liquidity'
                                        }
                                        components={{
                                            br: <br />,
                                        }}
                                        values={{
                                            liquidityPerUp,
                                            liquidityPerDown,
                                        }}
                                    />
                                }
                                customIconStyling={{ marginTop: '1px' }}
                            />
                        </FlexDiv>
                    )
                ) : (
                    <PriceChange up={processedPriceData > 0}>
                        {formatPricePercentageGrowth(processedPriceData)}
                    </PriceChange>
                )}
            </FlexDivSpaceBetween>
            <ChartContainer>
                <ChartComponent
                    data={candleData}
                    areaData={areaData}
                    position={position}
                    asset={asset}
                    selectedPrice={selectedPrice}
                    isSpeedMarkets={isSpeedMarkets}
                />
            </ChartContainer>

            <Toggle
                options={ToggleButtons}
                defaultSelectedIndex={
                    isSpeedMarkets ? DEFAULT_TOGGLE_BUTTON_INDEX_SPEED_MARKETS : DEFAULT_TOGGLE_BUTTON_INDEX
                }
                onChange={handleDateRangeChange}
            />

            {isSpeedMarkets && !pythQuery.isLoading && (
                <PythIconWrap>
                    <a target="_blank" rel="noreferrer" href={LINKS.Pyth}>
                        <i className="icon icon--pyth" />
                    </a>
                </PythIconWrap>
            )}
        </Wrapper>
    );
};

const Wrapper = styled.div`
    position: relative;
    width: 100%;
    height: 100%;
`;

const ChartContainer = styled.div`
    height: 284px;
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        display: none;
    }
`;

const PriceChange = styled.span<{ up: boolean }>`
    font-style: normal;
    font-weight: 700;
    font-size: 22px;
    line-height: 100%;
    color: ${(props) => (props.up ? props.theme.textColor.quaternary : props.theme.textColor.tertiary)};
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        font-size: 18px;
    }
`;

const Value = styled.span<{ margin?: string }>`
    font-weight: 400;
    font-size: 18px;
    line-height: 100%;
    color: ${(props) => props.theme.textColor.primary};
    ${(props) => (props.margin ? `margin: ${props.margin};` : '')};
`;

const PythIconWrap = styled.div`
    position: absolute;
    height: 20px;
    right: 20px;
    bottom: 35px;
    z-index: 1;
    i {
        font-size: 40px;
        line-height: 10px;
        color: ${(props) => props.theme.textColor.primary};
    }
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        display: none;
    }
`;

export default LightweightChart;
