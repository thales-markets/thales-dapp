import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { getIsWalletConnected, getNetworkId } from 'redux/modules/wallet';
import { RootState } from 'redux/rootReducer';
import styled from 'styled-components';
import { Button, FlexDiv, FlexDivColumn, Logo } from 'theme/common';
import onboardConnector from 'utils/onboardConnector';
import UserInfo from 'components/UserInfo';
import CustomizeLayout from 'pages/Options/Market/components/CustomizeLayout';
import gameDefaultIcon from 'assets/images/sidebar/game-default.svg';
import gameSelectedIcon from 'assets/images/sidebar/game-selected.svg';

import marketOverviewDefaultIcon from 'assets/images/sidebar/market-overview-default.svg';

import marketOverviewSelectedIcon from 'assets/images/sidebar/market-overview-selected.svg';
import tradeExerciseDefaultIcon from 'assets/images/sidebar/trade-default.svg';
import tradeExerciseSelectedIcon from 'assets/images/sidebar/trade-selected.svg';
import leaderboardDefaultIcon from 'assets/images/sidebar/leaderboard-default.svg';
import leaderboardSelectedIcon from 'assets/images/sidebar/leaderboard-selected.svg';
import burger from 'assets/images/burger.svg';
import earnDefaultIcon from 'assets/images/sidebar/thales-token-blue.svg';
import earnSelectedIcon from 'assets/images/sidebar/thales-token-white.svg';
import customMarketsDefaultIcon from 'assets/images/sidebar/custom-markets-default.svg';
import customMarketsSelectedIcon from 'assets/images/sidebar/custom-markets-selected.svg';

import royaleDefaultIcon from 'assets/images/sidebar/royale-default.svg';
import royaleSelectedIcon from 'assets/images/sidebar/royale-selected.svg';

import governanceDefaultIcon from 'assets/images/sidebar/governance-default.svg';
import governanceSelectedIcon from 'assets/images/sidebar/governance-selected.svg';
import logoSmallIcon from 'assets/images/logo-small-dark.svg';
import logoIcon from 'assets/images/logo-dark.svg';
import ROUTES from 'constants/routes';
import { useState } from 'react';
import './media.scss';
import { Overlay } from 'components/Header/Header';
import LanguageSelector from 'components/LanguageSelector';
import SPAAnchor from '../../../../components/SPAAnchor';
import { buildHref } from '../../../../utils/routes';
import { Modal } from '@material-ui/core';
import Swap from '../Swap';
import { getIsOVM } from 'utils/network';
import NetworkSwitch from 'components/NetworkSwitch';

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
    const [showSwap, setShowSwap] = useState(false);
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const isL2 = getIsOVM(networkId);

    const [showBurgerMenu, setShowBurdgerMenu] = useState<BurgerState>(BurgerState.Init);

    useMemo(() => {
        const htmlEl = document.getElementsByTagName('html')[0];
        if (showBurgerMenu === BurgerState.Show) {
            htmlEl.style.overflow = 'hidden';
        } else {
            htmlEl.style.overflow = 'visible';
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
                    <Logo to="" className="dapp-header__logoWrapper__logo" />
                    <MobileLanguageSelectorContainer>
                        <LanguageSelector />
                    </MobileLanguageSelectorContainer>
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
                <FlexDiv className="dapp-header__buttonsWrapper">
                    {isWalletConnected && (
                        <Button className="tertiary" style={{ padding: '6px 24px' }} onClick={() => setShowSwap(true)}>
                            {t('options.swap.button-text')}
                        </Button>
                    )}
                    <Modal
                        open={showSwap}
                        onClose={(_, reason) => {
                            if (reason !== 'backdropClick') setShowSwap(false);
                        }}
                    >
                        <div style={{ height: 0 }}>
                            <Swap handleClose={setShowSwap}></Swap>
                        </div>
                    </Modal>
                    <DesktopLanguageSelectorContainer>
                        <LanguageSelector />
                    </DesktopLanguageSelectorContainer>
                    {isWalletConnected && (
                        <div>
                            <NetworkSwitch />
                        </div>
                    )}
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
                </FlexDiv>
            </MarketHeaderWrapper>
            <Sidebar
                className={`dapp-header__nav ${showBurgerMenu === BurgerState.Show ? 'dapp-header__nav--show' : ''}`}
            >
                <ItemsContainer>
                    <SPAAnchor href={buildHref(ROUTES.Home)}>
                        <LogoLocal className="logo" />
                    </SPAAnchor>
                    {/* {!isL2 && (
                        <SPAAnchor href={buildHref(ROUTES.Options.CompetitionMarkets)}>
                            <SidebarItem
                                imgSrc={competitionMarketsDefaultIcon}
                                imgSrcHoverSelected={competitionMarketsSelectedIcon}
                                className={route === ROUTES.Options.CompetitionMarkets ? 'selected' : ''}
                            >
                                <SidebarIcon />
                                <SidebarText>{t('common.sidebar.competition-markets-label')}</SidebarText>
                            </SidebarItem>
                        </SPAAnchor>
                    )}
                    {!isL2 && (
                        <SPAAnchor href={buildHref(ROUTES.Options.QuickTradingCompetition)}>
                            <SidebarItem
                                imgSrc={competitionMarketsDefaultIcon}
                                imgSrcHoverSelected={competitionMarketsSelectedIcon}
                                className={route === ROUTES.Options.QuickTradingCompetition ? 'selected' : ''}
                            >
                                <SidebarIcon />
                                <SidebarText>{t('common.sidebar.quick-trading-label-competition')}</SidebarText>
                            </SidebarItem>
                        </SPAAnchor>
                    )} */}
                    <SPAAnchor href={buildHref(ROUTES.Options.Overview)}>
                        <SidebarItem
                            imgSrc={marketOverviewDefaultIcon}
                            imgSrcHoverSelected={marketOverviewSelectedIcon}
                            className={route === ROUTES.Options.Overview ? 'selected' : ''}
                        >
                            <SidebarIcon />
                            <SidebarText>{t('common.sidebar.overview-label')}</SidebarText>
                        </SidebarItem>
                    </SPAAnchor>
                    {/* {!isL2 && (
                        <SPAAnchor href={buildHref(ROUTES.Options.CustomMarkets)}>
                            <SidebarItem
                                imgSrc={customMarketsDefaultIcon}
                                imgSrcHoverSelected={customMarketsSelectedIcon}
                                className={route === ROUTES.Options.CustomMarkets ? 'selected' : ''}
                            >
                                <SidebarIcon />
                                <SidebarText>{t('common.sidebar.custom-markets-label')}</SidebarText>
                            </SidebarItem>
                        </SPAAnchor>
                    )} */}
                    {/* <SPAAnchor href={buildHref(ROUTES.Options.CreateMarket)}>
                        <SidebarItem
                            imgSrc={createMarketDefaultIcon}
                            imgSrcHoverSelected={createMarketSelectedIcon}
                            className={route === ROUTES.Options.CreateMarket ? 'selected' : ''}
                        >
                            <SidebarIcon />
                            <SidebarText>{t('common.sidebar.create-market-label')}</SidebarText>
                        </SidebarItem>
                    </SPAAnchor> */}
                    <SPAAnchor href={buildHref(ROUTES.Options.QuickTrading)}>
                        <SidebarItem
                            imgSrc={tradeExerciseDefaultIcon}
                            imgSrcHoverSelected={tradeExerciseSelectedIcon}
                            className={route === ROUTES.Options.QuickTrading ? 'selected' : ''}
                        >
                            <SidebarIcon />
                            <SidebarText>{t('common.sidebar.quick-trading-label')}</SidebarText>
                        </SidebarItem>
                    </SPAAnchor>
                    <SPAAnchor href={buildHref(ROUTES.Options.TradeHistory)}>
                        <SidebarItem
                            imgSrc={customMarketsDefaultIcon}
                            imgSrcHoverSelected={customMarketsSelectedIcon}
                            className={route === ROUTES.Options.TradeHistory ? 'selected' : ''}
                        >
                            <SidebarIcon />
                            <SidebarText>{t('common.sidebar.trade-history-label')}</SidebarText>
                        </SidebarItem>
                    </SPAAnchor>
                    {isL2 && (
                        <SPAAnchor href={buildHref(ROUTES.Options.AmmMining)}>
                            <SidebarItem
                                imgSrc={customMarketsDefaultIcon}
                                imgSrcHoverSelected={customMarketsSelectedIcon}
                                className={route === ROUTES.Options.AmmMining ? 'selected' : ''}
                            >
                                <SidebarIcon />
                                <SidebarText>{t('common.sidebar.amm-mining-label')}</SidebarText>
                            </SidebarItem>
                        </SPAAnchor>
                    )}
                    {!isL2 && (
                        <SPAAnchor href={buildHref(ROUTES.Options.Leaderboard)}>
                            <SidebarItem
                                imgSrc={leaderboardDefaultIcon}
                                imgSrcHoverSelected={leaderboardSelectedIcon}
                                className={route === ROUTES.Options.Leaderboard ? 'selected' : ''}
                            >
                                <SidebarIcon />
                                <SidebarText>{t('common.sidebar.leaderboard-label')}</SidebarText>
                            </SidebarItem>
                        </SPAAnchor>
                    )}
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
                    <Divider />
                    {!isL2 && (
                        <SPAAnchor href={buildHref(ROUTES.Options.Token)}>
                            <SidebarItem
                                imgSrc={earnDefaultIcon}
                                imgSrcHoverSelected={earnSelectedIcon}
                                className={route === ROUTES.Options.Token ? 'selected' : ''}
                            >
                                <SidebarIcon />
                                <SidebarText>{t('common.sidebar.earn-label')}</SidebarText>
                            </SidebarItem>
                        </SPAAnchor>
                    )}
                    <SPAAnchor href={buildHref(ROUTES.Governance.Home)}>
                        <SidebarItem
                            imgSrc={governanceDefaultIcon}
                            imgSrcHoverSelected={governanceSelectedIcon}
                            className={route === ROUTES.Governance.Home ? 'selected' : ''}
                        >
                            <SidebarIcon />
                            <SidebarText>{t('common.sidebar.governance-label')}</SidebarText>
                        </SidebarItem>
                    </SPAAnchor>

                    <SPAAnchor href={buildHref(ROUTES.Options.Royal)}>
                        <SidebarItem
                            imgSrc={royaleDefaultIcon}
                            imgSrcHoverSelected={royaleSelectedIcon}
                            className={route === ROUTES.Options.Royal ? 'selected' : ''}
                        >
                            <SidebarIcon />
                            <SidebarText>{t('common.sidebar.royale-label')}</SidebarText>
                        </SidebarItem>
                    </SPAAnchor>

                    <SPAAnchor href={buildHref(ROUTES.Options.Game)}>
                        <SidebarItem
                            imgSrc={gameDefaultIcon}
                            imgSrcHoverSelected={gameSelectedIcon}
                            className={route === ROUTES.Options.Game ? 'selected' : ''}
                        >
                            <SidebarIcon />
                            <SidebarText>{t('common.sidebar.game-label')}</SidebarText>
                        </SidebarItem>
                    </SPAAnchor>
                </ItemsContainer>
            </Sidebar>
            <Overlay
                onClick={() => {
                    setShowBurdgerMenu(BurgerState.Hide);
                }}
                className={showBurgerMenu === BurgerState.Show ? 'show' : 'hide'}
            />
        </FlexDivColumn>
    );
};

const DesktopLanguageSelectorContainer = styled.div`
    display: block;
    @media screen and (max-width: 767px) {
        display: none;
    }
`;

const MobileLanguageSelectorContainer = styled.div`
    display: none;
    @media screen and (max-width: 767px) {
        display: block;
    }
`;

const MarketHeaderWrapper = styled.div<{ showCustomizeLayout?: boolean }>`
    width: 100%;
    height: 100px;
    display: flex;
    align-items: center;
    justify-content: ${(props) => (props.showCustomizeLayout ? 'space-between' : 'flex-end')};
    @media screen and (max-width: 767px) {
        height: 100%;
    }
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
        width: 300px;
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
    margin-bottom: 10px;
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
    background-size: contain !important;
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

const Divider = styled.hr`
    width: 100%;
    border: none;
    border-top: 2px solid #04045a;
`;

export default MarketHeader;
