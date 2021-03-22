import React from 'react';
import { useTranslation } from 'react-i18next';
import { Progress } from 'semantic-ui-react';
import { formatCurrency } from 'utils/formatters/number';

type Display = 'row' | 'col';

type MarketSentimentProps = {
    long: number;
    short: number;
    display?: Display;
};

export const MarketSentiment: React.FC<MarketSentimentProps> = ({ long, short, display }) => {
    const { t } = useTranslation();
    const priceLong = long * 100;
    const priceShort = short * 100;
    return (
        <>
            {display === 'row' && (
                <>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: '#10BA97' }}>
                            {t('common.val-in-cents', { val: formatCurrency(priceLong) })}
                        </span>
                        <span style={{ color: '#D94454' }}>
                            {t('common.val-in-cents', { val: formatCurrency(priceShort) })}
                        </span>
                    </div>
                    <Progress percent={priceLong} color="green" size="small" />
                </>
            )}
            {display === 'col' && (
                <span>
                    <span style={{ color: '#10BA97' }}>
                        {t('common.val-in-cents', { val: formatCurrency(priceLong) })}
                    </span>
                    <span style={{ width: 200, display: 'inline-block' }}>
                        <Progress percent={priceLong} color="green" size="small" />
                    </span>
                    <span style={{ color: '#D94454' }}>
                        {t('common.val-in-cents', { val: formatCurrency(priceShort) })}
                    </span>
                </span>
            )}
        </>
    );
};

MarketSentiment.defaultProps = {
    display: 'row',
};

export default MarketSentiment;
