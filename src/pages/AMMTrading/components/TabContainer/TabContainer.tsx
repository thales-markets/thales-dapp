import React from 'react';
import { useTranslation } from 'react-i18next';

import OptionPriceTab from '../Tabs/OptionPriceTab';
// import Table from 'components/TableV2';

import Container from './styled-components/Container';

const TabContainer: React.FC = () => {
    const { t } = useTranslation();

    return (
        <Container>
            <Container.Main>
                <Container.Main.Item active={true}>
                    {t('options.market.widgets.chart-options-price-widget')}
                </Container.Main.Item>
                <Container.Main.Item>{t('options.market.widgets.your-transactions-widget')}</Container.Main.Item>
                <Container.Main.Item>{t('options.market.widgets.chart-trading-view-widget')}</Container.Main.Item>
                <Container.Main.Item>{t('options.market.widgets.recent-transactions-widget')}</Container.Main.Item>
            </Container.Main>
            <Container.Tab>
                <OptionPriceTab />
            </Container.Tab>
        </Container>
    );
};

export default TabContainer;
