import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Grid, Menu, Segment } from 'semantic-ui-react';
import { OptionSide } from 'types/options';
import TokenSwap from './TokenSwap';
import Orderbook from './Orderbook';
import PlaceOrder from './PlaceOrder';

type TradeOptionsSideProps = {
    optionSide: OptionSide;
};

const TradeOptionsSide: React.FC<TradeOptionsSideProps> = ({ optionSide }) => {
    const { t } = useTranslation();
    const tabContent: Array<{
        id: 'market' | 'limit';
        name: string;
    }> = useMemo(
        () => [
            {
                id: 'limit',
                name: t('options.market.trade-options.limit-tab-title'),
            },
            {
                id: 'market',
                name: t('options.market.trade-options.market-tab-title'),
            },
        ],
        [t]
    );

    const [activeTab, setActiveTab] = useState(tabContent[0]);

    return (
        <Segment color={optionSide === 'long' ? 'green' : 'red'}>
            <Grid centered>
                <Grid.Row>
                    <Grid.Column width={8}>
                        <Orderbook optionSide={optionSide} />
                    </Grid.Column>
                    <Grid.Column width={8}>
                        <Menu tabular>
                            {tabContent.map((tab) => (
                                <Menu.Item
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab)}
                                    active={tab.id === activeTab.id}
                                    name={tab.id}
                                >
                                    {tab.name}
                                </Menu.Item>
                            ))}
                        </Menu>
                        {activeTab.id === 'market' && <TokenSwap optionSide={optionSide} />}
                        {activeTab.id === 'limit' && <PlaceOrder optionSide={optionSide} />}
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </Segment>
    );
};

export default TradeOptionsSide;
