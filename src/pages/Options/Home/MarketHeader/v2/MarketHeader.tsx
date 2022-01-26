import React, { useState } from 'react';
import styled from 'styled-components';

import UserCard from 'components/UserInfo/v2/UserCard';
import MarketHeaderItem from '../MarketHeaderItem';
import SPAAnchor from 'components/SPAAnchor';
import { FlexDiv, FlexDivColumn, Logo } from 'theme/common';
import CustomizeLayout from 'pages/Options/Market/components/CustomizeLayout';

import { useTranslation } from 'react-i18next';

import { useSelector } from 'react-redux';
import { RootState } from 'redux/rootReducer';
import { getNetworkId } from 'redux/modules/wallet';
import { getIsOVM } from 'utils/network';

import { buildHref } from 'utils/routes';

import ROUTES from 'constants/routes';

import logoIcon from 'assets/images/logo-light.svg';
import logoSmallIcon from 'assets/images/logo-small-light.svg';
import burger from 'assets/images/burger.svg';

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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [showBurgerMenu, setShowBurdgerMenu] = useState<BurgerState>(BurgerState.Init);

    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const isL2 = getIsOVM(networkId);

    return (
        <FlexDivColumn style={{ width: '100%', flex: 'unset' }}>
            <UserCard />
            <MarketHeaderWrapper
                id="dapp-header"
                className={`dapp-header ${className}`}
                showCustomizeLayout={showCustomizeLayout}
            >
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
                {showCustomizeLayout && phase && <CustomizeLayout phase={phase} isCustomMarket={isCustomMarket} />}
            </MarketHeaderWrapper>
            <Sidebar
                className={`dapp-header__nav ${showBurgerMenu === BurgerState.Show ? 'dapp-header__nav--show' : ''}`}
            >
                <ItemsContainer>
                    <SPAAnchor href={buildHref(ROUTES.Home)}>
                        <LogoLocal className="logo" />
                    </SPAAnchor>
                    {!isL2 && (
                        <MarketHeaderItem
                            iconName="markets"
                            label={t('common.sidebar.markets')}
                            submenuItems={[
                                {
                                    className: route === ROUTES.Options.Overview ? 'selected' : '',
                                    href: buildHref(ROUTES.Options.Overview),
                                    iconName: 'markets-overview',
                                    label: t('common.sidebar.overview-label'),
                                },
                                {
                                    className: route === ROUTES.Options.CreateMarket ? 'selected' : '',
                                    href: buildHref(ROUTES.Options.CreateMarket),
                                    iconName: 'create-market',
                                    label: t('common.sidebar.create-market-label'),
                                },
                            ]}
                        />
                    )}
                    {!isL2 && (
                        <MarketHeaderItem
                            className={route === ROUTES.Options.Token ? 'selected' : ''}
                            href={buildHref(ROUTES.Options.Token)}
                            iconName="token"
                            label={t('common.sidebar.earn-label')}
                        />
                    )}
                    {!isL2 && (
                        <MarketHeaderItem
                            className={route === ROUTES.Options.Royal ? 'selected' : ''}
                            href={buildHref(ROUTES.Options.Royal)}
                            iconName="thales-royale"
                            label={t('common.sidebar.royale-label')}
                        />
                    )}
                </ItemsContainer>
            </Sidebar>
        </FlexDivColumn>
    );
};

const Sidebar = styled.nav`
    position: fixed;
    top: 0;
    left: 0;
    width: 58px;
    min-height: 100vh;
    z-index: 100;
    background: linear-gradient(190.01deg, #516aff -17.89%, #8208fc 90.41%);
    padding: 35px 0;
    transition: width 0.3s ease;
    overflow: hidden;
    &:hover {
        width: 300px;
        span {
            display: block;
        }
        i {
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

const ItemsContainer = styled.ul``;

const BurdgerIcon = styled.img`
    position: absolute;
    right: 30px;
    top: 32px;
    padding: 10px;
`;

const MarketHeaderWrapper = styled.div<{ showCustomizeLayout?: boolean }>`
    width: 100%;
    height: 100px;
    display: flex;
    align-items: center;
    justify-content: ${(props: any) => (props.showCustomizeLayout ? 'space-between' : 'flex-end')};
    @media screen and (max-width: 767px) {
        height: 100%;
    }
`;

const LogoLocal = styled.div`
    cursor: pointer;
    height: 50px;
    margin-bottom: 60px;
`;
export default MarketHeader;
