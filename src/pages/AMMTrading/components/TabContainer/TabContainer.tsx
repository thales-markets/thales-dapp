import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import OptionPriceTab from '../Tabs/OptionPriceTab';
import TradingView from '../Tabs/TradingView';
import MarketActivity from '../Tabs/MarketActivity';

import Container from './styled-components/Container';

const TabContainer: React.FC = () => {
    const [currentTab, setCurrentTab] = useState<number>(0);
    const { t } = useTranslation();

    const tabItems = [
        {
            title: t('options.market.widgets.chart-options-price-widget'),
        },
        {
            title: t('options.market.widgets.your-transactions-widget'),
        },
        {
            title: t('options.market.widgets.chart-trading-view-widget'),
        },
        {
            title: t('options.market.widgets.recent-transactions-widget'),
        },
    ];

    return (
        <Container>
            <Container.Main>
                {tabItems &&
                    tabItems.map((item, index) => {
                        return (
                            <Container.Main.Item
                                active={index == currentTab}
                                key={index}
                                onClick={() => setCurrentTab(index)}
                            >
                                {item.title}
                            </Container.Main.Item>
                        );
                    })}
            </Container.Main>
            <Container.Tab>
                {currentTab == 0 && <OptionPriceTab />}
                {currentTab == 1 && <OptionPriceTab />}
                {currentTab == 2 && <TradingView />}
                {currentTab == 3 && <MarketActivity />}
            </Container.Tab>
        </Container>
    );
};

export default TabContainer;
