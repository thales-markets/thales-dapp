import React from 'react';
import { useTranslation } from 'react-i18next';
import { ProgressBar } from 'theme/common';
import { formatCurrency } from 'utils/formatters/number';

type Display = 'row' | 'col';

type MarketSentimentProps = {
    long: number;
    short: number;
    display?: Display;
};

const MarketSentiment: React.FC<MarketSentimentProps> = ({ long, short, display }) => {
    const { t } = useTranslation();
    const priceLong = long * 100;
    const priceShort = short * 100;
    return (
        <div className="sentiment">
            {display === 'row' && (
                <>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '2px 6px' }}>
                        <span style={{ color: '#4fbf67' }}>
                            {t('common.val-in-cents', { val: formatCurrency(priceLong) })}
                        </span>
                        <span style={{ color: '#c62937' }}>
                            {t('common.val-in-cents', { val: formatCurrency(priceShort) })}
                        </span>
                    </div>
                    <ProgressBar aria-label={priceLong.toFixed(0)} />
                </>
            )}
            {display === 'col' && (
                <span>
                    <span style={{ color: '#4fbf67' }}>
                        {t('common.val-in-cents', { val: formatCurrency(priceLong) })}
                    </span>
                    <ProgressBar aria-label={priceLong.toFixed(0)} />
                    <span style={{ color: '#c62937' }}>
                        {t('common.val-in-cents', { val: formatCurrency(priceShort) })}
                    </span>
                </span>
            )}
        </div>
    );
};

MarketSentiment.defaultProps = {
    display: 'row',
};

export default MarketSentiment;
