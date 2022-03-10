import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import Container from '../TabContainer/styled-components/Container';
import OrderbookForm from './components/OrderbookForm';

import { OptionSide } from 'types/options';

export const TradeOptionType = [
    {
        value: 'long',
        labelBackgroundColor: 'linear-gradient(90deg, #50CE99 0%, #00C2C2 100%)',
        activeTabShadow: '0px 4px 0px 0px rgba(80, 206, 153, 0.8)',
    },
    {
        value: 'short',
        labelBackgroundColor: 'linear-gradient(90deg, #D651A1 0%, #C3244A 55.21%, #C3244A 97.92%)',
        activeTabShadow: '0px 4px 0px 0px #C3244A',
    },
];

const OrderbookView: React.FC = () => {
    const [optionType, setOptionType] = useState<OptionSide>('long');

    const { t } = useTranslation();

    return (
        <Container>
            <Container.Main justifyContent="flex-start">
                <Container.Main.Item
                    noStrech={true}
                    active={optionType == TradeOptionType[0].value}
                    customActiveColor={TradeOptionType[0].activeTabShadow}
                    padding={'20px 30px'}
                    onClick={() => setOptionType(TradeOptionType[0].value as OptionSide)}
                >
                    {t('options.order-book.trade-up')}
                </Container.Main.Item>
                <Container.Main.Item
                    noStrech={true}
                    active={optionType == TradeOptionType[1].value}
                    customActiveColor={TradeOptionType[1].activeTabShadow}
                    padding={'20px 30px'}
                    onClick={() => setOptionType(TradeOptionType[1].value as OptionSide)}
                >
                    {t('options.order-book.trade-down')}
                </Container.Main.Item>
            </Container.Main>
            <Container.Tab>
                <OrderbookForm type={optionType} />
            </Container.Tab>
        </Container>
    );
};

export default OrderbookView;
