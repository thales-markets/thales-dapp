import React, { useState } from 'react';
import { buildHref } from 'utils/routes';
import logoSmallIcon from 'assets/images/logo-small-light.svg';
import logoIcon from 'assets/images/logo-light.svg';
import DappHeaderItem from './DappHeaderItem';
import SPAAnchor from 'components/SPAAnchor';
import { useLocation } from 'react-router-dom';
import { getIsPolygon } from 'utils/network';
import { LINKS } from 'constants/links';
import styled from 'styled-components';
import ROUTES from 'constants/routes';
import { RootState } from 'redux/rootReducer';
import { getNetworkId, getWalletAddress } from 'redux/modules/wallet';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

const Sidebar: React.FC = () => {
    const location = useLocation();
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state));
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const isPolygon = getIsPolygon(networkId);
    const { t } = useTranslation();
    const [collapse, setCollapse] = useState(false);

    return (
        <SidebarHtml id="sidebar">
            <ItemsContainer
                onClick={() => {
                    const content = document.getElementById('main-content');
                    const sidebar = document.getElementById('sidebar');
                    const root = document.getElementById('root');
                    if (collapse) {
                        content?.classList.remove('collapse');
                        sidebar?.classList.remove('collapse');
                        root?.classList.remove('collapse');
                        setCollapse(false);
                    }
                }}
            >
                <SPAAnchor className="sidebar-logoSmall" href={buildHref(ROUTES.Options.Home)}>
                    <LogoIcon width="38" height="42" src={logoSmallIcon} />
                </SPAAnchor>
                <SPAAnchor className="sidebar-logoBig" href={buildHref(ROUTES.Options.Home)}>
                    <LogoIcon height="42" src={logoIcon} />
                </SPAAnchor>

                <DappHeaderItem
                    className={`show ${location.pathname === ROUTES.Options.Home ? 'selected' : ''}`}
                    href={buildHref(ROUTES.Options.Home)}
                    iconName="markets"
                    label={t('common.sidebar.markets')}
                />

                {!isPolygon && (
                    <DappHeaderItem
                        className={`show ${location.pathname === ROUTES.Options.RangeMarkets ? 'selected' : ''}`}
                        href={buildHref(ROUTES.Options.RangeMarkets)}
                        iconName="ranged-markets"
                        label={t('common.sidebar.ranged-markets')}
                    />
                )}

                {/* {isPolygon && (
                    <DappHeaderItem
                        className={`${collapse ? 'show' : ''} ${
                            location.pathname === ROUTES.Options.Leaderboard ? 'selected' : ''
                        }`}
                        href={buildHref(ROUTES.Options.Leaderboard)}
                        iconName="leaderboard"
                        label={t('common.sidebar.leaderboard-label')}
                    />
                )} */}

                {!isPolygon && (
                    <DappHeaderItem
                        className={`${collapse ? 'show' : ''} ${
                            location.pathname === ROUTES.Options.OPRewards ? 'selected' : ''
                        }`}
                        href={buildHref(ROUTES.Options.OPRewards)}
                        iconName="token"
                        label={t('common.sidebar.op-rewards')}
                    />
                )}

                {!isPolygon && (
                    <DappHeaderItem
                        className={`${collapse ? 'show' : ''} ${
                            location.pathname === ROUTES.Options.Wizard ? 'selected' : ''
                        }`}
                        href={buildHref(ROUTES.Options.Wizard)}
                        iconName="wizard"
                        label={t('common.sidebar.wizard')}
                    />
                )}

                {!isPolygon && (
                    <DappHeaderItem
                        className={`${collapse ? 'show' : ''} ${
                            location.pathname === ROUTES.Options.Referral ? 'selected' : ''
                        }`}
                        href={buildHref(ROUTES.Options.Referral)}
                        iconName="referral-page"
                        label={t('referral-page.title')}
                    />
                )}
                <Divider />
                {!isPolygon && (
                    <DappHeaderItem
                        className={`show ${location.pathname === ROUTES.Options.Token ? 'selected' : ''}`}
                        href={buildHref(ROUTES.Options.Token)}
                        iconName="token"
                        label={t('common.sidebar.earn-label')}
                    />
                )}
                <DappHeaderItem
                    className={`${collapse ? 'show' : ''} ${
                        location.pathname === ROUTES.Governance.Home ? 'selected' : ''
                    }`}
                    href={buildHref(ROUTES.Governance.Home)}
                    iconName="governance"
                    label={t('common.sidebar.governance-label')}
                />

                <Divider />
                {!isPolygon && (
                    <DappHeaderItem
                        className={`${collapse ? 'show' : ''} ${
                            location.pathname === ROUTES.Options.Royal ? 'selected' : ''
                        }`}
                        href={buildHref(ROUTES.Options.Royal)}
                        iconName="thales-royale"
                        label={t('common.sidebar.royale-label')}
                    />
                )}
                <DappHeaderItem
                    className={`${collapse ? 'show' : ''} ${
                        location.pathname === ROUTES.Options.Game ? 'selected' : ''
                    }`}
                    href={buildHref(ROUTES.Options.Game)}
                    iconName="game"
                    label={t('common.sidebar.game-label')}
                />

                {walletAddress && (
                    <DappHeaderItem
                        className={`show ${location.pathname === ROUTES.Options.Profile ? 'selected' : ''}`}
                        href={buildHref(ROUTES.Options.Profile)}
                        iconName="profile"
                        label={t('common.sidebar.profile-label')}
                    />
                )}

                <Divider />
                <DappHeaderItem
                    className={collapse ? 'show' : ''}
                    href={LINKS.ExoticMarkets}
                    iconName="exotic-markets"
                    label={t('common.sidebar.exotic-markets-label')}
                    onClick={(event: any) => {
                        event.preventDefault();
                        if (window.innerWidth <= 767) {
                            window.location.replace(LINKS.ExoticMarkets);
                        } else {
                            window.open(LINKS.ExoticMarkets);
                        }
                    }}
                    simpleOnClick={true}
                />

                <ThreeDotsContainer
                    onClick={(event) => {
                        event.stopPropagation();
                        const content = document.getElementById('main-content');
                        content?.classList.add('collapse');
                        const sidebar = document.getElementById('sidebar');
                        sidebar?.classList.add('collapse');
                        const root = document.getElementById('root');
                        root?.classList.add('collapse');
                        setCollapse(true);
                    }}
                >
                    <i className="icon icon--three-dots"></i>
                </ThreeDotsContainer>
            </ItemsContainer>
        </SidebarHtml>
    );
};

const ThreeDotsContainer = styled.div`
    display: none;
    align-items: center;
    @media (max-width: 568px) {
        display: flex;
    }
`;

const ItemsContainer = styled.div`
    transition: all 0.5s ease;
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    --scrollbar-width: 0%;
    height: 100%;
    @media (max-width: 1024px) {
        flex-direction: row;
        justify-content: space-around;
    }
`;

const SidebarHtml = styled.nav`
    transition: all 0.5s ease;
    position: fixed;
    top: 0;
    left: 0;
    width: 72px;
    height: 100vh;
    z-index: 100;
    background: linear-gradient(190.01deg, #516aff -17.89%, #8208fc 90.41%);
    padding: 35px 0;
    transition: width 0.3s ease;
    overflow: hidden;

    .sidebar-logoBig {
        display: none;
    }

    @media (min-width: 1024px) {
        &:hover {
            width: 300px;
            span {
                display: block;
            }
            i {
                display: block;
            }
            .sidebar-logoSmall {
                display: none;
            }
            .sidebar-logoBig {
                display: block;
            }
        }
    }

    @media (max-width: 1024px) {
        padding: 0;
        background: linear-gradient(270deg, #516aff 0%, #8208fc 100%);
        box-shadow: 0px 0px 30px 10px rgba(0, 0, 0, 0.25);
        border-radius: 30px;
        width: calc(100% - 40px);
        left: 20px;
        top: unset;
        bottom: 20px;
        height: 55px;

        .sidebar-logoSmall {
            display: none;
        }
        .sidebar-logoBig {
            display: none;
        }
        .game {
            display: none !important;
        }
    }

    &.collapse {
        transition: all 0.5s ease;
        background: transparent !important;
        height: 100vh;
        width: 100vw;
        ${ItemsContainer} {
            transition: all 0.5s ease;
            flex-direction: column;
            gap: 25px;
            justify-content: center;
        }
        ${ThreeDotsContainer} {
            display: none;
        }
        border-radius: 0;
        box-shadow: none;
        span {
            display: block;
        }
        li {
            max-width: 250px;
        }
    }

    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    -o-user-select: none;
    user-select: none;
`;

const LogoIcon = styled.img`
    display: block;
    object-fit: contain;
    cursor: pointer;
    margin: auto;
    margin-top: 10px;
    margin-bottom: 60px;
`;

const Divider = styled.hr`
    width: 100%;
    border: none;
    border-top: 3px solid rgb(255, 255, 255, 0.5);
    @media (max-width: 1024px) {
        display: none;
    }
`;

export default Sidebar;
