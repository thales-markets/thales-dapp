import React, { useState } from 'react';
import { buildHref } from 'utils/routes';
import logoSmallIcon from 'assets/images/logo-small-light.svg';
import logoIcon from 'assets/images/logo-light.svg';
import SPAAnchor from 'components/SPAAnchor';
import { useLocation } from 'react-router-dom';
import { getIsBSC, getIsMainnet, getIsPolygon } from 'utils/network';
import { LINKS } from 'constants/links';
import styled from 'styled-components';
import ROUTES from 'constants/routes';
import { RootState } from 'redux/rootReducer';
import { getIsWalletConnected, getNetworkId } from 'redux/modules/wallet';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { getIsMobile } from 'redux/modules/ui';
import DappHeaderItem from '../components/DappHeaderItem';
import { ScreenSizeBreakpoint } from '../../../enums/ui';

const DappSidebar: React.FC = () => {
    const { t } = useTranslation();
    const location = useLocation();
    const isWalletConnected = useSelector((state: RootState) => getIsWalletConnected(state));
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const isMobile = useSelector((state: RootState) => getIsMobile(state));

    const isPolygon = getIsPolygon(networkId);
    const isBSC = getIsBSC(networkId);
    const isMainnet = getIsMainnet(networkId);

    const [collapse, setCollapse] = useState(false);

    const showVaultsPage = !isMainnet && !isPolygon && !isBSC;
    const showLP = !isMainnet && !isPolygon && !isBSC;
    const showWizardPage = !isMobile;
    const showReferralPage = !isMainnet;
    const showTokenPage = !isPolygon && !isBSC;
    const showGovernancePage = !isMainnet;
    const showGamePage = !isMainnet;
    const showProfilePage = !isMainnet && isWalletConnected;
    const showProfileDivider = showGamePage || showProfilePage;

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

                {showVaultsPage && (
                    <DappHeaderItem
                        className={`show ${location.pathname === ROUTES.Options.Vaults ? 'selected' : ''}`}
                        href={buildHref(ROUTES.Options.Vaults)}
                        iconName="vaults"
                        label={t('common.sidebar.vaults-label')}
                    />
                )}

                {showLP && (
                    <DappHeaderItem
                        className={`show ${location.pathname === ROUTES.Options.LiquidityPool ? 'selected' : ''}`}
                        href={buildHref(ROUTES.Options.LiquidityPool)}
                        iconName="liquidity-pool"
                        label={t('common.sidebar.liquidity-pool-label')}
                    />
                )}

                {showWizardPage && (
                    <DappHeaderItem
                        className={`${collapse ? 'show' : ''} ${
                            location.pathname === ROUTES.Options.Wizard ? 'selected' : ''
                        }`}
                        href={buildHref(ROUTES.Options.Wizard)}
                        iconName="wizard"
                        label={t('common.sidebar.wizard')}
                    />
                )}

                {showReferralPage && (
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

                {showTokenPage && (
                    <DappHeaderItem
                        className={`show ${location.pathname === ROUTES.Options.Token ? 'selected' : ''}`}
                        href={buildHref(ROUTES.Options.Token)}
                        iconName="token"
                        label={t('common.sidebar.earn-label')}
                    />
                )}

                {showGovernancePage && (
                    <DappHeaderItem
                        className={`${collapse ? 'show' : ''} ${
                            location.pathname === ROUTES.Governance.Home ? 'selected' : ''
                        }`}
                        href={buildHref(ROUTES.Governance.Home)}
                        iconName="governance"
                        label={t('common.sidebar.governance-label')}
                    />
                )}

                {showProfileDivider && <Divider />}

                {showGamePage && (
                    <DappHeaderItem
                        className={`${collapse ? 'show' : ''} ${
                            location.pathname === ROUTES.Options.Game ? 'selected' : ''
                        }`}
                        href={buildHref(ROUTES.Options.Game)}
                        iconName="game"
                        label={t('common.sidebar.game-label')}
                    />
                )}

                {showProfilePage && (
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
                    href={LINKS.SportMarkets}
                    iconName="overtime-markets"
                    label={t('common.sidebar.sport-markets-label')}
                    onClick={(event: any) => {
                        event.preventDefault();
                        if (isMobile) {
                            window.location.replace(LINKS.SportMarkets);
                        } else {
                            window.open(LINKS.SportMarkets);
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
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        display: flex;
    }
`;

const ItemsContainer = styled.div`
    transition: all 0.5s ease;
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    margin-right: -10px;
    height: 100%;
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        margin-right: 0;
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
    z-index: 101;
    background: ${(props) => props.theme.background.secondary};
    padding: 35px 0;
    transition: width 0.3s ease;
    overflow: hidden;

    .sidebar-logoBig {
        display: none;
    }

    @media (min-width: ${ScreenSizeBreakpoint.SMALL}px) {
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

    @media (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        padding: 0;
        background: ${(props) => props.theme.background.secondary};
        box-shadow: 0px 0px 30px 10px rgba(0, 0, 0, 0.25);
        border-radius: 8px;
        width: calc(100% - 20px);
        left: 10px;
        top: unset;
        bottom: 10px;
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
        height: 100vh;
        width: 275px;
        left: 0;
        bottom: 0;
        padding-left: 20px;
        ${ItemsContainer} {
            transition: all 0.5s ease;
            flex-direction: column;
            gap: 20px;
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
    margin-bottom: 25px;
`;

const Divider = styled.hr`
    width: 100%;
    border: none;
    border-top: 3px solid ${(props) => props.theme.borderColor.secondary};
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        display: none;
    }
`;

export default DappSidebar;
