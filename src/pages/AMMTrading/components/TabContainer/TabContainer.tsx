import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import OptionPriceTab from '../Tabs/OptionPriceTab';
import UserActivity from '../Tabs/UserActivity';
import TradingView from '../Tabs/TradingView';
import MarketActivity from '../Tabs/MarketActivity';
import {
    Container,
    MenuContainer,
    MenuItem,
    Tab,
    ViewButton,
    ViewItem,
    ViewTitle,
    ViewsDropDown,
    ViewsDropDownWrapper,
} from './styled-components';
import { useMarketContext } from 'pages/AMMTrading/contexts/MarketContext';
import RowCard from '../RowCard';
import OutsideClickHandler from 'react-outside-click-handler';
import { useRangedMarketContext } from 'pages/AMMTrading/contexts/RangedMarketContext';

type TabContainerProps = {
    isRangedMarket: boolean;
};

const TabContainer: React.FC<TabContainerProps> = ({ isRangedMarket }) => {
    const rangedMarket = useRangedMarketContext();
    const directMarket = useMarketContext();
    const market = isRangedMarket ? rangedMarket : directMarket;
    const [currentTab, setCurrentTab] = useState<number>(1);
    const [inMaturity, setMaturity] = useState<boolean>(false);
    const [showViewsDropdown, setShowViewsDropdown] = useState<boolean>(false);

    useEffect(() => {
        if (market.phase == 'maturity') {
            setMaturity(true);
            setCurrentTab(4);
        }
    }, [market.phase]);

    const { t } = useTranslation();

    const tabItems = [
        ...(!inMaturity
            ? [
                  {
                      title: t('markets.market.widgets.chart', { currencyKey: market.currencyKey }),
                      index: 1,
                  },
              ]
            : []),
        ...(!inMaturity
            ? [
                  {
                      title: t('markets.market.widgets.position-price'),
                      index: 2,
                  },
              ]
            : []),
        ...(!inMaturity
            ? [
                  {
                      title: t('markets.market.widgets.your-transactions-widget'),
                      index: 3,
                  },
              ]
            : []),
        {
            title: t('markets.market.widgets.recent-transactions-widget'),
            index: 4,
        },
    ];

    return (
        <Container>
            <RowCard isRangedMarket={isRangedMarket} />
            <ViewButton onClick={() => setShowViewsDropdown(!showViewsDropdown)}>
                {currentTab
                    ? t('markets.market.row-card.current-view', {
                          currentView: tabItems.find((item) => item.index == currentTab)?.title,
                      })
                    : t('markets.market.row-card.views')}
            </ViewButton>
            {showViewsDropdown && (
                <ViewsDropDownWrapper>
                    <ViewsDropDown>
                        <OutsideClickHandler onOutsideClick={() => setShowViewsDropdown(false)}>
                            <ViewTitle>Views</ViewTitle>
                            {tabItems &&
                                tabItems.map((item, index) => {
                                    return (
                                        <ViewItem
                                            active={currentTab === item.index}
                                            key={index}
                                            onClick={() => {
                                                setCurrentTab(item.index);
                                                setShowViewsDropdown(false);
                                            }}
                                        >
                                            {item.title}
                                        </ViewItem>
                                    );
                                })}
                        </OutsideClickHandler>
                    </ViewsDropDown>
                </ViewsDropDownWrapper>
            )}
            <MenuContainer justifyContent={inMaturity ? 'flex-start' : 'stretch'}>
                {tabItems &&
                    tabItems.map((item, index) => {
                        return (
                            <MenuItem
                                active={item.index == currentTab}
                                key={index}
                                noStrech={inMaturity}
                                onClick={() => setCurrentTab(item.index)}
                            >
                                {item.title}
                            </MenuItem>
                        );
                    })}
            </MenuContainer>
            <Tab>
                {currentTab == 1 && <TradingView />}
                {currentTab == 2 && <OptionPriceTab isRangedMarket={isRangedMarket} />}
                {currentTab == 3 && <UserActivity isRangedMarket={isRangedMarket} />}
                {currentTab == 4 && <MarketActivity isRangedMarket={isRangedMarket} />}
            </Tab>
        </Container>
    );
};

export default TabContainer;
