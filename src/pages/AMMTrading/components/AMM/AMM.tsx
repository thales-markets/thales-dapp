import React, { useState } from 'react';
import Input from './components/Input';
import Button from 'components/Button';
import RangeSlider from 'components/RangeSlider';
import Switch from 'components/SwitchInput/SwitchInputNew';
import Slippage from './components/Slippage';
import Divider from './styled-components/Divider';
import GasInfo from './styled-components/GasInfo';

import styled from 'styled-components';

import { OrderSide, OptionSide } from 'types/options';
import { OPTIONS_CURRENCY_MAP, SYNTHS_MAP } from 'constants/currency';

import { useTranslation } from 'react-i18next';

const AMM: React.FC = () => {
    const { t } = useTranslation();
    const [amount, setAmount] = useState<string | number>(5700);
    const [orderSide, setOrderSide] = useState<number>(0);
    const [type, setType] = useState<number>(0);

    const orderSideOptions = [
        {
            value: 'buy' as OrderSide,
            label: t('common.buy'),
        },
        {
            value: 'sell' as OrderSide,
            label: t('common.sell'),
        },
    ];

    const positionType = [
        {
            type: 'long',
            label: 'long',
        },
        {
            type: 'short',
            label: 'short',
        },
    ];

    return (
        <Wrapper>
            <Switch
                active={orderSide == 1}
                width={'94px'}
                height={'32px'}
                dotSize={'22px'}
                label={{
                    firstLabel: t('common.buy').toUpperCase(),
                    secondLabel: t('common.sell').toUpperCase(),
                    fontSize: '25px',
                }}
                shadow={true}
                dotBackground={'var(--amm-switch-circle)'}
                handleClick={() => (orderSide == 0 ? setOrderSide(1) : setOrderSide(0))}
            />
            <ButtonWrapper>
                <Button
                    text={positionType[0].label}
                    width={'48%'}
                    active={type == 0}
                    padding={'5px 0px'}
                    onClickHandler={() => setType(0)}
                />
                <Button
                    text={positionType[1].label}
                    width={'48%'}
                    active={type == 1}
                    padding={'5px 0px'}
                    onClickHandler={() => setType(1)}
                />
            </ButtonWrapper>
            <Input
                title={t('options.market.trade-options.place-order.amount-label', {
                    orderSide: orderSideOptions[orderSide].label,
                })}
                value={amount}
                subValue={OPTIONS_CURRENCY_MAP[positionType[type].type as OptionSide]}
                valueChange={(value) => setAmount(value)}
            />
            <RangeSlider
                min={1}
                max={20}
                defaultValue={3.2}
                showFooter={true}
                footerText={'Max amount 20,550.00 sLONGS'}
            />
            <Input
                title={t('options.market.trade-options.place-order.price-label', {
                    currencyKey: positionType[type].label.toUpperCase(),
                })}
                value={amount}
                subValue={SYNTHS_MAP.sUSD}
                valueEditDisable={true}
            />
            <Input
                title={t('amm.total-buy-label')}
                value={'809.57'}
                subValue={SYNTHS_MAP.sUSD}
                valueEditDisable={true}
            />
            <Input
                title={t('amm.return-label')}
                value={'1,364.45 sUSD'}
                valueColor={'#50CE99'}
                subValue={'150%'}
                subValueColor={'#50CE99'}
                valueEditDisable={true}
            />
            <Input title={t('amm.skew-label')} value={'1.86%'} valueColor={'#F7B91A'} valueEditDisable={true} />
            <Slippage fixed={[0.5, 1, 2]} defaultValue={1} />
            <Divider />
            <GasInfo>
                <GasInfo.Row>
                    <GasInfo.Row.Label>{t('common.network-fee-gas')}</GasInfo.Row.Label>
                    <GasInfo.Row.Value>{'$0'}</GasInfo.Row.Value>
                </GasInfo.Row>
                <GasInfo.Row>
                    <GasInfo.Row.Label>{t('common.gas-price-gwei')}</GasInfo.Row.Label>
                    <GasInfo.Row.Value>{'0.001'}</GasInfo.Row.Value>
                </GasInfo.Row>
            </GasInfo>
        </Wrapper>
    );
};

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    border: 2px solid var(--input-border-color);
    border-radius: 15px;
    padding: 30px;
    margin-right: 27px;
    width: 30%;
`;

const ButtonWrapper = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin-bottom: 10px;
    margin-top: 28px;
`;

export default AMM;
