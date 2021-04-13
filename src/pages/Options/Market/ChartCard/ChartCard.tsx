import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FIAT_CURRENCY_MAP, USD_SIGN } from 'constants/currency';
import { ReactComponent as OptionsLineIcon } from 'assets/images/options-line.svg';
import { ReactComponent as DollarSignIcon } from 'assets/images/dollar-sign.svg';
import { formatCurrencyWithSign } from 'utils/formatters/number';
import { PeriodLabel, PERIOD_LABELS_MAP, PERIOD_LABELS } from 'constants/period';
import Currency from 'components/Currency';
import { Button } from 'semantic-ui-react';
import PriceChart from './PriceChart';
import OptionsChart from './OptionsChart';
import { useMarketContext } from '../contexts/MarketContext';

type ChartType = 'price' | 'options';

const ChartCard: React.FC = () => {
    const [selectedPeriod, setSelectedPeriod] = useState<PeriodLabel>(PERIOD_LABELS_MAP.ONE_DAY);
    const [chartType, setChartType] = useState<ChartType>('price');

    const optionsMarket = useMarketContext();

    const { t } = useTranslation();

    const chartProps = {
        optionsMarket,
        selectedPeriod,
    };

    return (
        <div>
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontWeight: 'bold',
                    fontSize: '1.28571429em',
                    marginBottom: 10,
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
                    <span style={{ marginLeft: 8, marginRight: 10 }}>|</span>
                    {PERIOD_LABELS.map((period) => (
                        <Button
                            size="mini"
                            key={period.value}
                            primary={period.value === selectedPeriod.value}
                            onClick={() => setSelectedPeriod(period)}
                        >
                            {t(period.i18nLabel)}
                        </Button>
                    ))}
                </span>
            </div>
            <div>
                {chartType === 'price' && <PriceChart {...chartProps} />}
                {chartType === 'options' && <OptionsChart {...chartProps} />}
            </div>
        </div>
    );
};

export default ChartCard;
