import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { getIsWalletConnected } from 'redux/modules/wallet';
import { RootState } from 'redux/rootReducer';
import styled from 'styled-components';
import { Button } from 'theme/common';
import onboardConnector from 'utils/onboardConnector';
import UserInfo from 'components/UserInfo';
import CustomizeLayout from 'pages/Options/Market/components/CustomizeLayout';
import createMarketDefaultIcon from 'assets/images/sidebar/create-market-default.svg';
import marketOverviewDefaultIcon from 'assets/images/sidebar/market-overview-default.svg';
import trendingMarketsDefaultIcon from 'assets/images/sidebar/trending-default.svg';
import olympicsMarketsDefaultIcon from 'assets/images/sidebar/olympics-default.svg';
import createMarketSelectedIcon from 'assets/images/sidebar/create-market-selected.svg';
import marketOverviewSelectedIcon from 'assets/images/sidebar/market-overview-selected.svg';
import trendingMarketsSelectedIcon from 'assets/images/sidebar/trending-selected.svg';
import olympicsMarketsSelectedIcon from 'assets/images/sidebar/olympics-selected.svg';
import tradeExerciseSelectedIcon from 'assets/images/sidebar/trade-selected.svg';
import leaderboardDefaultIcon from 'assets/images/sidebar/leaderboard-default.svg';
import leaderboardSelectedIcon from 'assets/images/sidebar/leaderboard-selected.svg';

import logoSmallIcon from 'assets/images/logo-small-dark.svg';
import logoIcon from 'assets/images/logo-dark.svg';
import ROUTES from 'constants/routes';
import { DisplayContentsAnchor } from '../MarketsTable/components';

type MarketHeaderProps = {
    showCustomizeLayout?: boolean;
    phase?: string;
    isCustomMarket?: boolean;
    route: string;
};

const MarketHeader: React.FC<MarketHeaderProps> = ({ showCustomizeLayout, phase, route, isCustomMarket }) => {
    const { t } = useTranslation();
    const isWalletConnected = useSelector((state: RootState) => getIsWalletConnected(state));

    return (
        <>
            <MarketHeaderWrapper id="market-header" showCustomizeLayout={showCustomizeLayout}>
                {showCustomizeLayout && phase && <CustomizeLayout phase={phase} isCustomMarket={isCustomMarket} />}
                {!isWalletConnected ? (
                    <Button
                        className="primary"
                        style={{ fontSize: '16px', alignSelf: 'center' }}
                        onClick={() => onboardConnector.connectWallet()}
                    >
                        {t('common.wallet.connect-your-wallet')}
                    </Button>
                ) : (
                    <UserInfo />
                )}
            </MarketHeaderWrapper>
            <Sidebar>
                <ItemsContainer>
                    <DisplayContentsAnchor href={ROUTES.Home}>
                        <Logo className="logo" />
                    </DisplayContentsAnchor>
                    <DisplayContentsAnchor href={ROUTES.Options.HotMarkets}>
                        <SidebarItem
                            imgSrc={trendingMarketsDefaultIcon}
                            imgSrcHoverSelected={trendingMarketsSelectedIcon}
                            className={route === ROUTES.Options.Home ? 'selected' : ''}
                        >
                            <SidebarIcon />
                            <SidebarText>{t('common.sidebar.trending-label')}</SidebarText>
                        </SidebarItem>
                    </DisplayContentsAnchor>
                    <DisplayContentsAnchor href={ROUTES.Options.Overview}>
                        <SidebarItem
                            imgSrc={marketOverviewDefaultIcon}
                            imgSrcHoverSelected={marketOverviewSelectedIcon}
                            className={route === ROUTES.Options.Overview ? 'selected' : ''}
                        >
                            <SidebarIcon />
                            <SidebarText>{t('common.sidebar.overview-label')}</SidebarText>
                        </SidebarItem>
                    </DisplayContentsAnchor>
                    <DisplayContentsAnchor href={ROUTES.Options.Olympics}>
                        <SidebarItem
                            imgSrc={olympicsMarketsDefaultIcon}
                            imgSrcHoverSelected={olympicsMarketsSelectedIcon}
                            className={route === ROUTES.Options.Olympics ? 'selected' : ''}
                        >
                            <SidebarIcon />
                            <SidebarText>{t('common.sidebar.olympics-label')}</SidebarText>
                        </SidebarItem>
                    </DisplayContentsAnchor>
                    <DisplayContentsAnchor href={ROUTES.Options.CreateMarket}>
                        <SidebarItem
                            imgSrc={createMarketDefaultIcon}
                            imgSrcHoverSelected={createMarketSelectedIcon}
                            className={route === ROUTES.Options.CreateMarket ? 'selected' : ''}
                        >
                            <SidebarIcon />
                            <SidebarText>{t('common.sidebar.create-market-label')}</SidebarText>
                        </SidebarItem>
                    </DisplayContentsAnchor>
                    <DisplayContentsAnchor href={ROUTES.Options.Leaderboard}>
                        <SidebarItem
                            imgSrc={leaderboardDefaultIcon}
                            imgSrcHoverSelected={leaderboardSelectedIcon}
                            className={route === ROUTES.Options.Leaderboard ? 'selected' : ''}
                        >
                            <SidebarIcon />
                            <SidebarText>{t('common.sidebar.leaderboard-label')}</SidebarText>
                        </SidebarItem>
                    </DisplayContentsAnchor>
                    {phase === 'trading' && (
                        <SidebarItem
                            imgSrc={tradeExerciseSelectedIcon}
                            imgSrcHoverSelected={tradeExerciseSelectedIcon}
                            className={'selected'}
                            style={{ cursor: 'default' }}
                        >
                            <SidebarIcon />
                            <SidebarText>{t('common.sidebar.trade-label')}</SidebarText>
                        </SidebarItem>
                    )}
                    {phase === 'maturity' && (
                        <SidebarItem
                            imgSrc={tradeExerciseSelectedIcon}
                            imgSrcHoverSelected={tradeExerciseSelectedIcon}
                            className={'selected'}
                            style={{ cursor: 'default' }}
                        >
                            <SidebarIcon />
                            <SidebarText>{t('common.sidebar.maturity-label')}</SidebarText>
                        </SidebarItem>
                    )}
                </ItemsContainer>
            </Sidebar>
        </>
    );
};

const MarketHeaderWrapper = styled.div<{ showCustomizeLayout?: boolean }>`
    padding: 0 75px;
    width: 100%;
    display: flex;
    height: 100px;
    align-items: center;
    justify-content: ${(props) => (props.showCustomizeLayout ? 'space-between' : 'flex-end')};
`;

const Sidebar = styled.nav`
    position: fixed;
    top: 0;
    left: 0;
    width: 88px;
    height: 100vh;
    z-index: 100;
    background: #748bc6;
    padding: 35px 19px;
    transition: width 0.3s ease;
    overflow: hidden;
    &:hover {
        width: 256px;
        span {
            display: block;
        }
        .logo {
            background: url(${logoIcon}) center no-repeat;
        }
    }
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    -o-user-select: none;
    user-select: none;
    .logo {
        background: url(${logoSmallIcon}) center no-repeat;
    }
`;

const Logo = styled.div`
    cursor: pointer;
    height: 50px;
    margin-bottom: 60px;
`;

const ItemsContainer = styled.ul``;

const SidebarItem = styled.li<{ imgSrc: string; imgSrcHoverSelected: string }>`
    cursor: pointer;
    border-radius: 12px;
    margin-bottom: 20px;
    height: 50px;
    padding: 14px;
    color: #04045a;
    transition: background 300ms;
    div {
        background: url(${(props) => props.imgSrc}) center no-repeat;
    }
    &.selected {
        color: #f6f6fe;
        background: #04045a;
        div {
            background: url(${(props) => props.imgSrcHoverSelected}) center no-repeat;
        }
    }
    &:hover {
        color: #f6f6fe;
        background: #141c7f;

        div {
            background: url(${(props) => props.imgSrcHoverSelected}) center no-repeat;
        }
    }
`;

const SidebarIcon = styled.div`
    z-index: 1;
    position: relative;
    width: 22px;
    height: 22px;
`;

const SidebarText = styled.span`
    z-index: 0;
    position: relative;
    display: block;
    top: -27px;
    margin-left: 36px;
    font-style: normal;
    font-weight: 600;
    font-size: 16px;
    line-height: 32px;
    letter-spacing: 0.35px;
    white-space: nowrap;
    display: none;
`;

export default MarketHeader;
