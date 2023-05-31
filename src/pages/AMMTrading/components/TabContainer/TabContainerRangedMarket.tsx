import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import OptionPriceTab from '../Tabs/OptionPriceTab';
import UserActivity from '../Tabs/UserActivity';
import TradingView from '../Tabs/TradingView';
import MarketActivity from '../Tabs/MarketActivity';
import Container from './styled-components/Container';
import RowCardRangedMarket from '../RowCard/RowCardRangedMarket';
import { useRangedMarketContext } from 'pages/AMMTrading/contexts/RangedMarketContext';
import { MarketType } from 'types/options';
import styled from 'styled-components';
import OutsideClickHandler from 'react-outside-click-handler';
import { MARKET_TYPE } from 'constants/options';
import { useMatomo } from '@datapunt/matomo-tracker-react';

const TabContainer: React.FC = () => {
    const marketInfo = useRangedMarketContext();
    const [currentTab, setCurrentTab] = useState<number>(1);
    const [inMaturity, setMaturity] = useState<boolean>(false);
    const [showViewsDropdown, setShowViewsDropdown] = useState<boolean>(false);
    const { trackEvent } = useMatomo();
    useEffect(() => {
        if (marketInfo.phase == 'maturity') {
            setMaturity(true);
            setCurrentTab(4);
        }
    }, [marketInfo.phase]);

    const { t } = useTranslation();

    const tabItems = [
        ...(!inMaturity
            ? [
                  {
                      title: t('options.market.widgets.chart', { currencyKey: marketInfo?.currencyKey }),
                      index: 1,
                  },
              ]
            : []),
        ...(!inMaturity
            ? [
                  {
                      title: t('options.market.widgets.position-price'),
                      index: 2,
                  },
              ]
            : []),
        ...(!inMaturity
            ? [
                  {
                      title: t('options.market.widgets.your-transactions-widget'),
                      index: 3,
                  },
              ]
            : []),
        {
            title: t('options.market.widgets.recent-transactions-widget'),
            index: 4,
        },
    ];

    return (
        <>
            <Container>
                <RowCardRangedMarket />
                <FiltersButton onClick={() => setShowViewsDropdown(!showViewsDropdown)}>
                    {currentTab
                        ? t('options.market.row-card.current-view', {
                              currentView: tabItems.find((item) => item.index == currentTab)?.title,
                          })
                        : t('options.market.row-card.views')}
                </FiltersButton>
                {showViewsDropdown && (
                    <PositionWrapper>
                        <Wrapper>
                            <OutsideClickHandler onOutsideClick={() => setShowViewsDropdown(false)}>
                                <Title>Views</Title>
                                {tabItems &&
                                    tabItems.map((item, index) => {
                                        return (
                                            <Item
                                                active={currentTab === item.index}
                                                key={index}
                                                onClick={() => {
                                                    setCurrentTab(item.index);
                                                    setShowViewsDropdown(false);
                                                }}
                                            >
                                                {item.title}
                                            </Item>
                                        );
                                    })}
                            </OutsideClickHandler>
                        </Wrapper>
                    </PositionWrapper>
                )}
                <Container.Main justifyContent={inMaturity ? 'flex-start' : ''}>
                    {tabItems &&
                        tabItems.map((item, index) => {
                            return (
                                <Container.Main.Item
                                    active={item.index == currentTab}
                                    key={index}
                                    noStrech={inMaturity ? true : false}
                                    onClick={() => {
                                        if (item.index == 5) {
                                            trackEvent({
                                                category: 'RangedMarket',
                                                action: 'click-on-similar-markets',
                                            });
                                        }
                                        setCurrentTab(item.index);
                                    }}
                                >
                                    {item.title}
                                </Container.Main.Item>
                            );
                        })}
                </Container.Main>
                <Container.Tab>
                    {currentTab == 1 && <TradingView />}
                    {currentTab == 2 && <OptionPriceTab marketType={MARKET_TYPE[1] as MarketType} />}
                    {currentTab == 3 && <UserActivity marketType={MARKET_TYPE[1] as MarketType} />}
                    {currentTab == 4 && <MarketActivity marketType={MARKET_TYPE[1] as MarketType} />}
                </Container.Tab>
            </Container>
        </>
    );
};

const PositionWrapper = styled.div`
    position: relative;
    width: 100%;
    height: 0;
    z-index: 2;
`;

const FiltersButton = styled.div`
    display: none;
    padding: 6px 20px;
    border: 1.5px solid rgba(100, 217, 254, 0.5);
    box-sizing: border-box;
    border-radius: 30px;
    background: transparent;
    font-weight: bold;
    font-size: 12px;
    line-height: 11px;
    text-transform: uppercase;
    color: var(--color-highlight);
    @media (max-width: 768px) {
        display: block;
        align-self: center;
        margin-top: 20px;
        margin-bottom: 20px;
    }
`;

const Wrapper = styled.div`
    display: none;
    @media (max-width: 768px) {
        display: flex;
        flex-direction: column;
        background: linear-gradient(270deg, #516aff 0%, #8208fc 100%);
        border: 2px solid rgba(100, 217, 254, 0.5);
        box-sizing: border-box;
        border-radius: 12px;
        padding: 15px 20px;
        max-width: 240px;
        position: absolute;
        margin-left: auto;
        margin-right: auto;
        left: 0;
        right: 0;
        text-align: center;
        top: -56px;
        z-index: 2;
    }
`;

const Item = styled.div<{ active: boolean }>`
    text-transform: uppercase;
    cursor: pointer;
    color: ${(props) => (props?.active ? 'var(--color-highlight)' : props.theme.textColor.primary)};

    @media (max-width: 768px) {
        font-weight: bold;
        font-size: 12px;
        line-height: 162.5%;
    }
`;

const Title = styled.p`
    font-weight: bold;
    font-size: 12px;
    line-height: 100%;
    text-transform: uppercase;
    color: var(--color-highlight);
    @media (min-width: 769px) {
        display: none;
    }
    margin-bottom: 10px;
`;

export default TabContainer;
