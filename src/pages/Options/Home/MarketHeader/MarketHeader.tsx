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
import burger from 'assets/images/burger.svg';

import logoSmallIcon from 'assets/images/logo-small-light.svg';
import logoIcon from 'assets/images/logo-light.svg';
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
import MarketHeaderItem from './MarketHeaderItem';
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

const LogoLocal = styled.div`
    cursor: pointer;
    height: 50px;
    margin-bottom: 60px;
`;

const ItemsContainer = styled.ul``;

// const SidebarItem = styled.li<{ imgSrc: string; imgSrcHoverSelected: string }>`
//     cursor: pointer;
//     border-radius: 12px;
//     margin-bottom: 20px;
//     height: 50px;
//     padding: 14px;
//     color: #04045a;
//     transition: background 300ms;
//     div {
//         background: url(${(props) => props.imgSrc}) center no-repeat;
//     }
//     &.selected {
//         color: #f6f6fe;
//         background: #04045a;
//         div {
//             background: url(${(props) => props.imgSrcHoverSelected}) center no-repeat;
//         }
//     }
//     &:hover {
//         color: #f6f6fe;
//         background: #141c7f;

//         div {
//             background: url(${(props) => props.imgSrcHoverSelected}) center no-repeat;
//         }
//     }
// `;

// const SidebarIcon = styled.div`
//     z-index: 1;
//     position: relative;
//     width: 22px;
//     height: 22px;
//     background-size: contain !important;
// `;

// const SidebarText = styled.span`
//     z-index: 0;
//     position: relative;
//     display: block;
//     top: -27px;
//     margin-left: 36px;
//     font-style: normal;
//     font-weight: 600;
//     font-size: 16px;
//     line-height: 32px;
//     letter-spacing: 0.35px;
//     white-space: nowrap;
//     display: none;
// `;

const BurdgerIcon = styled.img`
    position: absolute;
    right: 30px;
    top: 32px;
    padding: 10px;
`;

// const Divider = styled.hr`
//     width: 100%;
//     border: none;
//     border-top: 2px solid #04045a;
// `;

export default MarketHeader;
