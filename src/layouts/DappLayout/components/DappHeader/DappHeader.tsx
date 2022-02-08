import React, { useState } from 'react';
import styled from 'styled-components';
import UserCard from 'components/UserInfo/v2/UserCard';
import DappHeaderItem from './DappHeaderItem';
import SPAAnchor from 'components/SPAAnchor';
import { FlexDiv, FlexDivColumn, Logo } from 'theme/common';

import { useTranslation } from 'react-i18next';

// import { useSelector } from 'react-redux';
// import { RootState } from 'redux/rootReducer';
// import { getNetworkId } from 'redux/modules/wallet';
// import { getIsOVM } from 'utils/network';

import { buildHref } from 'utils/routes';

import ROUTES from 'constants/routes';

import logoIcon from 'assets/images/logo-light.svg';
import logoSmallIcon from 'assets/images/logo-small-light.svg';
import burger from 'assets/images/burger.svg';
import { useLocation } from 'react-router-dom';

enum BurgerState {
    Init,
    Show,
    Hide,
}

const DappHeader: React.FC = () => {
    const { t } = useTranslation();
    // const networkId = useSelector((state: RootState) => getNetworkId(state));
    // const isL2 = getIsOVM(networkId);
    const location = useLocation();
    const [showBurgerMenu, setShowBurdgerMenu] = useState<BurgerState>(BurgerState.Init);

    return (
        <FlexDivColumn style={{ width: '100%', flex: 'unset' }}>
            <UserCard />
            <DappHeaderWrapper id="dapp-header" className="dapp-header">
                <FlexDiv className="dapp-header__logoWrapper">
                    <Logo to="" className="dapp-header__logoWrapper__logo" />
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
            </DappHeaderWrapper>
            <Sidebar
                className={`dapp-header__nav ${showBurgerMenu === BurgerState.Show ? 'dapp-header__nav--show' : ''}`}
            >
                <ItemsContainer>
                    <SPAAnchor className="sidebar-logoSmall" href={buildHref(ROUTES.Home)}>
                        <LogoIcon width="38" height="51" src={logoSmallIcon} />
                    </SPAAnchor>
                    <SPAAnchor className="sidebar-logoBig" href={buildHref(ROUTES.Home)}>
                        <LogoIcon height="51" src={logoIcon} />
                    </SPAAnchor>

                    <DappHeaderItem
                        className={location.pathname === ROUTES.Options.Home ? 'selected' : ''}
                        href={buildHref(ROUTES.Options.Home)}
                        iconName="markets"
                        label={t('common.sidebar.markets')}
                    />

                    <DappHeaderItem
                        className={location.pathname === ROUTES.Options.Token ? 'selected' : ''}
                        href={buildHref(ROUTES.Options.Token)}
                        iconName="token"
                        label={t('common.sidebar.earn-label')}
                    />

                    <DappHeaderItem
                        className={location.pathname === ROUTES.Options.Royal ? 'selected' : ''}
                        href={buildHref(ROUTES.Options.Royal)}
                        iconName="thales-royale"
                        label={t('common.sidebar.royale-label')}
                    />
                    <DappHeaderItem
                        className={
                            [ROUTES.Governance.Home, ROUTES.Governance.Space, ROUTES.Governance.Proposal].includes(
                                location.pathname
                            )
                                ? 'selected'
                                : ''
                        }
                        href={buildHref(ROUTES.Governance.Home)}
                        iconName="governance"
                        label={t('common.sidebar.governance-label')}
                    />
                </ItemsContainer>
            </Sidebar>
        </FlexDivColumn>
    );
};

const Sidebar = styled.nav`
    position: fixed;
    top: 0;
    left: 0;
    width: 89px;
    min-height: 100vh;
    z-index: 100;
    background: linear-gradient(190.01deg, #516aff -17.89%, #8208fc 90.41%);
    padding: 35px 0;
    transition: width 0.3s ease;
    overflow: hidden;
    .sidebar-logoBig {
        display: none;
    }
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
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    -o-user-select: none;
    user-select: none;
`;

const ItemsContainer = styled.ul``;

const BurdgerIcon = styled.img`
    position: absolute;
    right: 30px;
    top: 32px;
    padding: 10px;
`;

const DappHeaderWrapper = styled.div`
    width: 100%;
    height: 100px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    @media screen and (max-width: 767px) {
        height: 100%;
    }
`;

const LogoIcon = styled.img`
    display: block;
    object-fit: contain;
    cursor: pointer;
    margin: auto;
    margin-top: 10px;
    margin-bottom: 100px;
`;

// const LogoLocal = styled.div`
//     cursor: pointer;
//     height: 50px;
//     margin-bottom: 60px;
// `;

export default DappHeader;
