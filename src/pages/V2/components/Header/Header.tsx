import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import LanguageSelector from 'components/LanguageSelector/V2';
import styled from 'styled-components';
import { Theme } from '../../Home';
import Cookies from 'universal-cookie';
import { navigateTo } from 'utils/routes';
import ROUTES from 'constants/routes';
import BurgerContainer from './BurgerContainer';

type HeaderInput = {
    theme: Theme;
    setTheme: (data: any) => void;
};

const cookies = new Cookies();

const Header: React.FC<HeaderInput> = ({ theme, setTheme }) => {
    const { t } = useTranslation();
    const [openBurger, setBurgerState] = useState(false);

    return (
        <Wrapper>
            <Logo
                onClick={() => navigateTo(ROUTES.Home, false, false, 'show')}
                className="icon-home icon-home--thales"
            />
            <Links>
                <PositionedContainer>
                    <Link target="_blank" rel="noreferrer" href="https://docs.thalesmarket.io/">
                        {t('header.links.learn.title')}
                    </Link>
                    <DropDownContainer>
                        <Link target="_blank" rel="noreferrer" href="https://docs.thalesmarket.io/">
                            {t('header.links.learn.docs')}
                        </Link>
                        <Link
                            target="_blank"
                            rel="noreferrer"
                            href="https://docs.thalesmarket.io/using-thales/why-use-thales"
                        >
                            {t('header.links.learn.guides')}
                        </Link>
                        <Link
                            rel="noreferrer"
                            onClick={() => navigateTo(ROUTES.Article.Whitepaper, false, false, 'show')}
                        >
                            {t('header.links.learn.whitepaper')}
                        </Link>

                        <Link href="../#faq-section">{t('header.links.faq')}</Link>
                    </DropDownContainer>
                </PositionedContainer>
                <Link target="_blank" rel="noreferrer" href="https://discord.com/invite/rB3AWKwACM">
                    {t('header.links.community')}
                </Link>
                <Link target="_blank" rel="noreferrer" href="https://thalesmarket.medium.com/">
                    {t('header.links.blog')}
                </Link>
                <Link rel="noreferrer" onClick={() => navigateTo(ROUTES.Article.Governance, false, false, 'show')}>
                    {t('header.links.governance')}
                </Link>
                <Link rel="noreferrer" onClick={() => navigateTo(ROUTES.Article.Token, false, false, 'show')}>
                    {t('header.links.token')}
                </Link>
            </Links>
            <ToggleContainer
                onClick={() => {
                    cookies.set('home-theme', theme === Theme.Light ? Theme.Dark : Theme.Light);
                    setTheme(theme === Theme.Light ? Theme.Dark : Theme.Light);
                }}
            >
                <ToggleIcon
                    className={`icon-home ${
                        theme === Theme.Light ? 'icon-home--toggle-white' : 'icon-home--toggle-dark'
                    }`}
                />
            </ToggleContainer>
            <DotsContainer
                onClick={() => {
                    setBurgerState(!openBurger);
                }}
            >
                <DotsIcon className="icon icon--three-dots" />
            </DotsContainer>
            <LanguageContainer>
                <LanguageSelector />
            </LanguageContainer>
            <ButtonContainer>
                <Link target="_blank" rel="noreferrer" href={ROUTES.Options.Home}>
                    {t('landing-page.use-app')}
                </Link>
                <i className="icon-home icon-home--right" />
            </ButtonContainer>
            <BurgerContainer burgerState={openBurger} setBurgerState={setBurgerState} />
        </Wrapper>
    );
};

const Wrapper = styled.div`
    display: contents;
    @media (max-width: 1024px) {
        display: flex;
        justify-content: space-between;
        align-items: center;
        position: absolute;
        top: 20px;
        width: 100vw;
        padding: 0 40px;
        z-index: 10;
    }
`;

const PositionedContainer = styled.div`
    position: relative;
    display: block;
    top: 50px;
    padding-bottom: 100px;
    &:hover {
        div {
            display: flex;
        }
    }
`;

const DropDownContainer = styled.div`
    position: absolute;
    top: 2em;
    left: 0;
    background: var(--background);
    box-shadow: 0px 20px 30px rgba(0, 0, 0, 0.1);
    border-radius: 7px;
    display: none;
    flex-direction: column;
    align-items: flex-start;
    justify-content: space-between;
    padding: 10px;
    @media (max-width: 600px) {
        background: transparent;
        position: relative;
        top: -45px;
        left: 0;
        display: none;
        &.open {
            display: flex;
        }
        box-shadow: none;
        border-radius: 0;
        & > a {
            margin-bottom: 0;
        }
    }
    & > a {
        width: 100%;
        font-family: Nunito !important;
        font-style: normal;
        font-weight: 300;
        font-size: 1em;
        line-height: 1.6em;
        text-align: left;
        text-transform: uppercase;
        color: var(--color);
        padding: 10px;
        border-radius: 7px;
        &:hover {
            background: rgba(196, 196, 196, 0.1);
        }
    }
`;

const Logo = styled.i`
    grid-column-start: 4;
    grid-column-end: 9;
    grid-row-start: 3;
    grid-row-end: 4;
    font-size: 8.3em;
    line-height: 34px;
    color: var(--color);
    z-index: 2;
    flex: 1;
    cursor: pointer;
`;

const CenteredDiv = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 2;
`;

const Links = styled(CenteredDiv)`
    grid-column-start: 14;
    grid-column-end: 39;
    grid-row-start: 3;
    grid-row-end: 4;
    justify-content: space-between;
    z-index: 10;
    @media (max-width: 1024px) {
        display: none;
    }
`;

const ToggleContainer = styled(CenteredDiv)`
    grid-column-start: 40;
    grid-column-end: 43;
    grid-row-start: 3;
    grid-row-end: 4;
    z-index: 2;
    cursor: pointer;
`;

const DotsContainer = styled(CenteredDiv)`
    display: none;
    grid-column-start: 45;
    grid-column-end: 47;
    grid-row-start: 3;
    grid-row-end: 4;
    z-index: 2;
    cursor: pointer;
    @media (max-width: 1024px) {
        display: block;
        margin-left: 20px;
    }
`;

const LanguageContainer = styled(CenteredDiv)`
    grid-column-start: 44;
    grid-column-end: 46;
    grid-row-start: 3;
    grid-row-end: 4;
    z-index: 1000;
    @media (max-width: 1024px) {
        display: none;
    }
`;

const ButtonContainer = styled(CenteredDiv)`
    grid-column-start: 47;
    grid-column-end: 50;
    grid-row-start: 3;
    grid-row-end: 4;
    color: var(--color);
    z-index: 2;
    @media (max-width: 1024px) {
        display: none;
    }
`;

const Link = styled.a`
    position: relative;
    font-family: Nunito !important;
    font-style: normal;
    font-weight: 300;
    font-size: 1em;
    line-height: 91.91%;
    z-index: 2;
    text-align: center;
    text-transform: uppercase;
    cursor: pointer;
    color: var(--color);
    @media (max-width: 1024px) {
        margin-bottom: 60px;
    }
    &.dropdown-icon {
        :after {
            content: '';
            display: block;
            position: absolute;
            top: -4px;
            right: -32px;
            width: 10px;
            height: 10px;
            border-top: 2px solid var(--color);
            border-right: 2px solid var(--color);
            transform: rotate(135deg);
        }
        &.open:after {
            top: 2px;
            transform: rotate(-45deg);
        }
    }
`;

const ToggleIcon = styled.i`
    font-size: 3.4em;
    line-height: 26px;
    z-index: 2;
    color: var(--color);
`;

const DotsIcon = styled.i`
    font-size: 3em;
    line-height: 24px;
    z-index: 2;
    color: var(--color);
`;

export default Header;
