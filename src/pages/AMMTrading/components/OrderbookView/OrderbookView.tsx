import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import Container from '../TabContainer/styled-components/Container';
import OrderbookForm from './components/OrderbookForm';

import { OptionSide } from 'types/options';
import TabContainer from '../TabContainer';
import { UI_COLORS } from 'constants/ui';

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
                    customActiveLabelColor={optionType == TradeOptionType[0].value ? UI_COLORS.GREEN : undefined}
                    padding={'20px 30px'}
                    onClick={() => setOptionType(TradeOptionType[0].value as OptionSide)}
                >
                    {t('options.order-book.trade-up')}{' '}
                    {
                        <Icon
                            className="v2-icon v2-icon--up"
                            color={optionType == TradeOptionType[0].value ? UI_COLORS.GREEN : undefined}
                        />
                    }
                </Container.Main.Item>
                <Container.Main.Item
                    noStrech={true}
                    active={optionType == TradeOptionType[1].value}
                    customActiveColor={TradeOptionType[1].activeTabShadow}
                    customActiveLabelColor={optionType == TradeOptionType[1].value ? UI_COLORS.RED : undefined}
                    padding={'20px 30px'}
                    onClick={() => setOptionType(TradeOptionType[1].value as OptionSide)}
                >
                    {t('options.order-book.trade-down')}{' '}
                    {
                        <Icon
                            className="v2-icon v2-icon--down"
                            color={optionType == TradeOptionType[1].value ? UI_COLORS.RED : undefined}
                        />
                    }
                </Container.Main.Item>
            </Container.Main>
            <Container.Tab>
                <OrderbookForm type={optionType} />
                <OrderBookContainer>
                    <TabContainer optionSide={optionType} />
                </OrderBookContainer>
            </Container.Tab>
        </Container>
    );
};

const OrderBookContainer = styled.div`
    align-items: baseline;
    max-width: calc(100% - 400px);
    width: 100%;
    @media (max-width: 1024px) {
        max-width: 100%;
    }
`;

const Icon = styled.i<{ color?: string }>`
    margin: 0 5px;
    font-size: 24px;
    color: ${(_props) => (_props?.color ? _props.color : 'var(--primary-color)')};
`;

export default OrderbookView;
