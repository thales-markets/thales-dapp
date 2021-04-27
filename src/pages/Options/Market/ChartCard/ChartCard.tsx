import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FIAT_CURRENCY_MAP, USD_SIGN } from 'constants/currency';
import { ReactComponent as OptionsLineIcon } from 'assets/images/options-line.svg';
import { ReactComponent as DollarSignIcon } from 'assets/images/dollar-sign.svg';
import { formatCurrencyWithSign } from 'utils/formatters/number';
// import { PeriodLabel, PERIOD_LABELS_MAP, PERIOD_LABELS } from 'constants/period';
import Currency from 'components/Currency';
import { Button } from 'semantic-ui-react';
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
// import TradingViewWidget from 'react-tradingview-widget';

type ChartType = 'price' | 'options' | 'trading-view';

const ChartCard: React.FC = () => {
    // const [selectedPeriod, setSelectedPeriod] = useState<PeriodLabel>(PERIOD_LABELS_MAP.ONE_MONTH);
    const { t } = useTranslation();
    const optionsMarket = useMarketContext();
    const [chartType, setChartType] = useState<ChartType>('price');
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
        <div style={{ width: '100%', height: '100%' }}>
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontWeight: 'bold',
                    fontSize: '1.28571429em',
                    marginBottom: 10,
                    width: '100%',
                    height: '8%',
                }}
            >
                <span>
                    <Currency.Pair
                        baseCurrencyKey={optionsMarket.currencyKey}
                        baseCurrencyAsset={optionsMarket.asset}
                        quoteCurrencyKey={FIAT_CURRENCY_MAP.USD}
                        iconProps={{
                            type: 'asset',
                        }}
                    />
                    <span style={{ marginLeft: 10, marginRight: 10 }}>|</span>
                    {formatCurrencyWithSign(USD_SIGN, optionsMarket.currentPrice)}
                </span>
                <span style={{ display: 'flex', alignItems: 'center' }}>
                    <Button size="mini" primary={chartType === 'price'} onClick={() => setChartType('price')}>
                        <DollarSignIcon /> {t('options.market.chart-card.chart-types.price')}
                    </Button>
                    <Button size="mini" primary={chartType === 'options'} onClick={() => setChartType('options')}>
                        <OptionsLineIcon /> {t('options.market.chart-card.chart-types.options')}
                    </Button>
                    {/* <Button
                        size="mini"
                        primary={chartType === 'trading-view'}
                        onClick={() => setChartType('trading-view')}
                    >
                        {t('options.market.chart-card.chart-types.trading-view')}
                    </Button> */}
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
                </span>
            </div>
            <div style={{ width: '100%', height: '90%' }}>
                {chartType === 'price' && <PriceChart {...chartProps} />}
                {chartType === 'options' && <OptionsChart {...chartProps} />}
                {/* {chartType === 'trading-view' && (
                    <div style={{ width: '100%', height: '100%' }}>
                        <TradingViewWidget
                            symbol="COINBASE:SNXUSD"
                            save_image={false}
                            style="2"
                            range="12m"
                            withdateranges={true}
                            autosize={true}
                        />
                    </div>
                )} */}
            </div>
        </div>
    );
};

export default ChartCard;
