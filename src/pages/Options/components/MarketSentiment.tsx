import React from 'react';
import { useTranslation } from 'react-i18next';
import { Progress } from 'semantic-ui-react';
import { formatCurrency } from 'utils/formatters';

type MarketSentimentProps = {
    long: number;
    short: number;
};

export const MarketSentiment: React.FC<MarketSentimentProps> = ({ long, short }) => {
    const { t } = useTranslation();
    const priceLong = long * 100;
    const priceShort = short * 100;
    return (
        <>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#10BA97' }}>{t('common.val-in-cents', { val: formatCurrency(priceLong) })}</span>
                <span style={{ color: '#D94454' }}>
                    {t('common.val-in-cents', { val: formatCurrency(priceShort) })}
                </span>
            </div>
            <Progress percent={priceLong} color="green" size="small" />
        </>
    );
};

export default MarketSentiment;
