import logoIcon from 'assets/images/logo-light.svg';
import logoSmallIcon from 'assets/images/logo-small-light.svg';
import SPAAnchor from 'components/SPAAnchor';
import { LINKS } from 'constants/links';
import ROUTES from 'constants/routes';
import React from 'react';
import { useTranslation } from 'react-i18next';
import OutsideClickHandler from 'react-outside-click-handler';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { getIsMobile } from 'redux/modules/ui';
import { getIsWalletConnected, getNetworkId } from 'redux/modules/wallet';
import styled from 'styled-components';
import { RootState } from 'types/ui';
import { getSupportedNetworksByRoute } from 'utils/network';
import { buildHref } from 'utils/routes';
import { ScreenSizeBreakpoint } from '../../../enums/ui';
import DappHeaderItem from '../components/DappHeaderItem';

const DappSidebar: React.FC = () => {
    const { t } = useTranslation();
    const location = useLocation();
    const isWalletConnected = useSelector((state: RootState) => getIsWalletConnected(state));
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const isMobile = useSelector((state: RootState) => getIsMobile(state));

    const showGamePage = getSupportedNetworksByRoute(ROUTES.Options.Game).includes(networkId);
    const showProfilePage =
        isWalletConnected && getSupportedNetworksByRoute(ROUTES.Options.Profile).includes(networkId);
    const showProfileDivider = showGamePage || showProfilePage;

    return (
        <OutsideClickHandler
            onOutsideClick={(e) => {
                isMobile && e.target instanceof HTMLElement && !e.target.className.includes('icon--nav-menu')
                    ? removeCollapse()
                    : {};
            }}
        >
            <SidebarHtml id="sidebar">
                <ItemsContainer onClick={removeCollapse}>
                    <SPAAnchor className="sidebar-logoSmall" href={buildHref(ROUTES.Options.Home)}>
                        <LogoIcon width="38" height="42" src={logoSmallIcon} />
                    </SPAAnchor>
                    <SPAAnchor className="sidebar-logoBig" href={buildHref(ROUTES.Options.Home)}>
                        <LogoIcon height="42" src={logoIcon} />
                    </SPAAnchor>

                    {getSupportedNetworksByRoute(ROUTES.Options.Home).includes(networkId) && (
                        <DappHeaderItem
                            className={`${location.pathname === ROUTES.Options.Home ? 'selected' : ''}`}
                            href={buildHref(ROUTES.Options.Home)}
                            iconName="markets"
                            label={t('common.sidebar.markets')}
                        />
                    )}

                    <DappHeaderItem
                        href={LINKS.SpeedMarkets}
                        iconName="speed-markets"
                        label={t('common.sidebar.speed-markets')}
                    />

                    {getSupportedNetworksByRoute(ROUTES.Options.Vaults).includes(networkId) && (
                        <DappHeaderItem
                            className={`${location.pathname === ROUTES.Options.Vaults ? 'selected' : ''}`}
                            href={buildHref(ROUTES.Options.Vaults)}
                            iconName="vaults"
                            label={t('common.sidebar.vaults-label')}
                        />
                    )}

                    {getSupportedNetworksByRoute(ROUTES.Options.LiquidityPool).includes(networkId) && (
                        <DappHeaderItem
                            className={`${location.pathname === ROUTES.Options.LiquidityPool ? 'selected' : ''}`}
                            href={buildHref(ROUTES.Options.LiquidityPool)}
                            iconName="liquidity-pool"
                            label={t('common.sidebar.liquidity-pool-label')}
                        />
                    )}

                    {!isMobile && getSupportedNetworksByRoute(ROUTES.Options.Wizard).includes(networkId) && (
                        <DappHeaderItem
                            className={`${location.pathname === ROUTES.Options.Wizard ? 'selected' : ''}`}
                            href={buildHref(ROUTES.Options.Wizard)}
                            iconName="wizard"
                            label={t('common.sidebar.wizard')}
                        />
                    )}

                    {getSupportedNetworksByRoute(ROUTES.Options.Referral).includes(networkId) && (
                        <DappHeaderItem
                            className={`${location.pathname === ROUTES.Options.Referral ? 'selected' : ''}`}
                            href={buildHref(ROUTES.Options.Referral)}
                            iconName="referral-page"
                            label={t('referral-page.title')}
                        />
                    )}

                    <Divider />
                    <DappHeaderItem
                        href={LINKS.ThalesProtocol.Token}
                        iconName="token"
                        label={t('common.sidebar.earn-label')}
                    />
                    <DappHeaderItem
                        href={LINKS.ThalesProtocol.Governance}
                        iconName="governance"
                        label={t('common.sidebar.governance-label')}
                    />

                    {showProfileDivider && <Divider />}

                    {showGamePage && (
                        <DappHeaderItem
                            className={`${location.pathname === ROUTES.Options.Game ? 'selected' : ''}`}
                            href={buildHref(ROUTES.Options.Game)}
                            iconName="game"
                            label={t('common.sidebar.game-label')}
                        />
                    )}

                    {showProfilePage && (
                        <DappHeaderItem
                            className={`${location.pathname === ROUTES.Options.Profile ? 'selected' : ''}`}
                            href={buildHref(ROUTES.Options.Profile)}
                            iconName="profile"
                            label={t('common.sidebar.profile-label')}
                        />
                    )}

                    <Divider />
                    <DappHeaderItem
                        href={LINKS.SportMarkets}
                        iconName="overtime-markets"
                        label={t('common.sidebar.sport-markets-label')}
                    />
                </ItemsContainer>
            </SidebarHtml>
        </OutsideClickHandler>
    );
};

const removeCollapse = () => {
    const root = document.getElementById('root');
    const content = document.getElementById('main-content');
    const sidebar = document.getElementById('sidebar');
    if (root?.classList.contains('collapse')) {
        sidebar?.classList.remove('collapse');
        content?.classList.remove('collapse');
        root?.classList.remove('collapse');
    }
};

const ItemsContainer = styled.div`
    transition: all 0.5s ease;
    display: flex;
    flex-direction: column;
    overflow-x: hidden;
    overflow-y: auto;
    margin-right: -10px;
    height: 100%;
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        margin-right: 0;
        gap: 20px;
        justify-content: center;
    }
`;

const SidebarHtml = styled.nav`
    transition: all 0.5s ease;
    transition: width 0.3s ease;
    position: fixed;
    top: 0;
    left: 0;
    width: 72px;
    height: 100vh;
    z-index: 101;
    background: ${(props) => props.theme.background.secondary};
    padding: 35px 0;
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
        width: 0;
        transition: width 0.3s ease-out;
        .sidebar-logoSmall {
            display: none;
        }
    }

    &.collapse {
        display: block;
        width: 275px;
        transition: width 0.5s ease-in;
        height: 100vh;
        left: 0;
        bottom: 0;
        padding-left: 20px;
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
