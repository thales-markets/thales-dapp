import SimpleLoader from 'components/SimpleLoader';
import TooltipInfo from 'components/Tooltip';
import { secondsToMilliseconds, subDays } from 'date-fns';
import { Positions } from 'enums/options';
import { ScreenSizeBreakpoint } from 'enums/ui';
import useInterval from 'hooks/useInterval';
import usePythCandlestickQuery from 'queries/prices/usePythCandlestickQuery';
import useExchangeRatesQuery from 'queries/rates/useExchangeRatesQuery';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { getIsAppReady } from 'redux/modules/app';
import { getIsDeprecatedCurrency } from 'redux/modules/ui';
import { getNetworkId } from 'redux/modules/wallet';
import styled from 'styled-components';
import { FlexDiv, FlexDivCentered, FlexDivRowCentered, FlexDivSpaceBetween } from 'styles/common';
import { bigNumberFormatter, bytesFormatter } from 'thales-utils';
import { calculatePercentageChange, formatPricePercentageGrowth } from 'utils/formatters/number';
import { getContractForInteraction } from 'utils/options';
import snxJSConnector from 'utils/snxJSConnector';
import { ChartComponent } from './components/Chart/ChartContext';
import CurrentPrice from './components/CurrentPrice';
import Toggle from './components/DateToggle';

type LightweightChartProps = {
    asset: string;
    position: Positions | undefined;
    selectedPrice?: number;
    selectedDate?: number;
    selectedRightPrice?: number;
};

const getToggleButtons = (now: Date) => [
    { label: '15m', resolution: '15', value: 2, startDate: Number(subDays(now, 2)) },
    { label: '30m', resolution: '30', value: 4, startDate: Number(subDays(now, 4)) },
    { label: '1H', resolution: '60', value: 14, startDate: Number(subDays(now, 14)) },
    { label: '4H', resolution: '240', value: 28, startDate: Number(subDays(now, 28)) },
    { label: '1D', resolution: '1D', value: 120, startDate: Number(subDays(now, 120)) },
    { label: '1W', resolution: '1W', value: 365, startDate: Number(subDays(now, 365)) }, // API history limit is 1 year range
];

const DEFAULT_TOGGLE_BUTTON_INDEX = 2;
const CHART_REFRESH_INTERVAL_SEC = 30;

const LightweightChart: React.FC<LightweightChartProps> = ({
    asset,
    selectedPrice,
    selectedRightPrice,
    position,
    selectedDate,
}) => {
    const { t } = useTranslation();

    const isAppReady = useSelector(getIsAppReady);
    const networkId = useSelector(getNetworkId);
    const isDeprecatedCurrency = useSelector(getIsDeprecatedCurrency);

    const [now, setNow] = useState(new Date());
    const [processedPriceData, setProcessedPriceData] = useState<number>(0);
    const [dateRange, setDateRange] = useState(getToggleButtons(now)[DEFAULT_TOGGLE_BUTTON_INDEX]);
    const [selectedToggleIndex, setToggleIndex] = useState(DEFAULT_TOGGLE_BUTTON_INDEX);

    const [candleData, setCandleData] = useState<any>();

    const [iv, setIV] = useState(0);

    const exchangeRatesMarketDataQuery = useExchangeRatesQuery(networkId, {
        enabled: isAppReady,
    });

    const pythQuery = usePythCandlestickQuery(asset, dateRange.startDate, Number(now), dateRange.resolution, {
        enabled: isAppReady,
        refetchInterval: secondsToMilliseconds(CHART_REFRESH_INTERVAL_SEC),
    });

    const candleStickData = useMemo(() => {
        if (pythQuery.isSuccess && pythQuery.data) {
            return pythQuery.data;
        }
    }, [pythQuery.isSuccess, pythQuery.data]);

    const currentPrice = useMemo(() => {
        if (exchangeRatesMarketDataQuery.isSuccess && exchangeRatesMarketDataQuery.data) {
            return exchangeRatesMarketDataQuery.data[asset];
        }
    }, [exchangeRatesMarketDataQuery.isSuccess, exchangeRatesMarketDataQuery.data, asset]);

    useEffect(() => {
        if (currentPrice && candleStickData && candleStickData.length) {
            const cloneData = [...candleStickData];
            cloneData[cloneData.length - 1].close = currentPrice;
            setProcessedPriceData(
                calculatePercentageChange(candleStickData[candleStickData.length - 2].close, currentPrice)
            );
            setCandleData(cloneData);
        } else {
            setCandleData(null);
        }
    }, [currentPrice, candleStickData]);

    useEffect(() => {
        const { ammContract, ammUSDCContract } = snxJSConnector;
        const ammContractForInteraction = getContractForInteraction(
            networkId,
            isDeprecatedCurrency,
            ammContract,
            ammUSDCContract
        );
        const getImpliedVolatility = async () => {
            try {
                const impliedVolatility = await ammContractForInteraction?.impliedVolatilityPerAsset(
                    bytesFormatter(asset)
                );
                setIV(bigNumberFormatter(impliedVolatility));
            } catch (e) {
                console.log(e);
            }
        };

        getImpliedVolatility();
    }, [asset, isDeprecatedCurrency, networkId]);

    useInterval(() => {
        setNow(new Date());
    }, secondsToMilliseconds(CHART_REFRESH_INTERVAL_SEC));

    const handleDateRangeChange = useCallback(
        (value: number) => {
            setDateRange(getToggleButtons(now)[value]);
            setToggleIndex(value);
        },
        [now]
    );

    return (
        <Wrapper>
            <FlexDivSpaceBetween>
                <FlexDivRowCentered>
                    <CurrentPrice asset={asset} currentPrice={currentPrice} />
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
                <PriceChange up={processedPriceData > 0}>{formatPricePercentageGrowth(processedPriceData)}</PriceChange>
            </FlexDivSpaceBetween>
            <ChartContainer>
                {pythQuery.isLoading ? (
                    <SimpleLoader />
                ) : !candleData ? (
                    <EmptyChart>{t('common.no-chart-data')}</EmptyChart>
                ) : (
                    <ChartComponent
                        resolution={dateRange.resolution}
                        data={candleData}
                        position={position}
                        asset={asset}
                        selectedPrice={selectedPrice}
                        selectedRightPrice={selectedRightPrice}
                        selectedDate={selectedDate}
                    />
                )}
            </ChartContainer>

            <Toggle
                options={getToggleButtons(now)}
                disabled={!candleData}
                selectedIndex={selectedToggleIndex}
                onChange={handleDateRangeChange}
            />
        </Wrapper>
    );
};

const Wrapper = styled.div`
    position: relative;
    width: 100%;
    height: 100%;
    margin-top: 15px;
    z-index: 0;
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        height: 352px;
    }
`;

const ChartContainer = styled.div`
    height: 284px;
    margin-top: 15px;
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
    @media (max-width: ${ScreenSizeBreakpoint.EXTRA_SMALL}px) {
        font-size: 16px;
    }
`;

const Value = styled.span<{ margin?: string }>`
    font-weight: 400;
    font-size: 18px;
    line-height: 100%;
    color: ${(props) => props.theme.textColor.primary};
    ${(props) => (props.margin ? `margin: ${props.margin};` : '')};
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        font-size: 18px;
    }
    @media (max-width: ${ScreenSizeBreakpoint.EXTRA_SMALL}px) {
        font-size: 16px;
    }
`;

const EmptyChart = styled(FlexDivCentered)`
    height: 100%;
    color: ${(props) => props.theme.textColor.primary};
    font-size: 23px;
    text-transform: uppercase;
`;

export default LightweightChart;
