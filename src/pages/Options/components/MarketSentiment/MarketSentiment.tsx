import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { formatCurrency } from 'utils/formatters/number';

type Display = 'row' | 'col';

type MarketSentimentProps = {
    long: number;
    short: number;
    display?: Display;
};

const ProgressBar = styled.div`
    width: 100%;
    height: 15px;
    margin-top: 2px;
    &::before {
        content: '';
        position: relative;
        z-index: 2;
        width: ${(props) => props.color}%;
        border-radius: 20px;
        height: 100%;
        display: block;
        background: #4fbf67;
    }
    &:after {
        content: '';
        position: relative;
        z-index: 1;
        top: -15px;
        background: #c62937;
        border-radius: 20px;
        height: 100%;
        display: block;
    }
    margin-bottom: 30px;
`;

export const MarketSentiment: React.FC<MarketSentimentProps> = ({ long, short, display }) => {
    const { t } = useTranslation();
    const priceLong = long * 100;
    const priceShort = short * 100;
    return (
        <>
            {display === 'row' && (
                <>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 4px' }}>
                        <span style={{ color: '#4fbf67' }}>
                            {t('common.val-in-cents', { val: formatCurrency(priceLong) })}
                        </span>
                        <span style={{ color: '#c62937' }}>
                            {t('common.val-in-cents', { val: formatCurrency(priceShort) })}
                        </span>
                    </div>
                    <ProgressBar color={priceLong.toFixed(0)} />
                </>
            )}
            {display === 'col' && (
                <span>
                    <span style={{ color: '#4fbf67' }}>
                        {t('common.val-in-cents', { val: formatCurrency(priceLong) })}
                    </span>
                    <ProgressBar color={priceLong.toFixed(0)} />
                    <span style={{ color: '#c62937' }}>
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
