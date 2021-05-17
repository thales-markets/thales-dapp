import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FIAT_CURRENCY_MAP, USD_SIGN } from 'constants/currency';
import { ReactComponent as OptionsLineIcon } from 'assets/images/options-line.svg';
// import { ReactComponent as DollarSignIcon } from 'assets/images/dollar-sign.svg';
import { formatCurrencyWithSign } from 'utils/formatters/number';
// import { PeriodLabel, PERIOD_LABELS_MAP, PERIOD_LABELS } from 'constants/period';
import Currency from 'components/Currency';
import PriceChart from './PriceChart';
import OptionsChart from './OptionsChart';
import { useMarketContext } from '../contexts/MarketContext';
import { useSelector } from 'react-redux';
import { RootState } from 'redux/rootReducer';
import { getNetworkId } from 'redux/modules/wallet';
import { getIsAppReady } from 'redux/modules/app';
import useBinaryOptionsTransactionsQuery from 'queries/options/useBinaryOptionsTransactionsQuery';
import { calculateTimestampForPeriod } from 'utils/rates';
import { Period, PERIOD_IN_HOURS } from 'constants/period';
import TradingViewWidget from 'react-tradingview-widget';
import { assetToTradingViewMap } from 'config/tradingView';
import { FlexDivColumn, FlexDivRowCentered, FlexDiv } from 'theme/common';
import styled from 'styled-components';

type ChartType = 'price' | 'options' | 'trading-view';

const ChartCard: React.FC = () => {
    // const [selectedPeriod, setSelectedPeriod] = useState<PeriodLabel>(PERIOD_LABELS_MAP.ONE_MONTH);
    const { t } = useTranslation();
    const optionsMarket = useMarketContext();
    const [chartType, setChartType] = useState<ChartType>('trading-view');
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));

    const marketTransactionsQuery = useBinaryOptionsTransactionsQuery(optionsMarket.address, networkId, {
        enabled: isAppReady,
    });
    const minTimestamp =
        marketTransactionsQuery.isSuccess && marketTransactionsQuery.data.length > 0
            ? Math.trunc(marketTransactionsQuery.data[marketTransactionsQuery.data.length - 1].timestamp / 1000)
            : calculateTimestampForPeriod(PERIOD_IN_HOURS[Period.ONE_MONTH]);

    const maxTimestamp =
        optionsMarket.phase === 'maturity'
            ? Math.trunc(optionsMarket.maturityDate / 1000)
            : Math.trunc(new Date().getTime() / 1000);

    const isChartEnabled = marketTransactionsQuery.isSuccess && marketTransactionsQuery.data.length > 0;

    const chartProps = {
        optionsMarket,
        minTimestamp,
        maxTimestamp,
        isChartEnabled,
    };

    return (
        <Container style={{ width: '100%', height: '100%' }}>
            <WidgetHeader>
                <WidgetTitle>
                    <Currency.Pair
                        baseCurrencyKey={optionsMarket.currencyKey}
                        baseCurrencyAsset={optionsMarket.asset}
                        quoteCurrencyKey={FIAT_CURRENCY_MAP.USD}
                        iconProps={{
                            type: 'asset',
                        }}
                    />
                    <Splitter>|</Splitter> {formatCurrencyWithSign(USD_SIGN, optionsMarket.currentPrice)}
                </WidgetTitle>
                <FilterContainer>
                    <FilterButton
                        className={chartType === 'trading-view' ? 'selected' : ''}
                        onClick={() => setChartType('trading-view')}
                    >
                        {t('options.market.chart-card.chart-types.trading-view')}
                    </FilterButton>
                    {/* <Button size="mini" primary={chartType === 'price'} onClick={() => setChartType('price')}>
                        <DollarSignIcon /> {t('options.market.chart-card.chart-types.price')}
                    </Button> */}
                    <FilterButton
                        className={chartType === 'options' ? 'selected' : ''}
                        onClick={() => setChartType('options')}
                    >
                        <OptionsLineIcon /> {t('options.market.chart-card.chart-types.options')}
                    </FilterButton>
                    {/* <span style={{ marginLeft: 8, marginRight: 10 }}>|</span>
                    {PERIOD_LABELS.map((period) => (
                        <Button
                            size="mini"
                            key={period.value}
                            primary={period.value === selectedPeriod.value}
                            onClick={() => setSelectedPeriod(period)}
                        >
                            {t(period.i18nLabel)}
                        </Button>
                    ))} */}
                </FilterContainer>
            </WidgetHeader>
            <div style={{ width: '100%', height: '90%' }}>
                {chartType === 'price' && <PriceChart {...chartProps} />}
                {chartType === 'options' && <OptionsChart {...chartProps} />}
                {chartType === 'trading-view' && (
                    <div style={{ width: '100%', height: '100%' }}>
                        <TradingViewWidget
                            symbol={assetToTradingViewMap[optionsMarket.currencyKey]}
                            save_image={false}
                            style="2"
                            range="12m"
                            withdateranges={true}
                            autosize={true}
                            hide_side_toolbar={false}
                            theme="Dark"
                        />
                    </div>
                )}
            </div>
        </Container>
    );
};

const Container = styled(FlexDivColumn)`
    background: #04045a;
    border-radius: 20px;
`;

const WidgetHeader = styled(FlexDivRowCentered)``;

const Splitter = styled.span`
    margin: 0px 5px;
`;

const WidgetTitle = styled(FlexDiv)`
    font-weight: bold;
    font-size: 20px;
    line-height: 32px;
    letter-spacing: 0.5px;
    color: #f6f6fe;
    padding: 10px 30px;
`;

const FilterContainer = styled.div`
    padding-right: 21px;
`;

const FilterButton = styled.button`
    border: 2px solid rgba(1, 38, 81, 0.5);
    border-radius: 23px;
    min-height: 32px;
    background-color: transparent;
    cursor: pointer;
    margin-left: 10px;
    font-weight: bold;
    font-size: 14px;
    line-height: 16px;
    text-align: center;
    letter-spacing: 0.5px;
    color: #f6f6fe;
    margin: 14px 9px;
    padding: 5px 20px;
    &.selected,
    &:hover {
        background: rgba(1, 38, 81, 0.5);
        border: 2px solid #355dff;
        border-radius: 23px;
        color: #355dff;
    }
`;

export default ChartCard;
