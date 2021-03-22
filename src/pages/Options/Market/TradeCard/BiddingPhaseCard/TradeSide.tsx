import React from 'react';
import { useTranslation } from 'react-i18next';
import { SYNTHS_MAP } from 'constants/currency';
import { USD_SIGN } from 'constants/currency';
import { formatCurrencyWithKey, formatCurrencyWithSign } from 'utils/formatters/number';
import { ReactComponent as QuestionMark } from 'assets/images/question-mark.svg';
import { CurrentPosition, OptionsTransaction } from 'types/options';
import { Segment, Label, Input, Button, Header, Popup } from 'semantic-ui-react';
import { SLIPPAGE_THRESHOLD } from 'constants/options';
import SideIcon from '../../components/SideIcon';

type TradeSideProps = {
    isActive: boolean;
    side: OptionsTransaction['side'];
    type: OptionsTransaction['type'];
    amount: OptionsTransaction['amount'] | string;
    price: string | number;
    onPriceChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onAmountChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onClick: () => void;
    onMaxClick: () => void;
    transKey?: string;
    currentPosition: CurrentPosition;
    priceShift: number;
};

const TradeSide: React.FC<TradeSideProps> = ({
    isActive,
    type,
    side,
    amount,
    price,
    onPriceChange,
    onAmountChange,
    onClick,
    transKey,
    currentPosition,
    priceShift,
    onMaxClick,
}) => {
    const { t } = useTranslation();

    const amountInputId = `${type}-${side}-amount`;
    const priceInputId = `${type}-${side}-price`;

    return (
        <Segment secondary={isActive} onClick={onClick}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 10 }}>
                <Label>
                    {t(`options.common.${side}`)} <SideIcon side={side} />
                </Label>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <label htmlFor={amountInputId} style={{ textTransform: 'uppercase' }}>
                    {t(`${transKey}.amount-label`)}
                </label>
                <Button
                    size="mini"
                    primary
                    onClick={() => {
                        if (isActive) {
                            onMaxClick();
                        } else onClick();
                    }}
                >
                    {t('common.max')}
                </Button>
            </div>
            <div>
                <Input
                    fluid
                    value={amount}
                    onChange={onAmountChange}
                    label={SYNTHS_MAP.sUSD}
                    id={amountInputId}
                    type="number"
                    min="0"
                />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <label htmlFor={priceInputId} style={{ textTransform: 'uppercase' }}>
                    {t(`${transKey}.price-label`)}
                </label>
                <span>
                    <label style={{ color: priceShift > SLIPPAGE_THRESHOLD ? 'red' : 'black' }}>
                        {formatCurrencyWithSign(USD_SIGN, priceShift, 3)}
                    </label>
                    {type === 'bid' ? (
                        <Popup
                            trigger={<QuestionMark width="12" height="12" />}
                            content={t('options.market.trade-card.shared.price-shift')}
                        />
                    ) : null}
                </span>
            </div>
            <div>
                <Input
                    fluid
                    id={priceInputId}
                    value={price}
                    onChange={onPriceChange}
                    type="number"
                    placeholder="0"
                    step="0.1"
                    min="0"
                    max="1"
                />
            </div>
            <Segment textAlign="center">
                <Header as="h5" style={{ textTransform: 'uppercase' }}>
                    {t('options.market.trade-card.bidding.common.current-position')}
                </Header>
                <div>
                    <span style={{ textTransform: 'uppercase' }}>
                        {t('options.market.trade-card.bidding.common.bid')}{' '}
                    </span>
                    {formatCurrencyWithKey(SYNTHS_MAP.sUSD, currentPosition.bid)}
                </div>
                <div>
                    <span style={{ textTransform: 'uppercase' }}>
                        {t('options.market.trade-card.bidding.common.payout')}{' '}
                    </span>
                    {formatCurrencyWithKey(SYNTHS_MAP.sUSD, currentPosition.payout)}
                </div>
            </Segment>
        </Segment>
    );
};

export default TradeSide;
