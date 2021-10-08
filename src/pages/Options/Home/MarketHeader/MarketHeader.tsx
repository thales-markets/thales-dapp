import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { getIsWalletConnected } from 'redux/modules/wallet';
import { RootState } from 'redux/rootReducer';
import styled from 'styled-components';
import { Button, FlexDiv, FlexDivColumn, Logo } from 'theme/common';
import onboardConnector from 'utils/onboardConnector';
import UserInfo from 'components/UserInfo';
import CustomizeLayout from 'pages/Options/Market/components/CustomizeLayout';
import createMarketDefaultIcon from 'assets/images/sidebar/create-market-default.svg';
import marketOverviewDefaultIcon from 'assets/images/sidebar/market-overview-default.svg';
import trendingMarketsDefaultIcon from 'assets/images/sidebar/trending-default.svg';
import createMarketSelectedIcon from 'assets/images/sidebar/create-market-selected.svg';
import marketOverviewSelectedIcon from 'assets/images/sidebar/market-overview-selected.svg';
import trendingMarketsSelectedIcon from 'assets/images/sidebar/trending-selected.svg';
import tradeExerciseDefaultIcon from 'assets/images/sidebar/trade-default.svg';
import tradeExerciseSelectedIcon from 'assets/images/sidebar/trade-selected.svg';
import leaderboardDefaultIcon from 'assets/images/sidebar/leaderboard-default.svg';
import leaderboardSelectedIcon from 'assets/images/sidebar/leaderboard-selected.svg';
import burger from 'assets/images/burger.svg';
import earnDefaultIcon from 'assets/images/sidebar/thales-token-blue.svg';
import earnSelectedIcon from 'assets/images/sidebar/thales-token-white.svg';
import customMarketsDefaultIcon from 'assets/images/sidebar/custom-markets-default.svg';
import customMarketsSelectedIcon from 'assets/images/sidebar/custom-markets-selected.svg';

import logoSmallIcon from 'assets/images/logo-small-dark.svg';
import logoIcon from 'assets/images/logo-dark.svg';
import ROUTES from 'constants/routes';
import { DisplayContentsAnchor } from '../MarketsTable/components';
import { useState } from 'react';
import './media.scss';
import { buildHref, history } from 'utils/routes';
import { Overlay } from 'components/Header/Header';
import queryString from 'query-string';

type MarketHeaderProps = {
    showCustomizeLayout?: boolean;
    phase?: string;
    isCustomMarket?: boolean;
    route: string;
    className?: string;
};

enum BurgerState {
    Init,
    Show,
    Hide,
}

const MarketHeader: React.FC<MarketHeaderProps> = ({
    showCustomizeLayout,
    phase,
    route,
    isCustomMarket,
    className,
}) => {
    const { t } = useTranslation();
    const isWalletConnected = useSelector((state: RootState) => getIsWalletConnected(state));

    const [showBurgerMenu, setShowBurdgerMenu] = useState<BurgerState>(BurgerState.Init);

    useMemo(() => {
        if (showBurgerMenu !== BurgerState.Init) {
            // const hero = document.getElementById('landing-hero');
            // if (hero && showBurgerMenu === BurgerState.Show) {
            //     hero.className += ' higher-z-index';
            // }
            // if (hero && showBurgerMenu === BurgerState.Hide) {
            //     hero.className.replace(' higher-z-index', '');
            // }
        }
    }, [showBurgerMenu]);

    return (
        <FlexDivColumn style={{ width: '100%', flex: 'unset' }}>
            <MarketHeaderWrapper
                id="dapp-header"
                className={`dapp-header ${className}`}
                showCustomizeLayout={showCustomizeLayout}
            >
                <FlexDiv className="dapp-header__logoWrapper">
                    <Logo to="" className="dapp-header__logoWrapper__logo"></Logo>
                    <BurdgerIcon
                        className="dapp-header__logoWrapper__burger"
                        onClick={() =>
                            setShowBurdgerMenu(
                                showBurgerMenu === BurgerState.Show ? BurgerState.Hide : BurgerState.Show
                            )
                        }
                        hidden={showBurgerMenu === BurgerState.Show}
                        src={burger}
                    />
                </FlexDiv>

                {showCustomizeLayout && phase && <CustomizeLayout phase={phase} isCustomMarket={isCustomMarket} />}
                {!isWalletConnected ? (
                    <Button
                        className="primary dapp-header__connectWallet"
                        style={{ fontSize: '16px', alignSelf: 'center' }}
                        onClick={() => onboardConnector.connectWallet()}
                    >
                        {t('common.wallet.connect-your-wallet')}
                    </Button>
                ) : (
                    <UserInfo />
                )}
            </MarketHeaderWrapper>
            <Sidebar
                className={`dapp-header__nav ${showBurgerMenu === BurgerState.Show ? 'dapp-header__nav--show' : ''}`}
            >
                <ItemsContainer>
                    <DisplayContentsAnchor href={buildHref(ROUTES.Home)}>
                        <LogoLocal className="logo" />
                    </DisplayContentsAnchor>
                    <DisplayContentsAnchor
                        href={buildHref(ROUTES.Options.HotMarkets)}
                        onClick={(event) => {
                            if (history.location.pathname === ROUTES.Options.Home) {
                                event.preventDefault();
                                history.push({
                                    pathname: ROUTES.Options.Home,
                                    search: queryString.stringify({ anchor: ['hot-markets'] }),
                                });
                                return false;
                            }
                        }}
                    >
                        <SidebarItem
                            imgSrc={trendingMarketsDefaultIcon}
                            imgSrcHoverSelected={trendingMarketsSelectedIcon}
                            className={route === ROUTES.Options.Home ? 'selected' : ''}
                        >
                            <SidebarIcon />
                            <SidebarText>{t('common.sidebar.trending-label')}</SidebarText>
                        </SidebarItem>
                    </DisplayContentsAnchor>
                    <DisplayContentsAnchor
                        onClick={(event) => {
                            if (history.location.pathname === ROUTES.Options.Home) {
                                event.preventDefault();
                                history.push({
                                    pathname: ROUTES.Options.Home,
                                    search: queryString.stringify({ anchor: ['overview'] }),
                                });
                                return false;
                            }
                        }}
                        href={buildHref(ROUTES.Options.Overview)}
                    >
                        <SidebarItem
                            imgSrc={marketOverviewDefaultIcon}
                            imgSrcHoverSelected={marketOverviewSelectedIcon}
                            className={route === ROUTES.Options.Overview ? 'selected' : ''}
                        >
                            <SidebarIcon />
                            <SidebarText>{t('common.sidebar.overview-label')}</SidebarText>
                        </SidebarItem>
                    </DisplayContentsAnchor>
                    <DisplayContentsAnchor
                        onClick={(event) => {
                            if (history.location.pathname === ROUTES.Options.Home) {
                                event.preventDefault();
                                history.push({
                                    pathname: ROUTES.Options.Home,
                                    search: queryString.stringify({ userFilter2: ['custom'] }),
                                });
                                return false;
                            }
                        }}
                        href={buildHref(ROUTES.Options.CustomMarkets)}
                    >
                        <SidebarItem
                            imgSrc={customMarketsDefaultIcon}
                            imgSrcHoverSelected={customMarketsSelectedIcon}
                            className={route === ROUTES.Options.CustomMarkets ? 'selected' : ''}
                        >
                            <SidebarIcon />
                            <SidebarText>{t('common.sidebar.custom-markets-label')}</SidebarText>
                        </SidebarItem>
                    </DisplayContentsAnchor>
                    <DisplayContentsAnchor href={buildHref(ROUTES.Options.CreateMarket)}>
                        <SidebarItem
                            imgSrc={createMarketDefaultIcon}
                            imgSrcHoverSelected={createMarketSelectedIcon}
                            className={route === ROUTES.Options.CreateMarket ? 'selected' : ''}
                        >
                            <SidebarIcon />
                            <SidebarText>{t('common.sidebar.create-market-label')}</SidebarText>
                        </SidebarItem>
                    </DisplayContentsAnchor>
                    <DisplayContentsAnchor href={buildHref(ROUTES.Options.Leaderboard)}>
                        <SidebarItem
                            imgSrc={leaderboardDefaultIcon}
                            imgSrcHoverSelected={leaderboardSelectedIcon}
                            className={route === ROUTES.Options.Leaderboard ? 'selected' : ''}
                        >
                            <SidebarIcon />
                            <SidebarText>{t('common.sidebar.leaderboard-label')}</SidebarText>
                        </SidebarItem>
                    </DisplayContentsAnchor>
                    <DisplayContentsAnchor href={buildHref(ROUTES.Options.QuickTrading)}>
                        <SidebarItem
                            imgSrc={tradeExerciseDefaultIcon}
                            imgSrcHoverSelected={tradeExerciseSelectedIcon}
                            className={route === ROUTES.Options.QuickTrading ? 'selected' : ''}
                        >
                            <SidebarIcon />
                            <SidebarText>{t('common.sidebar.quick-trading-label')}</SidebarText>
                        </SidebarItem>
                    </DisplayContentsAnchor>
                    {phase === 'trading' && (
                        <SidebarItem
                            imgSrc={tradeExerciseDefaultIcon}
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
                            imgSrc={tradeExerciseDefaultIcon}
                            imgSrcHoverSelected={tradeExerciseSelectedIcon}
                            className={'selected'}
                            style={{ cursor: 'default' }}
                        >
                            <SidebarIcon />
                            <SidebarText>{t('common.sidebar.maturity-label')}</SidebarText>
                        </SidebarItem>
                    )}
                    <DisplayContentsAnchor href={buildHref(ROUTES.Options.Token)}>
                        <SidebarItem
                            imgSrc={earnDefaultIcon}
                            imgSrcHoverSelected={earnSelectedIcon}
                            className={route === ROUTES.Options.Token ? 'selected' : ''}
                        >
                            <SidebarIcon />
                            <SidebarText>{t('common.sidebar.earn-label')}</SidebarText>
                        </SidebarItem>
                    </DisplayContentsAnchor>
                </ItemsContainer>
            </Sidebar>
            <Overlay
                onClick={() => {
                    setShowBurdgerMenu(BurgerState.Hide);
                }}
                className={showBurgerMenu === BurgerState.Show ? 'show' : 'hide'}
            ></Overlay>
        </FlexDivColumn>
    );
};

const MarketHeaderWrapper = styled.div<{ showCustomizeLayout?: boolean }>`
    width: 100%;
    height: 100px;
    display: flex;
    align-items: center;
    justify-content: ${(props) => (props.showCustomizeLayout ? 'space-between' : 'flex-end')};
`;

const Sidebar = styled.nav`
    position: fixed;
    top: 0;
    left: 0;
    width: 88px;
    min-height: 100vh;
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
        @media screen and (max-width: 1024px) {
            background: url(${logoIcon}) center no-repeat;
        }
        background: url(${logoSmallIcon}) center no-repeat;
    }
`;

const LogoLocal = styled.div`
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

const BurdgerIcon = styled.img`
    position: absolute;
    right: 30px;
    top: 32px;
    padding: 10px;
`;

export default MarketHeader;
