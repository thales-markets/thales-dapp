import React from 'react';
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

    return (
        <SidebarHtml>
            <ItemsContainer>
                <SPAAnchor className="sidebar-logoSmall" href={buildHref(ROUTES.Options.Home)}>
                    <LogoIcon width="38" height="42" src={logoSmallIcon} />
                </SPAAnchor>
                <SPAAnchor className="sidebar-logoBig" href={buildHref(ROUTES.Options.Home)}>
                    <LogoIcon height="42" src={logoIcon} />
                </SPAAnchor>

                <DappHeaderItem
                    className={location.pathname === ROUTES.Options.Home ? 'selected' : ''}
                    href={buildHref(ROUTES.Options.Home)}
                    iconName="markets"
                    label={t('common.sidebar.markets')}
                />

                {!isPolygon && (
                    <DappHeaderItem
                        className={location.pathname === ROUTES.Options.RangeMarkets ? 'selected' : ''}
                        href={buildHref(ROUTES.Options.RangeMarkets)}
                        iconName="ranged-markets"
                        label={t('common.sidebar.ranged-markets')}
                    />
                )}

                {isPolygon && (
                    <DappHeaderItem
                        className={location.pathname === ROUTES.Options.Leaderboard ? 'selected' : ''}
                        href={buildHref(ROUTES.Options.Leaderboard)}
                        iconName="leaderboard"
                        label={t('common.sidebar.leaderboard-label')}
                    />
                )}
                <Divider />
                {!isPolygon && (
                    <DappHeaderItem
                        className={location.pathname === ROUTES.Options.Token ? 'selected' : ''}
                        href={buildHref(ROUTES.Options.Token)}
                        iconName="token"
                        label={t('common.sidebar.earn-label')}
                    />
                )}
                <DappHeaderItem
                    className={location.pathname.includes(ROUTES.Governance.Home) ? 'selected' : ''}
                    href={buildHref(ROUTES.Governance.Home)}
                    iconName="governance"
                    label={t('common.sidebar.governance-label')}
                />

                <Divider />
                {!isPolygon && (
                    <DappHeaderItem
                        className={location.pathname === ROUTES.Options.Royal ? 'selected' : ''}
                        href={buildHref(ROUTES.Options.Royal)}
                        iconName="thales-royale"
                        label={t('common.sidebar.royale-label')}
                    />
                )}
                <DappHeaderItem
                    className={location.pathname === ROUTES.Options.Game ? 'selected' : '' + ' game'}
                    href={buildHref(ROUTES.Options.Game)}
                    iconName="game"
                    label={t('common.sidebar.game-label')}
                />

                {walletAddress && (
                    <DappHeaderItem
                        className={location.pathname === ROUTES.Options.Profile ? 'selected' : ''}
                        href={buildHref(ROUTES.Options.Profile)}
                        iconName="profile"
                        label={t('common.sidebar.profile-label')}
                    />
                )}
                <Divider />
                <DappHeaderItem
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
            </ItemsContainer>
        </SidebarHtml>
    );
};

const SidebarHtml = styled.nav`
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
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    -o-user-select: none;
    user-select: none;
`;

const ItemsContainer = styled.div`
    display: flex;
    flex-direction: column;
    @media (max-width: 1024px) {
        flex-direction: row;
        justify-content: space-around;
        height: 100%;
    }
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
