import ROUTES from 'constants/routes';
import { Link } from 'react-router-dom';
import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { Button, Logo } from 'theme/common';
import burger from 'assets/images/burger.svg';

enum BurgerState {
    Init,
    Show,
    Hide,
}

const Header: React.FC = () => {
    const { t } = useTranslation();
    const [showBurgerMenu, setShowBurdgerMenu] = useState<BurgerState>(BurgerState.Init);

    useMemo(() => {
        if (showBurgerMenu !== BurgerState.Init) {
            const hero = document.getElementById('landing-hero');
            if (hero && showBurgerMenu === BurgerState.Show) {
                hero.className += ' higher-z-index';
            }
            if (hero && showBurgerMenu === BurgerState.Hide) {
                hero.className.replace(' higher-z-index', '');
            }
        }
    }, [showBurgerMenu]);

    return (
        <HeaderWrapper>
            <Logo to={ROUTES.Home} />
            <Links
                className={
                    (showBurgerMenu === BurgerState.Show ? 'show' : '') +
                    ' ' +
                    (showBurgerMenu === BurgerState.Hide ? 'hide' : '')
                }
                onClick={() => {
                    setShowBurdgerMenu(BurgerState.Hide);
                }}
            >
                <Logo className="burger-logo" onClick={() => setShowBurdgerMenu(BurgerState.Hide)} to={ROUTES.Home} />
                <CommunityLink
                    onClick={() => {
                        document.getElementById('partners')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                >
                    {t('header.links.partners')}
                </CommunityLink>
                <CommunityLink target="_blank" rel="noreferrer" href="https://discord.gg/cFGv5zyVEj">
                    {t('header.links.community')}
                </CommunityLink>

                <CommunityLink target="_blank" rel="noreferrer" href="  https://thalesmarket.medium.com/">
                    {t('header.links.blog')}
                </CommunityLink>
                <CommunityLink
                    onClick={() => {
                        document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                >
                    {t('header.links.faq')}
                </CommunityLink>
                <NavLink to={process.env.REACT_APP_MAINTENANCE_MODE == 'true' ? ROUTES.Options.Home : ''}>
                    <Button className="primary" style={{ marginLeft: '60px', fontSize: 16 }}>
                        {process.env.REACT_APP_MAINTENANCE_MODE == 'true' ? t('landing-page.use-app') : 'Comming soon'}
                    </Button>
                </NavLink>
            </Links>
            <BurdgerIcon
                onClick={() =>
                    setShowBurdgerMenu(showBurgerMenu === BurgerState.Show ? BurgerState.Hide : BurgerState.Show)
                }
                hidden={showBurgerMenu === BurgerState.Show}
                src={burger}
            />
            <Overlay
                onClick={() => {
                    setShowBurdgerMenu(BurgerState.Hide);
                }}
                className={showBurgerMenu === BurgerState.Show ? 'show' : 'hide'}
            ></Overlay>
        </HeaderWrapper>
    );
};

const HeaderWrapper = styled.div`
    padding: 0 75px;
    width: 100%;
    display: flex;
    height: 100px;
    align-items: center;
    @media (max-width: 768px) {
        padding: 0 50px;
    }
    @media (max-width: 468px) {
        padding: 0 30px;
    }
`;

const Links = styled.div`
    flex: 3;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    .burger-logo {
        display: none;
    }
    @media (max-width: 768px) {
        flex-direction: column;
        position: fixed;
        top: 0;
        left: 102vw;
        width: 300px;
        height: 100vh;
        background: linear-gradient(281.48deg, #04045a -16.58%, #141874 97.94%);
        justify-content: flex-start;
        z-index: 2;
        .burger-logo {
            display: flex;
            max-height: 140px;
            margin-top: 20px;
        }
        &.show {
            animation-name: show;
            animation-duration: 300ms;
            left: calc(100vw - 300px);
        }
        &.hide {
            animation-name: hide;
            animation-duration: 300ms;
            left: 102vw;
        }
    }
    @keyframes show {
        from {
            left: 102vw;
        }
        to {
            left: calc(100vw - 300px);
        }
    }
    @keyframes hide {
        from {
            left: calc(100vw - 300px);
        }
        to {
            left: 102vw;
        }
    }
`;

const NavLink = styled(Link)`
    margin-right: 40px;
    font-weight: 600;
    font-size: 16px;
    line-height: 32px;
    letter-spacing: 0.15px;
    color: #f6f6fe;
    &:last-child {
        margin-right: 0;
    }
    &:hover {
        color: #44e1e2;
    }
    @media (max-width: 768px) {
        border-top: 1px solid #748bc6;
        width: 100%;
        text-align: center;
        margin: 0;
        padding: 6px 0;
        .primary {
            margin: 50px 0 !important;
            width: 140px;
            font-size: 16px;
            line-height: 24px;
            padding: 8px 16px !important;
        }
    }
`;

const CommunityLink = styled.a`
    margin-right: 40px;
    font-weight: 600;
    font-size: 16px;
    line-height: 32px;
    letter-spacing: 0.15px;
    color: #f6f6fe;
    cursor: pointer;
    &:hover {
        color: #44e1e2;
    }
    @media (max-width: 768px) {
        border-top: 1px solid #748bc6;
        width: 100%;
        text-align: center;
        margin: 0;
        padding: 6px 0;
        .primary {
            margin: 50px 0 !important;
            width: 140px;
            font-size: 16px;
            line-height: 24px;
            padding: 8px 16px !important;
        }
    }
`;

const BurdgerIcon = styled.img`
    position: absolute;
    right: 30px;
    top: 32px;
    padding: 10px;
    @media (min-width: 769px) {
        display: none;
    }
`;

const Overlay = styled.div`
    position: fixed;
    height: 100vh;
    width: 100vw;
    top: 0;
    left: 0;
    background: #748bc6;
    opacity: 0.4;
    &.show {
        display: block;
    }
    &.hide {
        display: none;
    }
`;

export default Header;
