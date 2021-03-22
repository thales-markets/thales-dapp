import React from 'react';
import { useTranslation } from 'react-i18next';
import { USD_SIGN } from 'constants/currency';
import { formatCurrency, formatCurrencyWithSign } from 'utils/formatters/number';
import { Side } from 'types/options';
import { Header, Segment } from 'semantic-ui-react';
import SideIcon from '../../../components/SideIcon';

type OptionResultProps = {
    side: Side;
    amount: number;
    price?: number;
    claimableAmount?: number;
};

const OptionResult: React.FC<OptionResultProps> = ({ side, amount, price, claimableAmount }) => {
    const { t } = useTranslation();

    return (
        <Segment style={{ textTransform: 'uppercase' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 5 }}>
                <SideIcon side={side} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 10 }}>
                <Header as="h3">{t(`options.common.amount-${side}`, { amount: formatCurrency(amount) })}</Header>
            </div>
            {claimableAmount != null && (
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    {t('options.common.claimable-amount', { amount: formatCurrency(claimableAmount) })}
                </div>
            )}
            {price != null && (
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    {t('options.common.final-price')} {formatCurrencyWithSign(USD_SIGN, price)}
                </div>
            )}
        </Segment>
    );
};

export default OptionResult;
