import React, { useState } from 'react';

import Container from './styled-components/Container';
import Button from 'components/Button';
import LimitOrder from './components/LimitOrder';
import MarketOrder from './components/MarketOrder';
import Mint from './components/Mint';

import { OptionSide } from 'types/options';
import { TradeOptionType } from '../../OrderbookView';

import { useTranslation } from 'react-i18next';
import WalletBalance from 'pages/AMMTrading/components/AMM/components/WalletBalance';

type OrderbookFormProps = {
    type: OptionSide;
};

const OrderbookForm: React.FC<OrderbookFormProps> = ({ type }) => {
    const { t } = useTranslation();
    const [currentForm, setCurrentForm] = useState<0 | 1 | 2>(0);

    const buttons = [
        {
            value: 'limit',
            title: t('options.market.trade-options.limit-tab-title'),
        },
        {
            value: 'market',
            title: t('options.market.trade-options.market-tab-title'),
        },
        {
            value: 'mint',
            title: t('options.market.trade-options.mint-tab-title'),
        },
    ];

    return (
        <Container>
            <Container.ColorLabel
                color={
                    type == TradeOptionType[0].value
                        ? TradeOptionType[0].labelBackgroundColor
                        : TradeOptionType[1].labelBackgroundColor
                }
            />
            <WalletBalance type={type} />
            <Container.ButtonContainer>
                <Button
                    width={'30%'}
                    active={currentForm == 0}
                    padding={'5px 0px'}
                    onClickHandler={() => setCurrentForm(0)}
                >
                    {buttons[0].title}
                </Button>
                <Button
                    width={'30%'}
                    active={currentForm == 1}
                    padding={'5px 0px'}
                    onClickHandler={() => setCurrentForm(1)}
                >
                    {buttons[1].title}
                </Button>
                <Button
                    width={'30%'}
                    active={currentForm == 2}
                    padding={'5px 0px'}
                    onClickHandler={() => setCurrentForm(2)}
                >
                    {buttons[2].title}
                </Button>
            </Container.ButtonContainer>
            {currentForm == 0 && <LimitOrder optionSide={type} />}
            {currentForm == 1 && <MarketOrder optionSide={type} />}
            {currentForm == 2 && <Mint />}
        </Container>
    );
};

export default OrderbookForm;
