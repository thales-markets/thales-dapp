import React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

import OptionPriceTab from '../Tabs/OptionPriceTab';

const TabContainer: React.FC = () => {
    const { t } = useTranslation();

    return (
        <Container>
            <MenuContainer>
                <MenuItem active={true}>{t('options.market.widgets.chart-options-price-widget')}</MenuItem>
                <MenuItem>{t('options.market.widgets.your-transactions-widget')}</MenuItem>
                <MenuItem>{t('options.market.widgets.chart-trading-view-widget')}</MenuItem>
                <MenuItem>{t('options.market.widgets.recent-transactions-widget')}</MenuItem>
            </MenuContainer>
            <Tab>
                <OptionPriceTab />
            </Tab>
        </Container>
    );
};

const Container = styled.div`
    width: 70%;
    display: flex;
    flex-direction: column;
`;

const MenuContainer = styled.div`
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: stretch;
    align-items: stretch;
    border-bottom: 4px solid var(--table-border-color);
    border-radius: 3px;
    margin-bottom: 50px;
`;

const Tab = styled.div`
    margin: 0 20px;
    width: 100%;
    display: flex;
`;

const MenuItem = styled.div<{ active?: boolean }>`
    text-align: center;
    flex: 1;
    font-family: Titillium Regular !important;
    font-style: normal;
    color: var(--primary-color);
    box-shadow: ${(_props) => (_props?.active ? '0px 4px var(--primary-filter-menu-active)' : '')};
    text-transform: uppercase;
    padding: 12px 5px;
`;

export default TabContainer;
